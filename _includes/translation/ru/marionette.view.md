Marionette имеет базовый класс `Marionette.View`, 
другие представления расширяют его (наследуются от него).
Это базовое представление предоставляет некоторую общую и базовую (core) функциональность,
которой могут воспользоваться другие представления.

**Замечание:** Класс `Marionette.View` не предназначен для непосредственного использования.
Он существует как базовое представление для других классов представлений, 
они должны расширять его. Задача класса `Marionette.View` обеспечить общее место для расположения поведении,
которые являются общими для всех представлений.

## Содержание

* [Привязка событий к представлению](#binding-to-view-events)
* [Метод onShow](#view-onshow)
* [Метод destroy](#view-destroy)
* [Метод onBeforeDestroy](#view-onbeforedestroy)
* [Событие "dom:refresh" / метод onDomRefresh](#view-domrefresh--ondomrefresh-event)
* [События представления](#viewevents)
* [Триггеры представления](#viewtriggers)
* [События модели в modelEvents и событий коллекции в collectionEvents](#viewmodelevents-and-viewcollectionevents)
* [View.serializeData](#viewserializedata)
* [View.bindUIElements](#viewbinduielements)
* [View.getOption](#viewgetoption)
* [View.bindEntityEvents](#viewbindentityevents)
* [View.templateHelpers](#viewtemplatehelpers)
  * [Basic Example](#basic-example)
  * [Accessing Data Within The Helpers](#accessing-data-within-the-helpers)
  * [Object Or Function As `templateHelpers`](#object-or-function-as-templatehelpers)
* [Change Which Template Is Rendered For A View](#change-which-template-is-rendered-for-a-view)

## Привязка событий к представлению

`Marionette.View` расширяет `Backbone.View`. Рекомендуется использовать метод `listenTo` для 
прослушивания событий (привязки к событиям) модели, коллекции или других событий от объектов Backbone и Marionette.

```js
var MyView = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    this.listenTo(this.model, "change:foo", this.modelChanged);
    this.listenTo(this.collection, "add", this.modelAdded);
  },

  modelChanged: function(model, value){
  },

  modelAdded: function(model){
  }
});
```

Контекст (`this`) будет автоматически установлен на объект представления.
При желании вы можете сами установить контекст с помошью `_.bind`.

```js
// Мы принудительно устанавливаем контекст функции обратного вызова "reconcileCollection"
// на объект самой collection, этот контекст только для этого обработчика события
// (не влияет на любое другое использование метода "reconcileCollection")
this.listenTo(this.collection, "add", _.bind(this.reconcileCollection, this.collection));
```

## Метод onShow

* "show" / `onShow` - Вызывается у экземпляра представления после того, как представление было сформировано (rendered) и отображено.

Это событие можно использовать для реагирования на отображение представления через [регион](marionette.region.md).
Все `представления`, которые наследованы от базового класса `Marionette.View` имеют эту функциональность,
в частности `ItemView`, `CollectionView`, `CompositeView`, и `LayoutView`.

```js
Backbone.Marionette.ItemView.extend({
  onShow: function(){
    // вызывается, когда представление было отображено
  }
});
```

Часто используемая ситуация для метода `onShow` это его использование для добавления дочерних представлений.

```js
var LayoutView = Backbone.Marionette.LayoutView.extend({
   regions: {
     Header: 'header',
     Section: 'section'
   },
   onShow: function() {
      this.Header.show(new Header());
      this.Section.show(new Section());
   }
});
```

## Метод destroy

Представление реализует метод `destroy`, который вызывается системой управления регионами 
(менеджерами регионов) автоматически. Как часть реализации, метод `destroy` выполняет
следующие операции:

* вызывает событие `onBeforeDestroy` у представления, если таковое имеется
* вызывает событие `onDestroy` у представления, если таковое имеется
* прекращает прослушивание всех пользовательских событий представления
* прекращает прослушивание всех DOM-событий
* удаляет `this.el` из DOM
* прекращает прослушивание всех `listenTo` событий

Реализовывая метод `onDestroy` в определении вашего представления, позволяет вам 
запускать пользовательский код для вашего представления, который будет выполнен
после того как ваше представление будет уничтожено и очищено. Метод `onDestroy` будет
вызван с аргументами, с которыми был вызван метод `destroy`. Это позволяет вам выполнить любой
дополнительный код по очистке без необходимости переопределения метода `destroy`.

```js
var MyView = Backbone.Marionette.ItemView.extend({
  onDestroy: function(arg1, arg2){
    // свой код очистки или уничтожения, должен быть здесь
  }
});

var v = new MyView();
v.destroy(arg1, arg2);
```

## Метод onBeforeDestroy

Когда запускается процесс уничтожения представления, то вызывается метод `onBeforeDestroy`, если этот
метод представлен. Метод `onBeforeDestroy` вызывается перед уничтожением представления. Он будет вызван
с аргументами, с которыми был вызван метод `destroy`.

### Событие "dom:refresh" / метод onDomRefresh

Вызывается после того, как представление было сформировано (rendered) и отображено в DOM через `Marionette.Region`, или было пере-сформировано (re-rendered).

Это событие / функция обратного вызова используется
[DOM-зависимыми UI плагинами](http://lostechies.com/derickbailey/2012/02/20/using-jquery-plugins-and-ui-controls-with-backbone/) таких как [jQueryUI](http://jqueryui.com/) или [KendoUI](http://kendoui.com).

```js
Backbone.Marionette.ItemView.extend({
  onDomRefresh: function(){
    // Манипуляции с `el` нужно делать здесь. Оно (`el`) уже было
    // сформировано, и HTML представления готов для использования.
  }
});
```

Чтобы узнать больше об интеграции Marionette с KendoUI (также применимо к jQueryUI и другим UI
виджетам), читайте [эту статью в блоге KendoUI + Backbone](http://www.kendoui.com/blogs/teamblog/posts/12-11-26/backbone_and_kendo_ui_a_beautiful_combination.aspx).

## События представления

Поскольку класс `Marionette.View` расширяет (наследуется от) backbone-ий класс представления, 
вы получаете преимущества от использования [хеша events](http://backbonejs.org/#View-delegateEvents).

Некоторый синтаксический сахар добавляется от возможности использования хеша `ui`.

```js
var MyView = Backbone.Marionette.ItemView.extend({
  // ...

  ui: {
    "cat": ".dog"
  },

  events: {
    "click @ui.cat": "bark" // это эквивалентно "click .dog":
  }
});
```

## Триггеры представления

В представлениях можно определять набор `triggers` в виде хеша, который будет 
преобразовывать DOM-события в вызов метода `view.triggerMethod`.

В хеше `triggers` слева указываются стандартые DOM-события Backbone.View ("событие селектор"),
справой же стороны хеша определяются события представления, которые вы хотите вызвать у представления.

```js
var MyView = Backbone.Marionette.ItemView.extend({
  // ...

  triggers: {
    "click .do-something": "something:do:it"
  }
});

var view = new MyView();
view.render();

view.on("something:do:it", function(args){
  alert("I DID IT!");
});

// нажатие ("click") на 'do-something' DOM-элемент
// демонстрирует преобразование DOM-события
view.$(".do-something").trigger("click");
```

В результате выполнения этого кода, появится окно предупрежедения с текстом "I DID IT!".

По умолчанию все триггеры (triggers) будут остановлены методами `preventDefault` и `stopPropagation`. 
По желанию вы можете вручную настроить триггеры, используя хэш вместо имени события представления. 
Пример тригера ниже демонстрирует определение события и предотвращение поведения браузера по умолчанию 
с помощью только метода `preventDefault`.

```js
Backbone.Marionette.CompositeView.extend({
  triggers: {
    "click .do-something": {
      event: "something:do:it",
      preventDefault: true, // этот параметр не является обязательным, по умолчанию его значение true
      stopPropagation: false
    }
  }
});
```

Вы также можете указать `triggers` как функцию, которая возвращает хеш сконфигурированных тригеров.

```js
Backbone.Marionette.CompositeView.extend({
  triggers: function(){
    return {
      "click .that-thing": "that:i:sent:you"
    };
  }
});
```

Селекторы в триггере могут быть указаны через ситнаксический сахар от использования хеша ```ui```.

```js
Backbone.Marionette.ItemView.extend({
  ui: {
     'monkey': '.guybrush'
  },
  triggers: {
    'click @ui.monkey': 'see:LeChuck' // эквивалентно конструкции "click .guybrush"
  }
});
```

Триггеры работают во всех классах представлений (`View`), которые наследованы от базового класса `Marionette.View`.

### Аргументы функции обработчика триггера

Функция обработчика события в `тригере`-е получает один аргумент, который 
включает в себя следующее:

* представление
* модель
* коллекция

Эти свойства соответствуют свойствам `view`, `model`, и `collection` из представления, 
которое вызвало событие.

```js
var MyView = Backbone.Marionette.ItemView.extend({
  // ...

  triggers: {
    "click .do-something": "some:event"
  }
});

var view = new MyView();

view.on("some:event", function(args){
  args.view; // => экземпляр представления, которое вызвало событие
  args.model; // => модель из представления - view.model, если модель была установлена в прдедставлении
  args.collection; // => коллекция из представления - view.collection, если коллекция была установлена в прдедставлении
});
```

Имея доступ к этим своиствам, позволяет обеспечить большую гибкость 
при обработке событий от множества представлений. Для примера, компонент управления вкладками или виджет для развернуть/свернуть бар-панель могут обрабытывать одинаковое событие от многих разных представлений 
и обработка этого события будет описана в одной функции.

## События модели в modelEvents и событий коллекции в collectionEvents

Подобно хешу `events`, в представлениях можно указывать хеши для коллекций и моделей.
С левой стороны указывается событие модели или коллекции, а с правой стороны имя метода из представления, 
который будет методом обратного вызова.

```js
Backbone.Marionette.CompositeView.extend({

  modelEvents: {
    "change:name": "nameChanged" // эквивалентно - view.listenTo(view.model, "change:name", view.nameChanged, view)
  },

  collectionEvents: {
    "add": "itemAdded" // эквивалентно - view.listenTo(view.collection, "add", view.itemAdded, view)
  },

  // ... методы обработчики событий
  nameChanged: function(){ /* ... */ },
  itemAdded: function(){ /* ... */ },

})
```

Эти конструкции используют памяти-безопасный `listenTo` и будет установлен контекст (значение `this`)
в обработчике события, равный текущему представлению. События связываются во время создания экзепляра
представления и будет сгенерировано исключение, если функции обработчики событий будут отсутствовать
в представлении.

События из `modelEvents` и `collectionEvents` будут подключены и отключены от прослушивания
при помощи вызова методов из `Backbone.View`: `delegateEvents` и `undelegateEvents`.
Это позволяет представлению повторно использовать события для модели и коллекции при 
переподключении прослушивания событий.

### Несколько функций обратного вызова

Для определения нескольких функций обратного вызова для события можно указать их друг за другом,
разделяя их между собой пробелом.

```js
Backbone.Marionette.CompositeView.extend({

  modelEvents: {
    "change:name": "nameChanged thatThing"
  },

  nameChanged: function(){ },

  thatThing: function(){ },
});
```

Это работает для обоих `modelEvents` и `collectionEvents`.

### Определение функций обратного вызова через функции

Функция может быть объявлена напрямую в строчке, где указывается имя функции обратного вызова
в виде строкового название метода.

```js
Backbone.Marionette.CompositeView.extend({

  modelEvents: {
    "change:name": function(){
      // обработка события изменеия имени будет здесь
    }
  }

});
```

Это работает для обоих `modelEvents` и `collectionEvents`.

### Определение событий через функцию

Функция может быть использована для определения назначаемых событий. Эта функция должна возвращать хеш,
который должен соответствовать виду указанному выше, т.е. иметь корректные вышеуказаные параметры.

```js
Backbone.Marionette.CompositeView.extend({

  modelEvents: function(){
    return { "change:name": "someFunc" };
  }

});
```

Это работает для обоих  `modelEvents` и `collectionEvents`.

## View.serializeData

The `serializeData` method will serialize a view's model or
collection - with precedence given to collections. That is,
if you have both a collection and a model in a view, calling
the `serializeData` method will return the serialized
collection.

## View.bindUIElements

In several cases you need to access ui elements inside the view
to retrieve their data or manipulate them. For example you have a
certain div element you need to show/hide based on some state,
or other ui element that you wish to set a css class to it.
Instead of having jQuery selectors hanging around in the view's code
you can define a `ui` hash that contains a mapping between the
ui element's name and its jQuery selector. Afterwards you can simply
access it via `this.ui.elementName`.
See ItemView documentation for examples.

This functionality is provided via the `bindUIElements` method.
Since View doesn't implement the render method, then if you directly extend
from View you will need to invoke this method from your render method.
In ItemView and CompositeView this is already taken care of.

## View.getOption
Retrieve an object's attribute either directly from the object, or from the object's this.options, with this.options taking precedence.

More information [getOption](./marionette.functions.md)

## View.bindEntityEvents
Helps bind a backbone "entity" to methods on a target object. bindEntityEvents is used to support `modelEvents` and `collectionEvents`.

More information [bindEntityEvents](./marionette.functions.md)

## View.templateHelpers

There are times when a view's template needs to have some
logic in it and the view engine itself will not provide an
easy way to accomplish this. For example, Underscore templates
do not provide a helper method mechanism while Handlebars
templates do.

A `templateHelpers` attribute can be applied to any View object that
renders a template. When this attribute is present its contents
will be mixed in to the data object that comes back from the
`serializeData` method. This will allow you to create helper methods
that can be called from within your templates. This is also a good place
to add data not returned from `serializeData`, such as calculated values.

### Basic Example

```html
<script id="my-template" type="text/html">
  I <%= percent %>% think that <%= showMessage() %>
</script>
```

```js
var MyView = Backbone.Marionette.ItemView.extend({
  template: "#my-template",

  templateHelpers: function () {
    return {
      showMessage: function(){
        return this.name + " is the coolest!";
      },

      percent: this.model.get('decimal') * 100
    };
  }
});

var model = new Backbone.Model({
  name: "Backbone.Marionette",
  decimal: 1
});
var view = new MyView({
  model: model
});

view.render(); //=> "I 100% think that Backbone.Marionette is the coolest!";
```

The `templateHelpers` can also be provided as a constructor parameter
for any Marionette view class that supports the helpers.

```js
var MyView = Marionette.ItemView.extend({
  // ...
});

new MyView({
  templateHelpers: {
    doFoo: function(){ /* ... */ }
  }
});
```

### Accessing Data Within The Helpers

In order to access data from within the helper methods, you
need to prefix the data you need with `this`. Doing that will
give you all of the methods and attributes of the serialized
data object, including the other helper methods.

```js
templateHelpers: {
  something: function(){
    return "Do stuff with " + this.name + " because it's awesome.";
  }
}
```

### Object Or Function As `templateHelpers`

You can specify an object literal (as shown above), a reference
to an object literal, or a function as the `templateHelpers`.

If you specify a function, the function will be invoked
with the current view instance as the context of the
function. The function must return an object that can be
mixed in to the data for the view.

```js
Backbone.Marionette.ItemView.extend({
  templateHelpers: function(){
    return {
      foo: function(){ /* ... */ }
    }
  }
});
```

## Change Which Template Is Rendered For A View

There may be some cases where you need to change the template that is
used for a view, based on some simple logic such as the value of a
specific attribute in the view's model. To do this, you can provide
a `getTemplate` function on your views and use this to return the
template that you need.

```js
var MyView = Backbone.Marionette.ItemView.extend({
  getTemplate: function(){
    if (this.model.get("foo")){
      return "#some-template";
    } else {
      return "#a-different-template";
    }
  }
});
```

This applies to all view classes.
