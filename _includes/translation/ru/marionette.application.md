Класс `Application` это контейнер для всего кода вашего приложения. Рекомендуется
иметь хотя бы один экзепляр класса `Application` на приложение.

Создавая Application  вы получаете три важных вещи:
  
 - Метод 'start' запускающий ваше приложение.
   Дает  вам отличную возможность сделать что либо, перед непосредственным запуском приложения. Например,
   начать роутинг, или, перед стартом, выполниить AJAX запрос для получения требующихся данных для приложения.
  
- Изоляцию пространства имен от `window`.
  Если вы не используете модульную систему загрузки ( ES6 modules, CommonJS, или AMD), то вы можете использовать
  пространсто имен Application для хранения Javascript объектов. И, даже, если используете эти модульные системы,
  вы все равно можете использовать application- пространство, например, для помощи в дебаггинге.
  
- Интеграцию с Marionette Inspector. Marionette Inspector - инструмент облегчающий понимание и дебаггинг вашего
  приложения. Использование Application Class автоматически связывает приложение с этим расширением.

Обратите внимание, что Application подвергается многим изменениям, что бы стать более легковесным. Поэтому все еще
содержит в себе множество фич не отображенных в cписке ниже. Например, Radio Channel и Regions, на данный момент "depricated" 
внутри Application. Сверяйтесь с соответвующими разделами, для уточнения, что использовать вместо объявленных устаревшими фич. 

## Содержание

