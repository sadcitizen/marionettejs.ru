Объект `Marionette.Application` это связующее звено вашего составного
приложения. Он объединяет, инициализирует и координирует различные части вашего
приложения. Он также является отправной точкой для вызова из вашего HTML-тега
script или непосредственно JavaScript-файлов, если вы предпочитаете такой путь.

Экземпляр объекта `Application` может быть создан напрямую, также вы можете расширить его, 
добавив свою собственную функциональность.

```js
var MyApp = new Backbone.Marionette.Application();
```

## Содержание

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

### <a name="initialize"></a> Initialize

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

## <a name="adding-initializers"></a> Добавление инициализаторов

Ваше приложение должно выполнять полезные действия, такие как отображение контента
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

## События иницализации приложения

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
MyApp.on("before:start", function(options){
  options.moreData = "Yo dawg, I heard you like options so I put some options in your options!"
});

MyApp.on("start", function(options){
  if (Backbone.history){
    Backbone.history.start();
  }
});
```

Параметр `options` передается из метода `start` экземпляра объекта `Application` (см. ниже).

## Запуск приложения

После того, как вы сконфигурировали ваше приложение, вы можете запустить его вызвав: `MyApp.start(options)`.

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

MyApp.start(options);
```

## Система обмена сообщениями

Объект `Marionette Applications` включает в себя [систему обмена сообщениями](http://en.wikipedia.org/wiki/Message_passing), 
которая позволяет упростить коммуникации в вашем приложении.

Система обмена сообщениями в `Application` является `Radio` каналом из `Backbone.Wreqr`.
`Backbone.Wreqr` на самом деле состоит из трех отдельных систем.

`Marionette Applications` по умолчанию назначает для канала имя 'global', но канал может
быть сконфигурирован.

```js
var MyApp = new Marionette.Application({ channelName: 'appChannel' });
```

Здесь будет дан только краткий обзор системы обмена сообщениями, более подробное описание вы можете
прочитать в [документации `Backbone.Wreqr`](https://github.com/marionettejs/backbone.wreqr).

### Агрегатор событий

Агрегатор событий доступен через свойство `vent`. `vent` удобен для пассивного обмена информацией
между различными частями вашего приложения, используя генерацию событий.

```js
var MyApp = new Backbone.Marionette.Application();

// Предупреждает пользователя (вызывается функция alert) 
// при наступлении события  'minutePassed'
MyApp.vent.on("minutePassed", function(someData){
  alert("Received", someData);
});

// Здесь будет генерироваться событие и 
// передаваться значение window.someData каждую минуту
window.setInterval(function() {
  MyApp.vent.trigger("minutePassed", window.someData);
}, 1000 * 60);
```

### Запрос/Ответ

Запрос/Ответ позволяет любому компоненту запросить информацию у другого компонента, 
не имея при этом явной связи между собой. Экземпляр объекта запрос/ответ (`Request Response`) 
доступен у экземпляра объекта `Application` через свойство `reqres`. 

```js
var MyApp = new Backbone.Marionette.Application();

// Устанавливаем обработчик, который возвращает todoList в зависимости от значения type
MyApp.reqres.setHandler("todoList", function(type){
  return this.todoLists[type];
});

// Делаем запрос для получения списка покупок
var groceryList = MyApp.reqres.request("todoList", "groceries");

// Метод запроса можно также получить непосредственно из экземпляра объекта Application
var groceryList = MyApp.request("todoList", "groceries");
```

### Команды

Команды используются для того, чтобы любой компонент мог сказать другому компоненту 
выполнить действие, при этом не используя явного обращения к этому компоненту. 
Экземпляр `Commands` доступен через своиство `commands` у экземпляра объекта `Application`.

Следует обратить внимание, что функция обратного вызова команды не предназначена для возврата значения.

```js
var MyApp = new Backbone.Marionette.Application();

MyApp.model = new Backbone.Model();

// Устанавливаем обработчик, который вызывает считывание модели с сервера
MyApp.commands.setHandler("fetchData", function(reset){
  MyApp.model.fetch({reset: reset});
});

// Исполнение запроса на считывание данных
MyApp.commands.execute("fetchData", true);

// Метод исполнения запроса можно также получить непосредственно из экземпляра объекта Application
MyApp.execute("fetchData", true);
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

## Регионы и объект приложения

Экземпляры объекта `Application` имеют API, который позволяет вам управлять [Регионами](../region/).
Регионы являются стандартным средством, с помощью которых ваши представления (views) добавляются в `document`.

Объект `Region` может быть добавлен в приложение вызовом метода `addRegions` и передачей в функцию 
литерала объекта или функции, которая возвращает литерал объекта. 

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

### Регионы как параметры

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

Перед тем как регион будет удален из объекта приложения, для него будут вызваны специальные методы, 
которые очистят его правильным образом.

Для более подробной информации ознакомьтесь с [документацией по регионам](../region/). 
API, которое объект `Applications` использует для управления регионами, приходит от класса `RegionManager`,
[документация доступна здесь](../regionmanager/).

### Application.getOption
Получить атрибут объекта можно либо напрямую от объекта, либо через `this.options`, 
использование `this.options` является предпочтительней.

Больше информации про [getOption](../functions/).
