Marionette.js имеет несколько глобально настраиваемых параметров, которые влияют на работу приложение. Большая часть из них описана в других разделах документации. В этом разделе расскажем о наиболее часто изменяемых параметрах.

## Содержание

* [Marionette.$](#marionette_)

## Marionette.$

Для работы с DOM по умолчанию используется jQuery. To get a reference to jQuery, though, it assigns the `Marionette.$` attribute to `Backbone.$`. This provides consistency with Backbone in which exact version of jQuery or other DOM manipulation library is used.

Если вы решили поменять библиотеку для работы с DOM на какую-то иную (например, jquery.js на zepro.js), то сделать это можно следующим образом:

```js
Backbone.$ = myDOMLib;
Marionette.$ = myDOMLib;
```

Обратите внимание, что при смене библиотеки для работы с DOM вы должны одновременно поменять ссылки на нее как для Backbone, так и для Marionette.