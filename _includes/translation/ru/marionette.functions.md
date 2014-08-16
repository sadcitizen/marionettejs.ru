Marionette содержит набор утилит / функций-хелперов, которые используются для упрощения работы с общими сценариями в 
рамках всего фреймворка. Эти функции могут быть полезны тем, кто разрабатывает приложения на основе Marionette, так как 
они позволяют получить те же поведения и конвенции (соглашения) в вашем собственном коде.

## Documentation Index

* [Marionette.extend](#marionetteextend)
* [Marionette.getOption](#marionettegetoption)
* [Marionette.proxyGetOption](#marionetteproxygetoption)
* [Marionette.triggerMethod](#marionettetriggermethod)
* [Marionette.bindEntityEvents](#marionettebindentityevents)
* [Marionette.unbindEntityEvents](#marionetteunbindentityevents)
* [Marionette.proxyBindEntityEvents](#marionetteproxybindentityevents)
* [Marionette.normalizeMethods](#marionettenormalizemethods)
* [Marionette.normalizeUIKeys](#marionettenormalizeuikeys)
* [Marionette.actAsCollection](#marionetteactascollection)

## Marionette.extend

Функция `extend` из Backbone является весьма полезной и используется в разных местах в Marionette. Для того, чтобы 
сделать использование этой функции более консистентным (последовательным) для нее был создани алиас `Marionette.extend`. 
Это позволяет получить дополнительную функциональность для ваших объектов без долгих раздумий над тем, 
из какой сущности получить эту функцию, будь то Backbone.View, Backbone.Model или другой объект из Backbone.

```js
var Foo = function(){};

// Используем Marionette.extend чтобы сделать Foo расширяемой  
// точно так же как и другие объекты Backbone и Marionette
Foo.extend = Marionette.extend;

// Теперь Foo может быть расширена для создания нового класса с методами
var Bar = Foo.extend({

  someMethod: function(){ ... }

  // ...
});

// Создаем экземпляр Bar
var b = new Bar();
```

## Marionette.getOption

Метод позволяет получить значение параметра объекта. Этот параметр может принадлежать как самому объекту непосредственно, 
так и быть вложенным в свойстве `options` объекта. Если запрашиваемый параметр существует и в объекте и в `options`, то 
метод вернет значение из `options`.

```js
var M = Backbone.Model.extend({
  foo: "bar",

  initialize: function(){
    var f = Marionette.getOption(this, "foo");
    console.log(f);
  }
});

new M(); // => "bar"

new M({}, { foo: "quux" }); // => "quux"
```

Этот метод удобно применять при создании объекта, имеющего набор конфигурируемых параметров, которые могут принадлежать 
как самому объекту, так и быть параметрами конструктора объекта.

### Лживые значения

Функция `getOption` вернет из `options` любое отличное от `undefined` лживое значение запрашиваемого параметра. 
Если `options` объекта имеет неопределенное значение (`undefined`) запрашиваемого параметра, то функция 
попытается прочитать его значение из объекта напрямую.

Например:

```js
var M = Backbone.Model.extend({
  foo: "bar",

  initialize: function(){
    var f = Marionette.getOption(this, "foo");
    console.log(f);
  }
});

new M(); // => "bar"

var f;
new M({}, { foo: f }); // => "bar"
```

В этом примере, оба раза будет получена строка "bar", так как во втором случае значение переменной `f` будет неопределено, 
то есть `undefined`.

## Marionette.proxyGetOption

Этот метод замещает `Marionette.getOption` таким образом, что `Marionette.getOption` может быть легко добавлен к объекту.

Предположим, что вы написали свой собственный класс Pagination и всегда передаете параметры в него.
С помощью `proxyGetOption` вы легко можете дать этому классу функцию `getOption`.

```js
_.extend(Pagination.prototype, {

  getFoo: function(){
    return this.getOption("foo");
  },

  getOption: Marionette.proxyGetOption
});
```

## Marionette.triggerMethod

Trigger an event and a corresponding method on the target object.

When an event is triggered, the first letter of each section of the
event name is capitalized, and the word "on" is tagged on to the front
of it. Examples:

* `triggerMethod("render")` fires the "onRender" function
* `triggerMethod("before:destroy")` fires the "onBeforeDestroy" function

All arguments that are passed to the triggerMethod call are passed along to both the event and the method, with the exception of the event name not being passed to the corresponding method.

`triggerMethod("foo", bar)` will call `onFoo: function(bar){...})`

Note that `triggerMethod` can be called on objects that do not have
`Backbone.Events` mixed in to them. These objects will not have a `trigger`
method, and no attempt to call `.trigger()` will be made. The `on{Name}`
callback methods will still be called, though.

## Marionette.bindEntityEvents

Этот метод используется для привязки сущностей backbone (например, collection или model) к методам целевого объекта.

```js
Backbone.View.extend({

  modelEvents: {
    "change:foo": "doSomething"
  },

  initialize: function(){
    Marionette.bindEntityEvents(this, this.model, this.modelEvents);
  },

  doSomething: function(){
    // Событие "change:foo" было поймано от model
    
    // Сюда можно поместить код, который будет реагировать 
    // на это событие соответствующим образом
  }

});
```

Первый параметр `target` должен иметь метод `listenTo` из объекта EventBinder. Второй параметр это сущность (Backbone.Model 
или Backbone.Collection), к событиям кототорой будет сделана привязка. Третий параметр это хэш `{ "event:name": "eventHandler" }`. 
В хэше имена нескольких обработчиков следует отделять пробелами. Также, вместо имени обработчика можно использовать функцию.

## Marionette.unbindEntityEvents

This method can be used to unbind callbacks from entities' (collection/model) events. It's
the opposite of bindEntityEvents, described above. Consequently, the APIs are identical for each method.

```js
// Just like the above example we bind our model events.
// This time, however, we unbind them on close.
Backbone.View.extend({

  modelEvents: {
    "change:foo": "doSomething"
  },

  initialize: function(){
    Marionette.bindEntityEvents(this, this.model, this.modelEvents);
  },

  doSomething: function(){
    // the "change:foo" event was fired from the model
    // respond to it appropriately, here.
  },

  onClose: function() {
    Marionette.unbindEntityEvents(this, this.model, this.modelEvents);
  }

});
```

## Marionette.proxyBindEntityEvents
This method proxies `Marionette.bindEntityEvents` so that it can easily be added to an instance.

Say you've written your own Pagination class and you want to easily listen to some entities events.
With `proxyBindEntityEvents`, you can easily give this class the `bindEntityEvents` function.

```js
_.extend(Pagination.prototype, {

   bindSomething: function() {
     this.bindEntityEvents(this.something, this.somethingEvents)
   },

   bindEntityEvents: Marionette.proxyBindEntityEvents

});
```

## Marionette.normalizeMethods

Receives a hash of event names and functions and/or function names, and returns the
same hash with the function names replaced with the function references themselves.

This function is attached to the `Marionette.View` prototype by default. To use it from non-View classes you'll need to attach it yourself.

```js
var View = Marionette.ItemView.extend({

  initialize: function() {
    this.someFn = function() {};
    this.someOtherFn = function() {};
    var hash = {
      eventOne: "someFn", // This will become a reference to `this.someFn`
      eventTwo: this.someOtherFn
    };
    this.normalizedHash = this.normalizeMethods(hash);
  }

});
```

## Marionette.normalizeUIKeys

This method allows you to use the `@ui.` syntax within a given key for triggers and events hashes. It
swaps the `@ui.` reference with the associated selector.

```js
var hash = {
  'click @ui.list': 'myCb'
};

var ui = {
  'list': 'ul'
};

// This sets 'click @ui.list' to be 'click ul' in the newHash object
var newHash = Marionette.normalizeUIKeys(hash, ui);
```

## Marionette.actAsCollection

Utility function for mixing in underscore collection behavior to an object.

It works by taking an object and a property field, in this example 'list',
and appending collection functions to the object so that it can
delegate collection calls to its list.

#### Object Literal
```js
var obj = {
  list: [1, 2, 3]
}

Marionette.actAsCollection(obj, 'list');

var double = function(v){ return v*2};
console.log(obj.map(double)); // [2, 4, 6]
```

#### Function Prototype
```js
var Func = function(list) {
  this.list = list;
};

Marionette.actAsCollection(Func.prototype, 'list');
var func = new Func([1,2,3]);


var double = function(v){ return v*2};
console.log(func.map(double)); // [2, 4, 6]
```

The first parameter is the object that will delegate underscore collection methods.

The second parameter is the object field that will hold the list.
