Это базовый класс, который может быть унаследован другими классами. `Object` включает 
в себя набор конвенций и утилит из Backbone, например, `initialize` и `Backbone.Events`.

## Содержание

* [Метод `initialize`](#initialize)
* [События](#events)
* [Уничтожение объекта](#destroying-a-object)
* [Метод `getOption`](#getoption)
* [bindEntityEvents](#bindentityevents)
* [Пример использования](#basic-use)


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

### Метод `getOption`

Метод позволяет получить значение свойства объекта. Это свойство может принадлежать как самому объекту непосредственно, так и 
быть вложенным в свойстве `this.options` объекта. Если запрашиваемое свойство сущестует и в объекте и в `this.options`, то метод вернет значение из `this.options`.
Для более полной информации ознакомьтесь с [getOption](../functions/).

### bindEntityEvents

Помогает привязать одну из сущностей Backbone к методам целевого объекта. Для более полной информации ознакомьтесь с [bindEntityEvents](../functions/).

### Уничтожение объекта

У объектов есть метод `destroy`, который отвязывает все события, которые были привязаны непосредственно к экземпляру объекта.

Вызов метода `destroy` запустит событие "before:destroy" и вызовет соответствующий метод `onBeforeDestroy`. 
В эти вызовы будут переданы аргументы, с которыми был вызван метод `destroy`.

```js
// Объявляем объект с методом onDestroy
var MyObject = Marionette.Object.extend({

  onBeforeDestroy: function(arg1, arg2){
    // Сюда можно поместить собственный 
    // код, который уничтожит этот объект
  }

});

// Создаем экземпляр объекта
var obj = new MyObject();

// Добавляем несколько обработчиков событий
obj.on("before:destroy", function(arg1, arg2){ ... });
obj.listenTo(something, "bar", function(){...});

// Уничтожение объекта: отвязываение всех обработчиков событий,
// запуск события "destroy" и вызов метода onDestroy
obj.destroy(arg1, arg2);
```

### Пример использования

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