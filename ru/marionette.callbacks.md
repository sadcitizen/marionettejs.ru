# Marionette.Callbacks (В процессе перевода)

Объект `Callbacks` помогает управлять коллекцией коллбеков и и выполнять их асинхронным способом.

Для работы с коллбеками существуют два метода: 

* `add`
* `run`

Метод `add` добавляет новый коллбек, который будет выполнен позже. 

Метод The `run` выполняет все текущие коллбеки in, using the
specified context for each of the callbacks, and supplying the
provided options to the callbacks.

## Содержание

* [Основное применение](#basic-usage)
* [Определение контекста для каждого коллбека](#specify-context-per-callback)
* [Продвинутое / асинхронное использование](#advanced--async-use)

## Основное применение

```js
var callbacks = new Backbone.Marionette.Callbacks();

callbacks.add(function(options){
  alert("I'm a callback with " + options.value + "!");
});

callbacks.run({value: "options"}, someContext);
```

В этом примере выводится высплывающее окошко с текстом "I'm a callback
with options!".

The executing context for each of the callback methods has been set to the `someContext` object, which is an optional parameter that can be any valid JavaScript object.

## Указание контекста для каждого коллбека

You can optionally specify the context that you want each callback to be
executed with, when adding a callback:

```js
var callbacks = new Backbone.Marionette.Callbacks();

callbacks.add(function(options){
  alert("I'm a callback with " + options.value + "!");

   // specify callback context as second parameter
}, myContext);


// the `someContext` context is ignored by the above callback
callbacks.run({value: "options"}, someContext);
```

This will run the specified callback with the `myContext` object set as
`this` in the callback, instead of `someContext`.

## Продвинутое / Асинхронное использование

The `Callbacks` executes each callback in an async-friendly 
manner, and can be used to facilitate async callbacks. 
The `Marionette.Application` object uses `Callbacks`
to manage initializers (see above). 

It can also be used to guarantee callback execution in an event
driven scenario, much like the application initializers.