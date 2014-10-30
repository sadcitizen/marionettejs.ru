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

После того как вы отрендерили `layoutView`, у вас есть прямой доступ
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

Любые указанные регионы в `LayoutView` будут доступны в представлении
или в любом вызываемом коде сразу после создания экземпляра представления.
Это позволяет представлению присоединяться к существующему DOM-элементу
на HTML-странице без необходимости вызова метода `render` или
чего-нибудь еще, чтобы создать регионы.

Однако, у региона появится возможность заполнить себя, если представление
имеет доступ к элементу, указанному в определении региона. То есть,
если ваше представление еще не отрендерино, то ваши регионы могут не иметь
возможность найти элемент, который вы указали ему для управления.
При таком сценарии, использование региона не приведет к изменению DOM.

## <a name="re-rendering-a-layoutview"></a> Повторный рендеринг LayoutView

`LayoutView` может быть отрендерин столько раз, сколько необходимо,
но рендеринг после первого раза ведет себя иначе, чем первый рендеринг.

При первом рендеринге `LayoutView` ничего особенного не происходит.
Выполнение рендеринга делегируется прототипу `ItemView`. После того как
первый рендеринг произошел, функция `render` модифицируется для учета
повторного рендеринга регионов в `LayoutView`.

После первого рендеринга, все последующие рендеринги будут насильно
очищать каждый регион, вызывая у каждого региона метод `empty`.
Это заставит каждое представление в регионе, а также вложенные представления, 
если они есть, вызвать операцию уничтожения. После того, как регионы очистятся,
они также будут переустановленны (сброшены), так как они не должны
больше ссылаться на элемент предыдущего отрендеринного `LayoutView`.

После того как `LayoutView` закончит себя перерендывать, отображение
представлений в регионах `LayoutView` будет присоединять регионы
к новым элементам в отрендеринном `LayoutView`.

### <a name="avoid-re-rendering-the-entire-layoutview"></a> Избегайте повторного рендеринга всего LayoutView

Есть моменты, когда повторный рендеринг всего `LayoutView` необходим.
Однако, в связи с поведением описанным выше, это может привести к 
большому объему работы, которая будет происходить для того, чтобы
полностью восстановить `LayoutView` и все представления, которые необходимо
показать.

Таким образом, предполагается, что вы избегаете повторного рендеринга всего `LayoutView`,
кроме случаев крайней необходимости. Вместо этого, если вы связываете шаблон `LayoutView` с моделью и
вам нужно обновить часть `LayoutView`, то вы должны прослушивать события `change` модели
и обновлять только необходимые DOM-элементы.

## <a name="nested-layoutviews-and-views"></a> Вложенные LayoutViews и Views

Поскольку `LayoutView` напрямую расширяет (наследуется от) `ItemView`,
оно имеет все основные функциональные возможности `ItemView`. Эти возможности
включают в себя методы необходимые для показа в существующем менеджере региона.

```js
var myApp = new Marionette.Application();

myApp.addRegions({
  mainRegion: "#main"
});

var layoutView = new AppLayout();
myApp.mainRegion.show(layoutView);

layoutView.menu.show(new MenuView());
```

Вы можете вкладывать `LayoutView` в менеждеры регионов так глубоко,
как вы хотите. Это позволяет обеспечить хорошую структурную организацию,
вкладываемых представлений.

Например, вложим 3 `LayoutView` (все они эквивалентны):

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

или, если вам нравятся цепочки команд:

```js
myApp.mainRegion.show(new Layout1())
  .currentView.myRegion1.show(new Layout2())
  .currentView.myRegion2.show(new Layout3());
```

## <a name="destroying-a-layoutview"></a> Удаление LayoutView

Когда вы закончите работать с `LayoutView`, вы можете вызвать у него
метод `destroy`. Это гарантирует, что все менеджеры регионов в `LayoutView`
будут правильно удалены (уничтожены), что в свою очередь гарантирует,
что все представления, показанные в регионах, будут правильно удалены (уничтожены).

Если вы показываете `LayoutView` в родительском менеджере региона,
заменив `LayoutView` другим представлением или другим `LayoutView`,
регион удалит текущий `LayoutView` также, как он удаляет представление.

Все это гарантирует, что `LayoutView`-ы и представления, которые они
содержат, будут правильно очищены.

## <a name="custom-region-class"></a> Собственный класс региона

Если вам необходимо заменить `Region` регион классом с вашей собственной реализацией,
вы можете указать альтернативный класс для использования в свойстве `regionClass`
в `LayoutView`.

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
layoutView.foo.show(new SomeView());
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

Регионы `LayoutView` прикрепляются напрямую к экземпляру `LayoutView` с именем региона
в качестве ключа и самим регионом в качестве значения. Поэтому вы должны быть осторожны,
чтобы избежать конфликтов с существующими свойствами в `LayoutView`, когда вы называете ваш регион.

Цепочка прототипов для `LayoutViews` выглядит следующим образом:

`Backbone.View > Marionette.View > Marionette.ItemView > Marionette.LayoutView`

Следовательно, каждое свойство у каждого из этих классов не должно совпадать с именем региона.
Наиболее распространненная ошибка людей, работающих с `LayoutViews`, это попытка назвать
свой регион *"attributes"*. Знайте, что вы **не** в состоянии сделать это.

Следующий неполный список наименований не может быть использован в качестве имени региона.
Более полный список наименований вы можете найти в документации по API для каждого класса в
цепочке прототипов:

* attributes
* constructor
* regionClass
* render
* destroy
* addRegion
* addRegions
* removeRegion

*Примечание: это известная проблема, ее исправление будет в v2*
