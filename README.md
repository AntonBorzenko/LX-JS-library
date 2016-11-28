LX JS Library
==================================================
## Author: Borzenko Anton

This is a short library, that wraps simple JS actions


String formatter:
--------------------------------------
```javascript
"%s xample %s".format("My", "string") // returns "My example string"
```


String substitutor:
--------------------------------------
```javascript
"My favourite fruit is {FRUIT}".substitute({ FRUIT : 'orange' }) // returns "My favourite fruit is orange"
```


Full page alert:
--------------------------------------
```javascript
lx.alert("Hello!!!");
```


Enabling scrolling anchors:
--------------------------------------
```javascript
lx.anchorsEnable();
```


And disabling:
--------------------------------------
```javascript
lx.anchorsDisable();
```


Finds size of font of block to set him needed height
--------------------------------------
```javascript
lx.fitHeightText(100);
```


Form sending by AJAX:
--------------------------------------
```javascript
$('form').lx('ajaxForm');
```


Block centering:
--------------------------------------
```javascript
$('form').lx('center');
```
