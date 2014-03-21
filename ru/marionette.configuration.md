# Конфигурация Marionette (В процессе перевода)

Marionette.js имеет несколько глобально настраиваемых параметров, которые влияют на то как работает приложение. Большая часть из них описана в других разделах документации. В этом разделе расскажем о наиболее изменяемых параметрах.

## Содержание

* [Marionette.$](#marionette_)

## Marionette.$

Для работы с DOM по умолчанию используется jQuery. To get a reference to jQuery, though, it assigns the `Marionette.$` attribute to `Backbone.$`. This provides consistency with Backbone in which exact version of jQuery or other DOM manipulation library is used.

Если вы решили поменять библиотеку для работы с DOM на какую то иную (например, jquery.js на zepro.js), то сделать это можно следующим образом:

```js
Backbone.$ = myDOMLib;
Marionette.$ = myDOMLib;
```

Помните, что при смене библиотеки работы с DOM вы должны одновременно поменять ссылки на нее как для Backbone.js, так и для Marionette.js.