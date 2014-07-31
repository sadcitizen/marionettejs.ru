Объект `Marionette.Application` это связующее звено вашего составного
приложения. Он объединяет, инициализирует и координирует различные части вашего
приложения. Он также является отправной точкой для вызово из вашего HTML-тега
script или непосредственно JavaScript-файлов, если вы предпочитаете такой путь.

The `Application` is meant to be instantiated directly, although you can extend
it to add your own functionality.

```js
var MyApp = new Backbone.Marionette.Application();
```

## Содержание / Documentation Index

* [Adding Initializers](#adding-initializers)
* [Application Event](#application-event)
* [Запуск приложения](#starting-an-application)
* [The Application Channel](#the-application-channel)
  * [Агрегатор событий](#event-aggregator)
  * [Запрос/Ответ](#request-response)
  * [Команды](#commands)
  * [Accessing the Application Channel](#accessing-the-application-channel)
* [Регионы и объект приложения](#regions-and-the-application-object)
  * [jQuery-селектор](#jquery-selector)
  * [Собственный тип региона](#custom-region-type)
  * [Собственный тип региона и селектор](#custom-region-type-and-selector)
  * [Region Options](#region-options)
  * [Overriding the default RegionManager](#overriding-the-default-regionmanager)
  * [Получение региона по его имени](#get-region-by-name)
  * [Удаление регионов](#removing-regions)
* [Application.getOption](#applicationgetoption)

## <a name="adding-initializers"></a> Добавление инициализаторов / Adding Initializers

Ваше приложение должно выполнять полезные дейтсвия, такие как отображение контента
в регионах, запускать роутеры и многое другое. Для того что бы достигнуть этих задач и
убедиться в том, что ваше Приложение полностью сконфигурировано вы можете добавить к нему
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
и добавлены в объект приложения как контекст для обратного вызова. Иначе говоря,
внутри инициализатора `this` это объект `MyApp`.

Параметр `options` передается из метода `start` (см. ниже).

Обратные вызовы инициализаторов гарантиованно будут запущены, не важно когда вы
добавили их в объект приложения. Если вы добавили их до запуска приложения,
они буду запущены, когда будет вызван метод `start`. Если вы добавили их после запуска
приложения, они будут запущены немедленно.

## События

The `Application` object raises a few events during its lifecycle, using the
[Marionette.triggerMethod](./marionette.functions.md) function. These events
can be used to do additional processing of your application. For example, you
may want to pre-process some data just before initialization happens. Or you may
want to wait until your entire application is initialized to start
`Backbone.history`.

The events that are currently triggered, are:

* **"before:start" / `onBeforeStart`**: fired just before the `Application` starts and before the initializers are executed.
* **"start" / `onStart`**: fires after the `Application` has started and after the initializers have been executed.

```js
MyApp.on("before:start", function(options){
  options.moreData = "Yo dawg, I heard you like options so I put some options in your options!"
});

MyApp.on("start", function(options){
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

## The Application Channel

Marionette Applications come with a [messaging system](http://en.wikipedia.org/wiki/Message_passing) to facilitate communications within your app.

The messaging system on the Application is the radio channel from Backbone.Wreqr, which is actually comprised of three distinct systems.

Marionette Applications default to the 'global' channel, but the channel can be configured.

```js
var MyApp = new Marionette.Application({ channelName: 'appChannel' });
```

This section will give a brief overview of the systems; for a more in-depth look you are encouraged to read
the [`Backbone.Wreqr` documentation](https://github.com/marionettejs/backbone.wreqr).

### Агрегатор событий

The Event Aggregator is available through the `vent` property. `vent` is convenient for passively sharing information between
pieces of your application as events occur.

```js
var MyApp = new Backbone.Marionette.Application();

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
var MyApp = new Backbone.Marionette.Application();

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
var MyApp = new Backbone.Marionette.Application();

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

### Accessing the Application Channel

To access this application channel from other objects within your app you are encouraged to get a handle of the systems
through the Wreqr API instead of the Application instance itself.

```js
// Assuming that we're in some class within your app,
// and that we are using the default 'global' channel
// it is preferable to access the channel like this:
var globalCh = Backbone.Wreqr.radio.channel('global');
globalCh.vent;

// This is discouraged because it assumes the name of your application
window.app.vent;
```

## Регионы и объект приложения

Application instances have an API that allow you to manage [Regions](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.region.md).
These Regions are typically the means through which your views become attached to the `document`.

Объект `Region` может быть добавлен в приложение вызовом метода `addRegions` by passing in an object
literal or a function that returns an object literal. 

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
var MyCustomRegion = Marionette.Region.extend({
  el: "#foo"
});

MyApp.addRegions(function() {
  return {
    someRegion: MyCustomRegion
  };
});
```

### Собственный тип региона и селектор

Третий способ - это определение собственного типа региона и jQuery-селектора для него с помощью литерала объекта: 

```js
var MyCustomRegion = Marionette.Region.extend({});

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

### Region Options

You can also specify regions per `Application` instance.

```js
new Marionette.Application({
  regions: {
    fooRegion: '#foo-region'
  }
});
```

### Overriding the default `RegionManager`

If you need the `RegionManager`'s class chosen dynamically, specify `getRegionManager`:

```js
Marionette.Application.extend({
  // ...

  getRegionManager: function() {
    // custom logic
    return new MyRegionManager();
  }
```

This can be useful if you want to attach `Application`'s regions to your own instance of `RegionManager`.

### Получение региона по его имени

Ссылку на регион можно получить по его имени с помощью метода `getRegion`:

```js
var app = new Marionette.Application();
app.addRegions({ r1: "#region1" });

// r1 === r1Again; true
var r1 = app.getRegion("r1");
var r1Again = app.r1;
```

Доступ к региону через точечнную нотацию как к свойству объекта приложения эквивалентен доступу через метод `getRegion`.

### Удаление регионов

Регионы могут быть удалены с помощью метода `removeRegion`, который принимает в виде строки имя удаляемого региона:

```js
MyApp.removeRegion('someRegion');
```

Перед тем как регион будет удален из объекта приложения, для него будет вызван метод `.close()`, который его отключит.

Для более подробной информации ознакомьтесь с [документацией по регионам](./marionette.region.md). Also, the API that Applications use to
manage regions comes from the RegionManager Class, which is documented [over here](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.regionmanager.md).

### Application.getOption
Retrieve an object's attribute either directly from the object, or from the object's this.options, with this.options taking precedence.

More information [getOption](./marionette.functions.md)