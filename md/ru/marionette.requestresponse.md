# Marionette.RequestResponse (В процессе перевода)

An application level request/response system. This allows components in
an application to request some information or work be done by another
part of the app, but without having to be explicitly coupled to the 
component that is performing the work.

A return response is expected when making a request.

Facilitated by [Backbone.Wreqr](https://github.com/marionettejs/backbone.wreqr)'s 
RequestResponse object.

## Содержание

* [Добавление обработчика запроса](#register-a-request-handler)
* [Получение ответа на запрос](#request-a-response)
* [Удаление / замена обработчика запроса](#remove--replace-a-request-handler)

## Добавление обработчика запроса

Для добавления запроса использутеся метод `App.reqres.setHandler`, который имеет два параметра - имя запроса и метод-обработчик.

```js
var App = new Marionette.Application();

App.reqres.setHandler("foo", function(bar){
  return bar + "-quux";
});
```

## Получение ответа на запрос

Для выполнения запроса служит метод `App.reqres.request` (или его коротка запись `App.request`), аргументами которого являются имя выполняемого запроса и набор требуемых параметров:

```js
App.request("foo", "baz"); // => returns "baz-quux"
```

## Удаление / замена обработчика запроса

Для удаления запроса используется метод `App.reqres.removeHandler`, параметром которого является имя удаляемого запроса.

Метод `App.reqres.removeAllHandlers()` позволяет удалить все запросы.

Чтобы заменить запрос достаточно для его имени определить новый обработчик. Для одного имени запроса может быть определен только один обработчик.