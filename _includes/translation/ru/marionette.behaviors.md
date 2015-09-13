`Marionette.Behaviors` является вспомогательным классом, который берет на себя задачу присоединить экземпляры ваших [поведений](../behavior/) к нужным представлениям.
Наиболее важной частью этого класса является то, что вы **должны** переопределить метод класса `behaviorsLookup` или
установить свойство `behaviorClass` для корректной работы.

## Содержание

* [API](#api)
  * [Метод behaviorsLookup](#behaviorslookup)
  * [Метод getBehaviorClass](#getbehaviorclass)
  * [Свойство behaviorClass](#behaviorclass)

## <a name="api"></a> API

Есть два метода класса, которые вы можете переопределить в классе `Behaviors`. Остальная часть класса связана
с деталями реализации представлений.

### <a name="behaviorslookup"></a> Метод behaviorsLookup

Этот метод определяет место, где хранятся классы ваших поведений. Самая простая реализация может выглядит
следующим образом.

```js
Marionette.Behaviors.behaviorsLookup = function() {
  return window.Behaviors;
}
```

По умолчанию поведения ищутся по значению ключа из behaviors-хэша определенного в представлениях.

В данном примере (с использованием реализации метода `getBehaviorClass` по умолчанию) ваш код будет ожидать, что
следующие поведения будут находиться в `window.Behaviors.CloseWarn` и `window.Behaviors.ToolTip`

```js
var MyView = Marionette.ItemView.extend({
  behaviors: {
    CloseWarn: {
      message: "you are closing all your data is now gone!"
    },
    
    ToolTip: {
      text: "what a nice mouse you have"
    }
  }
});
```

### <a name="getbehaviorclass"></a> Метод getBehaviorClass

Этот метод имеет реализацию по умолчанию, которую можно легко переопределить. Он отвечает за поиск нужного
поведения в месте указанном в `Behaviors.behaviorsLookup` или другом месте.

```js
getBehaviorClass: function(options, key) {
  if (options.behaviorClass) {
    return options.behaviorClass;
  }

  return Behaviors.behaviorsLookup[key];
}
```

### <a name="behaviorclass"></a> Свойство behaviorClass

Это свойство позволяет указывать конкретный класс поведения (в обход нормальному поиску по ключу). 
Это полезно, когда поведение является зависимостью (dependency) представления через [requirejs](http://requirejs.org/). 
Свойства, переданные этим способом, будут использованы в методе `getBehaviorClass`.

```js
define(['marionette', 'lib/tooltip'], function(Marionette, Tooltip) {
  var View = Marionette.ItemView.extend({
    behaviors: {
      Tooltip: {
        behaviorClass: Tooltip,
        message: "hello world"
      }
    }
  });
});
```
