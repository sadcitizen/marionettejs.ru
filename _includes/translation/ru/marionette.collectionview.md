`CollectionView` будет пробегать по всем моделям в определенной коллекции рендеря каждую, используя переданный `childView`.
Затем, присоеденит `el` каждой отрендеренной вьюшки (child view) к родительскому (collection view) `el`. По умолчанию,   
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

Вложенная вьюшка должна быть определена прежде, чем вы будете на нее ссылаться в описании.
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

Описывая `childEvents` хеш ( в определении) или метод (в инстанцировании) вы перехватываете все всплывающие childEvents события 
без ручного биндинга. Ключи хеша могут быть либо функцией, либо строкой- именем метода в collection view. 

```js
// childEvents может буть определен как хеш
var MyCollectionView = Marionette.CollectionView.extend({

  // эта кэллбек- функция будет вызвана, когда ребенок вызовет событие `render` event
  childEvents: {
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
});
```

Так же работает для ваших кастомных событий,  которые вы можете вызывать из вложенных вьющек.

```js
// Вложенная вьюшка вызывает, `show:message`
var ChildView = new Marionette.ItemView.extend({
  events: {
    'click .button': 'showMessage'
  },

  showMessage: function () {
    console.log('The button was clicked.');

    this.triggerMethod('show:message');
  }
});

// Родитель использует childEvents для обработки присланного кастомного сообщения от вложенной вьюшки.
var ParentView = new Marionette.CollectionView.extend({
  childView: ChildView,

  childEvents: {
    'show:message': function () {
      console.log('The show:message event bubbled up to the parent.');
    }
  }
});
```

### CollectionView's `buildChildView`

Когда требуется кастомная `childView`, нужно переопределить `buildChildView` метод. Этот метод принимает 3 параметра и
возращает `view instance`, который будет использован для отображения вложенных вьюшек.

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

Метод `addChild` отвечает за рендеринг `childViews` и добавления в HTML  `collectionView` инстанса. Также,он отвечает за 
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

