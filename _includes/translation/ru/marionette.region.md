Регионы предоставляют методы для согласованного управления, показа и уничтожения представлений
в ваших приложениях и макетах. Они используют jQuery-селекторы, чтобы показать ваши представления
в правильном месте.

С помощью класса `LayoutView` вы можете создавать вложенные регионы.

## Содержание

* [Определение регионов приложения](#defining-an-application-region)
  * [Типы конфигурирования регионов](#region-configuration-types)
* [Инициализация региона с помощью `el`](#initialize-a-region-with-an-el)
* [Основное применение](#basic-use)
  * [Отображение представления](#showing-a-view)
  * [Проверка отображено ли представление в регионе](#checking-whether-a-region-is-showing-a-view)
  * [Сброс региона](#reset-a-region)
  * [Конфигурирование, как `el` представлнения будет добавлено](#set-how-views-el-is-attached)
  * [Добавление существующего представления](#attach-existing-view)
    * [Установка `currentView` при инициализации](#set-currentview-on-initialization)
    * [Вызов `attachView` в регионе](#call-attachview-on-region)
* [События и коллбэки региона](#region-events-and-callbacks)
  * [События, которые вызываются в течение `отображения`](#events-raised-during-show)
* [Custom Region Classes](#custom-region-classes)
  * [Attaching Custom Region Classes](#attaching-custom-region-classes)
  * [Instantiate Your Own Region](#instantiate-your-own-region)

## Определение регионов приложения

Вы можете добавить регионы в ваших приложениях, вызвав метод `addRegions` 
у экземпляра вашего приложения. Этот метод ожидает один параметр в виде хэша. 
В хэше заданы имена регионов и либо jQuery-селектор, либо объект `Region`.
Вы можете вызвать этот метод столько раз, сколько вам нужно, и он будет продолжать
добавлять регионы в приложение.

```js
MyApp.addRegions({
  mainRegion: "#main-content",
  navigationRegion: "#navigation"
});
```

Вскоре после вызова `addRegions`, ваши регионы станут доступны у объекта вашего приложения.
В приведенном выше примере `MyApp.mainRegion` и `MyApp.navigationRegion` немедленно доступны для использования.

Если вы укажете одно и то же имя для региона дважды, будет использовано последнее определение.

Вы можете также добавить регионы через `LayoutView`:

```js
var AppLayoutView = Backbone.Marionette.LayoutView.extend({
  template: "#layout-view-template",

  regions: {
    menu: "#menu",
    content: "#content"
  }
});
var layoutView = new AppLayoutView();
layoutView.render();
layoutView.menu.show(new MenuView());
layoutView.content.show(new MainContentView());
```

### Типы конфигурирования регионов

Marionette поддреживает несколько способов определения регионов в вашем `Application` или `LayoutView`.

#### Селектор в виде строки

Для определения региона вы можете использовать jQuery-селектор в виде строки.

```js
App.addRegions({
  mainRegion: '#main'
});
```

#### Класс региона

Если у вас есть собственный класс региона, вы можете использовать его для определения региона.

**Внимание:** Убедитесь, что класс региона имеет свойство `el`, в противном случае регион создать не получится.

```js
var MyRegion = Marionette.Region.extend({
  el: '#main-nav'
});

App.addRegions({
  navigationRegion: MyRegion
});
```

#### Литерал объекта

Наконец, вы можете определить регионы в виде литерал объекта. 
Определения в виде литерал объекта обычно содержит определенное `selector` или `el` свойство. 
Свойство `selector` это селектор в виде строки, а свойство `el` может быть 
как селектором в виде строки, так и Query-объектом или HTML-узлом.

Вы можете также задать свойство `regionClass` для собственного класса региона.
Если ваш `regionClass` уже имеет установленное свойство `el`, то вам не нужно
определять `selector` или `el` свойство в литерал объекте.

Любые другие свойства, заданные вами в литерал объекте, будут использоваться к качестве
параметров, которые будут переданы в экземпляр региона.

```js
var MyRegion      = Marionette.Region.extend();
var MyOtherRegion = Marionette.Region.extend();
var MyElRegion    = Marionette.Region.extend({ el: '#footer' });

App.addRegions({
  contentRegion: {
    el: '#content',
    regionClass: MyRegion
  },

  navigationRegion: {
    el: '#navigation',
    regionClass: MyOtherRegion,

    // Параметры, которые будут переданы в экземпляр `MyOtherRegion` для
    // `navigationRegion` в `App`
    navigationOption: 42,
    anotherNavigationOption: 'foo'
  },

  footerRegion: {
    regionClass: MyElRegion
  }
});
```

Обратите внимание, что одним из основных преимуществ использования `regionClass` с уже
установленным `el` является возможность предоставления параметров для экземпляра региона.
Это невозможно, когда используется непосредственно класс региона, как в способах ранее.

```js
var MyRegion = Marionette.Region.extend({
  el: '#content',
});

App.addRegions({
  contentRegion: {
    regionClass: MyRegion,
    myRegionOption: 'bar',
    myOtherRegionOption: 'baz'
  }
});
```

#### Смешивание и комбинирование

Конечно вы можете смешивать и комбинировать различные типы конфигурирования регионов.

```js
var MyRegion = Marionette.Region.extend({
  el: '#content'
});

var MyOtherRegion = Marionette.Region.extend();

App.addRegions({
  contentRegion: MyRegion,

  navigationRegion: '#navigation',

  footerRegion: {
    el: '#footer',
    regionClass: MyOtherRegion
  }
});
```

## Инициализация региона с помощью `el`

Вы можете указать `el` для региона, чтобы управлять местом, где будет создан экземпляр регион:

```js
var mgr = new Backbone.Marionette.Region({
  el: "#someElement"
});
```

Опция `el` может также быть ссылкой на DOM-узел:

```js
var mgr = new Backbone.Marionette.Region({
  el: document.querySelector("body")
});
```

Также `el` может быть `jQuery`-оберткой для DOM-узла:

```js
var mgr = new Backbone.Marionette.Region({
  el: $("body")
});
```

## Основное применение

### Отображение представления

Как только регион объявлен, вы можете вызвать его методы `show` и `empty` для отображения или выключения представления:

```js
var myView = new MyView();

// Рендеринг и отобрабражение представления
MyApp.mainRegion.show(myView);

// Удаление текущего представления
MyApp.mainRegion.empty();
```

#### опция preventDestroy

Если вы хотите заменить текущее представление на новое представлние, вы можете вызвать метод `show`,
этот метод, по умолчанию, автоматически уничтожит предыдущее представление. Вы можете предотвратить
это поведение передав опцию `{preventDestroy: true}` в параметрах метода; больше информации можно
прочитать в [События и коллбэки региона](#region-events-and-callbacks).

```js
// Отобразим первое представление.
var myView = new MyView();
MyApp.mainRegion.show(myView);

// Заменим представление на другое.
// Метод `destroy` будет вызван для вас автоматически
var anotherView = new AnotherView();
MyApp.mainRegion.show(anotherView);

// Заменим представление на другое.
// Предотвращием вызов метода `destroy`
var anotherView2 = new AnotherView();
MyApp.mainRegion.show(anotherView2, { preventDestroy: true });
```

ПРИМЕЧАНИЕ: При использовании `preventDestroy: true` вы должны быть осторожны, необходимо помнить,
что ваши старые представления должны быть удалены вручную, чтобы предотвратить утечку памяти.

#### опция forceShow

Если вы повторно вызовите метод `show` с тем же представлением, то по умолчанию ничего
не произойдет, потому что представление уже в регионе. Вы можете заставить представление
переотобразиться (re-shown), для этого нужно передать опцию `{forceShow: true}` в параметрах метода. 

```js
var myView = new MyView();
MyApp.mainRegion.show(myView);

// сейчас повторный вызов метода `show` переотобразит представление
MyApp.mainRegion.show(myView, {forceShow: true});
```

### Проверка отображено ли представление в регионе

Если вы хотите проверить, есть ли представление у региона, то вы можете использовать
функцию `hasView`. Эта функция возвращает соответствующее булевское значение в зависимости от того,
отображено ли представление в регионе или нет.

### Сброс региона

Регион может быть сброшен в любое время через метод `reset`. Этот метод уничтожит
существующее представление, отображаемое в регионе, и удалит закэшированное значение из `el`.
Затем, регион отобразит представление, значение свойства `el` региона запрашивается у DOM.

```js
myRegion.reset();
```

Это полезно, когда регионы используются повторно для экземпляров представления, 
а также в модульном тестировании.

### Конфигурирование, как `el` представлнения будет добавлено

Переопределение метода `attachHtml` региона изменяет поведение того, как представление
будет добавлено в DOM. Этот метод принимает один параметр - представление для отображения.

По умолчанию, реализация метода `attachHtml` является следующей:

```js
Marionette.Region.prototype.attachHtml = function(view){
  this.$el.empty().append(view.el);
}
```

Происходит замещение содержимого региона значением/содержимым `el` представления.
Вы можете переопределить метод `attachHtml` для создания своего эффекта перехода 
или чего-то еще.  

```js
Marionette.Region.prototype.attachHtml = function(view){
  this.$el.hide();
  this.$el.html(view.el);
  this.$el.slideDown("fast");
}
```

Кроме того, можно задать свой собственный метод отрисовки для своего региона,
наследуясь от класса `Region` и добавив свою реализацию метода `attachHtml`.

Этот пример задает появление представления slide-эффектом снизу вверх экрана,
а не просто появление в нужном месте:

```js
var ModalRegion = Marionette.Region.extend({
  attachHtml: function(view){
    // Некоторый эффект отображения представления:
    this.$el.empty().append(view.el);
    this.$el.hide().slideDown('fast');
  }
})

MyApp.addRegions({
  mainRegion: '#main-region',
  modalRegion: {
    regionClass: ModalRegion,
    selector: '#modal-region'
  }
})
```

### Добавление существующего представления

Есть несколько сценариев, как желательно добавлять существующее представление в регион,
без отрисовки или отображения представления и без замещения HTML-содержимого региона.
Например, для SEO и [универсального доступа](http://www.w3.org/WAI/intro/accessibility.php) часто нужен HTML, который должен сгенерироваться на сервере, а также для [прогрессивного улучшения](http://en.wikipedia.org/wiki/Progressive_enhancement) HTML.

Есть два способа сделать это:

* установить `currentView` в конструкторе региона
* вызвать `attachView` у экземпляра региона

#### Установка `currentView` при инициализации

```js
var myView = new MyView({
  el: $("#existing-view-stuff")
});

var region = new Backbone.Marionette.Region({
  el: "#content",
  currentView: myView
});
```

#### Вызов `attachView` в регионе

```js
MyApp.addRegions({
  someRegion: "#content"
});

var myView = new MyView({
  el: $("#existing-view-stuff")
});

MyApp.someRegion.attachView(myView);
```

## События и коллбэки региона

### События, которые вызываются в течение `отображения`:

Регион будет вызывать некоторые события при отображении и
уничтожении представления:

* "before:show" / `onBeforeShow` - Вызывается у экземпляра представления после того, как представление было отрисовано (rendered), но до его отображения (показа).
* "before:show" / `onBeforeShow` - Вызывается у экземпляра региона после того, как представление было отрисовано, но до его отображения.
* "show" / `onShow` - Вызывается у экземпляра представления, когда представление было отрисовано и отображено.
* "show" / `onShow` - Вызывается у экземпляра региона, когда представление было отрисовано и отображено.
* "before:swap" / `onBeforeSwap` - Вызывается у экземпляра региона до того, как новое представление будет отображено. ЗАМЕЧАНИЕ: это событие будет вызвано только тогда, когда представление сменилось (swapped), но не когда регион пустой.
* "before:swapOut" / `onBeforeSwapOut` - Вызывается у экземпляра региона до того, как новое представление начинает сменяться. ЗАМЕЧАНИЕ: это событие будет вызвано только тогда, когда представление сменилось, но не когда регион пустой.
* "swap" / `onSwap` - Вызывается у экземпляра региона тогда, когда новое представление `отображено`. ЗАМЕЧАНИЕ: это событие будет вызвано только тогда, когда представление сменилось, но не когда регион пустой.
* "swapOut" / `onSwapOut` - Вызывается у экземпляра региона тогда, когда новое представление сменилось и начинает заменять отображаемое представление. ЗАМЕЧАНИЕ: это событие будет вызвано только тогда, когда представление сменилось, но не когда регион пустой.
* "before:empty" / `onBeforeEmpty` - Вызывается у экземпляра региона до того, как представление будет очищено/уничтожено.
* "empty" / `onEmpty` - Вызывается тогда, когда представление было очищено/уничтожено.

Эти события могут быть использованы для запуска кода, когда ваш регион открывает и/или уничтожает представления.

```js
MyApp.mainRegion.on("before:show", function(view){
  // manipulate the `view` or do something extra
  // with the region via `this`
});

MyApp.mainRegion.on("show", function(view){
  // manipulate the `view` or do something extra
  // with the region via `this`
});

MyApp.mainRegion.on("before:swap", function(view){
  // manipulate the `view` or do something extra
  // with the region via `this`
});

MyApp.mainRegion.on("swap", function(view){
  // manipulate the `view` or do something extra
  // with the region via `this`
});

MyApp.mainRegion.on("empty", function(view){
  // manipulate the `view` or do something extra
  // with the region via `this`
});

var MyRegion = Backbone.Marionette.Region.extend({
  // ...

  onBeforeShow: function(view) {
    // the `view` has not been shown yet
  },

  onShow: function(view){
    // the `view` has been shown
  }
});

var MyView = Marionette.ItemView.extend({
  onBeforeShow: function() {
    // called before the view has been shown
  },
  onShow: function(){
    // called when the view has been shown
  }
});

var MyRegion = Backbone.Marionette.Region.extend({
  // ...

  onBeforeSwap: function(view) {
    // the `view` has not been swapped yet
  },

  onSwap: function(view){
    // the `view` has been swapped
  }
});
```

## Собственные классы регионов

You can define a custom region by extending from
`Region`. This allows you to create new functionality,
or provide a base set of functionality for your app.

### Attaching Custom Region Classes

Once you define a region class, you can attach the
new region class by specifying the region class as the
value. In this case, `addRegions` expects the constructor itself, not an instance.

```js
var FooterRegion = Backbone.Marionette.Region.extend({
  el: "#footer"
});

MyApp.addRegions({
  footerRegion: FooterRegion
});
```

You can also specify a selector for the region by using
an object literal for the configuration.

```js
var FooterRegion = Backbone.Marionette.Region.extend({
  el: "#footer"
});

MyApp.addRegions({
  footerRegion: {
    selector: "#footer",
    regionClass: FooterRegion
  }
});
```

Note that a region must have an element to attach itself to. If you
do not specify a selector when attaching the region instance to your
Application or LayoutView, the region must provide an `el` either in its
definition or constructor options.

### Instantiate Your Own Region

There may be times when you want to add a region to your
application after your app is up and running. To do this, you'll
need to extend from `Region` as shown above and then use
that constructor function on your own:

```js
var SomeRegion = Backbone.Marionette.Region.extend({
  el: "#some-div",

  initialize: function(options){
    // your init code, here
  }
});

MyApp.someRegion = new SomeRegion();

MyApp.someRegion.show(someView);
```

You can optionally add an `initialize` function to your Region
definition as shown in this example. It receives the `options`
that were passed to the constructor of the Region, similar to
a Backbone.View.
