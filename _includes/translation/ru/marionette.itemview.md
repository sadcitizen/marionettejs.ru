Класс `ItemView` является представлением, которое отображает одиночный элемент,
который можно быть как `Backbone.Model`, так и `Backbone.Collection`. 
Так или иначе, этот элемент будет рассматриваться как одиночный.

Класс `ItemView` наследован напрямую от класса `Marionette.View`. 

Для более полной информации о доступных функциях и функциональности ознакомьтесь с
[документацией по Marionette.View](../view/).

Кроме того, совместное использование `ItemView` с `Marionette.Region` позволяет использовать такие функции как коллбэк `onShow` и т.д. 
Более полную информацию о классе `Marionette.Region` можно найти в соответствующем разделе [документации](../region/).

## Содержание

* [Метод `render`](#itemview-render)
* [Отрисовка коллекций в ItemView](#rendering-a-collection-in-an-itemview)
* [Безшаблонный ItemView](#template-less-itemview)
* [События и Коллбеки](#events-and-callback-methods)
  * [событие `before:render` / коллбек `onBeforeRender`](#beforerender--onbeforerender-event)
  * [событие `render` / коллбек `onRender`](#render--onrender-event)
  * [событие `before:destroy` / коллбек `onBeforeDestroy`](#beforedestroy--onbeforedestroy-event)
  * [событие `destroy` / коллбек `onDestroy`](#destroy--ondestroy-event)
* [Метод `serializeData`](#itemview-serializedata)
* [Организация элементов UI](#organizing-ui-elements)
* [События модели и коллекции](#modelevents-and-collectionevents)

## <a name="itemview-render"></a> Метод `render`

В отличие от `Backbone.Views`, все представления в Marionette обладают методом `render`. 
Фактически, основные различия между представлениями являются различия в их методах `render`. 
Очевидно, что переопределение метода `render` у любого представления является неразумным. Вместо этого, вы должны
использовать [`onBeforeRender` и `onRender` коллбеки](#events-and-callback-methods)
для добавления дополнительной функциональности в процесс отрисовки вашего представления.

`ItemView` передает объекту `Marionette.Renderer` сделать фактическую отрисовку шаблона.

Экземпляр `ItemView` передается как третий аргумент в метод `render`
объекта `Marionette.Renderer`. Этот аргумент может быть полезен при
собстенной реализации `Marionette.Renderer`.

Вы должны определить атрибут `template` в `ItemView`. Этот атрибут
может быть либо JQuery-селектором:

```js
var MyView = Marionette.ItemView.extend({
  template: "#some-template"
});

new MyView().render();
```

.. либо финкцией, принимающей один аргумент: объект, возвращаемый [ItemView.serializeData](#itemview-serializedata):

```js
var myTemplateHtml = '<div><%= args.name %></div>';

var MyView = Marionette.ItemView.extend({
  template : function(serialized_model) {
    var name = serializedModel.name;
    return _.template(myTemplateHtml)({
        name : name,
        someCustomAttribute : someCustomKey
    });
  }
});

new MyView().render();
```

Обратите внимание, что использование `template` в виде функции позволяет
передавать собственные аргументы в функцию `_.template` и позволяет
получить больший контроль над процессом вызова функции `_.template`.

Более подробную информацию о функции `_.template` можно узнать в [документации по Underscore](http://underscorejs.org/#template).

## <a name="rendering-a-collection-in-an-itemview"></a> Отрисовка коллекций в ItemView

Самым часто используемым способом отрисовки `Backbone.Collection`
является использование `CollectionView` или `CompositeView`. Но иногда нужно отобразить 
простой список, которому не требуется много интерактивности,
в этом случае нет смысла в использовании этих представлений. `Backbone.Collection`
может быть отрисована с помощью простого `ItemView`. Для этого в шаблонах
можно использовать массив `items` для перебора элементов коллекции.

```js
<script id="some-template" type="text/html">
  <ul>
    <% _.each(items, function(item){ %>
    <li> <%= item.someAttribute %> </li>
    <% }); %>
  </ul>
</script>
```

Здесь важно отметить, что `items` используется как переменная для перебора (итерирования)
в вызове `_.each`. В переменной `items` будут всегда содержаться элементы вашей коллекции.

Таким образом, в JavaScript вы можете определить и использовать
`ItemView` с шаблоном из примера выше, следующим образом:

```js
var MyItemsView = Marionette.ItemView.extend({
  template: "#some-template"
});

var view = new MyItemsView({
  collection: someCollection
});

// отобразить представление, используя регион, или вызвать метод .render у представления
```

При отрисовки этого представления коллекция `someCollection` будет преобразована
в массив `items` для использования его в шаблоне.

Для получения дополнительной информации о том, когда вам может понадобится использовать такой подход,
какие параметры вы имеете для получения отдельного элемента, когда происходит событие `click`
или другое взаимодействие с отдельным элементом, вы можете прочитать в статье
[Получение модели при клике на элемент](http://lostechies.com/derickbailey/2011/10/11/backbone-js-getting-the-model-for-a-clicked-element/).

## <a name="template-less-itemview"></a> Безшаблонный ItemView

`ItemView` можно без особых проблем связать с существующими элементам. Основное приемущество этого заключается в 
возможности добавить поведение или события к статическому контенту, который был отрисован на сервере
(как правило, для целей SEO). Что бы создать безшаблонный `ItemView`, вам нужно установить
атрибуту `template` значение `false`.  

```html
<div id="my-element">
  <p>Hello World</p>
  <button class="my-button">Click Me</button>
</div>
```

```js
var MyView = Marionette.ItemView.extend({
  el: '#my-element',

  template: false,

  ui: {
    paragraph: 'p',
    button: '.my-button'
  },

  events: {
    'click @ui.button': 'clickedButton'
  },

  clickedButton: function() {
    console.log('I clicked the button!');
  }
});

var view = new MyView();
view.render();

view.ui.paragraph.text();        // возвращает 'Hello World'
view.ui.button.trigger('click'); // в логе будет сообщение 'I clicked the button!'
```

Другой вариант использования, это когда вы хотите связать `Marionette.ItemView` с SVG-графикой или
canvas-элементом, для создания единого интерфейса в виде слоя представления к нестандартным DOM-узлам.
`ItemView` без шаблона позволяет вам также использовать представление для предварительно отрисованных
DOM-узлов, таких как сложные грфические элементы.

## <a name="events-and-callback-methods"></a> События и Коллбеки

Есть несколько событий и коллбеков, которые вызываются у `ItemView`.
Эти события/коллбеки инициируются/вызываются с помощью функции
[Marionette.triggerMethod](../functions/),
которая инициирует событие и вызывает соответствующий метод "on{ИмяСобытия}".

### <a name="beforerender--onbeforerender-event"></a> событие `before:render` / коллбек `onBeforeRender`

Инициируется до того, как `ItemView` будет отрисовано.

```js
Marionette.ItemView.extend({
  onBeforeRender: function(){
    // последние действия перед тем, как сгенерируется `el` представления
  }
});
```

### <a name="render--onrender-event"></a> событие `render` / коллбек `onRender`

Инициируется после того, как представление было отрисовано.
Вы можете сами реализовать этот метод в вашем представлении
для того, чтобы добавить собственный код для работы с `el` представления
после того, как `el` было сгенерировано.

```js
Marionette.ItemView.extend({
  onRender: function(){
    // здесь манипулируем `el`. Оно уже было сгенерировано и
    // содержит готовый для работы HTML представления.
  }
});
```

### <a name="beforedestroy--onbeforedestroy-event"></a> событие `before:destroy` / коллбек `onBeforeDestroy`

Инициируется только перед тем, как представление будет уничтожено, в момент,
когда метод `destroy()` представление был вызван.

```js
Marionette.ItemView.extend({
  onBeforeDestroy: function(){
    // здесь манипулируем `el`. Оно уже было сгенерировано и
    // содержит готовый для работы HTML представления.
  }
});
```

### <a name="destroy--ondestroy-event"></a> событие `destroy` / коллбек `onDestroy`

Инициируется только после того, как предствление было уничтожено.

```js
Marionette.ItemView.extend({
  onDestroy: function(){
    // здесь размещается собственный код для уничтожения и очистки
  }
});
```

## <a name="itemview-serializedata"></a> Метод `serializeData`

`ItemView` будет сериализовывать модель или коллекцию. По умолчанию, вызывается
метод `.toJSON` у модели или коллекции. Если `ItemView` содержит одновременно
модель и коллекцию, то только модель будет использоваться как источник данных для представления.
Результат сериализации будет передан в шаблон, который отрисовывается.

Если сериализуется модель, то результат сериализации передается непосредственно:

```js
var myModel = new MyModel({foo: "bar"});

new MyItemView({
  template: "#myItemTemplate",
  model: myModel
});

MyItemView.render();
```

```html
<script id="myItemTemplate" type="template">
  Foo is: <%= foo %>
</script>
```

Если сериализуется коллекция, то результат сериализации передается в виде массива `items`:

```js
var myCollection = new MyCollection([{foo: "bar"}, {foo: "baz"}]);

new MyItemView({
  template: "#myCollectionTemplate",
  collection: myCollection
});

MyItemView.render();
```

```html
<script id="myCollectionTemplate" type="template">
  <% _.each(items, function(item){ %>
    Foo is: <%= foo %>
  <% }); %>
</script>
```

Если вам нужен собственный способ сериализации ваших данных,
то вы можете переопределить метод `serializeData` в вашем представлении.
Метод должен возвращать корректный JSON-объект, как если бы вы вызвали метод
`.toJSON` у модели или коллекции.

```js
Marionette.ItemView.extend({
  serializeData: function(){
    return {
      "some attribute": "some value"
    }
  }
});
```

## <a name="organizing-ui-elements"></a> Организация элементов UI

Как говорилось в документации по [Marionette.View](../view/), вы можете
указать хеш `ui` в вашем представлении. В хеше `ui` сопоставляются
элементы UI с их jQuery-селекторами. Это особенно полезно, если вы хотите получать доступ
к одному и тому же UI элементу несколько раз в вашем коде. Вместо того, чтобы дублировать селектор,
вы можете просто ссылаться на него при помощи `this.ui.elementName`.

Вы можете также использовать значения хеша `ui` в ключах хешей `events` и `trigger`,
используя следующий синтакс: ```"@ui.elementName"```

```js
Marionette.ItemView.extend({
  tagName: "tr",

  ui: {
    checkbox: "input[type=checkbox]"
  },

  onRender: function() {
    if (this.model.get('selected')) {
      this.ui.checkbox.addClass('checked');
    }
  }
});
```

## <a name="modelevents-and-collectionevents"></a> События модели и коллекции

`ItemView` может напрямую осуществлять привязку к событиям модели и событиям коллекции,
используя для этого хеши `modelEvents` и `collectionEvents` соответственно:

```js
Marionette.ItemView.extend({
  modelEvents: {
    "change": "modelChanged"
  },

  collectionEvents: {
    "add": "modelAdded"
  }
});
```

Больше информации можно прочитать в документации по [Marionette.View](../view/).
