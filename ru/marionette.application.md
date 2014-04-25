# Marionette.Application

Объект Backbone.Marionette.Application это связующее звено ваiего составного
приложения. Он объединят, инициализирует и координирует  различные части вашего
приложения. Он также является отправной точкой для вызово из вашего HTML-тега
script или непосредственно JavaScript-файлов, если вы предпочитаете такой путь.

The `Application` is meant to be instantiated directly, although you can extend
it to add your own functionality.

```js
MyApp = new Backbone.Marionette.Application();
```

## Содержание / Documentation Index

* [Adding Initializers](#adding-initializers)
* [Application Event](#application-event)
* [Запуск приложения](#starting-an-application)
* [Обмен сообщениями](#messaging-systems)
  * [Агрегатор событий](#event-aggregator)
  * [Запрос/Ответ](#request-response)
  * [Команды](#commands)
* [Регионы и объект приложения](#regions-and-the-application-object)
  * [jQuery-селектор](#jquery-selector)
  * [Собственный тип региона](#custom-region-type)
  * [Собственный тип региона и селектор](#custom-region-type-and-selector)
  * [Получение региона по его имени](#get-region-by-name)
  * [Удаление регионов](#removing-regions)

## Добавление инициализторов / Adding Initializers

Ваше приложение должно выполнять полезные дейтсвия, такие как отображение контента
в регионах, запускать роутеры и многое другое. Для того что бы достигнуть этих задач и
убедиться в том, что ваше Приложние полностью сконфигурировано вы можете добавить к нему
функиции обратного вызова инициализатора.

```js
MyApp.addInitializer(function(options){
  // do useful stuff here
  var myView = new MyView({
    model: options.someModel
  });
  MyApp.mainRegion.show(myView);
});

MyApp.addInitializer(function(options){
  new MyAppRouter();
  Backbone.history.start();
});
```

Эти фунцкии обратного вызова будут исполнены когда вы запустите ваше приложение,
и добавлены в объект приложения как контекст обратного вызова. Иначе говоря,
внутри инициализатора `this` это объект `MyApp`.

Параметр `options` передается из метода `start` (см. ниже).

Обратные вызовы инициализаторов гарантиованно будут запущены, не важно когда вы
добавили их в объект приложения. Если вы добавили их до запуска приложения,
они буду запущены, когда будет вызван метод `start`. Если вы добавили их после запуска
приложения, они будут запущены немедленно.

## События приложения / Application Event

The `Application` object raises a few events during its lifecycle, using the
[Marionette.triggerMethod](./marionette.functions.md) function. These events
can be used to do additional processing of your application. For example, you
may want to pre-process some data just before initialization happens. Or you may
want to wait until your entire application is initialized to start the
`Backbone.history`.

The events that are currently triggered, are:

* **"initialize:before" / `onInitializeBefore`**: fired just before the initializers kick off
* **"initialize:after" / `onInitializeAfter`**: fires just after the initializers have finished
* **"start" / `onStart`**: fires after all initializers and after the initializer events

```js
MyApp.on("initialize:before", function(options){
  options.moreData = "Yo dawg, I heard you like options so I put some options in your options!"
});

MyApp.on("initialize:after", function(options){
  if (Backbone.history){
    Backbone.history.start();
  }
});
```

The `options` parameter is passed through the `start` method of the application
object (see below).

## Запуск приложения

Once you have your application configured, you can kick everything off by 
calling: `MyApp.start(options)`.

This function takes a single optional parameter. This parameter will be passed
to each of your initializer functions, as well as the initialize events. This
allows you to provide extra configuration for various parts of your app, at
initialization/start of the app, instead of just at definition.

```js
var options = {
  something: "some value",
  another: "#some-selector"
};

MyApp.start(options);
```

## Обмен сообщениями

Application instances have an instance of all three [messaging systems](http://en.wikipedia.org/wiki/Message_passing) of `Backbone.Wreqr` attached to them. This
section will give a brief overview of the systems; for a more in-depth look you are encouraged to read
the [`Backbone.Wreqr` documentation](https://github.com/marionettejs/backbone.wreqr).

### Агрегатор событий

The Event Aggregator is available through the `vent` property. `vent` is convenient for passively sharing information between
pieces of your application as events occur.

```js
MyApp = new Backbone.Marionette.Application();

// Alert the user on the 'minutePassed' event
MyApp.vent.on("minutePassed", function(someData){
  alert("Received", someData);
});

// This will emit an event with the value of window.someData every minute
window.setInterval(function() {
  MyApp.vent.trigger("minutePassed", window.someData);
}, 1000 * 60);
```

### Запрос/Ответ

Request Response is a means for any component to request information from another component without being tightly coupled. An instance of Request Response is available on the Application as the `reqres` property. 

```js
MyApp = new Backbone.Marionette.Application();

// Set up a handler to return a todoList based on type
MyApp.reqres.setHandler("todoList", function(type){
  return this.todoLists[type];
});

// Make the request to get the grocery list
var groceryList = MyApp.reqres.request("todoList", "groceries");

// The request method can also be accessed directly from the application object
var groceryList = MyApp.request("todoList", "groceries");
```

### Команды

Commands is used to make any component tell another component to perform an action without a direct reference to it. A Commands instance is available under the `commands` property of the Application.

Note that the callback of a command is not meant to return a value.

```js
MyApp = new Backbone.Marionette.Application();

MyApp.model = new Backbone.Model();

// Set up the handler to call fetch on the model
MyApp.commands.setHandler("fetchData", function(reset){
  MyApp.model.fetch({reset: reset});
});

// Order that the data be fetched
MyApp.commands.execute("fetchData", true);

// The execute function is also available directly from the application
MyApp.execute("fetchData", true);
```

## Регионы и объект приложения

Объект `Region` может быть добавлен в приложение вызовом метода `addRegions`. 

Существуют три способа добавления региона в объект приложения.

### jQuery-селектор

Первый способ - это определение jQuery-селектора как значения для имени региона. В этом случае будет создан экземпляр `Region` и ему будет назначен jQuery-селектор:

```js
MyApp.addRegions({
  someRegion: "#some-div",
  anotherRegion: "#another-div"
});
```

### Собственный тип региона

Второй способ - это определение собственного типа региона, которому задан селектор:

```js
MyCustomRegion = Marionette.Region.extend({
  el: "#foo"
});

MyApp.addRegions({
  someRegion: MyCustomRegion
});
```

### Собственный тип региона и селектор

Третий способ - это определение собственного типа региона и jQuery-селектора для него с помощью литерала объекта: 

```js
MyCustomRegion = Marionette.Region.extend({});

MyApp.addRegions({

  someRegion: {
    selector: "#foo",
    regionType: MyCustomRegion
  },

  anotherRegion: {
    selector: "#bar",
    regionType: MyCustomRegion
  }

});
```

### Получение региона по его имени

Ссылку на регион можно получить по его имени с помощью метода `getRegion`:

```js
var app = new Marionette.Application();
app.addRegions({ r1: "#region1" });

// r1 === r1Again; true
var r1 = app.getRegion("r1");
var r1Again = app.r1;
```

Доступ к региону через точенную нотацию как к свойству объекта приложения  эквивалентен доступу через метод `getRegion`.

### Удаление регионов

Регионы могут быть удалены с помощью метода `removeRegion`, который принимает в виде строки имя удаляемого региона:

```js
MyApp.removeRegion('someRegion');
```

Перед тем как регион будет удален из объекта приложения, для него будет вызван метод `.close()`, который его отключит.

Для более подробной информации ознакомьтесь с [документацией по регионам](./marionette.region.md).