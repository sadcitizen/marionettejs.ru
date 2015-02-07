Это базовый класс, который может быть унаследован другими классами. `Object` включает
в себя набор конвенций и утилит из Backbone, например, `initialize` и `Backbone.Events`.

## Содержание

* [Метод `initialize`](#initialize)
* [События](#events)
* [Метод `getOption`](#getoption)
* [Метод bindEntityEvents](#bindentityevents)
* [Удаление объекта](#destroying-a-object)
* [Пример использования](#basic-use)


### <a name="initialize"></a> Метод `initialize`

Метод `initialize` вызывается сразу после того, как был создан экземпляр класса `Object`.
Вызов метода происходит с аргументами, которые были переданы в конструктор.

```js
var Friend = Marionette.Object.extend({
  initialize: function(options) {
    console.log(options.name);
  }
});

new Friend({name: 'John'});
```

### <a name="events"></a> События

`Marionette.Object` наследует `Backbone.Events` и включает в себя метод `triggerMethod`.
Это упрощает объектам запуск событий, на которые могут быть подписаны другие объекты
с помощью методов `on` или `listenTo`.

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

### <a name="getoption"></a> Метод `getOption`

Метод позволяет получить значение свойства объекта. Это свойство может принадлежать как самому объекту непосредственно, так и
быть вложенным в свойстве `this.options` объекта. Если запрашиваемое свойство сущестует и в объекте и в `this.options`, то метод вернет значение из `this.options`.
Для более полной информации ознакомьтесь с [getOption](../functions/).

### <a name="bindentityevents"></a> bindEntityEvents

Помогает привязать одну из сущностей Backbone к методам целевого объекта. Для более полной информации ознакомьтесь с [bindEntityEvents](../functions/).

### <a name="destroying-a-object"></a> Удаление объекта

У объектов есть метод `destroy`, который отвязывает все события, которые были привязаны непосредственно к экземпляру объекта.

Вызов метода `destroy` запустит событие "before:destroy" и вызовет соответствующий метод `onBeforeDestroy`.
В эти вызовы будут переданы аргументы, с которыми был вызван метод `destroy`.

```js
// Объявляем объект с методом onDestroy
var MyObject = Marionette.Object.extend({
  onBeforeDestroy: function(arg1, arg2) {
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

### <a name="basic-use"></a> Пример использования

`Selections` - это простой объект, предназначенный для управления выбором вещей.
Так как этот объект наследует `Object`, то он обладает методом `initialize` и умеет
работать с событиями `Events`.

```js
var Selections = Marionette.Object.extend({
  initialize: function(options) {
    this.selections = {};
  },

  select: function(key, item) {
    this.triggerMethod("select", key, item);
    this.selections[key] = item;
  },

  deselect: function(key, item) {
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

selections.select('toy', Truck);
```
