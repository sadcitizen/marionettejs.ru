`CollectionView` будет пробегать по всем моделям в переданной представлению коллекции, отрисовывая каждую модель, используя для этого назначенный `childView`.
После этого, присоеденит `el` каждого вложенного отрендеренного представления (`childView`) к родительскому (`collectionView`) `el`. По умолчанию,   
`CollectionView` будет отражать отсортированный порядок коллекции в DOM. Такое поведение можно отключить передачей `{sort: false}` при инициализации.

CollectionView расширяется напрямую от `Marionette.View`. Подробнее про `Marionette.View` можно прочитать тут
[the Marionette.View documentation](./marionette.view.md) для уточнения информации о доступных свойствах и функциональности.

Дополнительно, взаимодействие с `Marionette.Region` будет обеспечивать такие  возможности, как кэлбеки `onShow` и т.д. Подробнее о регионах 
можно прочитать тут [the Region documentation](./marionette.region.md)

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

Определяет `childView` в вашей `CollectionView`. Должен быть `Backbone.View` определением,т.е. не инстанционированным объектом. Это может быть любой
`Backbone.View`  или  `Marionette.ItemView`.

```js
var MyChildView = Marionette.ItemView.extend({});

Marionette.CollectionView.extend({
  childView: MyChildView
});
```

Вложенное представление должно быть определено прежде, чем вы будете на него ссылаться в описании.
Вы можете использовать функцию `getChildView` для получения определения класса.

Другой вариант, определить `childView` в опциях конструктора.

```js
var MyCollectionView = Marionette.CollectionView.extend({...});

new MyCollectionView({
  childView: MyChildView
});
```

Если не определите `childView`, выбросится исключение, указывающее на необходимость определения `childView`.

### CollectionView's `getChildView`
Значение, возвращаемое эти методом - класс `ChildView` что будет инстанцирован при рендеренге `Model`. Также, этот метод позволяет
настраивать для каждой `Model` свой `ChildViews`.

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
    // Выбираем класс вложенного представления,
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

Существует много сценариев, когда вам необходимо передать информацию от родительсуой `collectionView` каждому вложенному
`childView` представлению. Для этого добавте определение `childViewOptions` в `collectionView` (как литеральный объект). Оно 
передастся в конструктор `childVIew`, как часть `options`.


```js
var ChildView = Marionette.ItemView.extend({
  initialize: function(options) {
    console.log(options.foo); // выведет => "bar"
  }
});

var CollectionView = Marionette.CollectionView.extend({
  childView: ChildView,

  childViewOptions: {
    foo: "bar"
  }
});
```

Можно определить `childViewOptions` как функцию, если нужно вычеслить значения во время работы приложения. `Model` передается внурь функции
и доступна для обращения при вычислениях. Функция должна вернуть объект, аттрибуты объекта будут скопированны в options инстанса 
`childView` 

```js
var CollectionView = Marionette.CollectionView.extend({
  childViewOptions: function(model, index) {
    // проводим какие либо вычесления, model доступна для обращений
    return {
      foo: "bar",
      childIndex: index
    }
  }
});
```

### CollectionView's `childViewEventPrefix`

