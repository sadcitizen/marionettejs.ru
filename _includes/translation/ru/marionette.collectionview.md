`CollectionView` будет пробегать по всем моделям в определенной коллекции рендеря каждую, используя переданный `childView`.
Затем, присоеденит `el` каждого отрендеренного представления (child view) к родительскому (collection view) `el`. По умолчанию,   
`CollectionView` будет отражать отсортированный порядок коллекции в DOM. Такое поведение можно отключить передачей 
`{sort: false}` при инициализации.


CollectionView экстендится напрямую от Marionette.View. Поглядите
[the Marionette.View documentation](./marionette.view.md)
для уточнения информации о доступных фичах и функциональности.

Дополнительно, взаимодействие с Marionette.Region
будет обеспечивать такие  возможности как кэлбеки `onShow` и т.д. Поглядите 
[the Region documentation](./marionette.region.md) для уточнения.

## Documentation Index

* [CollectionView's `childView`](#collectionviews-childview)
  * [CollectionView's `getChildView`](#collectionviews-getchildview)
  * [CollectionView's `childViewOptions`](#collectionviews-childviewoptions)
  * [CollectionView's `childViewEventPrefix`](#collectionviews-childvieweventprefix)
  * [CollectionView's `childEvents`](#collectionviews-childevents)
  * [CollectionView's `buildChildView`](#collectionviews-buildchildview)
  * [CollectionView's `addChild`](#collectionviews-addchild)
  * [CollectionView's `reorderOnSort`](#collectionviews-reorderonsort)
* [CollectionView's `emptyView`](#collectionviews-emptyview)
  * [CollectionView's `getEmptyView`](#collectionviews-getemptyview)
  * [CollectionView's `isEmpty`](#collectionviews-isempty)
  * [CollectionView's `emptyViewOptions`](#collectionviews-emptyviewoptions)
* [Callback Methods](#callback-methods)
  * [onBeforeRender callback](#onbeforerender-callback)
  * [onRender callback](#onrender-callback)
  * [onBeforeReorder callback](#onbeforereorder-callback)
  * [onReorder callback](#onreorder-callback)
  * [onBeforeDestroy callback](#beforedestroy-callback)
  * [onDestroy callback](#ondestroy-callback)
  * [onBeforeAddChild callback](#onbeforeaddchild-callback)
  * [onAddChild callback](#onaddchild-callback)
  * [onBeforeRemoveChild callback](#onbeforeremovechild-callback)
  * [onRemoveChild callback](#onremovechild-callback)
* [CollectionView Events](#collectionview-events)
  * ["before:render" event](#beforerender-event)
  * ["render" event](#render-event)
  * ["before:reorder" / "reorder" event](#beforereorder--reorder-event)
  * ["before:destroy" event](#beforedestroy-event)
  * ["destroy" / "destroy:collection" event](#destroy--destroycollection-event)
  * ["before:add:child" / "add:child" event](#beforeaddchild--addchild-event)
  * ["before:remove:child event](#beforeremovechild-event)
  * ["remove:child" event](#removechild-event)
  * ["childview:\*" event bubbling from child views](#childview-event-bubbling-from-child-views)
  * ["before:render:collection" event](#beforerendercollection-event)
  * ["render:collection" event](#rendercollection-event)
* [CollectionView Child View Events](#collectionview-child-view-events)
* [CollectionView render](#collectionview-render)
* [CollectionView: Automatic Rendering](#collectionview-automatic-rendering)
* [CollectionView: Re-render Collection](#collectionview-re-render-collection)
* [CollectionView's attachHtml](#collectionviews-attachhtml)
* [CollectionView's resortView](#collectionviews-resortview)
* [CollectionView's viewComparator](#collectionviews-viewcomparator)
* [CollectionView's `filter`](#collectionviews-filter)
* [CollectionView's children](#collectionviews-children)
* [CollectionView destroy](#collectionview-destroy)

## CollectionView's `childView`

Определяет `childView` в вашей CollectionView. Должен быть
`Backbone.View` определением, не инстанционированным объектом. Это может быть любой
`Backbone.View`  или  `Marionette.ItemView`.

```js
var MyChildView = Marionette.ItemView.extend({});

Marionette.CollectionView.extend({
  childView: MyChildView
});
```

Вложенное представление должно быть определено прежде, чем вы будете на него ссылаться в описании.
Используйте `getChildView` для получения определения класса.

Другой вариант,  определить `childView` в опциях конструктора

```js
var MyCollectionView = Marionette.CollectionView.extend({...});

new MyCollectionView({
  childView: MyChildView
});
```

Если не определите `childView`, выбросится исключение, указывающее на необходимость определения `childView`

### CollectionView's `getChildView`
Значение, возвращаемое эти методом- класс `ChildView` инстанцируемый, когда `Model` начнет рендерится. Также, этот метод позволяет
настраивать для каждой  `Model` свой `ChildViews`.

```js
var FooBar = Backbone.Model.extend({
  defaults: {
    isFoo: false
  }
});

var FooView = Marionette.ItemView.extend({
  template: '#foo-template'
});
var BarView = Marionette.ItemView.extend({
  template: '#bar-template'
});

var MyCollectionView = Marionette.CollectionView.extend({
  getChildView: function(item) {
    // Выбираем класс вложенной  вью,
    // в зависимости от аттрибута модели 'isFoo'
    if  (item.get('isFoo')) {
      return FooView;
    }
    else {
      return BarView;
    }
  }
});

var collectionView = new MyCollectionView();
var foo = new FooBar({
  isFoo: true
});
var bar = new FooBar({
  isFoo: false
});

// Renders a FooView
collectionView.collection.add(foo);

// Renders a BarView
collectionView.collection.add(bar);
```

### CollectionView's `childViewOptions`

Существует много сценариев, когда вам необходимо передать информацию от родительсуой `collection view` каждому вложенному
`childView` инстансу. Для этого добавте определение `childViewOptions` в collection view (как литеральный объект). Оно 
передстся в конструктор childVIewЮ как часть `options`


```js
var ChildView = Marionette.ItemView.extend({
  initialize: function(options) {
    console.log(options.foo); // => "bar"
  }
});

var CollectionView = Marionette.CollectionView.extend({
  childView: ChildView,

  childViewOptions: {
    foo: "bar"
  }
});
```

Можно определить `childViewOptions` как функцию, если нужно вычеслить значения в рантайме. Model передается внурь функции
и доступна для обращения при вычеслениях. Функция должна вернуть объект, аттрибуты объекта будут скопированны в options инстанса 
`childView` 

```js
var CollectionView = Marionette.CollectionView.extend({
  childViewOptions: function(model, index) {
    // do some calculations based on the model
    return {
      foo: "bar",
      childIndex: index
    }
  }
});
```

### CollectionView's `childViewEventPrefix`

Вы можете настраивать префикс событий, для событитй передающихся через `collection view`. Для этого, установите `childViewEventPrefix`.
Для большей информации смотрите ["childview:*" event bubbling from child views](#childview-event-bubbling-from-child-views)

```js
var CV = Marionette.CollectionView.extend({
  childViewEventPrefix: "some:prefix"
});

var c = new CV({
  collection: myCol
});

c.on("some:prefix:render", function(){
  // child view was rendered
});

c.render();
```

`childViewEventPrefix` можно передавать в определении, либо в опциях вызова констурктора. 

### CollectionView's `childEvents`

A `childEvents` hash or method permits handling of child view events without 
manually setting bindings. The values of the hash can either be a function or a string method name on the collection view.

> Описывая `childEvents` хеш ( в определении) или метод (в инстанцировании) вы перехватываете все всплывающие childEvents события 
> без ручного биндинга. Ключи хеша могут быть либо функцией, либо строкой- именем метода в collection view. 

```js
// childEvents может быть определен как хеш
var MyCollectionView = Marionette.CollectionView.extend({

  childEvents: {
    // This callback will be called whenever a child is rendered or emits a `render` event
    render: function() {
      console.log("a childView has been rendered");
    }
  }
});

// ... или как функция, возвращающая хеш
var MyCollectionView = Marionette.CollectionView.extend({

  childEvents: function() {
    return {
      render: this.onChildRendered
    }
  },

  onChildRendered: function () {
    console.log('A child view has been rendered.');
  }
});
```

> Так же работает для ваших кастомных событий,  которые вы можете вызывать из вложенных представлений.

`childEvents` also catches custom events fired by a child view.  Take note that the first argument to a `childEvents` handler is the child view itself.

```js
// The child view fires a custom event, `show:message`
var ChildView = Marionette.ItemView.extend({

  // Events hash defines local event handlers that in turn may call `triggerMethod`.
  events: {
    'click .button': 'onClickButton'
  },

  // Triggers hash converts DOM events directly to view events catchable on the parent.
  triggers: {
    'submit form': 'submit:form'
  },

  onClickButton: function () {
    // Both `trigger` and `triggerMethod` events will be caught by parent.
    this.trigger('show:message', 'foo');
    this.triggerMethod('show:message', 'bar');
  }
});

// The parent uses childEvents to catch the child view's custom event
var ParentView = Marionette.CollectionView.extend({

  childView: ChildView,

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

### CollectionView's `buildChildView`

Когда требуется кастомная `childView`, нужно переопределить `buildChildView` метод. Этот метод принимает 3 параметра и
возращает `view instance`, который будет использован для отображения вложенных представлений.

```js
buildChildView: function(child, ChildViewClass, childViewOptions){
  // build the final list of options for the childView class
  var options = _.extend({model: child}, childViewOptions);
  // create the child view instance
  var view = new ChildViewClass(options);
  // return it
  return view;
},
```

### CollectionView's `addChild`

Метод `addChild` отвечает за рендеринг `childViews` и добавления в HTML  `collectionView` инстанса. Также, он отвечает за 
вызов событий от `ChildView`. Чаще всего, вам не нужно его переопределять. Но, если хотите, то можно. Примерно так:

```js
Marionette.CollectionView.extend({
  addChild: function(child, ChildView, index){
    if (child.shouldBeShown()) {
      Marionette.CollectionView.prototype.addChild.apply(this, arguments);
    }
  }
});
```

### CollectionView's `reorderOnSort`

Эта опция полезна, когда вы выполняете пересортировку вашей коллекции. Без этой опции, ваш  `CollectionView` будет полностью
перерендерен, что может быть очень накладно, в случае большого количества элементов или из-за сложности ваших `ChildView`.
Если эта опция активна,  то пересортица `Collection` не будет требовать перерисовки, но только переупорядочивания  DOM узлов.
Это может быть проблемой, если `ChildView` используют свой индекс в коллекции для рендеринга. В этом случае, вы не сможете
использовать эту опцию. так как вам придется перерендерить каждую `ChildView`.

Если скомбинировать эту опцию с [filter](#collectionviews-filter),  `reorderOnSort` будет рендерить новые вложенные и удалять
 те, что не прошли через `filter`.

## CollectionView's `emptyView`

Когда коллекция не имеет детей, а вам нужно отобразить представление отличающиеся от обычного списка, вы  можете определить аттрибут
`emptyView`.

```js
var NoChildrenView = Marionette.ItemView.extend({
  template: "#show-no-children-message-template"
});

Marionette.CollectionView.extend({
  // ...

  emptyView: NoChildrenView
});
```

### CollectionView's `getEmptyView`

Если нужно `emptyView` выбрать динамически, определите `getEmptyView`:

```js
Marionette.CollectionView.extend({
  // ...

  getEmptyView: function() {
    // custom logic
    return NoChildrenView;
  }
});
```

### CollectionView's `isEmpty`

Если нужно контролировать, когда отображается пустое представление, определите `isEmpty`:

```js
Marionette.CollectionView.extend({
  isEmpty: function(collection) {
    // some logic to calculate if the view should be rendered as empty
    return someBoolean;
  }
});
```

### CollectionView's `emptyViewOptions`

Сходное с `childView` и `childViewOptions`, свойство  `emptyViewOptions` передастся в конструктор `emptyView`.
Можно описать как литеральный объект или функцию.

Если `emptyViewOptions` не определено в  CollectionView, по умолчанию будет передаваться `childViewOptions` в `emptyView`.

```js
var EmptyView = Marionette.ItemView({
  initialize: function(options){
    console.log(options.foo); // => "bar"
  }
});

var CollectionView = Marionette.CollectionView({
  emptyView: EmptyView,

  emptyViewOptions: {
    foo: "bar"
  }
});
```

## Callback Methods

There are several callback methods that can be provided on a
`CollectionView`. If they are found, they will be called by the
view's base methods. These callback methods are intended to be
handled within the view definition directly.


### onBeforeRender callback

`onBeforeRender` вызывается непосредственно перед рендерингом `collection view`

```js
Marionette.CollectionView.extend({
  onBeforeRender: function(){
    // do stuff here
  }
});
```

### onRender callback

После рендеринга вьюшки, вызовится метод  `onRender`. Можно определить этот метод, для связывания вашего кода
с отренедеренными элементами.

```js
Marionette.CollectionView.extend({
  onRender: function(){
    // do stuff here
  }
});
```

### onBeforeReorder callback

Если `reorderOnSort` установлен в `true`, `onBeforeReorder` будет вызван перед переупорядочиванием collectionView.

```js
Marionette.CollectionView.extend({
  onBeforeReorder: function(){
    // do stuff here
  }
});
```

### onReorder callback

Если `reorderOnSort` установлен в `true`, после переупорядочивания collectionView будет вызван  `onReorder`.

```js
Marionette.CollectionView.extend({
  onReorder: function(){
    // do stuff here
  }
});
```

### onBeforeDestroy callback

Этот метод вызывается перед удалением (разрушением) представления.

```js
Marionette.CollectionView.extend({
  onBeforeDestroy: function(){
    // do stuff here
  }
});
```

### onDestroy callback

Этот метод вызывается после удаления (разрушения) представления.

```js
Marionette.CollectionView.extend({
  onDestroy: function(){
    // do stuff here
  }
});
```

### onBeforeAddChild callback

Этот кэллбек позволит вам знать, когда добавляется вложенное представление в collectionView. Обеспечивает доступ 
к инстансу добавляемого представления. Вызвается непосредственно перед добавлением.  

```js
Marionette.CollectionView.extend({
  onBeforeAddChild: function(childView){
    // work with the childView instance, here
  }
});
```

### onAddChild callback

Этот кэллбек позволит вам знать, когда добавилось вложенное представленим в collectionView. Обеспечивает доступ 
к инстансу добавленного представления. Вызвается после добавления.

```js
Marionette.CollectionView.extend({
  onAddChild: function(childView){
    // work with the childView instance, here
  }
});
```

### onBeforeRemoveChild callback

Этот кэллбек позволит вам знать, когда вложенное представление удаляется из collectionView. Обеспечивает доступ 
к инстансу удаляемого представления.

```js
Marionette.CollectionView.extend({
  onBeforeRemoveChild: function(childView){
    // work with the childView instance, here
  }
});
```

### onRemoveChild callback

Этот кэллбек позволит вам знать, когда вложенное представление удалится (уже удалено) из collectionView. Обеспечивает доступ 
к инстансу удаленного представления.

```js
Marionette.CollectionView.extend({
  onRemoveChild: function(childView){
    // work with the childView instance, here
  }
});
```

## CollectionView Events


Есть несколько событий, что триггерятся в течении жизненного цикла `collection view`. Каждое такое событие  вызывается
[Marionette.triggerMethod](./marionette.functions.md#marionettetriggermethod) функцией и связано с соответсвующим 
"on{EventName}" методом инстанса представления ( дополнительная информмация [above](#callback-methods)).

### "before:render" event


Триггерится непосредственно перед  рендерингом представления.
Также триггерится, как "collection:before:render" / `onCollectionBeforeRender` 

```js
var MyView = Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("before:render", function(){
  alert("the collection view is about to be rendered");
});

myView.render();
```

### "render" event

Событие "render:collection" / `onRenderCollection` также будет вызываться. Это позволит вам запускать больше чем один кэлбек
после рендеринга представления, и позволит родительскому представлению и другим частям приложения узнать, что  представление
отрендерилось. 

```js
var MyView = Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("render", function(){
  alert("the collection view was rendered!");
});

myView.on("collection:rendered", function(){
  alert("the collection view was rendered!");
});

myView.render();
```

### "before:reorder" / "reorder" events

Когда `reorderOnSort установленно в `true`, это событие будет вызываться перед/после реорганизацией коллекции.

```js
var MyView = Marionette.CollectionView.extend({...});

var myCol = new Backbone.Collection({ comparator: ... })
var myView = new MyView({ reorderOnSort: true });
myView.render();
myCol.comparator = function () { return this.get('foo'); };

myView.on("before:reorder", function(){
  alert("the collection view is about to be reordered");
});

myView.on("reorder", function(){
  alert("the collection view has been reordered following its collection");
});

myCol.sort()

```

### "before:destroy" event

Вызывается непосредствнно перед удалением представления, также вызываются "before:destroy:collection" /`onBeforeDestroyCollection`

```js
var MyView = Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("before:destroy:collection", function(){
  alert("the collection view is about to be destroyed");
});

myView.destroy();
```

### "destroy" / "destroy:collection" event

Вызывается сразу после удаления представления, вмест с вызовом соответсвующих методов.

```js
var MyView = Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("destroy:collection", function(){
  alert("the collection view is now destroyed");
});

myView.destroy();
```

### "before:add:child" / "add:child" event

"before:add:child" и соответвующий ему `onBeforeAddChild` метод вызываются сразу после создания нового `childView`инстанса 
для "ребенка" добавленного в коллекцию, но прежде, чем представление будет отрендерено и добавлено в DOM.

"add:child" событие и соответсвующий ему `onAddChild` метод триггерятся после того, как отрендеренное представление
добавляется в DOM

```js
var MyCV = Marionette.CollectionView.extend({
  // ...

  onBeforeAddChild: function(){
    // ...
  },

  onAddChild: function(){
    // ...
  }
});

var cv = new MyCV({...});

cv.on("before:add:child", function(viewInstance){
  // ...
});

cv.on("add:child", function(viewInstance){
  // ...
});
```

### "before:remove:child"

Это событие триггерится после того, как childView инстанс удаляется из коллекции, но перед его разрушением.

```js
cv.on("before:remove:child", function(childView){
  // ...
});
```

### "remove:child" event

Триггерится после удаления и разрушения вложенного (childView) представления из коллекции.

```js
cv.on("remove:child", function(viewInstance){
  // ...
});
```

### "childview:\*" event bubbling from child views

Когда вложенное представление  триггерит событие, это событие будет всплывать к родителю с префиксом `childview:` 
в имени события

Пэтому, если ребенок триггерит "do:something", родительское представление стриггерит "childview:do:something" 

```js
// set up basic collection
var myModel = new MyModel();
var myCollection = new MyCollection();
myCollection.add(myModel);

var MyItemView = Marionette.ItemView.extend({
  triggers: {
    'click button': 'do:something'
  }
});

// get the collection view in place
var colView = new CollectionView({
  collection: myCollection,
  childView: MyItemView,

  onChildviewDoSomething: function() {
    alert("I said, 'do something!'");
  }
});
colView.render();
```
В примере, когда кнопку, внутри вложенного предствления, нажмут, появится сообщение с текстом I said, 'do something!'

Также можно  присоединится к события вручную, используя обычный `on`
`view.on('childview:do:something')`.

### before:render:collection event

`before:render:collection` событие вызывается прежде чем дети  `collectionView` будут отрендерены и закешированны.
Отличается от `collectionsView  -> before:render` тем, что вызывается только, если  `collection` не пустая.

### render:collection event

`render:collection` вызывается после того, как дети отрендерятся и закешируются.
Отличается от `collectionsView -> render` тем, что вызывается только, если  `collection` не пустая. 

## CollectionView Child View Events

The following events are raised on child views during rendering and destruction of child views, which is consistent with the view lifecycle experienced during `Region#show`.

* `before:render` / `onBeforeRender` - Called before the view is rendered.
* `render` / `onRender` - Called after the view is rendered, but before it is attached to the DOM.
* `before:show` / `onBeforeShow` - Called after the view has been rendered, but before it has been bound to the CollectionView.
* `before:attach` / `onBeforeAttach` - Called before the view is attached to the DOM.  This will not fire if the CollectionView itself is not attached.
* `attach` / `onAttach` - Called after the view is attached to the DOM.  This will not fire if the CollectionView itself is not attached.
* `show` / `onShow` - Called when the view has been rendered and bound to the CollectionView.
* `dom:refresh` / `onDomRefresh` - Called when the view is both rendered and shown, but only if it is attached to the DOM.  This will not fire if the CollectionView itself is not attached.
* `before:destroy` / `onBeforeDestroy` - Called before destroying a view.
* `destroy` / `onDestroy` - Called after destroying a view.

Note: `render`, `destroy`, and `dom:refresh` are triggered on pure Backbone Views during child view rendering, but for a complete implementation of these events the Backbone View should fire `render` within `render()` and `destroy` within `remove()` as well as set the following flags:

```js
view.supportsRenderLifecycle = true;
view.supportsDestroyLifecycle = true;
```

## CollectionView render

The `render` method of the collection view is responsible for
rendering the entire collection. It loops through each of the
children in the collection and renders them individually as an
`childView`.

Метод `render` отвечает за рендеринг всей коллекции. Проходит по каждому ребенку в коллекции и рендерит его индивидуально, 
как `childView`.

```js
var MyCollectionView = Marionette.CollectionView.extend({...});

// все вложенные представления будут отрендерены
new MyCollectionView().render();
```

## CollectionView: Automatic Rendering

`collection view` связывается с  "add", "remove" и "reset" событиями своей коллекции.

Когда коллекция сьрасывается ( "reset"), представление вызовит `render` в себе и перерисует всю коллекцию

При добавлении модели в коллекцию, будет отрендерено представление этой модели и добавленно в коллекцию вложенным представлений.

Удаление модели из колллекции, вызовет уделние  его вложеного представления.

## CollectionView: Re-render Collection

Если вам нужно перерендерить всю коллекцию, вы можете вызвать `view.render` метод. Этот метод позаботится об удалении 
всех вложенных представлений.

## CollectionView's attachHtml

По умолчанию, `CollectionView`, будет добавлять HTML  каждого своего ребенка в буфер, затем вызовит `jQuery.append` единожды
для добавления "буферного" HTML к родительскому `el`. 

Вы можете изменить это поведение, переопределив метод  `attachHtml` в определении вашего представления. Метод получает
три парметра и ничего не возращает.

```js
Marionette.CollectionView.extend({

	// The default implementation:
  attachHtml: function(collectionView, childView, index){
    if (collectionView.isBuffering) {
      // buffering happens on reset events and initial renders
      // in order to reduce the number of inserts into the
      // document, which are expensive.
      collectionView._bufferedChildren.splice(index, 0, childView);
    }
    else {
      // If we've already rendered the main collection, append
      // the new child into the correct order if we need to. Otherwise
      // append to the end.
      if (!collectionView._insertBefore(childView, index)){
        collectionView._insertAfter(childView);
      }
    }
  },

  // Called after all children have been appended into the elBuffer
  attachBuffer: function(collectionView, buffer) {
    collectionView.$el.append(buffer);
  },

  // called on initialize and after attachBuffer is called
  initRenderBuffer: function() {
    this.elBuffer = document.createDocumentFragment();
  }

});
```

Первый парметр инстанс CollectionView. что будет получать HTML из второго параметра, текущего childView инстанса.

Третий параметр, `index`. Индекс модели в коллекции, что сейчас отрисовываем. Полезно  для отсортированной колекции и
отображения сортированного списка в правильном порадке на экране.

Overrides of `attachHtml` that don't take into account the element
buffer will work fine, but won't take advantage of the 60x performance
increase the buffer provides.


## CollectionView's resortView

По умолчанию `CollectionView` будет отражать упорядочненость своей `collection` в DOM. Но иногда представлению
требуется ререндеринг, что бы это было возможно. Например, если сменить компаратор (`comparator`) у коллекции. По умолчанию, 
`CollectionView` будет вызывать метод `render` когда это случится. Это может привести к большим издержкам. Вы можете 
определить свою логику поведения, и отрисовывать только часть коллекции.

```js
var cv = new Marionette.CollectionView({
  collection: someCollection,
  resortView: function() {
    // тут логика ререндеринга после сортировки коллекции 
  }
});
```

## CollectionView's viewComparator

CollectionView позволяет  определить опцию`viewComparator`, если вы хотите отрисовывать детей в ином сортированном порядке, 
отличном от сортировки в `collection` 

```js
  var cv = new MarionetteCollectionView({
    collection: someCollection,
    viewComparator: 'otherFieldToSortOn'
  });
```

The `viewComparator` can take any of the acceptable `Backbone.Collection` [comparator formats](http://backbonejs.org/#Collection-comparator)
 -- a sortBy (pass a function that takes a single argument), as a sort (pass a comparator function that expects two arguments),
  or as a string indicating the attribute to sort by.


## CollectionView's `filter`

Опция `filter` позволяет не рендерить некоторые модели коллекции. Фильтр возращает истину, если ребенок будет отрисован, и 
ложь,  если не будет

```js
  var cv = new Marionette.CollectionView({
    childView: SomeChildView,
    emptyView: SomeEmptyView,
    collection: new Backbone.Collection([
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 }
    ]),

    // Показываем только модели с четным числом
    filter: function (child, index, collection) {
      return child.get('value') % 2 === 0;
    }
  });

  // renders the views with values '2' and '4'
  cv.render();

  // change the filter
  cv.filter = function (child, index, collection) {
    return child.get('value') % 2 !== 0;
  };

  // renders the views with values '1' and '3'
  cv.render();

  // remove the filter
  // note that using `delete cv.filter` will cause the prototype's filter to be used
  // which may be undesirable
  cv.filter = null;

  // renders all views
  cv.render();
```


## CollectionView's children

The CollectionView испоьзует [Backbone.BabySitter](https://github.com/marionettejs/backbone.babysitter) для хранения и управления
своими вложенными представлениями. Это позволяет вам иметь легкий доступ к представлениям внутри CollectionView, итерировать их,
искать по индексу и т.д.

```js
var cv = new Marionette.CollectionView({
  collection: someCollection
});

cv.render();

// retrieve a view by model
var v = cv.children.findByModel(someModel);

// iterate over all of the views and process them
cv.children.each(function(view){

  // process the `view` here

});
```

Для большей инофрмации смотри [Backbone.BabySitter documentation](https://github.com/marionettejs/backbone.babysitter).

## CollectionView destroy

CollectionView реализвет метод `destroy`, вызываемя менеджером регионов автоматически. Как часть реализации, будет
выполненно следующее:

* отвязывает все `listenTo` события
* отвязывает все custom view события
* отвязывает все DOM события
* отвязывает все вложенные отренедренные представления
* удаляет `this.el` из DOM
* вызывает `onDestroy` на представлении, если  оно определено
* возвращает`CollectionView` 

Обрабатвая `onDestroy` событие, вы можете выполнить необходимый код после того, как представление уничтожится и 
пройдет процесс очистки. Это дает возможность выполнить дополнительные процедуры очистки без лишнего переопределения метода `destroy`


```js
Marionette.CollectionView.extend({
  onDestroy: function() {
    // custom cleanup or destroying code, here
  }
});
```
