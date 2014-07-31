Это базовый класс, который может быть унаследован другими классами. `Object` включает 
в себя набор конвенций и утилит из Backbone, например, `initialize` и `Backbone.Events`.

## Содержание

* [Метод `initialize`](#initialize)
* [События](#events)
* [Destroying An Object](#destroying-a-object)
* [getOption](#getoption)
* [bindEntityEvents](#bindentityevents)
* [Основное применение](#basic-use)


### Метод `initialize`

Метод `initialize` вызывается сразу после того, как был создан экземпляр класса `Object`. 
Вызов метода происходит с аргументами, которые были переданы в конструктор.

```js
var Friend = Marionette.Object.extend({
  initialize: function(options){
    console.log(options.name);
  }
});

new Friend({name: 'John'});
```

### События

`Marionette.Object` наследует `Backbone.Events` и включает в себя метод `triggerMethod`.
Это упрощает объектам запуск событий, на которые могут быть подписаны другие объекты 
с помощью `on` или `listenTo`.

```js
var Friend = Marionette.Object.extend({
  graduate: function() {
    this.triggerMethod('announce', 'I graduated!!!');
  }
});

var john = new Friend({name: 'John'});

john.on('announce', function(message) {
  console.log(message); // I graduated!!!
})

john.graduate();
```

### getOption

Retrieve an object's attribute either directly from the object, or from the object's this.options, with this.options taking precedence.

More information [getOption](./marionette.functions.md).

### bindEntityEvents

Helps bind a backbone "entity" to methods on a target object. More information [bindEntityEvents](./marionette.functions.md).

### Destroying A Object

У объектов есть метод `destroy`, который unbind the events that are directly attached to the instance.

Вызов метода `destroy` запустит событие "before:destroy" и вызовет соответствующий метод `onBeforeDestroy`. 
В эти вызовы будут переданы аргументы, с которыми был вызван метод `destroy`.

```js
// define a object with an onDestroy method
var MyObject = Marionette.Object.extend({

  onBeforeDestroy: function(arg1, arg2){
    // put custom code here, to destroy this object
  }

});

// create a new object instance
var obj = new MyObject();

// add some event handlers
obj.on("before:destroy", function(arg1, arg2){ ... });
obj.listenTo(something, "bar", function(){...});

// destroy the object: unbind all of the
// event handlers, trigger the "destroy" event and
// call the onDestroy method
obj.destroy(arg1, arg2);
```

### Основное применение

`Selections` - это простой объект, предназначенный для управления выбором вещей.
Так как этот объект наследует `Object`, то он обладает методом `initialize` и умеет 
работать с событиями `Events`.

```js
var Selections = Marionette.Object.extend({

  initialize: function(options){
    this.selections = {};
  },

  select: function(key, item){
    this.triggerMethod("select", key, item);
    this.selections[key] = item;
  },

  deselect: function (argument) {
    this.triggerMethod("deselect", key, item);
    delete this.selections[key];
  }

});

var selections = new Selections({
  filters: Filters
});

// использование встроенного EventBinder
selections.listenTo(selections, "select", function(key, item){
  console.log(item);
});

selections.select(toyTruck);
```