Если скобмбинировать эту опцию с [filter](#collectionviews-filter),  `reorderOnSort` будет рендерить новые вложенные и удалять
 те, что не прошли через `filter`.

## CollectionView's `emptyView`

Когда коллекция не имеет детей, а вам нужно отобразить вьюху отличающуюся от обычного списка, вы  можете определить аттрибут
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

Если нужно контролироватьЮ когда отображается пустая вью, определите
`isEmpty`:

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

Этот метод вызывается перед удалением (разрушением) вьюшки.

```js
Marionette.CollectionView.extend({
  onBeforeDestroy: function(){
    // do stuff here
  }
});
```

### onDestroy callback

Этот метод вызывается после удаления (разрушения) вьюшки.

```js
Marionette.CollectionView.extend({
  onDestroy: function(){
    // do stuff here
  }
});
```

### onBeforeAddChild callback

Этот кэллбек позволит вам знать, когда добавляется вложенное представлением в collectionView. Обеспечивает доступ 
к инстансу добавляемой вьюхи. Вызвается непосредственно перед добавлением.  

```js
Marionette.CollectionView.extend({
  onBeforeAddChild: function(childView){
    // work with the childView instance, here
  }
});
```

### onAddChild callback

Этот кэллбек позволит вам знать, когда добавилось вложенное представлением в collectionView. Обеспечивает доступ 
к инстансу добавленной вьюхи. Вызвается после добавления.

```js
Marionette.CollectionView.extend({
  onAddChild: function(childView){
    // work with the childView instance, here
  }
});
```

### onBeforeRemoveChild callback

Этот кэллбек позволит вам знать, когда вложенное представление удаляется из collectionView. Обеспечивает доступ 
к инстансу удаляемой вьюхи.

```js
Marionette.CollectionView.extend({
  onBeforeRemoveChild: function(childView){
    // work with the childView instance, here
  }
});
```

### onRemoveChild callback

Этот кэллбек позволит вам знать, когда вложенное представление удалится (уже удалено) из collectionView. Обеспечивает доступ 
к инстансу удаленной вьюхи.

```js
Marionette.CollectionView.extend({
  onRemoveChild: function(childView){
    // work with the childView instance, here
  }
});
```

## CollectionView Events

There are several events that will be triggered during the life
of a collection view. Each of these events is called with the
[Marionette.triggerMethod](./marionette.functions.md#marionettetriggermethod) function,
which calls a corresponding "on{EventName}" method on the
view instance (see [above](#callback-methods)).

### "before:render" event


Triggers just prior to the view being rendered. Also triggered as
"collection:before:render" / `onCollectionBeforeRender`.

```js
var MyView = Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("before:render", function(){
  alert("the collection view is about to be rendered");
});

myView.render();
```

### "render" event

A "render:collection" / `onRenderCollection` event will also be fired. This allows you to
add more than one callback to execute after the view is rendered,
and allows parent views and other parts of the application to
know that the view was rendered.

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

When `reorderOnSort` is set to `true`, these events are fired
respectfully just prior/just after the reordering of the collection.

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

Triggered just before destroying the view. A "before:destroy:collection" /
`onBeforeDestroyCollection` event will also be fired

```js
var MyView = Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("before:destroy:collection", function(){
  alert("the collection view is about to be destroyed");
});

myView.destroy();
```

### "destroy" / "destroy:collection" event

Triggered just after destroying the view, both with corresponding
method calls.

```js
var MyView = Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("destroy:collection", function(){
  alert("the collection view is now destroyed");
});

myView.destroy();
```

### "before:add:child" / "add:child" event

The "before:add:child" event and corresponding `onBeforeAddChild`
method are triggered just after creating a new `childView` instance for
a child that was added to the collection, but before the
view is rendered and added to the DOM.

The "add:child" event and corresponding `onAddChild`
method are triggered after rendering the view and adding it to the
view's DOM element.

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

This is triggered after the childView instance has been
removed from the collection, but before it has been destroyed.

```js
cv.on("before:remove:child", function(childView){
  // ...
});
```

### "remove:child" event

Triggered after a childView instance has been destroyed and
removed, when its child was deleted or removed from the
collection.

```js
cv.on("remove:child", function(viewInstance){
  // ...
});
```

### "childview:\*" event bubbling from child views

When a child view within a collection view triggers an
event, that event will bubble up through the parent
collection view with "childview:" prepended to the event
name.

That is, if a child view triggers "do:something", the
parent collection view will then trigger "childview:do:something".

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

Now, whenever the button inside the attached childView is clicked, an alert box
will appear that says: I said, 'do something!'

It's also possible to attach the event manually using the usual
`view.on('childview:do:something')`.

### before:render:collection event

The `before:render:collection` event is triggered before the `collectionView`'s children have been rendered and buffered. It differs from the `collectionsView`'s `before:render` in that it is __only__ emitted if the `collection` is not empty.

### render:collection event

The `render:collection` event is triggered after a `collectionView`'s children have been rendered and buffered. It differs from the `collectionViews`'s `render` event in that it happens __only__ if the `collection` is not not empty.

## CollectionView render

The `render` method of the collection view is responsible for
rendering the entire collection. It loops through each of the
children in the collection and renders them individually as an
`childView`.

```js
var MyCollectionView = Marionette.CollectionView.extend({...});

// all of the children views will now be rendered.
new MyCollectionView().render();
```

## CollectionView: Automatic Rendering

The collection view binds to the "add", "remove" and "reset" events of the
collection that is specified.

When the collection for the view is "reset", the view will call `render` on
itself and re-render the entire collection.

When a model is added to the collection, the collection view will render that
one model in to the collection of child views.

When a model is removed from a collection (or destroyed / deleted), the collection
view will destroy and remove that model's child view.

## CollectionView: Re-render Collection

If you need to re-render the entire collection, you can call the
`view.render` method. This method takes care of destroying all of
the child views that may have previously been opened.

## CollectionView's attachHtml

By default the collection view will append the HTML of each ChildView
into the element buffer, and then call jQuery's `.append` once at the
end to move the HTML into the collection view's `el`.

You can override this by specifying an `attachHtml` method in your
view definition. This method takes three parameters and has no return
value.

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

The first parameter is the instance of the collection view that
will receive the HTML from the second parameter, the current child
view instance.

The third parameter, `index`, is the index of the
model that this `childView` instance represents, in the collection
that the model came from. This is useful for sorting a collection
and displaying the sorted list in the correct order on the screen.

Overrides of `attachHtml` that don't take into account the element
buffer will work fine, but won't take advantage of the 60x performance
increase the buffer provides.

## CollectionView's resortView

By default the `CollectionView` will maintain the order of its `collection`
in the DOM. However on occasions the view may need to re-render to make this
possible, for example if you were to change the comparator on the collection.
By default `CollectionView` will call `render` when this happens, but there are
cases where this may not be suitable. For instance when sorting the `children`
in a `CompositeView`, you want to only render the internal collection.

```js
var cv = new Marionette.CollectionView({
  collection: someCollection,
  resortView: function() {
    // provide custom logic for rendering after sorting the collection
  }
});
```

## CollectionView's viewComparator

CollectionView allows for a custom `viewComparator` option if you want your CollectionView's children to be rendered with a different sort order than the underlying Backbone collection uses.

```js
  var cv = new MarionetteCollectionView({
    collection: someCollection,
    viewComparator: 'otherFieldToSortOn'
  });
```

The `viewComparator` can take any of the acceptable `Backbone.Collection` [comparator formats](http://backbonejs.org/#Collection-comparator) -- a sortBy (pass a function that takes a single argument), as a sort (pass a comparator function that expects two arguments), or as a string indicating the attribute to sort by.

## CollectionView's `filter`

CollectionView allows for a custom `filter` option if you want to prevent some of the
underlying `collection`'s models from being rendered as child views.
The filter function takes a model from the collection and returns a truthy value if the child should be rendered,
and a falsey value if it should not.

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

    // Only show views with even values
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

The CollectionView uses [Backbone.BabySitter](https://github.com/marionettejs/backbone.babysitter)
to store and manage its child views. This allows you to easily access
the views within the collection view, iterate them, find them by
a given indexer such as the view's model or collection, and more.

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

For more information on the available features and functionality of
the `.children`, see the [Backbone.BabySitter documentation](https://github.com/marionettejs/backbone.babysitter).

## CollectionView destroy

CollectionView implements a `destroy` method, which is called by the
region managers automatically. As part of the implementation, the
following are performed:

* unbind all `listenTo` events
* unbind all custom view events
* unbind all DOM events
* unbind all child views that were rendered
* remove `this.el` from the DOM
* call an `onDestroy` event on the view, if one is provided
* the `CollectionView` is returned

By providing an `onDestroy` event in your view definition, you can
run custom code for your view that is fired after your view has been
destroyed and cleaned up. This lets you handle any additional clean up
code without having to override the `destroy` method.

```js
Marionette.CollectionView.extend({
  onDestroy: function() {
    // custom cleanup or destroying code, here
  }
});
```
