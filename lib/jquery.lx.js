/* 
    @name       lx
    @author     Anton Borzenko (vk.com/id63016985)
    @version    1.0.2
*/
Object.defineProperty(String.prototype, 'format', {
    enumerable  : false,
    value       : function () {
        var strings = this.split('%s');
        var result = strings[0];
        for (var i = 1; i < strings.length; i++) {
            result += arguments[i - 1] + strings[i];
        }
        return result;
    }
});
Object.defineProperty(String.prototype, 'substitute', {
    enumerable  : false,
    value       : function (obj) {
        if (!obj) {
            return this;
        }
        
        return this.replace(
            /\\?{([^{}]+)}/g,
            function (match, selected) {
                if (match[0] === '\\') {
                    return match.substr(0);
                }
                return obj.hasOwnProperty(selected) ? obj[selected] : '';
            }
        );
    }
});

(function ($, window) {
    var lx = {};
    window.lx = lx;
    
    lx.$        = {};
    lx.debug    = true;
    lx.console  = {
        log  : function (message) {
            lx.debug && console.log(message);
        },
        warn : function (message) {
            lx.debug && console.log(message);
        },
        err  : function (message) {
            if (lx.debug) {
                throw message;
            }
        }
    };
    
    
    $.fn.lx = function (jPluginName) {
        if (typeof jPluginName !== 'string' || !lx.$[jPluginName]) {
            lx.console.warn('jQuery plugin "' + jPluginName + '" is not defined');
            return this;
        }
        try {
            return lx.$[jPluginName].apply(this, Array.prototype.slice.call(arguments, 1));
        } catch (e) {
            lx.console.err(e);
            return this;
        }
    };
    lx.EventListener = (function () {
        function EventListener() {
            this._events = {};
        }
        EventListener.prototype = {
            constructor : EventListener,
            fireEvent   : function (eventName) {
                if (this._events[eventName] instanceof Array) {
                    this._events[eventName].forEach(function (onEvent) {
                        onEvent(eventName, this);
                    });
                }
            },
            addEvent    : function (eventName, onEvent) {
                if (!(this._events[eventName] instanceof Array)) {
                    this._events[eventName] = [];
                }
                this._events[eventName].push(onEvent);
            },
            removeEvents: function (eventName) {
                if (arguments.length === 0) {
                    this._events = {};
                } else {
                    delete this._events[eventName];
                }
            }
        };
        
        return EventListener;
    })();
    
    
    
    
    lx.$.ajaxForm = (function () {
var uniqId = 0;
var defaultOptions = {
    phoneRegex : /[ 0-9\-\(\)\+]/,
    emailRegex : /^\s*[a-zа-я0-9\._\-:]+@[a-zа-я0-9\._\-:]+\s*$/i,
    method : 'post',
    action : null,
    dataUpdater : function (data) { return data; },
    submit : function (options, data, $form) {
        var ajaxData = {};
        var optionsDone = options.done;
        var optionsFail = options.fail;
        var optionsAlways = options.always;
        
        switch (options.type) {
        case 'email' :
            var mails = options.emailAddr instanceof Array ? options.emailAddr : [options.emailAddr];
            var output = options.emailGetContent(options, data, $form);
            ajaxData = {
                type: options.method,
                url : 'https://mandrillapp.com/api/1.0/messages/send.json',
                data: {
                    'key'       : options.emailKey,
                    'message'   : {
                        'from_email': options.emailFrom,
                        'to'        : mails.map(function (email) { return { email : email, type : 'to' }; }),
                        'autotext'  : 'true',
                        'subject'   : output.subject,
                        'html'      : output.content
                    }
                }
            };
            optionsDone = function (message) {
                var args = Array.prototype.slice.call(arguments);
                if (!message || !message[0] || message[0].status !== 'sent') {
                    optionsFail.apply(this, args);
                } else {
                    options.done.apply(this, args);
                }
            };
            break;
        case 'send':
        default:
            ajaxData = {
                url    : options.action !== null ? options.action : $form.attr('action'),
                method : options.method,
                data   : data
            };
        }
        $
            .ajax(ajaxData)
            .done(optionsDone)
            .fail(optionsFail)
            .always(optionsAlways);
        options.startSend && options.startSend(options, data, $form);
    },
    startSend: function () {},
    abort  : function () {},
    always : function () {},
    done   : function () {
        var message = 'Ваша заявка отправлена. Спасибо!';
        try {
            lx.alert(message);
        } catch (e) {
            console.log('lx-ajaxForm: ' + message);
        }
    },
    fail   : function () {
        var message = 'Произошла ошибка отправки :(';
        try {
            lx.alert(message);
        } catch (e) {
            console.log('lx-ajaxForm: ' + message);
        }
    },
    type   : 'send',
    emailAddr   : 'borzenko_a@bk.ru',
    emailKey    : 'IYDaQlFGtKn5I0FI6fOHeA',
    emailSubject: 'Заполненная форма со страницы ' + location.toString(),
    emailFrom   : 'send@former.com',
    emailGetContent : function (options, data, $form) {
        var content = '';
        for (var key in data) {
            if (content) {
                content += '<br/>';
            }
            content += key + ': ' + data[key];
        }
        return {
            subject : options.emailSubject,
            content : content
        };
    }
};
return function (options) {
    options = $.extend({}, defaultOptions, options);
    
    this
        .on('keypress.setAjaxForm', 'input[name="phone"]', function (event) {
            var character = String.fromCharCode(event.which);
            if (!options.phoneRegex.test(character)) {
                event.preventDefault();
                var $this = $(this);
                $this.addClass('broken');
                setTimeout(function () {
                    $this.removeClass('broken');
                }, 600);
            }
        })
        .on('paste.setAjaxForm', 'input[name="phone"]', function (event) {
            var $this = $(this);
            setTimeout(function () {
                $this.val($this.val().split('').filter(function (character) {
                    return options.phoneRegex.test(character);
                }).join(''));
            }, 0);
        })
        .on('click.setAjaxForm', 'button, input[type="submit"]', function (event) {
            event.preventDefault();
            function checkInput(input) {
                if (input.value.trim()) {
                    switch (input.name) {
                    case 'email':
                        if (!options.emailRegex.test(input.value)) return false;
                        break;
                    }
                } else {
                    if (input.required || $(input).hasClass('required')) return false;
                }
                return true;
            }
            var brokenInput = null;
            $form = $(event.delegateTarget);
            $form.find('input, select, textarea').each(function (index, input) {
                if (!checkInput(input)) {
                    brokenInput = input;
                    return false;
                }
            });
            
            if (brokenInput) {
                $(brokenInput).addClass('broken');
                setTimeout(function () {
                    $(brokenInput).removeClass('broken');
                }, 600);
                options.abort && options.abort(event.delegateTarget, brokenInput);
                return;
            }
            
            var data = {};
            $form.find('input, select').each(function () {
                data[this.name] = this.value;
            });
            if (options.dataUpdater) {
                data = options.dataUpdater(data, event);
            }
            if (options.submit) {
                options.submit(options, data, $form);
            }
        });
    
    return this;
};
    })();


    
    (function () {
        var anchorsEnabled = false;
        lx.anchorsEnable = function () {
            if (anchorsEnabled) { return; }
            $('body').on('click.lx-anchors', 'a[href^="#"]', function (event) {
                var offsetObj = $(this.hash).offset();
                $('body').animate({ scrollTop : (offsetObj ? offsetObj.top : 0) }, 400);
                location.hash = this.hash;
                event.preventDefault();
            });
            anchorsEnabled = true;
        };
        lx.anchorsDisable = function () {
            if (!anchorsEnabled) { return; }
            $('body').off('click.lx-anchors');
            anchorsEnabled = false;
        };
    })();

    
    lx.alert = function (message, options) {
        options = $.extend({
            backgroundColor : '#e7bf20',
            color           : 'black',
            delay           : 3000,
            ratio           : 1
        }, options);
        
        var $alert = $('<div class="overlay alert-form"><span>' + message + '</span></div>')
            .css({
                display         : 'none',
                backgroundColor : options.backgroundColor,
                color           : options.color
            })
            .click(closeForm)
            .appendTo('body')
            .fadeIn(200);
        function closeForm() {
            $alert.fadeOut(200, function () {
                $alert.remove();
            });
        }
        setTimeout(closeForm, options.delay);
    };
    
    lx.Value = function (value) {
        if (this === window) {
            return new lx.Value(value);
        }
        this.setValue(value);
    }
    lx.Value.prototype = {
        constructor : lx.Value, 
        getGetter   : function (value) {
            switch (typeof value) {
            case 'function':
                return value;
            case 'number':
                return function () {
                    return value;
                }
            case 'string':
                var strValue = parseFloat(value);
                if (/^\s*\d+(.\d+)?vh\s*$/.test(value)) {
                    return function () {
                        return $(window).height() * strValue / 100;
                    }
                }
                if (/^\s*\d+(.\d+)?vw\s*$/.test(value)) {
                    return function () {
                        return $(window).width()  * strValue / 100;
                    }
                }
                return function () {
                    return strValue;
                }
            case 'object':
                if (value instanceof lx.Value) {
                    return value.getValue;
                }
            default:
                lx.console.warn("Value '%s' is not recognized".format(value));
                return function () {
                    return undefined;
                }
            }  
        },
        setValue    : function (value) {
            this.getValue = this.getGetter(value);
        },
        getValue    : function () { return undefined; },
        toString    : function () { return this.getValue().toString(); }
    };
    lx.Value.setGetter = function (object, name, value) {
        value = new Value(value);
        object.__defineGetter__(name, value.getValue);
        object.__defineSetter__(name, value.setValue);
    };
    
    
    lx.$.fitHeightText = function (heightValue, options) {
        heightValue = new lx.Value(heightValue);
        
        options = $.extend({
            minFont : 1,
            maxFont : 1000,
            deltaHeight : 1,
            deltaFont   : 0.05
        }, options);
        
        return this.each(function (index, item) {
            var $this = $(item);
            
            function resize() {
                var curFont = parseFloat($this.css('fontSize')), 
                    minFont = options.minFont, 
                    maxFont = options.maxFont
                    
                curFont = Math.max(options.minFont, curFont);
                curFont = Math.min(options.maxFont, curFont);
                $this.css('fontSize', curFont);
                
                var needHeight = heightValue.getValue($this) * lx.$.fitHeightText.ratioBefore;
                var bestHeight = null,
                    bestFont = null;
                
                if (isGood(curFont)) {
                    applyFont(curFont);
                    return;
                }
                /* if ($this.height() > needHeight) {
                    $this.css('fontSize', minFont);
                    if ($this.height() > needHeight) {
                        applyFont(minFont);
                        return;
                    }
                    maxFont = curFont;
                } else  {
                    $this.css('fontSize', maxFont);
                    if ($this.height() < needHeight) {
                        applyFont(maxFont);
                        return;
                    }
                    minFont = curFont;
                } */
                function applyFont(font) {
                    $this.css('fontSize', font * options.ratio);
                }
                function isGood(curFont) {
                    $this.css('fontSize', curFont);
                    var thisHeight = $this.height();
                    var curDeltaHeight = Math.abs(thisHeight - needHeight);
                    if (!bestHeight || curDeltaHeight < bestHeight || curDeltaHeight === bestHeight && curFont > bestFont) {
                        bestHeight = curDeltaHeight;
                        bestFont   = curFont;
                    }
                    return curDeltaHeight <= options.deltaHeight;
                }
                
                while (Math.abs(maxFont - minFont) > options.deltaFont) {
                    var curFont = (minFont + maxFont) / 2.0;
                    if (isGood(curFont)) {
                        break;
                    }
                    if ($this.height() > needHeight) {
                        maxFont = curFont;
                    } else {
                        minFont = curFont;
                    }
                }
                
                applyFont(bestFont);
            }
            function setResizing() {
                setTimeout(resize, 0);
            }
            setResizing();
            $(window).on('resize.fitHeightText', setResizing);
        });
    };
    lx.$.fitHeightText.ratioBefore = 1.0;
    
    lx.$.center = function () {
        return this.each(function () {
            var $this = $(this);
            function resize() {
                $this.css({
                    position: 'absolute',
                    left : ($this.parent().width() - $this.width()) / 2,
                    top  : ($this.parent().height() - $this.height()) / 2
                });
            }
            var times = 2;
            function setResizing() {
                if (times < 1) {
                    resize();
                } else {
                    --times;
                    setTimeout(setResizing, 0);
                }
            }
            setResizing();
            $(window).resize(setResizing);
        });
    };
})(jQuery, window);
