Менеджеры регионов предоставляют согласованный способ управления
несколькими объектами `Marionette.Region` в приложении.
`RegionManager` предназначен для использования в других объектах,
он облегчает добавление, хранение, поиск и удаление регионов из этих объектов.
Для примера того, как менеджер регионов может быть использован, можно посмотреть реализацию
объектов [Marionette.Application](../application/) и [Marionette.LayoutView](../layoutview/).

## Содержание

* [Основное применение](#basic-use)
* [RegionManager.addRegion](#regionmanageraddregion)
* [RegionManager.addRegions](#regionmanageraddregions)
  * [Параметры по умолчанию в addRegions](#addregions-default-options)
* [RegionManager.get](#regionmanagerget)
* [RegionManager.getRegions](#regionmanagergetregions)
* [RegionManager.removeRegion](#regionmanagerremoveregion)
* [RegionManager.removeRegions](#regionmanagerremoveregions)
* [RegionManager.emptyRegions](#regionmanageremptyregions)
* [RegionManager.destroy](#regionmanagerdestroy)
* [События RegionManager-а](#regionmanager-events)
  * [Событие before:add:region](#beforeaddregion-event)
  * [Событие add:region](#addregion-event)
  * [Событие before:remove:region](#beforeremoveregion-event)
  * [Событие remove:region](#removeregion-event)
* [RegionManager Iterators](#regionmanager-iterators)

## Основное применение

Экземпляр `RegionManager`-а может быть создан напрямую, а для добавления
и удаления регионов используются специальные методы:

```js
var rm = new Marionette.RegionManager();

var region = rm.addRegion("foo", "#bar");

var regions = rm.addRegions({
  baz: "#baz",
  quux: "ul.quux"
});

regions.baz.show(myView);

rm.removeRegion("foo");
```

## RegionManager.addRegion

Регионы могут добавляться по отдельности с помощью метода `addRegion`.
Этот метод принимает два параметра: название региона и определение региона.

```js
var rm = new Marionette.RegionManager();

var region = rm.addRegion("foo", "#bar");
```

В этом примере, регион названый "foo" будет добавлен в экземпляр менеджера регионов `RegionManager`.
Регион определен как jQuery-cелектор, который будет искать по `#bar` соответствующий элемент в DOM.

Существует много других способов определить регион, в том числе в виде
литерал объекта с различными опциями, а также экземпляр объекта `Region`.
Больше информации об этом можно узнать в документации по [Marionette.Region](../region/).

## RegionManager.addRegions

Регионы также могут быть добавлены пачкой (en-masse) с помощью метода `addRegions`.
Этот метод принимает литерал объекта или функцию, которая возвращает литерал объекта.
Литерал объекта должен содержать названия регионов как ключи и определения регионов как значения.
Метод `addRegions` возвращает литерал объекта со всеми созданными регионами.

```js
var rm = new Marionette.RegionManager();

// С помощью литерал объекта
var regions = rm.addRegions({
  main: '#main-content',
  navigation: {
    selector: '#navigation',
    regionClass: MyNavRegion
  }
});

// С помощью функции
var otherRegions = rm.addRegions(function(regionDefinition) {
  return {
    footer: '#footer'
  };
});

regions.main;        //=> 'main' экземпляр региона
regions.navigation;  //=> 'navigation' экземпляр региона
otherRegions.footer; //=> 'footer' экземпляр региона
```

Если вы передаете функцию в `addRegions`, то она будет вызвана
с контекстом экземпляра объекта `RegionManager` и со всеми аргументами,
переданными в `addRegions`.

```js
var rm = new Marionette.RegionManager();

var regionDefaults = {
  regionClass: MyRegionClass
};

rm.addRegions(function(regionDefinition, defaults) {
  console.log(this);             // `rm` экземпляр объекта `RegionManager`
  console.log(regionDefinition); // функция определения регионов
  console.log(defaults);         // объект `{ regionClass: MyRegionClass }`

  // ...возвращает определение регионов в виде литерал объекта
}, regionDefaults);
```

### Параметры по умолчанию в addRegions

При добавлении множества регионов может быть полезным
возможность задать параметры по умолчанию, которые будут передаваться
всем добавляемым регионам. Это может быть сделано с помощью
параметра `defaults`. Задается этот параметр в виде литерал объекта
с парами `ключ: значение`, которые будут передаваться в каждый добавляемый регион.

```js
var rm = new Marionette.RegionManager();

var defaults = {
  regionClass: MyRegionClass
};

var regions = {
  foo: "#bar",
  baz: "#quux"
};

rm.addRegions(regions, defaults);
```

В этом примере, все регионы будут добавлены как экземпляры объекта `MyRegionClass`.

## RegionManager.get

Экземпляр региона может быть получен у экземпляра объекта `RegionManager`
через вызов метода `get` и передачей в этот метод названия региона.

```js
var rm = new Marionette.RegionManager();
rm.addRegion("foo", "#bar");

var region = rm.get("foo");
```

## RegionManager.getRegions

Метод `getRegions` позволяет получить все регионы у менеджера регионов.
Этот метод возвращает литерал объекта с названиями регионов в качестве атрибутов.

```js
var rm = new Marionette.RegionManager();
rm.addRegion("foo", "#foo");
rm.addRegion("bar", "#bar");

var regions = rm.getRegions();

regions.foo; //=> foo регион
regions.bar; //=> bar регион
```

## RegionManager.removeRegion

Регион можно удалить, вызвав метод `removeRegion` и передав в этот метод название региона.

```js
var rm = new Marionette.RegionManager();
rm.addRegion("foo", "#bar");

rm.removeRegion("foo");
```

Регион имеет метод `empty`, который будет вызван прежде, чем
регион будет удален из экземпляра объекта `RegionManager`, а также перед вызовом
метода `stopListening`.

## RegionManager.removeRegions

Вы можете быстро удалить все регионы из экземпляра объекта `RegionManager`,
вызвав метод `removeRegions`.

```js
var rm = new Marionette.RegionManager();
rm.addRegions({
  foo: "#foo",
  bar: "#bar",
  baz: "#baz"
});

rm.removeRegions();
```

Этот метод очистит все регионы и удалит их.

## RegionManager.emptyRegions

Вы можете быстро очистить все регионы у экземпляра объекта `RegionManager`,
вызвав метод `emptyRegions`.

```js
var rm = new Marionette.RegionManager();
rm.addRegions({
  foo: "#foo",
  bar: "#bar",
  baz: "#baz"
});

rm.emptyRegions();
```

Этот метод очистит регионы без удаления их из экземпляра объекта `RegionManager`.

## RegionManager.destroy

Экземпляр объекта `RegionManager` может быть полностью уничтожен вызовом метода `destroy`.
Этот метод уничтожит экземпляр объекта `RegionManager` и 
удалит все регионы из этого экземпляра объекта `RegionManager`.

```js
var rm = new Marionette.RegionManager();
rm.addRegions({
  foo: "#foo",
  bar: "#bar",
  baz: "#baz"
});

rm.destroy();
```

## События RegionManager-а

`RegionManager` генерирует различные события в процессе своего использования.

### Событие before:add:region

`RegionManager` генерирует событие "before:add:region" перед тем,
как регион будет добавлен в менеджер регионов. Это позволяет вам 
добавить выполнение некоторого действия для региона перед его добавлением.

```js
var rm = new Marionette.RegionManager();

rm.on("before:add:region", function(name, region) {
  // что-то делает с экземпляром региона
});

rm.addRegion("foo", "#bar");
```

### Событие add:region

`RegionManager` генерирует событие "add:region", когда регион
добавлен в менеджер регионов. Это событие позволяет вам сразу использовать
экземпляр региона или добавить регион в объект, который нуждается в ссылке на него:

```js
var rm = new Marionette.RegionManager();

rm.on("add:region", function(name, region) {

  // добавляем экземпляр региона в объект
  myObject[name] = region;

});

rm.addRegion("foo", "#bar");
```

### Событие before:remove:region

`RegionManager` генерирует событие "before:remove:region" перед тем, как
регион будет удален из менеджера регионов. Это событие позволяет вам выполнить
любые операции очистки перед тем, как регион удалится.

```js
var rm = new Marionette.RegionManager();

rm.on("before:remove:region", function(name, region) {
  // сделать что-то с экземпляром региона
});

rm.addRegion("foo", "#bar");

rm.removeRegion("foo");
```

### Событие remove:region

`RegionManager` генерирует событие "remove:region", когда регион 
удален из менеджера регионов. Это событие позволяет вам использовать
экземпляр региона в последний раз или удалить регион из объекта, 
который имеет на него ссылку:

```js
var rm = new Marionette.RegionManager();

rm.on("remove:region", function(name, region) {
  // удаляем экземпляр региона из объекта
  delete myObject[name];
});

rm.addRegion("foo", "#bar");

rm.removeRegion("foo");
```

## RegionManager Iterators

The RegionManager has several methods for iteration
attached to it, from underscore.js. This works in the
same way as the Backbone.Collection methods that have
been imported. For example, you can easily iterate over
the entire collection of region instances by calling
the `each` method:

```js
var rm = new Marionette.RegionManager();

rm.each(function(region) {
  // do stuff w/ the region instance here
});
```

The list of underscore methods includes:

* forEach
* each
* map
* find
* detect
* filter
* select
* reject
* every
* all
* some
* any
* include
* contains
* invoke
* toArray
* first
* initial
* rest
* last
* without
* isEmpty
* pluck
