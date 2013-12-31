# Marionette.commands (В процессе перевода)

An application level command execution system. This allows components in
an application to state that some work needs to be done, but without having
to be explicitly coupled to the component that is performing the work.

No response is allowed from the execution of a command. It's a "fire-and-forget"
scenario.

Facilitated by [Backbone.Wreqr](https://github.com/marionettejs/backbone.wreqr)'s 
Commands object.

## Содержание

* [Добавление команды](#register-a-command)
* [Выполнение команды](#execute-a-command)
* [Удаление / замена команды](#remove--replace-commands)

## Добавление команды

Для добавления команды использутеся метод `App.commands.setHandler`, который имеет два параметра - имя команды и метод-обработчик.

```js
var App = new Marionette.Application();

App.commands.setHandler("foo", function(bar){
  console.log(bar);
});
```

## Выполнение команды

Для выполнения команды служит метод `App.commands.execute` (или его короткая запись `App.execute`), аргументами которого являются имя выполняемой команды и набор требуемых параметров:

```js
App.execute("foo", "baz");
// outputs "baz" to the console, from command registered above
```

## Удаление / замена команды

Для удаления команды используется метод `App.commands.removeHandler`, параметром которого является имя удаляемой команды.

Метод `App.commands.removeAllHandlers()` позволяет удалить все команды.

Чтобы заменить команду достаточно для ее имени определить новый обработчик. Для одного имени может быть определен только один обработчик команды.