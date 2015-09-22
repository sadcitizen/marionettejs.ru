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
* [LayoutView.childEvents](#layoutview-childevents)
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

There are also helpful shortcuts for more concise syntax.

```js
layoutView.showChildView('menu', new MenuView());

layoutView.showChildView('content', new MainContentView());
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

### LayoutView childEvents

Можно  определить `childEvents` хеш (или метод возвращающий хеш) позволяющий описать варианты перехвата всплывающих 
`childEvents` от вложенных представлений без ручного биндинга.

Ключи хеша могут быть функцией  или текстовой строкой. Функция вызывается в контексте `view`. Первым параметром получает
`child view` (из которого приходит событие), затем следующие аргументы ассоциированные с событием. 

```js
// childEvents можно описать в виде хеша
var MyLayoutView = Marionette.LayoutView.extend({

  // этот кэлбэк  будет вызван когда ребенок рендерится или посылает `render` событие
  childEvents: {
    render: function(childView) {
      console.log("a childView has been rendered");
    }
  }
});

// ...или функции возвращающей хэш
var MyLayoutView = Marionette.LayoutView.extend({

  childEvents: function() {
    return {
      render: this.onChildRender
    }
  },

  onChildRender: function(childView) {
  }
});
```

Также это работает для кастомных событий, что вы можете вызывать из вложенных `child view`.

```js
  // `child view` вызывает кастомный ивент, `show:message`
  var ChildView = new Marionette.ItemView.extend({
    events: {
      'click .button': 'showMessage'
    },

    showMessage: function (e) {
      console.log('The button was clicked.');
      this.triggerMethod('show:message', msg);
    }
  });

  // его родитель, используя настройки childEvents перехватывает кастомное событие 
  var ParentView = new Marionette.LayoutView.extend({
    childEvents: {
      'show:message': function (childView, msg) {
        console.log('The show:message event bubbled up to the parent.');
      }
    },

    // Или можем описать перехват события используя префиксную форму нотации 
    onChildviewShowMessage: function (childView, msg) {
      console.log('The show:message event bubbled up to the parent.');
    }
  });
```

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

Любые определенные регионы внутри `LayoutView` будут доступны представлению ( или внутреннему коду представления)
немедленно после инстанцирования. Это позволяет добавлять вложенные `View` в существующий DOM страницы, без необходимости вызова
`render` метода (или чего то другого) этих регионов.

Однако, регионы будут доступны только если добавляемый `View` имеет доступ к элементу описанному внутри  определения региона.
Поэтому, если ваше `LayoutView` представление еще не отрендерено, ваши регионы еще не могут найти "свои" корневые элементы, что вы 
передали в определении. В этом случае, никаких изменений в DOM не произойдет.

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

После того, как повторный рендеринг будет закончен, регионы макета будут
инициализированы уже на новых DOM-элементах, а затем в этих регионах будут
инициализированы представления. Таким образом, `LayoutView` каскадно обновит
себя и вложенные регионы, представления и другие макеты.

### <a name="avoid-re-rendering-the-entire-layoutview"></a> Избегайте повторного рендеринга всего макета

Временами, требуется полная перерисовка `layoutView`. Однако, такое поведение может привести в к большому количеству
работы необходимой для полного "пересчета" `layoutView` и всех его вложенных представлений.

По это причине, предполагается, что вы не станете перерендеривать всю `layoutView` (пока это не станет действительно необходимо).
Вместо этого, если привязали шаблон к модели и вам необходимо обновить часть `layoutView`, вам стоит прослушивать событие
`change` модели и обнавлять только требуемые элементы DOM. 

## <a name="nested-layoutviews-and-views"></a> Вложенные LayoutViews и Views

Так как `LayoutView` расширяет `ItemView` напрямую, он имеет всю базовую функциональность `ItemView`, включая 
методы, требуемые для показа внутри существующего `regionManager`-а

В следующем примере, мы будем использовать  Application's Regions в которую вложим наше представление.

```js
//  создаем Application
var myApp = new Marionette.Application();

// добавляем регион
myApp.addRegions({
  mainRegion: "#main"
});

// создаем новый LayoutView
var layoutView = new Marionette.LayoutView({
  // эта опция удаляет layoutView из DOM перед удалением вложенных представлений,
  // предотвращая перерисовку при удалении детей.
  // Однако, это ослажняет анимацию детей при закрытии.
  destroyImmediate: true
});

// показываем `LayoutView` в регионе класса App (App's mainRegion)
MyApp.getRegion('main').show(layoutView);
```
Вы можете вложить `LayoutViews` так глубоко, как хотите. Что поможет вам получить хорошо организованную структуру приложения. 

Для примера, вложение 3-ех представлений.

```js
var layout1 = new Layout1();
var layout2 = new Layout2();
var layout3 = new Layout3();

MyApp.getRegion('main').show(layout1);

layout1.showChildView('region1', layout2);
layout2.showChildView('region2', layout3);
```

### Эффективные вложенные структуры.

Пример, показаный выше, работает замечательно, но приводит к 3 процессам перерисоки, по одному на каждый макет. 
Marionette предоставляет простой механизм единовремнной отрисовки всех вложенных представлений: просто рендерите все
вложенные представления  в кэллбекек `onBeforeShow`. 

```js
var ParentLayout = Marionette.LayoutView.extend({
  onBeforeShow: function() {
    this.showChildView('header', new HeaderView());
    this.showChildView('footer', new FooterView());
  }
});

myRegion.show(new ParentLayout());
```

В этом примере, два вложенных представления отрисуются за один проход.

Эта система рекурсивна, поэтому работает с любым уровнем вложенности. Вложенные представления, могут  рендерить своих
вложенных детей на своем `onBeforeShow` кэлбеке.

#### Использование `attach` события

Часто вам нужно знать когда ваши представления (в "дереве представлений") присоединятся к документу (`document`),
примерно, как некоторые jQuery плагины. Событие `attach` и связанный с ним кэлбек `onAttach` отлично подходят для этого
юзкейса. Каждое представление в дереве представлений ( включая и родиткльский `LayoutView`) сгенерирует событие `attach`
когда они присоединяться в `document`.

Заметьте, неэффективный рендеринг "дерева" приведет к тому, что `attach` событие сгенерируется много раз. Это происходит
если вы рендерите вложенные представления после того, как отрендерится родитель, например, используя `onShow` для рендеринга детей.
Правильнее будет рендерить любые вложенные представления в кэллбеке `onBeforeShow`.

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

When calling `destroy` on a layoutView, the layoutView will be returned. This can be useful for
chaining.

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
