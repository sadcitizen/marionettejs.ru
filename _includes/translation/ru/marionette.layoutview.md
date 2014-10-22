Класс `LayoutView` является смесью класса `ItemView` и коллекции объектов класса `Region`. Это хорошее решение для 
рендеринга макетов приложения с несколькими подрегионами, которые управляются указанными менеджерами регионов.

`LayoutView` также может использоваться как составное представление, которое объединяет несколько представлений и областей 
экрана с вложенными приложениями, позволяя приложениями добавлять несколько менеджеров регионов к динамически созданному HTML.

Вы можете создавать сложные представления, помещая объекты класса `LayoutView` внутрь объектов класса `Regions`.

Для более подробного обсуждения `LayoutView` прочитайте пост [Manage Layouts And Nested Views With Backbone.Marionette](http://lostechies.com/derickbailey/2012/03/22/managing-layouts-and-nested-views-with-backbone-marionette/)

Пожалуйста, познакомьтесь с [документацией по ItemView](../itemview/) для более полной информации по доступной функциональности.

Кроме того, взаимодействие с `Marionette.Region` предоставляет такие возможности, как
коллбек `onShow` и т.д. Пожалуйста, познакомьтесь с [документацией по Region](../region/)
для получения более полной информации.

## Содержание

* [Основное применение](#basic-usage)
* [Опции для региона](#region-options)
* [Указание регионов с помощью функции](#specifying-regions-as-a-function)
* [Переопределение RegionManager, заданного по умолчанию](#overriding-the-default-regionmanager)
* [Доступность региона](#region-availability)
* [Повторный рендеринг LayoutView](#re-rendering-a-layoutview)
  * [Избегайте повторного рендеринга всего LayoutView](#avoid-re-rendering-the-entire-layoutview)
* [Вложенные LayoutViews и Views](#nested-layoutviews-and-views)
* [Удаление LayoutView](#destroying-a-layoutview)
* [Собственный класс региона](#custom-region-class)
* [Добавление и удаление регионов](#adding-and-removing-regions)
* [Именование регионов](#region-naming)

## <a name="basic-usage"></a> Основное применение

`LayoutView` напрямую расширяет (наследуется от) `ItemView` и к нему добавлена
возможность указать `regions`, которые становятся экземплярами объекта `Region`,
которые прикрепляются к `LayoutView`.

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

После того, как вы отрендерили `layoutView`, у вас есть прямой доступ
ко всем указанным регионам, как к менеджерам регионов.

```js
layoutView.menu.show(new MenuView());

layoutView.content.show(new MainContentView());
```

### <a name="region-options"></a> Опции для региона

Конструктор `LayoutView` может принимать хэш `regions`, который позволяет указать список регионов 
для каждого экземпляра `LayoutView`.

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

### <a name="specifying-regions-as-a-function"></a> Указание регионов с помощью функции

Регионы могут быть указаны для `LayoutView` с помощью функции, которая возвращает объект с описаниями регионов. 
Возвращаемый объект должен следовать тем же правилам для описания региона, которые были указаны выше. 

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

Обратите внимание, что функция принимает аргумент `options` представления,
это параметры, которые были переданы в конструктор представления.
`this.options` еще не доступен, когда регионы инициализируются, поэтому
опции должны быть доступны через этот параметр.

### <a name="overriding-the-default-regionmanager"></a> Переопределение `RegionManager`, заданного по умолчанию

Если вам нужен класс `RegionManager`-а, выбираемый динамически, вы можете
определить `getRegionManager`:

```js
Marionette.LayoutView.extend({
  // ...

  getRegionManager: function() {
    // собственная логика
    return new MyRegionManager();
  }
```

Это может быть полезно, если вы хотите связать регионы `LayoutView` с вашим
собственным экземпляром `RegionManager`-а.

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

## <a name="re-rendering-a-layoutview"></a> Повторный рендеринг LayoutView

A layoutView can be rendered as many times as needed, but renders
after the first one behave differently than the initial render.

The first time a layoutView is rendered, nothing special happens. It just
delegates to the `ItemView` prototype to do the render. After the
first render has happened, though, the render function is modified to
account for re-rendering with regions in the layoutView.

After the first render, all subsequent renders will force every
region to be emptied by calling the `empty` method on them. This will
force every view in the region, and sub-views if any, to be destroyed
as well. Once the regions are emptied, the regions will also be
reset so that they are no longer referencing the element of the previous
layoutView render.

Then after the layoutView is finished re-rendering itself,
showing a view in the layoutView's regions will cause the regions to attach
themselves to the new elements in the layoutView.

### <a name="avoid-re-rendering-the-entire-layoutview"></a> Избегайте повторного рендеринга всего LayoutView

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

```js
var myApp = new Marionette.Application();

myApp.addRegions({
  mainRegion: "#main"
});

var layoutView = new AppLayout();
myApp.mainRegion.show(layoutView);

layoutView.show(new MenuView());
```

You can nest layoutViews into region managers as deeply as you want.
This provides for a well organized, nested view structure.

For example, to nest 3 layouts (all of these are equivalent):

```js
var layout1 = new Layout1();
var layout2 = new Layout2();
var layout3 = new Layout3();

myApp.mainRegion.show(layout1);

layout1.region1.show(layout2);
layout2.region2.show(layout3);
```

```js
myApp.mainRegion.show(new Layout1());
myApp.mainRegion.currentView.myRegion1.show(new Layout2());
myApp.mainRegion.currentView.myRegion1.currentView.myRegion2.show(new Layout3());
```

Or if you like chaining:

```js
myApp.mainRegion.show(new Layout1())
  .currentView.myRegion1.show(new Layout2())
  .currentView.myRegion2.show(new Layout3());
```

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

Если требуется, то регионы могут быть добавлены или удаленя из экземпляра `LayoutView`. 
Для этого используются следующие методы:

* `addRegion`
* `addRegions`
* `removeRegion`

Метод addRegion:

```js
var layoutView = new MyLayoutView();
// ...

layoutView.addRegion("foo", "#foo");
layoutView.foo.show(new someView());
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
