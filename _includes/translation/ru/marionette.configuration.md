Marionette.js имеет несколько глобально настраиваемых параметров,
которые влияют на работу приложение. Большая часть из них описана в других
разделах документации. В этот раздел документации будет помещаться информация
о наиболее общих параметрах, которые можно настроить.

## Содержание

* [Marionette.Deferred](#deferred)

## Marionette.Deferred <a name="deferred"></a>

By default, Marionette makes use of `Backbone.$.Deferred` to create
thenable objects. All that is needed is a Deferred that has the
following properties:

1. `promise`: a Promises/A+ thenable, or a function that returns one
2. `resolve`: a function that resolves the provided promise with a value

For example:

```js
var deferred = Marionette.Deferred();

_.result(deferred, 'promise').then(function (target) {
    console.log("Hello, " + target + "!");
});

deferred.resolve("world"); // asynchronous "Hello, world!"
```

If you wish to use a specific promise library, you can override the default via:

```js
Marionette.Deferred = myDeferredLib;
```