* [Getting Started](#getting-started)
* [Метод initialize](#initialize)
* [Добавление инициализаторов](#adding-initializers)
* [События иницализации приложения](#application-event)
* [Запуск приложения](#starting-an-application)
* [Система обмена сообщениями](#the-application-channel)
  * [Агрегатор событий](#event-aggregator)
  * [Запрос/Ответ](#request-response)
  * [Команды](#commands)
  * [Доступ к системе обмена сообщениями](#accessing-the-application-channel)
* [Регионы и объект приложения](#regions-and-the-application-object)
  * [jQuery-селектор](#jquery-selector)
  * [Собственный тип региона](#custom-region-type)
  * [Собственный тип региона и селектор](#custom-region-type-and-selector)
  * [Регионы как параметры](#region-options)
  * [Переопределение стандартного RegionManager-а](#overriding-the-default-regionmanager)
  * [Получение региона по его имени](#get-region-by-name)
  * [Удаление регионов](#removing-regions)
* [Application.getOption](#applicationgetoption)

### <a name="getting-started"></a> Getting Started

A common pattern in Backbone apps is the following:

```js
var app = {};
```

Two notable examples of this pattern are
[DocumentCloud's source](https://github.com/documentcloud/documentcloud/blob/master/public/javascripts/application.js#L3) and
[Backbone Boilerplate](https://github.com/backbone-boilerplate/backbone-boilerplate/blob/master/app/app.js#L1-L6). DocumentCloud
is notable because it is the codebase that Backbone was abstracted from. If such a thing as a quintessential Backbone application
existed, then that app would certainly be a candidate. Backbone Boilerplate is notable as perhaps the most popular library
for bootstrapping a Backbone application. Do note that in the Backbone Boilerplate code the exported object is implicit.

The pattern of creating a Javascript object is so popular because it provides you with a location to
put the pieces of your application. For instance, attaching a Router to this object is common practice.

Using a raw Javascript object is great, but Marionette provides a light wrapper for a plain Javascript object, which is the
Application. One benefit to using the Application is that it comes with a `start` method. This can be used to accomplish
tasks before the rest of your application begins. Let's take a quick look at an example:

```js
// Create our Application
var app = new Marionette.Application();

// Start history when our application is ready
app.on('start', function() {
  Backbone.history.start();
});

// Load some initial data, and then start our application
loadInitialData().then(app.start);
```

In the simple example above, we could have just as easily started history after our initial data had loaded. This
pattern becomes more useful as the startup phase of your application becomes more complex.

### <a name="initialize"></a> Метод initialize

Метод `initialize` вызывается сразу же после того, как был создан экземпляр `Application`.
При этом этот метод будет вызван с теми же аргументами, которые получил конструктор `Application`.

```js
var MyApp = Marionette.Application.extend({
  initialize: function(options) {
    console.log(options.container);
  }
});

var myApp = new MyApp({container: '#app'});
```

## События класса `Application`

Объект `Application` вызывает несколько событий в течение своего жизненного цикла,
для этого используется функция [Marionette.triggerMethod](../functions/).
Эти события могут использоваться для того, чтобы сделать дополнительную обработку в
вашем приложении. Например, вы хотите предварительно обработать некоторые данные перед
процессом инициализации приложения. Или вы хотите дождаться завершения инициализации
приложения и запустить `Backbone.history`.

Список событий, которые вызываются:

* **"before:start" / `onBeforeStart`**: вызывается перед запуском `Application` и перед началом исполнения инициализаторов.
* **"start" / `onStart`**: вызывается после запуска `Application` и после исполнения инициализаторов.

```js
myApp.on("before:start", function(options){
  options.moreData = "Yo dawg, I heard you like options so I put some options in your options!"
});

myApp.on("start", function(options){
  if (Backbone.history){
    Backbone.history.start();
  }
});
```

Параметр `options` передается из метода `start` экземпляра объекта `Application` (см. ниже).

## Запуск приложения

После того, как вы сконфигурировали ваше приложение, вы можете запустить его вызвав: `myApp.start(options)`.

Эта функция принимает один необязательный параметр `options`. Этот параметр будет
передаваться в каждую определенную вами функцию инициализатора, а также в функции
обработчика событий инициализации. Это позволяет вам производить дополнительное
конфигурирование в различных частях вашего приложения, в таких как инициализация/запуск
приложения, а не только при определении.

```js
var options = {
  something: "some value",
  another: "#some-selector"
};

myApp.start(options);
```

## Регионы и объект приложения

> Warning: deprecated
> This feature is deprecated. Instead of using the Application as the root
> of your view tree, you should use a Layout View. To scope your Layout View to the entire
> document, you could set its `el` to 'body'. This might look something like the following:
>
>
> ```js
> var RootView = Marionette.LayoutView.extend({
>   el: 'body'
> });
> ```
>
> Later, you can attach an instance of the `RootView` to your Application instance.
>
> ```js
> app.rootView = new RootView();
> ```

Экземпляры объекта `Application` имеют API, который позволяет вам управлять [Регионами](../region/).
Регионы являются стандартным средством, с помощью которых ваши представления (views) добавляются в `document`.

Объект `Region` может быть добавлен в приложение вызовом метода `addRegions` и передачей в функцию
литерала объекта или функции, которая возвращает литерал объекта.

Существуют три способа добавления региона в объект приложения.

### jQuery-селектор

Первый способ - это определение jQuery-селектора как значения для имени региона. В этом случае будет создан экземпляр `Region` и ему будет назначен jQuery-селектор:

```js
myApp.addRegions({
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

myApp.addRegions(function() {
  return {
    someRegion: MyCustomRegion
  };
});
```

### Собственный тип региона и селектор

Третий способ - это определение собственного типа региона и jQuery-селектора для него с помощью литерала объекта:

```js
var MyCustomRegion = Marionette.Region.extend({});

myApp.addRegions({
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

### Регионы как параметры ???

Вы также можете указать регионы при создании экземпляра объекта `Application`.

```js
new Marionette.Application({
  regions: {
    fooRegion: '#foo-region'
  }
});
```

### Переопределение стандартного `RegionManager`-а

Если вы хотите использовать класс отличный от класса `RegionManager`,
вы можете указать его в `getRegionManager`:

```js
Marionette.Application.extend({
  // ...

  getRegionManager: function() {
    // своя логика
    return new MyRegionManager();
  }
```

Это может быть полезно, если вы хотите связать регионы из `Application`
с вашим собственным экземпляром объекта `RegionManager`.

### Получение региона по его имени

Ссылку на регион можно получить по его имени с помощью метода `getRegion`:

```js
var myApp = new Marionette.Application();
myApp.addRegions({ r1: "#region1" });

// r1 === r1Again; true
var r1 = myApp.getRegion("r1");
var r1Again = myApp.r1;
```

Доступ к региону через точечнную нотацию как к свойству объекта приложения эквивалентен доступу через метод `getRegion`.

### Удаление регионов

Регионы могут быть удалены с помощью метода `removeRegion`, который принимает в виде строки имя удаляемого региона:

```js
myApp.removeRegion('someRegion');
```

Перед тем как регион будет удален из объекта приложения, для него будут вызваны специальные методы,
которые очистят его правильным образом.

Для более подробной информации ознакомьтесь с [документацией по регионам](../region/).
API, которое объект `Applications` использует для управления регионами, приходит от класса `RegionManager`,
[документация доступна здесь](../regionmanager/).


## <a name="adding-initializers"></a> Добавление инициализаторов

> Warning: deprecated
>
> This feature is deprecated, and is scheduled to be removed in version 3 of Marionette. Instead
> of Initializers, you should use events to manage start-up logic. The `start` event is an ideal
> substitute for Initializers.
>
> If you were relying on the deferred nature of Initializers in your app, you should instead
> use Promises. This might look something like the following:
>
> ```js
> doAsyncThings().then(app.start);
> ```

Ваше приложение должно выполнять полезные действия, такие как отображение контента
в регионах, запускать роутеры и многое другое. Для того что бы достигнуть этих задач и
убедиться в том, что ваше Приложение полностью сконфигурировано вы можете добавить к нему
функиции обратного вызова инициализатора.

```js
myApp.addInitializer(function(options){
  // do useful stuff here
  var myView = new MyView({
    model: options.someModel
  });

  myApp.mainRegion.show(myView);
});

myApp.addInitializer(function(options){
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

## Система обмена сообщениями

> Warning: deprecated
>
> This feature is deprecated, and is scheduled to be removed in the next major release of Marionette.
> Instead of accessing Channels through the Application, you should use the Wreqr (or Radio) API.
> By default the application's channel is named 'global'. To access this channel, you can use
> the following code, depending on whether you're using Wreqr or Radio:
>
> ```js
> // Wreqr
> var globalCh = Backbone.Wreqr.radio.channel('global');
>
> // Radio
> var globalCh = Backbone.Radio.channel('global');
> ```

Объект `Marionette Applications` включает в себя [систему обмена сообщениями](http://en.wikipedia.org/wiki/Message_passing),
которая позволяет упростить коммуникации в вашем приложении.

Система обмена сообщениями в `Application` является `Radio` каналом из `Backbone.Wreqr`.
`Backbone.Wreqr` на самом деле состоит из трех отдельных систем.

`Marionette Applications` по умолчанию назначает для канала имя 'global', но канал может
быть сконфигурирован.

```js
var myApp = new Marionette.Application({ channelName: 'appChannel' });
```

Здесь будет дан только краткий обзор системы обмена сообщениями, более подробное описание вы можете
прочитать в [документации `Backbone.Wreqr`](https://github.com/marionettejs/backbone.wreqr).

### Агрегатор событий

Агрегатор событий доступен через свойство `vent`. `vent` удобен для пассивного обмена информацией
между различными частями вашего приложения, используя генерацию событий.

```js
var myApp = new Marionette.Application();

// Предупреждает пользователя (вызывается функция alert)
// при наступлении события  'minutePassed'
myApp.vent.on("minutePassed", function(someData){
  alert("Received", someData);
});

// Здесь будет генерироваться событие и
// передаваться значение window.someData каждую минуту
window.setInterval(function() {
  myApp.vent.trigger("minutePassed", window.someData);
}, 1000 * 60);
```

### Запрос/Ответ

Запрос/Ответ позволяет любому компоненту запросить информацию у другого компонента,
не имея при этом явной связи между собой. Экземпляр объекта запрос/ответ (`Request Response`)
доступен у экземпляра объекта `Application` через свойство `reqres`.

```js
var myApp = new Marionette.Application();

// Устанавливаем обработчик, который возвращает todoList в зависимости от значения type
myApp.reqres.setHandler("todoList", function(type){
  return this.todoLists[type];
});

// Делаем запрос для получения списка покупок
var groceryList = myApp.reqres.request("todoList", "groceries");

// Метод запроса можно также получить непосредственно из экземпляра объекта Application
var groceryList = myApp.request("todoList", "groceries");
```

### Команды

Команды используются для того, чтобы любой компонент мог сказать другому компоненту
выполнить действие, при этом не используя явного обращения к этому компоненту.
Экземпляр `Commands` доступен через своиство `commands` у экземпляра объекта `Application`.

Следует обратить внимание, что функция обратного вызова команды не предназначена для возврата значения.

```js
var myApp = new Marionette.Application();

myApp.model = new Backbone.Model();

// Устанавливаем обработчик, который вызывает считывание модели с сервера
myApp.commands.setHandler("fetchData", function(reset){
  MyApp.model.fetch({reset: reset});
});

// Исполнение запроса на считывание данных
myApp.commands.execute("fetchData", true);

// Метод исполнения запроса можно также получить непосредственно из экземпляра объекта Application
myApp.execute("fetchData", true);
```

### Доступ к системе обмена сообщениями

Для того, чтобы получить доступ к системе обмена сообщениями из других объектов,
в пределах вашего приложения, вам предлагается получить эту систему через API `Wreqr`,
а не через свойство экземпляра объекта `Application`.

```js
// Предположим, что мы в некотором классе вашего приложения,
// и мы хотим использовать систему обмена сообщениями по умолчанию,
// т.е. систему обмена сообщениями с именем 'global', то,
// предпочтительно, получить доступ к этой системе обмена сообщениями следующим образом:
var globalCh = Backbone.Wreqr.radio.channel('global');
globalCh.vent;

// Этот способ не рекомендуется, поскольку он предполагает использование имени вашего приложения
window.app.vent;
```
