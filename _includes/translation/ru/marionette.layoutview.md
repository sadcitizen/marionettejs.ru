Класс `LayoutView` это гибрид класса `ItemView` и коллекции объектов класса
`Region`, который дает возможность рендерить сложные макеты с несколькими
подрегионами, управляемыми указанными менеджерами регионов.

`LayoutView` также может использоваться как составное представление, которое
объединяет несколько представлений и областей макета с вложенными приложениями,
позволяя приложениями добавлять несколько менеджеров регионов к динамически
созданному HTML.

Вы можете создавать сложные представления, помещая объекты класса `LayoutView`
внутрь объектов класса `Regions`.

Для лучшего понимания предназначения `LayoutView` советуем ознакомиться с постом [Manage Layouts And Nested Views With Backbone.Marionette](http://lostechies.com/derickbailey/2012/03/22/managing-layouts-and-nested-views-with-backbone-marionette/)

Поскольку класс `LayoutView` наследуется от `ItemView`, то он обладает всем
функционалом класса-родителя. Подробнее о `ItemView` вы можете познакомиться в
отдельном [разделе документации](../itemview/).

Кроме того, класс `LayoutView` обладает свойствами класса `Region`, например,
коллбеком `onShow`. Подробнее о этих свойствах вы сможете узнать из
[раздела документации о классе Region](../region/).

## Содержание

* [Основное применение](#basic-usage)
* [Параметры региона](#region-options)
* [Указание регионов с помощью функции](#specifying-regions-as-a-function)
* [Переопределение RegionManager, заданного по умолчанию](#overriding-the-default-regionmanager)
* [Доступность региона](#region-availability)
* [Повторный рендеринг макета](#re-rendering-a-layoutview)
  * [Избегайте повторного рендеринга всего макета](#avoid-re-rendering-the-entire-layoutview)
* [Вложенные макеты и представления](#nested-layoutviews-and-views)
  * [Efficient Nested View Structures](#efficient-nested-view-structures)
    * [Use of the `attach` Event](#use-of-the-attach-event)
* [Удаление макета](#destroying-a-layoutview)
* [Собственный класс региона](#custom-region-class)
* [Добавление и удаление регионов](#adding-and-removing-regions)
* [Именование регионов](#region-naming)

## <a name="basic-usage"></a> Основное применение

Класс `LayoutView` предназначен для организации иерархий представлений. Позволяет
определить макет представлений приложения с помощью регионов, вложенных макетов
и представлений.

Для `LayoutView` можно указать собственный шаблон (`template`) макета, а также
список регионов (`regions`).

```html
<script id="layout-view-template" type="text/template">
  <section>
    <navigation id="menu">...</navigation>
    <article id="content">...</article>
  </section>
</script>
```

```js
var AppLayoutView = Marionette.LayoutView.extend({
  template: "#layout-view-template",

  regions: {
    menu: "#menu",
    content: "#content"
  }
});

var layoutView = new AppLayoutView();
layoutView.render();
```

После того, как экземпляр макета отрендерен, у вас есть прямой доступ ко
всем указанный регионам этого макета.

```js
layoutView.getRegion('menu').show(new MenuView());

layoutView.getRegion('content').show(new MainContentView());
```

### <a name="region-options"></a> Параметры региона

Как видно из примера выше, конструктор класса `LayoutView` может принимать
хэш `regions`, который позволяет указать список регионов для каждого
экземпляра класса `LayoutView`.

```js
new Marionette.LayoutView({
 regions: {
   "cat": ".doge",
   "wow": {
     selector: ".such",
     regionClass: Coin
   }
 }
})
```

В приведенном примере для макета определяются два региона. Первый регион будет
находиться внутри контейнера с классом `doge`, а второй - с классом `such`.

За более подробной информацией о способах определения регионов обратитесь к
[разделу документации о классе Region](../region/).

### <a name="specifying-regions-as-a-function"></a> Указание регионов с помощью функции

Регионы могут быть заданы с помощью функции, которая возвращает объект с
описаниями регионов.

```js
Marionette.LayoutView.extend({
  // ...

  regions: function(options) {
    return {
      fooRegion: "#foo-element"
    };
  },

  // ...
});
```

Обратите внимание, что функция принимает аргумент `options`. Это параметры,
которые были переданы в конструктор представления.
Дело в том, что в момент инициализации регионов `this.options` еще не доступен,
поэтому опции должны быть доступны через этот параметр.

### <a name="overriding-the-default-regionmanager"></a> Переопределение `RegionManager`, заданного по умолчанию

Если вам необходимо динамически задавать класс менеджера регионов, то
вы можете воспользоваться методом `getRegionManager`:

```js
Marionette.LayoutView.extend({
  // ...

  getRegionManager: function() {
    // собственная логика
    return new MyRegionManager();
  }
});
```

Этот метод позволяет прикреплять регионы к `LayoutView` с помощью экземпляра
вашего собственного класса `RegionManager`.

## <a name="region-availability"></a> Доступность региона

Any defined regions within a layoutView will be available to the
View or any calling code immediately after instantiating the
View. This allows a View to be attached to an existing
DOM element in an HTML page, without the need to call a render
method or anything else, to create the regions.

However, a region will only be able to populate itself if the
View has access to the elements specified within the region
definitions. That is, if your view has not yet rendered, your
regions may not be able to find the element that you've
specified for them to manage. In that scenario, using the
region will result in no changes to the DOM.

## <a name="re-rendering-a-layoutview"></a> Повторный рендеринг макета

`LayoutView` может быть отрендерен столько раз, сколько потребуется, но первый
рендеринг будет отличаться от последующих.

При первом рендеринге `LayoutView` не происходит ничего особенного. Просто
вызывается метод `render` из прототипа `ItemView`. При последующих рендерингах
метод `render` будет учитывать повторную инициализацию регионов.

При всех последующих рендерингах принудительно будет очищаться каждый регион с
помощью вызова метода `empty`. Это принудительно удалит любое, даже вложенное, представление из региона. После очистки каждый регион будет сброшен, то есть он
не будет ссылаться на DOM-элемент разметки, полученной предыдущим рендерингом
макета.

После того, как повторный рендеринг макета будет закончен, регионы макета будут
инициализированы уже на новых DOM-элементах макета, а затем в этих регионах будут
инициализированы представления. Таким образом, `LayoutView` каскадно обновит
себя и вложенные регионы, представления и другие макеты.

### <a name="avoid-re-rendering-the-entire-layoutview"></a> Избегайте повторного рендеринга всего макета

There are times when re-rendering the entire layoutView is necessary. However,
due to the behavior described above, this can cause a large amount of
work to be needed in order to fully restore the layoutView and all of the
views that the layoutView is displaying.

Therefore, it is suggested that you avoid re-rendering the entire
layoutView unless absolutely necessary. Instead, if you are binding the
layoutView's template to a model and need to update portions of the layoutView,
you should listen to the model's "change" events and only update the
necessary DOM elements.

## <a name="nested-layoutviews-and-views"></a> Вложенные LayoutViews и Views

Since the `LayoutView` extends directly from `ItemView`, it
has all of the core functionality of an item view. This includes
the methods necessary to be shown within an existing region manager.

In the following example, we will use the Application's Regions
as the base of a deeply nested view structure.

```js
// Create an Application
var myApp = new Marionette.Application();

// Add a region
myApp.addRegions({
  mainRegion: "#main"
});

// Create a new LayoutView
var layoutView = new Marionette.LayoutView();

// Lastly, show the LayoutView in the App's mainRegion
MyApp.getRegion('main').show(layoutView);
```

You can nest LayoutViews as deeply as you want. This provides for a well organized,
nested view structure.

For example, to nest 3 layouts:

```js
var layout1 = new Layout1();
var layout2 = new Layout2();
var layout3 = new Layout3();

MyApp.getRegion('main').show(layout1);

layout1.getRegion('region1').show(layout2);
layout2.getRegion('region2').show(layout3);
```

### Efficient Nested View Structures

The above example works great, but it causes three separate paints: one for each layout that's being
shown. Marionette provides a simple mechanism to infinitely nest views in a single paint: just render all
of the children in the `onBeforeShow` callback.

```js
var ParentLayout = Marionette.LayoutView.extend({
  onBeforeShow: function() {
    this.getRegion('header').show(new HeaderView());
    this.getRegion('footer').show(new FooterView());
  }
});

myRegion.show(new ParentLayout());
```

In this example, the doubly-nested view structure will be rendered in a single paint.

This system is recursive, so it works for any deeply nested structure. The child views
you show can render their *own* child views within their `onBeforeShow` callbacks!

#### Use of the `attach` event

Often times you need to know when your views in the view tree have been attached to the `document`,
like when using certain jQuery plugins. The `attach` event, and associated `onAttach` callback, are perfect for this
use case. Start with a Region that's a child of the `document` and show any LayoutView in it: every view in the tree
(including the parent LayoutView) will have the `attach` event triggered on it when they have been
attached to the `document`.

Note that inefficient tree rendering will cause the `attach` event to be fired multiple times. This
situation can occur if you render the children views *after* the parent has been rendered, such as using
`onShow` to render children. As a rule of thumb, most of the time you'll want to render any nested views in
the `onBeforeShow` callback.

## <a name="destroying-a-layoutview"></a> Удаление LayoutView

When you are finished with a layoutView, you can call the
`destroy` method on it. This will ensure that all of the region managers
within the layoutView are destroyed correctly, which in turn
ensures all of the views shown within the regions are destroyed correctly.

If you are showing a layoutView within a parent region manager, replacing
the layoutView with another view or another layoutView will destroy the current
one, the same it will destroy a view.

All of this ensures that layoutViews and the views that they
contain are cleaned up correctly.

## <a name="custom-region-class"></a> Собственный класс региона

If you have the need to replace the `Region` with a region class of
your own implementation, you can specify an alternate class to use
with the `regionClass` property of the `LayoutView`.

```js
var MyLayoutView = Marionette.LayoutView.extend({
  regionClass: SomeCustomRegion
});
```

Так же вы можете указать собственнный класс `Region` для каждого вашего региона:

```js
var AppLayoutView = Marionette.LayoutView.extend({
  template: "#layout-view-template",

  regionClass: SomeDefaultCustomRegion,

  regions: {
    menu: {
      selector: "#menu",
      regionClass: CustomRegionClassReference
    },
    content: {
      selector: "#content",
      regionClass: CustomRegionClass2Reference
    }
  }
});
```

## <a name="adding-and-removing-regions"></a> Добавление и удаление регионов

Если требуется, то регионы могут быть добавлены или удалены из экземпляра `LayoutView`. Для этого используются следующие методы:

* `addRegion`
* `addRegions`
* `removeRegion`

Метод addRegion:

```js
var layoutView = new MyLayoutView();
// ...

layoutView.addRegion("foo", "#foo");
layoutView.getRegion('foo').show(new someView());
```

Метод addRegions:

```js
var layoutView = new MyLayoutView();
// ...

// Литерал объекта
layoutView.addRegions({
  foo: "#foo",
  bar: "#bar"
});

// Функция, которая возвращает литерал объекта
layoutView.addRegions(function() {
  return {
    baz: "#baz",
    quux: "#quux"
  };
});
```

Метод removeRegions:

```js
var layoutView = new MyLayoutView();
// ...

layoutView.removeRegion("foo");
```

Любой регион может быть удален вне зависимости от того как он был задан.

За более полной информацией об этих методах следует обратиться к [документации](../regionmanager/) по `RegionManager`.

## <a name="region-naming"></a> Именование регионов

A LayoutViews' Regions are attached directly to the LayoutView instance with the name of the region
as the key and the region itself as the value. Because of this, you need to be careful
to avoid conflicts with existing properties on the LayoutView when you name your Region.

Цепочка прототипов для `LayoutViews` выглядит следующим образом:

`Backbone.View > Marionette.View > Marionette.ItemView > Marionette.LayoutView`

Consequently, every property on each of those Classes must be avoided as Region names. The most
common issue people run into is trying to name their Region *"attributes"*. Be aware
that you are **not** able to do this.

The following is an abbreviated list of other names that can't be used as Region names. For a more
complete list refer to the API documentation for each Class on the prototype chain:

* attributes
* constructor
* regionClass
* render
* destroy
* addRegion
* addRegions
* removeRegion

*Note: this is a known issue that is flagged for being fixed in v2*