Вы можете настраивать префикс для событий пересылаемых в `collectionView` из вложенных представлений. Для этого, установите `childViewEventPrefix`.
Подробнее про события вложенных представлений можно прочитать тут ["childview:*" event bubbling from child views](#childview-event-bubbling-from-child-views)

```js
var CV = Marionette.CollectionView.extend({
  childViewEventPrefix: "some:prefix"
});

var c = new CV({
  collection: myCol
});

c.on("some:prefix:render", function(){
  // вложенное представление отрисовано
});

c.render();
```

`childViewEventPrefix` можно передавать в определении класса, либо в опциях вызова констурктора. 

### CollectionView's `childEvents`

Хеш `childEvents` или метод (возвращающий хеш) позволяет перехватывать  всплывающие childEvents события 
без ручных настроек связывания с кэлбэек-функциями. Значения хеша могут быть либо функцией, либо строкой - именем метода в `collectionView`. 

```js
// childEvents может быть определен как хеш
var MyCollectionView = Marionette.CollectionView.extend({

  childEvents: {
    // эта кэлбэк-функция будет вызвана вский раз, когда вложенное представление отрисуется или пришлет событие `render`
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

Кроме того, `childEvents` позволяет перехватывать определенные вами события, присылаемые из вложенных представлений.
Заметьте, что первый аргумент функции будет ссылка на вложенное представление приславшее это событие.

```js
// childView запускает событие `show:message`
var ChildView = Marionette.ItemView.extend({

  // в хеше `events`  определили локальный обработчик `onClickButton` события клика
  events: {
    'click .button': 'onClickButton'
  },

  // хеш triggers позволяет конвертировать DOM события напрямую в события перехватываемые родителем 
  triggers: {
    'submit form': 'submit:form'
  },

  onClickButton: function () {
    // оба `trigger` and `triggerMethod` события будут перехвачены родителем
    this.trigger('show:message', 'foo');
    this.triggerMethod('show:message', 'bar');
  }
});

// родительское представление использует `childEvents` настройки, для обработки событий вложенного представления
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
  // создаем список опций для `childView` класса
  var options = _.extend({model: child}, childViewOptions);
  //инстанцируем класс представления
  var view = new ChildViewClass(options);
  // возращаем его
  return view;
},
```

### CollectionView's `addChild`

Метод `addChild` отвечает за рендеринг `childViews` и добавления в HTML `collectionView` представления. Также, он отвечает за 
передачу событий от `ChildView`. Чаще всего, вам не нужно его переопределять. Но, если хотите, то можно. Примерно так:

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
Если эта опция активна,  то пересортировка `Collection` не будет требовать перерисовки, а произойдет только переупорядочивание DOM узлов.
Это может быть проблемой, если `ChildView` используют свой индекс в коллекции для рендеринга. В этом случае, вы не сможете
использовать эту опцию, так как вам придется перерендерить каждую `ChildView`.

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
    // логика выбора "пустого" представления
    return NoChildrenView;
  }
});
```

### CollectionView's `isEmpty`

Если нужно контролировать, когда отображается пустое представление, определите `isEmpty`:

```js
Marionette.CollectionView.extend({
  isEmpty: function(collection) {
    // логика определения, что отображаемая коллекция "пустая"
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

## Callback методы


Есть несколько кэлюек методов определенных в `CollectionView`. Если они определены, то будут вызываться базовыми методами
представления. Эти методы предназначены для использования внутри представления.


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

После рендеринга представления, вызовится метод  `onRender`. Можно определить этот метод, для связывания вашего кода
с отображенными элементами.

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

## CollectionView события


Есть несколько событий, что вызываются в течении жизненного цикла `collectionView`. Каждое такое событие  вызывается
функцией `triggerMethod` (подробнее  можно прочитать тут [Marionette.triggerMethod](./marionette.functions.md#marionettetriggermethod) )
и связано с соответсвующим `on{EventName}` методом инстанса представления (дополнительная информмация [above](#callback-methods)).

### "before:render" событие


Вызывается непосредственно перед рендерингом представления.
Также триггерится, как `collection:before:render` / `onCollectionBeforeRender` 

```js
var MyView = Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("before:render", function(){
  alert("the collection view is about to be rendered");
});

myView.render();
```

### "render" событие

Также будет вызываться событие "render:collection" / `onRenderCollection`. Это позволит вам запускать больше чем один кэлбек
после рендеринга представления, и позволит родительскому представлению и другим частям приложения узнать, что  представление
отрисовалось.

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

Когда `reorderOnSort` установленно в `true`, это событие будет вызываться перед/после реорганизацией коллекции.

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

Вызывается сразу после удаления представления, вместе с вызовом соответсвующих методов.

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

### "childview:\*" всплытие событий от вложенных представлений

Когда вложенное представление  вызывает событие, это событие будет всплывать к родителю с префиксом `childview:` 
в имени события

Пэтому, если ребенок триггерит "do:something", родительское представление стриггерит "childview:do:something" 

```js
// создаем простую коллекцию
var myModel = new MyModel();
var myCollection = new MyCollection();
myCollection.add(myModel);

