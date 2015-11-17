`CompositeView` расширяет `CollectionView` и обычно используется в сценариях где нужно отразить "ветвь и листья", или
в сценариях, где коллекцию нужно вставить в "оборачивающий" ее шаблон.
По умолчанию, `CompositeView` отражает сортировку коллекции в DOM. 
Такое поведение можно отключить, определяя `{sort: false}` при инициализации.

Подробнее [the Marionette.CollectionView documentation](./marionette.collectionview.md)

Дополнительно,  взаимодействие с `Marionette.Region` даст возможность использовать различные кэллбеки, например `onShow`.
Подробнее [the Region documentation](./marionette.region.md).

## Пример: Tree View

Для примера, вы рендерите древовидное представление. Возможно, вы хотите рендерить collection view с моделью и шаблоном.
Именно для ренедринга более сложных представлений ( чем просто список колеекции) и служит CompositeView.

Вы можете определить `modelView` для использования  в отрисовке каждой модели. Если не определяете, будет использоваться
дефолтный `Marionette.ItemView`.

```js
var CompositeView = Marionette.CompositeView.extend({
  template: "#leaf-branch-template" // шаблон всего представления
});

new CompositeView({
  model: someModel,
  collection: someCollection
});
```

Дополнительные примеры
[using the composite view.](http://lostechies.com/derickbailey/2012/04/05/composite-views-tree-structures-tables-and-more/)

## Содержание

* [Composite Model `template`](#composite-model-template)
* [CompositeView's `childView`](#compositeviews-childview)
* [CompositeView's `childViewContainer`](#compositeviews-childviewcontainer)
* [CompositeView's `attachHtml`](#compositeviews-attachhtml)
* [Recursive By Default](#recursive-by-default)
* [Model And Collection Rendering](#model-and-collection-rendering)
* [Events And Callbacks](#events-and-callbacks)
* [Organizing UI elements](#organizing-ui-elements)
* [modelEvents and collectionEvents](#modelevents-and-collectionevents)

## Composite Model `template`

Когда `CompositeView` рендерится, каждая `model` будет рендериться с шаблоном `template` определенным в ее ( модели)
представлении. Вы можете переопределить шаблон для `CompositeView`, передавая его конструктору в опциях.

```js
new MyComp({
  template: "#some-template" // шаблон CompositeView
});
```

Опция `collection` не передается в контекст шаблона по умолчанию. Если  в шаблоне требуется доступ к коллекции, 
вам нужно будет передавать ее используя `templateHelpers`. 

```js
new MyComp({
  template: "#some-template",
  templateHelpers: function() {
    return { items: this.collection.toJSON() };
  }
})
```

## CompositeView's `childView`

Каждый `childView` будет рендерится используя класс описанный в `childView` опции. Сначала отрисуется `CompositeView` шаблон, 
после этого, добавятся  дети с `childView` шаблонами.

```js
var ChildView = Marionette.ItemView.extend({});

var CompView = Marionette.CompositeView.extend({
  childView: ChildView
});
```

## CompositeView's `childViewContainer`

По умолчанию, `CompositeView` использует `attachHtml` метод  из `СollectionView`. Это означает, 
что представление будет вызывать jQuery метод `append` для размещения HTML содержимого из вложенных `childView` инстансов
в `collectionView` `el`.

Скорее всего, это не очень соответствует вашим задачам рендеринга кажого вложенного представления в необходимое место.
Например, если вы строите табличное представление, и хотите прибавлять каждого ребенка из коллекции в `<tbody>` таблицы.
Вероятно, вы будете использовать следующий шаблон. 

```html
<script id="row-template" type="text/html">
  <td><%= someData %></td>
  <td><%= moreData %></td>
  <td><%= stuff %></td>
</script>

<script id="table-template" type="text/html">
  <table>
    <thead>
      <tr>
        <th>Some Column</th>
        <th>Another Column</th>
        <th>Still More</th>
      </tr>
    </thead>

    <!-- хотим вставить отображение коллекции в это место -->
    <tbody></tbody>

    <tfoot>
      <tr>
        <td colspan="3">some footer information</td>
      </tr>
    </tfoot>
  </table>
</script>
```

Для рендеринга ваших `childView` инстансов внутри `<tbody>`, определите `childViewContainer` в вашем `CompositeView`.

```js
var RowView = Marionette.ItemView.extend({
  tagName: "tr",
  template: "#row-template"
});

var TableView = Marionette.CompositeView.extend({
  childView: RowView,

  // определяем jQuery селектор, внутрь которого будем добавлять `childView` инстансы
  childViewContainer: "tbody",

  template: "#table-template"
});
```

Это разместит все `childView` инстасы внутри `<tbody>` тега родительского шаблона и корректно отрисует
структуру таблицы ( в данном примере).

Или вы можете определить функцию для опции `childViewContainer`. Функции необходиом возвращать jQuery селектор,  или 
jQuery объект.

```js
var TableView = Marionette.CompositeView.extend({
  // ...

  childViewContainer: function(){
    return "#my-tbody"
  }
});
```
Использование функции, позволяет добавить логику для возвората определенного селектора. Однако, только одно значение может быть
возвращено. Первое возвращаемое  значение будет закешированно, и будет использоваться в весь период работы 
представления.

Также, `childViewContainer` можно передать в конструкторе класса.

```js
var myComp = new Marionette.CompositeView({
  // ...,

  childViewContainer: "#my-tbody"
});
```

## CompositeView's `attachHtml`

Иногда, конфигурация `childViewContainer` недостаточна для специфического размещения "определенных" `childView` представлений.
В этом случае, можно переопределить `attachHtml` метод.

Подробнее смотреть тут [CollectionView's documentation](./marionette.collectionview.md#collectionviews-attachhtml).

## CompositeView's `childView` выбор контейнера

Метод `getChildViewContainer` получает вторым параметром `childView`, который, если переопределен, позволит выбирать
"специфический" контейнер (`containerView` возвращаемый методом `getChildViewContainer`)  для размещения детей.
 

## Recursive по умолчанию

Режим рендеринга `CompositeView` предполагает (допускает) иерархическую, рекурсивную структуру данных. Если вы 
не определяете какой либо `childView` для вашего `CompositeView`, то дети будут отрендерены одним и тем же
методом рендеринга класса `CompositeView`. 
 

## Model и Collection ререндеринг

Модель и коллекция для `CompositeView` будет перерисовываться при следующих условиях.

* Когда в коллекции происходит событие "reset". Перерендерится только коллекция внутри `Composite`, окружающий шаблон не затрагивается.
* При добавлении модели в коллекцию (событие "add"), отрендерится только один ребенок в списке.
* Удаление модели из коллекции (событие "remove"), удалит только одного ребенка из уже отрисованного списка

Как и в `ItemView`, `CompositeView` получает третьим аргументом `Renderer` объект `render` метода, удобный для
кастомной реализации своего `Renderer`-а.

## События и кэлбеки

При рендеринге `compositeView` будет вызванно несколько событий. События триггерятся с помощью 
[Marionette.triggerMethod](./marionette.functions.md#marionettetriggermethod) функции, которая вызывает соответствующие
`on{EventName}` методы представления.

* "before:render:template" / `onBeforeRenderTemplate` - перед рендерингом `model` 
* "render:template" / `onRenderTemplate` - после рендеринга `model`
* "before:render:collection" / `onBeforeRenderCollection` - перед рендеригом коллекции моделей
* "render:collection" / `onRenderCollection` - после рендеринга коллекция моделей
* "before:render" / `onBeforeRender` - перед тем, как что нибудь будет отрендерено
* "render" / `onRender` - после того, как что либо будет рендерится

Кроме этого, после ренедринга `CompositeView`, будет вызван метод `onRender`. Вы можете определить этот метод
в вашем представлении, и ваш код  сможет работать с `el` представления, после его (представления) "полного" рендеринга.

```js
Marionette.CompositeView.extend({
  onRender: function(){
    // Шаблон compositeView и  вложенная коллекция уже отрендерены, через this.el поимеем к ним доступ  
  }
});
```

## Организация UI элементов

Аналогично с `ItemView`, вы можете описать UI элементы внутри `CompositeView` используя `UI` хеш. Заметим, что  элементы
из этого хеша, это элементы, отрендериваемые `CompositeView` шаблоном , а не вложенными.

UI элементы будут доступны, как только шаблон `CompositeView` отрендерится (но перед рендерингом коллекции), т.е. вы сможете
иметь к UI элементам доступ в методе  `onBeforeRender`.

## События модели и коллекции

`CompositeViews` может связываться напрямую к событиям модели и коллекции в декларативном виде при определении класса.

```js
Marionette.CompositeView.extend({
  modelEvents: {
    "change": "modelChanged"
  },

  collectionEvents: {
    "add": "modelAdded"
  }
});
```

Подробнее смотреть [Marionette.View](./marionette.view.md#viewmodelevents-and-viewcollectionevents)
