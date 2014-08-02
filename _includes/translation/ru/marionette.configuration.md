Marionette.js имеет несколько глобально настраиваемых параметров,
которые влияют на работу приложение. Большая часть из них описана в других
разделах документации. В этот раздел документации будет помещаться информация
о наиболее общих параметрах, которые можно настроить.

## Содержание

* [Marionette.Deferred](#deferred)

## <a name="deferred"></a> Marionette.Deferred

By default, Marionette makes use of `Backbone.$.Deferred` to create
thenable objects. All that is needed is a Deferred that has the
following properties:

1. `promise`: a Promises/A+ thenable, or a function that returns one
2. `resolve`: a function that resolves the provided promise with a value

Например:

```js
var deferred = Marionette.Deferred();

_.result(deferred, 'promise').then(function (target) {
    console.log("Hello, " + target + "!");
});

deferred.resolve("world"); // asynchronous "Hello, world!"
```

Если вы хотите использовать иную библиотеку для промисов, то переопределите значение по умолчанию::

```js
Marionette.Deferred = myDeferredLib;
```