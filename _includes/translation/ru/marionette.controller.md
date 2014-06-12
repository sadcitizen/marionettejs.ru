A Controller is a white-label Marionette Object. Its name can be a cause for
confusion, as it actually has nothing to do with the popular MVC architectural pattern.
Instead, it's better to think of the Controller as a base object from which you can build.

Controllers should be used when you have a task that you would like an object to be responsible for,
but none of the other Marionette Classes quite make sense to do it. It's a base object for you to use to
create a new Class altogether.

Это многоцелевой объект, который может использоваться в качестве контроллера для модулей и роутеров и в качестве медиатора для работы и взаимодействия других объектов, представлений и прочего.

## Содержание

* [Основное применение](#basic-use)
* [Выключение контроллера](#closing-a-controller)
* [Термин 'Controller'](#on-the-name-controller)

## Основное применение

Объект `Marionette.Controller` может быть расширен так же как и объекты `Backbone` и `Marionette`. Он поддерживет стандартный метод `initialize`, обладает встроенным `EventBinder` и может самостоятельно вызывать события.

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
contr.close();
```

## Термин 'Controller'

Само название `Controller` может вызвать некоторое замешательство, потому что оно довольно неудачное. Было много обсуждений и споров о том, как назвать этот объект. Мысль, что пользователи будут путать этот объект с контроллером из паттерна MVC, приходила несколько раз. В конце концов, было принято решение все-таки назвать его контроллером потому, что типичным примером его использования может служить управление работой приложения и/или его модуля.

Но правда в том, что в широком понимании это многоцелевой объект, который может выполнять много различных ролей при многих различных сценариях. Разработчики Marionette всегда открыты для предложений (с обоснованием и после обсуждения) о переменовании объктов с целью сделать библиотеку более понятной и менее запутанной.

Если вы хотите предложить какое-то иное имя для этого объекта, то просто создайте issue в [официальном репозитории](https://github.com/marionettejs/backbone.marionette) Marionette на Github.