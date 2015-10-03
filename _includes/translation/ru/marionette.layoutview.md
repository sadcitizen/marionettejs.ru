Класс `LayoutView` это гибрид класса `ItemView` и коллекции объектов класса
`Region`, который дает возможность рендерить сложные макеты с несколькими
подрегионами, управляемыми указанными менеджерами регионов.

Класс `LayoutView` также может использоваться как составное представление, которое
объединяет несколько представлений и областей макета с вложенными приложениями,
позволяя приложениями добавлять несколько менеджеров регионов к динамически созданному HTML.

Вы можете создавать сложные представления, помещая объекты класса `LayoutView`
внутрь объектов класса `Regions`.

Для лучшего понимания предназначения `LayoutView` советуем ознакомиться с постом [Manage Layouts And Nested Views With Backbone.Marionette](http://lostechies.com/derickbailey/2012/03/22/managing-layouts-and-nested-views-with-backbone-marionette/)

Поскольку класс `LayoutView` наследуется от `ItemView`, то он обладает всем
функционалом класса-родителя. Подробнее о `ItemView` вы можете познакомиться в
отдельном [разделе документации](../itemview/).

Кроме того, совместное использование `LayoutView` с `Marionette.Region` позволяет использовать такие функции как коллбэк `onShow` и т.д.
Более полную информацию о классе `Marionette.Region` можно найти в соответствующем разделе [документации](../region/).

## Содержание

* [Основное применение](#basic-usage)
* [Параметры региона](#region-options)
* [Свойство `childEvents`](#layoutview-childevents)
* [Указание регионов с помощью функции](#specifying-regions-as-a-function)
* [Переопределение RegionManager, заданного по умолчанию](#overriding-the-default-regionmanager)
* [Доступность региона](#region-availability)
* [Повторный рендеринг `LayoutView`](#re-rendering-a-layoutview)
  * [Избегайте повторного рендеринга всего `LayoutView`](#avoid-re-rendering-the-entire-layoutview)
* [Вложенные макеты и представления](#nested-layoutviews-and-views)
  * [Эффективные структуры вложенных представлений](#efficient-nested-view-structures)
    * [Использование события `attach`](#use-of-the-attach-event)
* [Удаление `LayoutView`](#destroying-a-layoutview)
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

Прямой доступ также можно получить более лаконичным способом с помощью метода `showChildView`.

```js
layoutView.showChildView('menu', new MenuView());

layoutView.showChildView('content', new MainContentView());
```

### <a name="region-options"></a> Параметры региона

Как видно из примера выше, конструктор класса `LayoutView` может принимать
хэш `regions`, который позволяет указать список регионов для каждого
экземпляра класса `LayoutView`.

```js
var layoutView = new Marionette.LayoutView({
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

### <a name="layoutview-childevents"></a> Свойство `childEvents`

Свойство `childEvents` представляет собой хэш или метод, который возвращает хэш.
Это свойство позволяет задать обработчики событий от вложенных представлений без биндинга в ручную.

Значения в хэше могут быть как функциями, так и строками имен методов самого представления.

```js
// childEvents может быть задан в виде хэша
var MyLayoutView = Marionette.LayoutView.extend({

  // этот коллбэк будет вызван когда потомок отрендерится или пошлет событие `render`
  childEvents: {
    render: function() {
      console.log('A child view has been rendered.');
    }
  }
});

// ...или функции возвращающей хэш.
var MyLayoutView = Marionette.LayoutView.extend({

  childEvents: function() {
    return {
      render: this.onChildRendered
    };
  },

  onChildRendered: function() {
    console.log('A child view has been rendered.');
  }
});
```

В `childEvents` также можно указывать кастомные события для представлений-потомков.

Обратите внимание, что первый аргумент обработчика `childEvents` это ссылка на самое представление-потомок.
**Внимание**: События, которые были запущены на представлении с помощью метода `trigger` нельзя обработать
с помощью `childEvents`. В представлениях-потомках вместо `trigger` используйте метод `triggerMethod`.  

```js
// Представление запускает собственное событие `show:message`
var ChildView = Marionette.ItemView.extend({

  // Хэш событий определяет локальные обработчики событий, которые могут вызывать `triggerMethod`.
  events: {
    'click .button': 'onClickButton'
  },

  // Хэш триггеров конвертирует события DOM в события представления-потомка, которые могут быть обработаны
  // в представлении-родителе.
  triggers: {
    'submit form': 'submit:form'
  },

  onClickButton: function () {
    this.triggerMethod('show:message', 'foo');
  }
});

// Представление-родитель использует childEvents для ловли собственного события представления-потомка
var ParentView = Marionette.LayoutView.extend({

  childEvents: {
    'show:message': 'onChildShowMessage',
    'submit:form': 'onChildSubmitForm'
  },

  onChildShowMessage: function (childView, message) {
    console.log('A child view fired show:message with ' + message);
  },

  onChildSubmitForm: function (childView) {
    console.log('A child view fired submit:form');
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

Любые регионы, определенные внутри `LayoutView`, будут доступны представлению или любому вызывающему коду сразу же после инициализации. Это позволяет добавлять вложенные представления в существующий DOM страницы, без необходимости вызова метода
`render` или другого метода, создающего регионы.

Однако, регион сможет заполнить себя только если представление
имеет доступ к элементу DOM описанному внутри определения региона. Поэтому, если представление еще не отрендерено, то  регион не сможет найти "свой" DOM-элемент, указанный при определении. В этом случае, никаких изменений в DOM не произойдет.

## <a name="re-rendering-a-layoutview"></a> Повторный рендеринг `LayoutView`

`LayoutView` может быть отрендерен столько раз, сколько потребуется, но первый рендеринг будет отличаться от последующих.

При первом рендеринге `LayoutView` не происходит ничего особенного. Просто вызывается метод `render` из прототипа `ItemView`. При последующих рендерингах метод `render` будет учитывать повторную инициализацию регионов.

При всех последующих рендерингах принудительно будет очищаться каждый регион с помощью вызова метода `empty`. Это принудительно удалит любое, даже вложенное, представление из региона. После очистки каждый регион будет сброшен, то есть он не будет ссылаться на DOM-элемент разметки, полученной предыдущим рендерингом макета.

После того, как повторный рендеринг будет закончен, регионы макета будут инициализированы уже на новых DOM-элементах, а затем в этих регионах будут инициализированы представления. Таким образом, `LayoutView` каскадно обновит себя и вложенные регионы, представления и другие макеты.

### <a name="avoid-re-rendering-the-entire-layoutview"></a> Избегайте повторного рендеринга всего `LayoutView`

Иногда требуется полная перерисовка `layoutView`. Однако, такое поведение может привести в к большому количеству
работы необходимой для полного "пересчета" `layoutView` и всех его вложенных представлений.

По это причине, предполагается, что вы не станете перерисовывать все `layoutView` (пока это не станет действительно необходимо).
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

### <a name="efficient-nested-view-structures"></a> Эффективные структуры вложенных представлений

Пример, показаный выше, работает замечательно, но приводит к трем  перерисовкам, по одной на каждый макет.
Marionette предоставляет простой механизм единовремнной отрисовки всех вложенных представлений: просто рендерите все
вложенные представления в методе `onBeforeShow`.

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

#### <a name="use-of-the-attach-event"></a> Использование события `attach`

Иногда необходимо узнать когда ваше представление внутри каскада представлений будет добавленно в `document`, как при использовании некоторых jQuery-плагинов. Событие `attach` и связанный с ним коллбэк `onAttach` отлично подходят для этого случая.

Каждое представление в каскаде представлений (включая и родительский `LayoutView`) запустит событие `attach`, как только оно будет досбавлено в `document`.

Обратите внимание, что неэффективный рендеринг каскада представлений приведет к тому, что событие `attach` запустится много раз. Это произойдет в случае, когда вы рендерите представления-потомки после того, как отрендерится родитель, например, используя `onShow` для рендеринга потомков. Правильнее будет рендерить любые вложенные представления в кэллбеке `onBeforeShow`.

## <a name="destroying-a-layoutview"></a> Удаление LayoutView

Когда `layoutView` больше вам не нужен, вы можете удалить его, вызвав метод `destroy`. Это гарантирует, что все представления внутри вложенных регионов удалятся корректно.

Если вы отображаете `layoutView` внутри родительского региона, то замена текущего `layoutView` другим, удалит
текущий.

Все это гарантирует, что `LayoutView` и вложенные в него представления очистятся корректно.

Вызов метода `destroy` на `LayoutView` вернет ссылку на само представление, что может быть удобно для вызовов по цепочке.

## <a name="custom-region-class"></a> Собственный класс региона

Если  требуется заменить `Region` своим классом региона, то следует указать альтернативный класс в свойстве `regionClass`.

```js
var MyLayoutView = Marionette.LayoutView.extend({
  regionClass: SomeCustomRegion
});
```

Так же вы можете указать собственнный класс для каждого вашего региона:

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

Регионы прикрепляются напрямую к экземпляру `LayoutView` с ключом в виде имени региона и значением в виде ссылки на регион. Поэтому, следует быть аккуратным в именовании своих регионов, так как это может вызвать конфликты.

Цепочка прототипов для `LayoutViews` выглядит следующим образом:

`Backbone.View > Marionette.View > Marionette.ItemView > Marionette.LayoutView`

Соответсвенно, любое свойство каждого из этих классов не может быть использованно в качестве имени региона.

Следующий список аббриевиатур не может быть использован для именования регионов. Для более полного списка воспользуйтесь
документацией API для каждого класса в цепочке прототипов.

* attributes
* constructor
* regionClass
* render
* destroy
* addRegion
* addRegions
* removeRegion
