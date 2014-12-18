Marionette.js имеет несколько глобально настраиваемых параметров,
которые влияют на работу приложение. Большая часть из них описана в других
разделах документации. В этот раздел документации будет помещаться информация
о наиболее общих параметрах, которые можно настроить.

## <a name="deferred"></a> Marionette.Deferred

> Warning: deprecated
>
> This feature is deprecated, and is scheduled to be removed in version 3 of Marionette. It is used to configure
> `Marionette.Callbacks`, which is also deprecated and scheduled to be removed in version 3. Instead of proxying
> the `Deferred` property on Marionette, use the native `Promise` object directly, and include a polyfill such as
> https://github.com/jakearchibald/es6-promise if you are supporting older browsers. `$.Deferred` can also be used, but
> it is not compliant with the ES6 Promise and is not recommended.

По умолчанию, в Marionette используется `Backbone.$.Deferred` для создания объектов
с определенным методом `then` (thenable objects).

### Переопределение Marionette.Deferred

Если вы используете `Marionette` без `jQuery`, то вам, первым делом, понадобится объект `Backbone.$.Deferred` 
для поддержки совместимости (shim). `Backbone.$.Deferred` предоставляет объект, который поддерживает
следующие свойства:

1. `promise`: объект спецификации `Promises/A+` с определенным методом `then` или функция, которая возвращает промис объект 
2. `resolve`: функция, которая переводит промис объект в состояние «выполнено». Можно установить значение, которое будет передано в качестве аргумента в функцию обратного вызова метода then.

Например:

```js
var deferred = Marionette.Deferred();

_.result(deferred, 'promise').then(function (target) {
    console.log("Hello, " + target + "!");
});

deferred.resolve("world"); // асинхронный "Hello, world!"
```

Если вы хотите использовать иную библиотеку для промисов, то переопределите значение по умолчанию:

```js
Marionette.Deferred = myDeferredLib;
```
