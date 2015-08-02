Marionette имеет базовый класс `Marionette.View`,
другие представления расширяют его (наследуются от него).
Это базовое представление предоставляет некоторую общую и базовую (core) функциональность,
которой могут воспользоваться другие представления.

**Замечание:** Класс `Marionette.View` не предназначен для непосредственного использования.
Он существует как базовое представление для других классов представлений,
они должны расширять его. Задача класса `Marionette.View` обеспечить общее место для расположения поведений,
которые являются общими для всех представлений.

## Содержание

* [Привязка событий к представлению](#binding-to-view-events)
* [Метод onShow](#view-onshow)
* [Метод destroy](#view-destroy)
* [Метод onBeforeDestroy](#view-onbeforedestroy)
* [Событие "attach" / onAttach](#view-attach--onattach-event)
* [Событие "before:attach" / onBeforeAttach](#view-beforeattach--onbeforeattach-event)
* [Событие "dom:refresh" / метод onDomRefresh](#view-domrefresh--ondomrefresh-event)
* [События представления](#viewevents)
* [Триггеры представления](#viewtriggers)
* [События модели в modelEvents и события коллекции в collectionEvents](#viewmodelevents-and-viewcollectionevents)
* [Метод serializeModel](#viewserializemodel)
* [Метод bindUIElements](#viewbinduielements)
* [Метод mergeOptions](#viewmergeoptions)
* [Метод getOption](#viewgetoption)
* [Метод bindEntityEvents](#viewbindentityevents)
* [Помощники в templateHelpers](#viewtemplatehelpers)
  * [Типичный пример](#basic-example)
  * [Доступ к данным в помощниках](#accessing-data-within-the-helpers)
  * [Определение `templateHelpers` через объект или функцию](#object-or-function-as-templatehelpers)
* [Изменение шаблона, который отображается в представления](#change-which-template-is-rendered-for-a-view)

## Привязка событий к представлению

`Marionette.View` расширяет `Backbone.View`. Рекомендуется использовать метод `listenTo` для
прослушивания событий (привязки к событиям) модели, коллекции или других событий от объектов Backbone и Marionette.

```js
var MyView = Marionette.ItemView.extend({
  initialize: function() {
    this.listenTo(this.model, "change:foo", this.modelChanged);
    this.listenTo(this.collection, "add", this.modelAdded);
  },

  modelChanged: function(model, value) {},

  modelAdded: function(model){}
});
```

Контекст (`this`) будет автоматически установлен на объект представления.
При желании вы можете сами установить контекст с помощью `_.bind`.

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
Marionette.ItemView.extend({
  onShow: function() {
    // вызывается, когда представление было отображено
  }
});
```

Часто используемая ситуация для метода `onShow` - это его использование для добавления дочерних представлений.

```js
var LayoutView = Marionette.LayoutView.extend({
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
* возвращает представление.

Реализовывая метод `onDestroy` в определении вашего представления, позволяет вам
запускать пользовательский код для вашего представления, который будет выполнен
после того как ваше представление будет уничтожено и очищено. Метод `onDestroy` будет
вызван с аргументами, с которыми был вызван метод `destroy`. Это позволяет вам выполнить любой
дополнительный код по очистке без необходимости переопределения метода `destroy`.

```js
var MyView = Marionette.ItemView.extend({
  onDestroy: function(arg1, arg2) {
    // свой код очистки или уничтожения, должен быть здесь
  }
});

var myView = new MyView();
myView.destroy(arg1, arg2);
```

## Метод onBeforeDestroy

Когда запускается процесс уничтожения представления, то вызывается метод `onBeforeDestroy`, если этот
метод представлен. Метод `onBeforeDestroy` вызывается перед уничтожением представления. Он будет вызван
с аргументами, с которыми был вызван метод `destroy`.

### Событие "attach" / метод onAttach

Каждое представление в Marionette имеет специальное событие `attach`, оно срабатывает каждый раз когда представление
было добавлено в `document`. Как и другие Marionette-события, оно вызывает еще и метод `onAttach`, если он описан.
Событие `attach` отлично подходит для jQuery плагинов или других библиотек, которое должны быть выполнены *после*
того как представление появится в `document`.

Событие `attach` срабатывает только когда представление становится дочерним узлом `document`. Если Region, в котором
показывается представление не является потомком `document`, а вы вызываете метод `show`, то событие `attach` не сработает
до тех пор пока Region не станет потомком `document`.

Это событие уникально тем, что оно распространяется вниз по дереву. Например, если в CollectionView срабатывает метод
`attach`, то и во всех дочерних представлениях инициируется событие `attach`. Кроме того, и в глубоко вложенных структурах
Layout View вызовется событие `attach`.

Для более полного понимания вложенных структур представлений обратитесь к документации [LayoutView](marionette.layoutview.md).

### Событие "before:attach" / метод onBeforeAttach

Тоже самое что и событие `attach`, описанное выше, но срабатывает *перед* тем как представление будет добавлено в `document`.

### Событие "dom:refresh" / метод onDomRefresh

Вызывается после того, как представление было сформировано (rendered) и отображено в DOM через `Marionette.Region`, или было пере-сформировано (re-rendered).

Это событие / функция обратного вызова используется
[DOM-зависимыми UI плагинами](http://lostechies.com/derickbailey/2012/02/20/using-jquery-plugins-and-ui-controls-with-backbone/) таких как [jQueryUI](http://jqueryui.com/) или [KendoUI](http://kendoui.com).

```js
Marionette.ItemView.extend({
  onDomRefresh: function() {
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
var MyView = Marionette.ItemView.extend({
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
var MyView = Marionette.ItemView.extend({
  // ...

  triggers: {
    "click .do-something": "something:do:it"
  }
});

var myView = new MyView();
myView.render();

myView.on("something:do:it", function(args) {
  alert("I DID IT!");
});

// нажатие ("click") на 'do-something' DOM-элемент
// демонстрирует преобразование DOM-события
myView.$(".do-something").trigger("click");
```

В результате выполнения этого кода, появится окно предупреждения с текстом "I DID IT!".

По умолчанию все триггеры (triggers) будут остановлены методами `preventDefault` и `stopPropagation`.
По желанию вы можете вручную настроить триггеры, используя хэш вместо имени события представления.
Пример тригера ниже демонстрирует определение события и предотвращение поведения браузера по умолчанию
с помощью только метода `preventDefault`.

```js
Marionette.CompositeView.extend({
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
Marionette.CompositeView.extend({
  triggers: function() {
    return {
      "click .that-thing": "that:i:sent:you"
    };
  }
});
```

Селекторы в триггере могут быть указаны через ситнаксический сахар от использования хеша ```ui```.

```js
Marionette.ItemView.extend({
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

Функция обработчика события в `триггере` получает один аргумент, который
включает в себя следующее:

* представление
* модель
* коллекция

Эти свойства соответствуют свойствам `view`, `model`, и `collection` из представления,
которое вызвало событие.

```js
var MyView = Marionette.ItemView.extend({
  // ...

  triggers: {
    "click .do-something": "some:event"
  }
});

var myView = new MyView();

myView.on("some:event", function(args) {
  args.view; // => экземпляр представления, которое вызвало событие
  args.model; // => модель из представления - view.model, если модель была установлена в прдедставлении
  args.collection; // => коллекция из представления - view.collection, если коллекция была установлена в прдедставлении
});
```

Имея доступ к этим свойствам, позволяет обеспечить большую гибкость
при обработке событий от множества представлений. Для примера, компонент управления вкладками или виджет для развернуть/свернуть бар-панель могут обрабытывать одинаковое событие от многих разных представлений,
и обработка этого события будет описана в одной функции.

## События модели в modelEvents и события коллекции в collectionEvents

Подобно хешу `events`, в представлениях можно указывать хеши для коллекций и моделей.
С левой стороны указывается событие модели или коллекции, а с правой стороны имя метода из представления,
который будет методом обратного вызова.

```js
Marionette.CompositeView.extend({
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
представления, и будет сгенерировано исключение, если функции-обработчики событий будут отсутствовать
в представлении.

События из `modelEvents` и `collectionEvents` будут подключены и отключены от прослушивания
при помощи вызова методов из `Backbone.View`: `delegateEvents` и `undelegateEvents`.
Это позволяет представлению повторно использовать события для модели и коллекции при
переподключении прослушивания событий.

### Несколько функций обратного вызова

Для определения нескольких функций обратного вызова для события можно указать их друг за другом,
разделяя их между собой пробелом.

```js
Marionette.CompositeView.extend({
  modelEvents: {
    "change:name": "nameChanged thatThing"
  },

  nameChanged: function() {},

  thatThing: function() {},
});
```

Это работает для обоих `modelEvents` и `collectionEvents`.

### Определение функций обратного вызова через функции

Функция может быть объявлена напрямую в строчке, где указывается имя функции обратного вызова
в виде строкового название метода.

```js
Marionette.CompositeView.extend({
  modelEvents: {
    "change:name": function() {
      // обработка события изменения имени будет здесь
    }
  }
});
```

Это работает для обоих `modelEvents` и `collectionEvents`.

### Определение событий через функцию

Функция может быть использована для определения назначаемых событий. Эта функция должна возвращать хеш,
который должен соответствовать виду указанному выше, т.е. иметь корректные вышеуказаные параметры.

```js
Marionette.CompositeView.extend({
  modelEvents: function() {
    return { "change:name": "someFunc" };
  }
});
```

Это работает для обоих  `modelEvents` и `collectionEvents`.

## Метод serializeModel

Метод `serializeModel` сериализует модель, которая была передана аргументом.

## Метод bindUIElements

В некоторых случаях возникает задача получить доступ к ui элементам внутри представления
для того, чтобы получить у них данные или для манипуляции над ними. Для примера, у вас есть
div элемент и вы хотите показать/скрыть его, основываясь на некотором состоянии или
на состоянии другого ui элемента, которому вы хотите установить css-класс.
Вместо того, чтобы использовать jQuery-селекторы, описываемые везде в коде представления,
вы можете определить `ui` хэш, который сопоставляет название ui элемента с его
jQuery-селектором. После этого вы можете получить доступ к ui элементу через `this.ui.elementName`.
Для примера можно посмотреть документацию для `ItemView`

Эта функциональность для `ui` хэша обеспечивается через метод `bindUIElements`.
Поскольку `View` не реализует метод `render`, то если вы напрямую наследуетесь
от `View`, вам необходимо вызвать этот метод из вашего `render` метода.
В `ItemView` и `CompositeView` об этом уже позаботились.

## View.mergeOptions

Предпочтительным способом управления свойствами в Вашем представлении является метод `mergeOptions`. 
Он принимает 2 аргумента: `options` - объект и массив ключей. По этим ключам будут выбираться свойства из `options` и напрямую соединяться с представлением. 

```js
var ProfileView = Marionette.ItemView.extend({
  profileViewOptions: ['user', 'age'],

  initialize: function(options) {
    this.mergeOptions(options, this.profileViewOptions);

    console.log('The merged options are:', this.user, this.age);
  }
});
```

Подробнее [mergeOptions](./marionette.functions.md#marionettemergeoptions)

## Метод getOption

Получает атрибут объекта напрямую у объекта или через `this.options` объекта,
значение в `this.options` приоритетнее.

Больше информации о [getOption](./marionette.functions.md)

## Метод bindEntityEvents

Помогает привязать backbone-скую сущность к методам целевого объекта.
Метод `bindEntityEvents` используется для поддержки `modelEvents` и `collectionEvents`.

Больше информации о [bindEntityEvents](./marionette.functions.md)

## Помощники в templateHelpers

Иногда, шаблону представления требуется некоторая логика при отрисовки данных, но сами
движки генерации HTML могут не предоставлять простого пути для добавления этой специальной логики.
Например, шаблоны Underscore не предоставляют механизма методов помощников,
а шаблоны Handlebars предоставляют.

Атрибут `templateHelpers` может быть применен в любом объекте `View`, который отображает шаблон.
Когда этот атрибут присутствует, его содержимое будет подмешано к данным, которые приходят от
метода `serializeData`. Это позволяет вам создать методы помощники, которые можно вызывать
внутри шаблона. Также это хорошее место для добавления данных, которые не возвращаются методом `serializeData`,
например, рассчитываемые значения.

### Типичный пример

```html
<script id="my-template" type="text/html">
  I <%= percent %>% think that <%= showMessage() %>
</script>
```

```js
var MyView = Marionette.ItemView.extend({
  template: "#my-template",

  templateHelpers: function() {
    return {
      showMessage: function() {
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

var myView = new MyView({
  model: model
});

myView.render(); //=> "I 100% think that Backbone.Marionette is the coolest!";
```

Атрибут `templateHelpers` может быть передан как параметр в конструктор любого Marionette-класса,
который поддерживает помощников.

```js
var MyView = Marionette.ItemView.extend({
  // ...
});

new MyView({
  templateHelpers: {
    doFoo: function() { /* ... */ }
  }
});
```

### Доступ к данным в помощниках

В методах помощниках вы можете получить доступ к данным,
для этого нужные данные вызываются с префиксом `this`.
Через `this` вам доступны все методы и атрибуты сериализованного объекта данных,
а также и другие методы помощники.

```js
templateHelpers: {
  something: function() {
    return "Do stuff with " + this.name + " because it's awesome.";
  }
}
```

### Определение `templateHelpers` через объект или функцию

В качестве `templateHelpers` вы можете указать литерал объект (как показано выше),
ссылку на литерал объект или функцию.

Если указать функцию, то функция будет вызываться с текущим экземпляром представления
в качестве контекста функции. Функция должна возвращать объект, который можно подмешать
к данным представления.

```js
Marionette.ItemView.extend({
  templateHelpers: function() {
    return {
      foo: function(){ /* ... */ }
    }
  }
});
```

## Изменение шаблона (Template), который отображается (Rendered) в представления (View)

Иногда возникают случаи, когда вам нужно изменить шаблон (template),
который используется в представлении, основываясь на некоторой простой логике,
такой как некоторое значение определенного атрибута у модели представления.
Для того, что бы это сделать, вы можете воспользоваться функцией `getTemplate` у
вашего представления и использовать ее для возвращения нужного вам шаблона.

```js
var MyView = Marionette.ItemView.extend({
  getTemplate: function() {
    if (this.model.get("foo")) {
      return "#some-template";
    } else {
      return "#a-different-template";
    }
  }
});
```

Все описанное в этом документе, относится ко всем классам представлений.

## UI интерполяция

Marionette `ui` предлагает синтаксис, по которому можно ссылаться на элементы jQuery.
`ui` элементы могут вставляться в события или селекторы регионов.

В примере ниже, кнопку `buyButton` используется в DOM событии, а `checkoutSection` - как селектор региона.

Marionette UI offers a convenient way to reference jQuery elements.
UI elements can also be interpolated into event and region selectors.

In this example, the buy button is referenced in a DOM event and the checkout section is referenced in the region selector.

```js
var MyView = Marionette.ItemView.extend({

  ui: {
    buyButton: '.buy-button',
    checkoutSection: '.checkout-section'
  },

  events: {
    'click @ui.buyButton': 'onClickBuyButton'
  },

  regions: {
    checkoutSection: '@ui.checkoutSection'
  },

  onShow: function() {
    this.getRegion('checkoutSection').show(new CheckoutSection({
      model: this.checkoutModel
    }));
  }
});
```
