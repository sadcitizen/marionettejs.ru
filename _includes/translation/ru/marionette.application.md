Класс `Application` это контейнер для всего приложения. Рекомендуется
иметь хотя бы один экзепляр класса `Application` на каждое приложение.

Создавая экземпляр класса `Application`, вы получаете три важных инструмента:

- Метод `start`, запускающий ваше приложение.
  Дает возможность сделать что-либо перед непосредственным запуском приложения. Например, начать роутинг или перед стартом выполнить AJAX-запрос для получения требующихся данных.

- Изоляцию пространства имен от `window`.
  Если вы не используете модульную систему (модули ES6, CommonJS, или AMD), то можете использовать `Application` как пространсто имен для Javascript-объектов. И даже если используете эти модульные системы, вы все равно можете использовать `Application` как пространсто имен, например, для отладки.

- Интеграцию с Marionette Inspector.
  Marionette Inspector - инструмент облегчающий понимание и отладку приложения. Использование класса `Application` автоматически связывает приложение с этим расширением.

Обратите внимание, что класс `Application` подвергается частым изменениям с целью сделать его более легковесным. Поэтому этот класс все еще содержит в себе функционал, пречисленный ниже (например, шина сообщений или регионы), который считается устаревшим. Сверяйтесь с соответвующими разделами для уточнения того, что следует использовать вместо устаревшего.

## Содержание

* [Начало работы](#getting-started)
* [Метод `initialize`](#initialize)
* [События класса `Application`](#application-events)
* [Запуск приложения](#starting-an-application)
* [Регионы приложения (устарело)](#application-regions)
  * [jQuery-селектор](#jquery-selector)
  * [Собственный класс региона](#custom-region-class)
  * [Собственный класс региона и селектор](#custom-region-class-and-selector)
  * [Параметры-регионы](#region-options)
  * [Переопределения стандартного `RegionManager`](#overriding-the-default-regionmanager)
  * [Получение ссылки на регион по его имени](#get-region-by-name)
  * [Удаление регионов](#removing-regions)
* [Метод `mergeOptions`](#application-mergeoptions)
* [Метод `getOption`](#application-getoption)
* [Добавление инициализаторов (устарело)](#adding-initializers)
* [Шина сообщений приложения (устарело)](#the-application-channel)
  * [Агрегатор событий](#event-aggregator)
  * [Запрос-Ответ](#request-response)
  * [Команды](#commands)
  * [Доступ к шине сообщений приложения](#accessing-the-application-channel)

### <a name="getting-started"></a> Начало работы

Общий паттерн создания Backbone- приложения:

```js
var app = {};
```

Two notable examples of this pattern are
[DocumentCloud's source](https://github.com/documentcloud/documentcloud/blob/master/public/javascripts/application.js#L3) and
[Backbone Boilerplate](https://github.com/backbone-boilerplate/backbone-boilerplate/blob/master/app/app.js#L1-L6). DocumentCloud
is notable because it is the codebase that Backbone was abstracted from. If such a thing as a quintessential Backbone application
existed, then that app would certainly be a candidate. Backbone Boilerplate is notable as perhaps the most popular library
for bootstrapping a Backbone application. Do note that in the Backbone Boilerplate code the exported object is implicit.


Паттерн создания Javascript объекта попоулярен тем, что предоставляет вам место, куда можно сложить "кусочки" вашего приложения.
Например, добавление роутера приложения (Router) к этому объекту- обычная практика.

Использование Javascript объекта- замечательно, но Marionette предоставляет Application, являющийся легковесной оберткой
для обычного js-объекта. Преимущество использования Application в том, что предоставляется  `start` метод. Это позволит
выполнить "задания-таски" перед запуском самого приложения. Простой пример:


```js
// создаем наш Application
var app = new Marionette.Application();

// запускаем  history  когда приложение будет готово
app.on('start', function() {
  Backbone.history.start();
});

// загрузка начальных данных, и затем старт приложения
loadInitialData().then(app.start);
```

Пример выше показал возможность запуска `Backbone.history` именно после загрузки начальных данных. Этот паттерн особенно
полезен, когда фаза старта приложения становится все более сложной.

### <a name="initialize"></a> Метод `initialize`

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

## <a name="application-events"></a> События класса `Application`

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

## <a name="starting-an-application"></a> Запуск приложения

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

## <a name="application-regions"></a> Регионы приложения

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

### <a name="jquery-selector"></a> jQuery-селектор

Первый способ - это определение jQuery-селектора как значения для имени региона. В этом случае будет создан экземпляр `Region` и ему будет назначен jQuery-селектор:

```js
myApp.addRegions({
  someRegion: "#some-div",
  anotherRegion: "#another-div"
});
```

### <a name="custom-region-class"></a> Собственный класс региона

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

### <a name="custom-region-class-and-selector"></a> Собственный класс региона и селектор

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

### <a name="region-options"></a> Параметры-регионы

Вы также можете указать регионы при создании экземпляра класса `Application`.

```js
new Marionette.Application({
  regions: {
    fooRegion: '#foo-region'
  }
});
```

### <a name="overriding-the-default-regionmanager"></a> Переопределение стандартного `RegionManager`

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

### <a name="get-region-by-name"></a> Получение региона по его имени

Ссылку на регион можно получить по его имени с помощью метода `getRegion`:

```js
var myApp = new Marionette.Application();
myApp.addRegions({ r1: "#region1" });

var myRegion = app.getRegion('r1');
```

Regions are also attached directly to the Application instance, **but this is not recommended usage**.

### <a name="removing-regions"></a> Удаление регионов

Регионы могут быть удалены с помощью метода `removeRegion`, который принимает в виде строки имя удаляемого региона:

```js
myApp.removeRegion('someRegion');
```

Перед тем как регион будет удален из объекта приложения, для него будут вызваны специальные методы,
которые очистят его правильным образом.

Для более подробной информации ознакомьтесь с [документацией по регионам](../region/).
API, которое объект `Applications` использует для управления регионами, приходит от класса `RegionManager`,
[документация доступна здесь](../regionmanager/).

### <a name="application-mergeoptions"></a> Метод `mergeOptions`
Merge keys from the `options` object directly onto the Application instance.

```js
var MyApp = Marionette.Application.extend({
  initialize: function(options) {
    this.mergeOptions(options, ['myOption']);

    console.log('The option is:', this.myOption);
  }
})
```

More information at [mergeOptions](./marionette.functions.md#marionettemergeoptions)

### <a name="application-getoption"></a> Метод `getOption`
Retrieve an object's attribute either directly from the object, or from the object's this.options, with this.options taking precedence.

More information [getOption](./marionette.functions.md#marionettegetoption)

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

## <a name="the-application-channel"></a> Шина сообщений приложения

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

### <a name="event-aggregator"></a> Агрегатор событий

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

### <a name="request-response"></a> Запрос-Ответ

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

### <a name="commands"></a> Команды

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

### <a name="accessing-the-application-channel"></a> Доступ к шине сообщений приложения

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