var MyItemView = Marionette.ItemView.extend({
  triggers: {
    'click button': 'do:something' // отсылаем родителю событие `do:something` при клике
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

### before:render:collection событие

`before:render:collection` событие вызывается прежде чем дети  `collectionView` будут отрендерены и закешированны.
Отличается от `collectionsView  -> before:render` тем, что вызывается только, если  `collection` не пустая.

### render:collection событие

`render:collection` вызывается после того, как дети отрендерятся и закешируются.
Отличается от `collectionsView -> render` тем, что вызывается только, если  `collection` не пустая. 

## CollectionView события от вложенных представлений


Следующие события  всплывают от вложенных представлений в процессе своего жизненного цикла (происходящего в течении `Region#show`)

* `before:render` / `onBeforeRender` - Вызывается прежде, чем вложенное представление отрендерится.
* `render` / `onRender` - Вызывается после рендеринга представления, но до добавления его в DOM
* `before:show` / `onBeforeShow` - Вызывается после рендеринга представления, но перед его "включением"  в `collectionView` представление.
* `before:attach` / `onBeforeAttach` - Вызывается перед добавлением в DOM. Не будет вызываться, если  `collectionView` не присоединен в DOM.
* `attach` / `onAttach` -  Вызывается после добавления в DOM. Не будет вызываться, если  `collectionView` не присоединен в DOM.
* `show` / `onShow` - Вызывается когда представление отрендерено и "включено" в `collectionView`.
* `dom:refresh` / `onDomRefresh` - Вызывается когда представление отрендерено и показано, но только, если включено в DOM.  Не будет вызываться, если  `collectionView` не присоединен в DOM.
* `before:destroy` / `onBeforeDestroy` - Вызывается перед удалением представления. 
* `destroy` / `onDestroy` - Вызывается после удаления представления.

Note: `render`, `destroy`, and `dom:refresh` are triggered on pure Backbone Views during child view rendering,
 but for a complete implementation of these events the Backbone View should fire `render` within `render()` and 
 `destroy` within `remove()` as well as set the following flags:

```js
view.supportsRenderLifecycle = true;
view.supportsDestroyLifecycle = true;
```

## CollectionView рендеринг

Метод `render` отвечает за рендеринг всей коллекции. Проходит по каждой моделе в коллекции и рендерит его индивидуально, 
как `childView`.

```js
var MyCollectionView = Marionette.CollectionView.extend({...});

// все вложенные представления будут отрендерены
new MyCollectionView().render();
```

## CollectionView: Автоматический рендеринг

`collection view` связывается с  "add", "remove" и "reset" событиями своей коллекции.

Когда коллекция сбрасывается ( "reset"), представление вызовет `render` в себе и перерисует всю коллекцию.

При добавлении модели в коллекцию, будет сформированно представление этой модели и добавленно в коллекцию вложенным представлением.

Удаление модели из колллекции, вызовет уделние  его из вложеного представления.

## CollectionView: перерендеривание

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

CollectionView позволяет  определить опцию`viewComparator`, если вы хотите отрисовывать вложенные представления в ином сортированном порядке, 
отличном от сортировки в `collection` 

```js
  var cv = new MarionetteCollectionView({
    collection: someCollection,
    viewComparator: 'otherFieldToSortOn'
  });
```

`viewComparator` может взять любой доступный `Backbone.Collection` [comparator formats](http://backbonejs.org/#Collection-comparator)
Например, `sortBy` (функция принимающая один аргумент), или `sort` (функция-компаратор, принимающая 2 аргумента),
или строку, указывающую на атрибут по которому идет сортировка.

## CollectionView's `filter`

Опция `filter` позволяет не рендерить некоторые модели коллекции. Фильтр возращает истину, если ребенок будет отрисован, и 
ложь,  если не будет.

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

  // рендерим представления с '2' и '4'
  cv.render();

  // изменяем фильтр
  cv.filter = function (child, index, collection) {
    return child.get('value') % 2 !== 0;
  };

  // рендерим представления с '1' и '3'
  cv.render();

  // удаляем фильтр
  // обратите внимание. что использование `delete cv.filter` приведет к использованию `filter` определенному в прототипах,
  // что может быть не уместно
  cv.filter = null;

  //рендерим все представления
  cv.render();
```


## CollectionView's children

The `CollectionView` использует [Backbone.BabySitter](https://github.com/marionettejs/backbone.babysitter) для хранения и управления
своими вложенными представлениями. Это позволяет вам иметь легкий доступ к представлениям внутри CollectionView, итерировать их,
искать по индексу и т.д.

```js
var cv = new Marionette.CollectionView({
  collection: someCollection
});

cv.render();

// получаем представление по модели
var v = cv.children.findByModel(someModel);

// итерируем по всем вложенным представления и взаимодействем с каждой
cv.children.each(function(view){

  // взаимодействем с представлением

});
```

Подробнее можно прочитать тут [Backbone.BabySitter documentation](https://github.com/marionettejs/backbone.babysitter).

## CollectionView destroy

`CollectionView` реализует метод `destroy`, вызываемый менеджером регионов автоматически. Как часть реализации, будет
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