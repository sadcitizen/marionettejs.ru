# Marionette.Controller (В процессе перевода)

Это многоцелевой объект, который может использоваться в качестве контроллера для модулей и роутеров, и в качестве медиатора для работы и взаимодействия других объектов, представлений и прочего.

## Содержание

* [Основное применение](#basic-use)
* [Выключение контроллера](#closing-a-controller)
* [On The Name 'Controller'](#on-the-name-controller)

## Основное применение

Объект `Marionette.Controller` может быть расширен так же как и объекты `Backbone` и `Marionette`. 
Он поддерживет стандартный метод `initialize`, обладает встроенным `EventBinder` и может самостоятельно вызывать события.

```js
// объявляем контроллер
var MyController = Marionette.Controller.extend({

  initialize: function(options){
    this.stuff = options.stuff;
  },

  doStuff: function(){
    this.trigger("stuff:done", this.stuff);
  }

});

// создаем экземпляр
var c = new MyController({
  stuff: "some stuff"
});

// используем встроенный EventBinder
c.listenTo(c, "stuff:done", function(stuff){
  console.log(stuff);
});

// вызываем какой-то функционал
c.doStuff();
```

## Выключение контроллера

Каждый экземпляр контроллера имеет встроенный метод `close`, 
который удаляет все обработчики событий, присоединенные к экземпляру контроллера, 
а также те, которые были навешаны с помощью EventBinder.

Метод `close` запустит событие "close" и вызовет соответствующий метод `onClose`:

```js
// объявляем контроллер с методом onClose
var MyController = Marionette.Controller.extend({

  onClose: function(){
    // put custom code here, to close this controller
  }

})

// создаем новый экземпляр контроллера
var contr = new MyController();

// добавляем несколько обработчиков событий
contr.on("close", function(){ ... });
contr.listenTo(something, "bar", function(){...});

// выключаем контроллер: отписываемся от всех событий, 
// вызываем событие "close" и метод onClose
controller.close();
```

## On The Name 'Controller'

The name `Controller` is bound to cause a bit of confusion, which is
rather unfortunate. There was some discussion and debate about what to
call this object, the idea that people would confuse this with an 
MVC style controller came up a number of times. In the end, we decided
to call this a controller anyway--as the typical use case is to control
the workflow and process of an application and/or module. 

But the truth is, this is a very generic, multi-purpose object that can
serve many different roles, in many different scenarios. We are always open
to suggestions, with good reason and discussion, on renaming objects to
be more descriptive and less confusing. If you would like to suggest a
different name, please do so in either the mailing list or in the Github
Issues list.
