Marionette содержит набор утилит / функций-хелперов, которые используются для упрощения работы с общими сценариями в 
рамках всего фреймворка. Эти функции могут быть полезны тем, кто разрабатывает приложения на основе Marionette, так как 
они позволяют получить те же поведения и конвенции (соглашения) в вашем собственном коде.

## Documentation Index

* [Marionette.extend](#marionetteextend)
* [Marionette.getOption](#marionettegetoption)
* [Marionette.proxyGetOption](#marionetteproxygetoption)
* [Marionette.triggerMethod](#marionettetriggermethod)
* [Marionette.bindEntityEvents](#marionettebindentityevents)
* [Marionette.unbindEntityEvents](#marionetteunbindentityevents)
* [Marionette.proxyBindEntityEvents](#marionetteproxybindentityevents)
* [Marionette.normalizeMethods](#marionettenormalizemethods)
* [Marionette.normalizeUIKeys](#marionettenormalizeuikeys)
* [Marionette.actAsCollection](#marionetteactascollection)

## Marionette.extend

Функция `extend` из Backbone является весьма полезной и используется в разных местах в Marionette. Для того, чтобы 
сделать использование этой функции более консистентным (последовательным) для нее был создани алиас `Marionette.extend`. 
Это позволяет получить дополнительную функциональность для ваших объектов без долгих раздумий над тем, 
из какой сущности получить эту функцию, будь то Backbone.View, Backbone.Model или другой объект из Backbone.

```js
var Foo = function(){};

// Используем Marionette.extend чтобы сделать Foo расширяемой  
// точно так же как и другие объекты Backbone и Marionette
Foo.extend = Marionette.extend;

// Теперь Foo может быть расширена для создания нового класса с методами
var Bar = Foo.extend({

  someMethod: function(){ ... }

  // ...
});

// Создаем экземпляр Bar
var b = new Bar();
```

## Marionette.getOption

Метод позволяет получить значение параметра объекта. Этот параметр может принадлежать как самому объекту непосредственно, 
так и быть вложенным в свойстве `options` объекта. Если запрашиваемый параметр существует и в объекте и в `options`, то 
метод вернет значение из `options`.

```js
var M = Backbone.Model.extend({
  foo: "bar",

  initialize: function(){
    var f = Marionette.getOption(this, "foo");
    console.log(f);
  }
});

new M(); // => "bar"

new M({}, { foo: "quux" }); // => "quux"
```

Этот метод удобно применять при создании объекта, имеющего набор конфигурируемых параметров, которые могут принадлежать 
как самому объекту, так и быть параметрами конструктора объекта.

### Лживые значения

Функция `getOption` вернет из `options` любое отличное от `undefined` лживое значение запрашиваемого параметра. 
Если `options` объекта имеет неопределенное значение (`undefined`) запрашиваемого параметра, то функция 
попытается прочитать его значение из объекта напрямую.

Например:

```js
var M = Backbone.Model.extend({
  foo: "bar",

  initialize: function(){
    var f = Marionette.getOption(this, "foo");
    console.log(f);
  }
});

new M(); // => "bar"

var f;
new M({}, { foo: f }); // => "bar"
```

В этом примере, оба раза будет получена строка "bar", так как во втором случае значение переменной `f` будет неопределено, 
то есть `undefined`.

## Marionette.proxyGetOption

Этот метод замещает `Marionette.getOption` таким образом, что `Marionette.getOption` может быть легко добавлен к объекту.

Предположим, что вы написали свой собственный класс Pagination и всегда передаете параметры в него.
С помощью `proxyGetOption` вы легко можете предоставить этому классу функцию `getOption`.

```js
_.extend(Pagination.prototype, {

  getFoo: function(){
    return this.getOption("foo");
  },

  getOption: Marionette.proxyGetOption
});
```

## Marionette.triggerMethod

Инициирует событие и запускает соотвествующий метод целевого объекта.

Когда метод инициирован, первая буква каждой секции из названия события становится прописной, к в начало полученного имени 
добавляется предлог "on". Например:

* `triggerMethod("render")` запускает функцию "onRender"
* `triggerMethod("before:destroy")` запускает функцию "onBeforeDestroy"

Все аргументы, которые были переданы в вызов triggerMethod, будут переданы и в событие и в метод, за исключением имени 
события. Например, `triggerMethod("foo", bar)` вызовет `onFoo: function(bar){...})`.

Обратите внимание, что `triggerMethod` может быть вызван на объектах, к которым не был примешан объект `Backbone.Events`.
Эти объекты не будут иметь метода `trigger` и не будет никакой попытки вызова `.trigger()`. При этом все методы `on{Name}` 
будут вызываться по-прежнему.

## Marionette.bindEntityEvents

Этот метод используется для привязки сущностей backbone (например, collection или model) к методам целевого объекта.

```js
Backbone.View.extend({

  modelEvents: {
    "change:foo": "doSomething"
  },

  initialize: function(){
    Marionette.bindEntityEvents(this, this.model, this.modelEvents);
  },

  doSomething: function(){
    // Событие "change:foo" было поймано от model
    
    // Сюда можно поместить код, который будет реагировать 
    // на это событие соответствующим образом
  }

});
```

Первый параметр `target` должен иметь метод `listenTo` из объекта EventBinder. Второй параметр это сущность (Backbone.Model 
или Backbone.Collection), к событиям кототорой будет сделана привязка. Третий параметр это хэш `{ "event:name": "eventHandler" }`. 
В хэше имена нескольких обработчиков следует отделять пробелами. Также, вместо имени обработчика можно использовать функцию.

## Marionette.unbindEntityEvents

Этот метод используется для отвязки обработчиков событий от сущностей backbone (например, collection или model). Этот метод
протиположен методу `bindEntityEvents`, описанному выше. Следовательно, API обоих методов идентичны.

```js
// Точно так же, как и в примере выше, мы привязываем события к модели.
// Одноко, в этом случае, мы отвяжем их при закрытии.
Backbone.View.extend({

  modelEvents: {
    "change:foo": "doSomething"
  },

  initialize: function(){
    Marionette.bindEntityEvents(this, this.model, this.modelEvents);
  },

  doSomething: function(){
    // Событие "change:foo" было поймано от model
        
    // Сюда можно поместить код, который будет реагировать 
    // на это событие соответствующим образом
  },

  onClose: function() {
    Marionette.unbindEntityEvents(this, this.model, this.modelEvents);
  }

});
```

## Marionette.proxyBindEntityEvents

Этот метод замещает `Marionette.bindEntityEvents` таким образом, что `Marionette.bindEntityEvents` может быть легко добавлен к объекту.

Предположим, что вы написали свой собственный класс Pagination и хотите следить за некоторыми событиями.
С помощью `proxyBindEntityEvents` вы легко можете предоставить этому классу функцию `bindEntityEvents`.

```js
_.extend(Pagination.prototype, {

   bindSomething: function() {
     this.bindEntityEvents(this.something, this.somethingEvents)
   },

   bindEntityEvents: Marionette.proxyBindEntityEvents

});
```

## Marionette.normalizeMethods

Получает хэш, состоящий из имен событий и функций и/или имен функций, и возвращает тот же хэш, в котором имена функций 
заменены ссылками на сами функции.   

Эта функция по умолчанию добавлена в протитип `Marionette.View`. Для использования ее в классах, которые не являются 
view-классами (`ItemView`, `LayoutView` и др., так как они наследуют `Marionette.View`), необходимо самостоятельно ее добавить в прототип.

```js
var View = Marionette.ItemView.extend({

  initialize: function() {
    this.someFn = function() {};
    this.someOtherFn = function() {};
    var hash = {
      eventOne: "someFn", // Станет ссылкой на `this.someFn`
      eventTwo: this.someOtherFn
    };
    this.normalizedHash = this.normalizeMethods(hash);
  }

});
```

## Marionette.normalizeUIKeys

Этот метод позволяет использовать синтаксис `@ui.` внутри указанного ключа для хэшей триггеров и событий.  
Метод меняет местами ссылку `@ui.` и соответствующий селектор.

```js
var hash = {
  'click @ui.list': 'myCb'
};

var ui = {
  'list': 'ul'
};

// В результате ключ 'click @ui.list' станет 'click ul' в объекте newHash
var newHash = Marionette.normalizeUIKeys(hash, ui);
```

## Marionette.actAsCollection

Это утилита предназначена для добавления поведения коллекций из Underscore к объекту.

Утилита принимает объект и свойство объекта, в примере - `list`, и добавляет к объекту фукнции коллекций таким образом, что 
объект может делегировать вызовы коллекции к своему свойству `list`.  

#### Литерал объекта
```js
var obj = {
  list: [1, 2, 3]
}

Marionette.actAsCollection(obj, 'list');

var double = function(v){ return v*2};
console.log(obj.map(double)); // [2, 4, 6]
```

#### Прототип функции
```js
var Func = function(list) {
  this.list = list;
};

Marionette.actAsCollection(Func.prototype, 'list');
var func = new Func([1,2,3]);

var double = function(v){ return v*2};
console.log(func.map(double)); // [2, 4, 6]
```

Первый параметр это объект, который будет делегировать методы коллекций из Underscore. Второй параметр это свойство 
объекта, которое будет хранить `list`.
