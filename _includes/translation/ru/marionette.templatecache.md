`TemplateCache` предоставляет кэш для шаблонов, которые хранятся внутри тегов
`script` вашей HTML-разметки. Это позволяет увеличить скорость получения
шаблона при последующих обращениях к нему.

## Содержание

* [Основное применение](#basic-usage)
* [Удаление записей из кэша](#clear-items-from-cache)
* [Настройка способа доступа к шаблонам](#customizing-template-access)
* [Переопределение способа получения шаблона](#override-template-retrieval)
* [Переопределение способа компиляции шаблонов](#override-template-compilation)

## <a name="basic-usage"></a> Основное применение

Нет необходимости самостоятельно создавать экземпляры класса `TemplateCache`,
достаточно просто вызывать метод `get`. `TemplateCache` внутри себя создаст и будет
хранить новый экземпляр. Метод `get` вернет скомпилированный шаблон в виде функции.

```js
var template = Marionette.TemplateCache.get("#my-template");
// использование шаблона
template({param1:'value1', paramN:'valueN'});
```

При первом обращении шаблон будет получен из DOM и сохранен в кэше.
При последующих обращениях шаблон будет отдаваться уже из кэша.

### <a name="clear-items-from-cache"></a> Удаление записей из кэша

Вы можете удалить одну, несколько или все записи из кеша с помощью метода `clear`.

Удаление шаблона из кэша приведет к принудительной перезагрузки его из DOM
(с помощью метода `loadTemplate`, который можно переопределить, см. далее)
при следующем запросе шаблона.

Если метод `clear` вызывается без параметров, то будут удалены все записи кэша шаблонов:

```js
Marionette.TemplateCache.get("#my-template");
Marionette.TemplateCache.get("#this-template");
Marionette.TemplateCache.get("#that-template");

// удаление всех шаблонов из кэша
Marionette.TemplateCache.clear()
```

Если вы укажете один и более параметров, то они будут трактоваться как `templateId`, который используется при загрузке / кэшировании шаблонов:

```js
Marionette.TemplateCache.get("#my-template");
Marionette.TemplateCache.get("#this-template");
Marionette.TemplateCache.get("#that-template");

// удаление 2 из 3 шаблонов из кэша
Marionette.TemplateCache.clear("#my-template", "#this-template");
```

## <a name="customizing-template-access"></a> Настройка способа доступа к шаблонам

Если есть необходимость использования альтернативного движка шаблонов, сохранив при этом
функциональность кеширования, или настройки хранения и получения шаблонов из кэша,
то следует настроить объект `TemplateCache`.

По умолчанию `TemplateCache` запрашивает шаблоны из DOM (согласно значению атрибута id элемента,
который содержит в себе код шаблона) и компилирует их в HTML-разметку с помощью метода `template`
из библиотеки [underscore.js](http://underscorejs.org/#template).

### <a name="override-template-retrieval"></a> Переопределение способа получения шаблона

По умолчанию для поиска шаблона в DOM и получения его разметки используется jQuery. Для изменения
способа получения шаблона следует переопределить метод `loadTemplate` объекта `TemplateCache`:

```js
Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {
  // загрузка шаблона, возврат данных, которые требуются методу compileTemplate
  // Например, ваша собственная функция которая создает шаблон на основании
  // значения параметра templateId
  var myTemplate = myTemplateFunc(templateId);

  // возврат шаблона
  return myTemplate;
}
```

### <a name="override-template-compilation"></a> Переопределение способа компиляции шаблонов

При компиляции шаблона результаты работы метода `loadTemplate` передаются в метод `compileTemplate`,
который в свою очередь возвращает скомпилированный шаблон в виде функции. При переопределении метода
`compileTemplate` следует помнить о том, что этот метод должен возвращать функцию, которая в качестве
параметров принимает объект с данными шаблона и возвращает HTML-разметку в виде строки.

```js
Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
  // использование Handlebars.js для компиляции шаблона
  return Handlebars.compile(rawTemplate);
}
```


