Объект `Renderer` был извлечен из процесса рендеринга `ItemView` с целью создать консистентный и переиспользуемый 
способ рендеринга шаблонов с данными и без.

## Содержание

* [Основное применение](#basic-usage)
* [Предварительно скомпилированные шаблоны](#pre-compiled-templates)
* [Custom Template Selection And Rendering](#custom-template-selection-and-rendering)
* [Использование предварительно скомпилированных шаблонов](#using-pre-compiled-templates)

## Основное применение

Основное применение `Renderer` заключается в вызове метода `render`. Этот метод возвращает строку, содержащую результат 
наложения объекта данных `data` на шаблон `template`.

```js
var template = "#some-template";
var data = {foo: "bar"};
var html = Backbone.Marionette.Renderer.render(template, data);

// какие-то манипуляции с HTML
```

Если в качестве параметра `template` передать "лживое" значение, то метод `render` сгенерирует исключение о том, что шаблон не был указан.

## Предварительно скомпилированные шаблоны

Если параметр `template` функции `render` сам является функцией, то `Renderer` рассматривает его как предварительно скомпилированный
шаблон и не пытается его скомпилировать снова. Это позволяет любому представлению, которое поддерживает параметр `template`, задавать 
функцию предварительно скомпилированного шаблона в качестве значения для параметра `template`.

```js
var myTemplate = _.template("<div>foo</div>");
Backbone.Marionette.ItemView.extend({
  template: myTemplate
});
```

Это функция не должна иметь какой-либо движок шаблонов. Она должна быть просто функцией, которая возвращает валидный HTML в виде строки
согласно значению аргумента `data`, которое было передано в функцию.

## Custom Template Selection And Rendering

By default, the renderer will take a jQuery selector object as
the first parameter, and a JSON data object as the optional
second parameter. It then uses the `TemplateCache` to load the
template by the specified selector, and renders the template with
the data provided (if any) using Underscore.js templates.

If you wish to override the way the template is loaded, see
the `TemplateCache` object. 

If you wish to override the template engine used, change the 
`render` method to work however you want:

```js
Backbone.Marionette.Renderer.render = function(template, data){
  return $(template).tmpl(data);
});
```

Эта реализация заменит используемый по умолчанию рендеринг с помощью Underscore.js 
на рендеринг с помощью шаблонов jQuery.

Если вы переопределите метод `render` и захотите использовать механизм `TemplateCache`, то не забудьте включить код, 
необходимый для получения шаблона из кэша: 

```js
Backbone.Marionette.Renderer.render = function(template, data){
  var template = Marionette.TemplateCache.get(template);
  // Какие-то действия с шаблоном
};
```

## Использование предварительно скомпилированных шаблонов

Вы легко можете заменить стандартный рендеринг шаблонов на предварительно скомпилированные шаблоны, 
например, те, которые предусмотрены плагинами JST или TPL для AMD/RequireJS.

Чтобы сделать это, просто переопределите метод `render` на метод, который вернет исполняемый шаблон с данными.

```js
Backbone.Marionette.Renderer.render = function(template, data){
  return template(data);
};
```

Затем вы можете указать функцию предварительно скомпилированного шаблона как значение атрибута `template` вашего 
представления:

```js
var myPrecompiledTemplate = _.template("<div>some template</div>");

Backbone.Marionette.ItemView.extend({
  template: myPrecompiledTemplate
});
```