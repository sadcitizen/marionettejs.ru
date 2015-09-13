Класс `Behavior` (поведение) это изолированный набор взаимодействий пользователя с DOM, 
который может быть примешан к любому `View`. &laquo;Поведения&raquo; позволяют вынести сложные куски кода 
со специфическим взаимодействием из `View` в портативные логические куски, 
сохраняя ваше `views` простым, а код недублированным.

## Содержание

* [Причина появления](#the-motivation)
* [Использование Behaviors](#using)
* [API](#api)
  * [Проксирование событий](#the-event-proxy)
  * [Триггеры](#triggers)
  * [События модели](#model-events)
  * [События коллекции](#collection-events)
  * [Группированные поведения](#grouped-behaviors)
  * [`$`](#$)
  * [`$el` и `el`](#$el-and-el)
  * [Свойство `defaults`](#defaults)
  * [Свойство `view`](#view)

## <a name="the-motivation"></a> Причина появления

Когда вы пишете более и более сложные представления, вы замечаете, что ваше `view` все меньше 
используется для отображения данных модели, а все более для поддержки взаимодействий с пользователем.

Эти взаимодействия, как правило, представляются отдельными кусками логики, которую вы, скорее всего,
захотите использовать в других представлениях.

## <a name="using"></a> Использование

Приведем пример простого `itemView`. Давайте попробуем упростить его и абстрагируем поведение от него.

```js
var MyView = Marionette.ItemView.extend({
  ui: {
    "close": ".close-btn"
  },

  events: {
    "click @ui.close": "warnBeforeClose"
  },

  warnBeforeClose: function() {
    alert("you are closing all your data is now gone!");
    this.close();
  },

  onShow: function() {
    this.ui.close.tooltip({
      text: "what a nice mouse you have"
    });
  }
});
```

Имеются следующие точки взаимодействия: всплывающие подсказки, предупреждающие сообщения. Они являются
общими способами взаимодействия для многих представлений. Нет необходимости писать повторно один и тот же код в
ваших представлениях. Их просто абстрагировать на более высоком уровне, несвязанном с текущим концептом использования.
Именно этот более высокий уровень и предоставляет для вас `Behaviors`.

Вот пример синтаксиса для объявления этих поведений (behaviors) для использования в представлении.
Ключи из хэша передаются в метод `getBehaviorClass` для поиска нужного класса `Behavior`.
Опции для каждого поведения также передаются в указанный `Behavior` во время инициализации.
Переданные опции сохраняются в каждом поведении в `options`. 

```js
var MyView = Marionette.ItemView.extend({
  ui: {
    "destroy": ".destroy-btn"
  },

  behaviors: {
    DestroyWarn: {
      message: "you are destroying all your data is now gone!"
    },
    ToolTip: {
      text: "what a nice mouse you have"
    }
  }
});
```

Теперь давайте создадим поведение `DestroyWarn`.

```js
var DestroyWarn = Marionette.Behavior.extend({
  // вы можете задать значения по умолчанию для опций
  // это похоже на значения по умолчанию в Backbone Models
  // значения опции будут переопределены, если вы передадите опции с тем же именами
  defaults: {
    "message": "you are destroying!"
  },

  // в поведениях можно указать прослушивание DOM-событий представлений
  events: {
    "click @ui.destroy": "warnBeforeDestroy"
  },

  warnBeforeDestroy: function() {
    alert(this.options.message);
    // каждый Behavior имеет связь с представлением, в котором он был объявлен
    this.view.destroy();
  }
});
```

И также создадим поведение `Tooltip`.

```js
var ToolTip = Marionette.Behavior.extend({
  ui: {
    tooltip: '.tooltip'
  },

  onShow: function() {
    this.ui.tooltip.tooltip({
      text: this.options.text
    });
  }
});
```

Кроме того, пользователь должен определить место, где будут храниться `поведения`.
Простой пример для этого выглядит следующим образом:

```js
Marionette.Behaviors.behaviorsLookup = function() {
  return window.Behaviors;
}
```

В этом примере ваши поведения будут сохранены следующим образом:

```js
window.Behaviors.ToolTip = ToolTip;
window.Behaviors.DestroyWarn = DestroyWarn;
```

Заметим, что в дополнение к расширению `View` с помощью `Behavior`, 
`Behavior` может быть сам использован в других поведениях.
Синтаксис для объявления этого, идентичен тому, что используется для `View`:

```js
var Modal = Marionette.Behavior.extend({
  behaviors: {
    DestroyWarn: {
      message: "Whoa! You sure about this?"
    }
  }
});
```

Вложенные поведения действуют так, как будто они были напрямую определены в экземпляре представления.

## <a name="api"></a> API

### <a name="the-event-proxy"></a> Проксирование событий

Поведения используют для взаимодействия прокси события. Это значит, что любые события,
которые генерируются функцией представления `triggerMethod`, передаются каждому `Behavior`
этого представления.

Примером из жизни может служить ситуация, когда в вашем `представлении` используется метод `onShow`, то
ваше поведение может также определить метод `onShow`. То же самое относится для `modelEvents` и `collectionEvents`.
Думайте о вашем поведении как о приемнике всех событий экземпляра вашего представления.

Эта концепция также позволяет хорошо разделять методы взаимодействия поведений 
от методов экземпляра вашего представления. Вы можете просто вызвать в вашем представлении
`this.triggerMethod("SomeEvent", {some: "data"})`, что вызовет соответствующий соглашению метод у вашего
`behavior` класса, выглядит это следующим образом: 

```js
Marionette.Behavior.extend({
  onSomeEvent: function(data) {
    console.log("wow such data", data);
  }
});
```

### <a name="triggers"></a> Триггеры

Любой указанный в `triggers` триггер будет срабатывать в ответ на соответствующие событие в представлении.

```js
Marionette.Behavior.extend({
  triggers: {
    'click .label': 'click:label'
  }
});
```

### <a name="model-events"></a> События модели

Указав `modelEvents`, позволит прослушивать и реагировать на события модели представления.

```js
Marionette.Behavior.extend({
  modelEvents: {
    "change:doge": "onDogeChange"
  },

  onDogeChange: function() {
    // купить больше doge...
  }
});
```

### <a name="collection-events"></a> События коллекции

Указав `collectionEvents`, позволит прослушивать и реагировать на события коллекции представления.

```js
Marionette.Behavior.extend({
  collectionEvents: {
    add: "onCollectionAdd"
  },

  onCollectionAdd: function() {}
});
```

### <a name="grouped-behaviors"></a> Группированные поведения

Ключи в свойстве `behaviors` поведения позволяют группировать различные поведения вместе.

```js
Marionette.Behavior.extend({
  behaviors: {
    SomeBehavior: {}
  }
});
```

### <a name="$"></a> `$`

Метод `$` в поведении является прямым прокси на метод `$` из представления.

```js
Marionette.Behavior.extend({
  onShow: function() {
    this.$('.zerg')
  }
});
```

### <a name="$el-and-el"></a> `$el` и `el`

Свойство `el` в поведении является прямым прокси на свойство `el` из представления.
Аналогично и свойство `$el` является прямым прокси на свойство `$el` из представления,
это свойство является кэшированным `el` jQuery-селектором.

```js
Marionette.Behavior.extend({
  onShow: function() {
    this.$el.fadeOut('slow')
  }
});
```

### <a name="defaults"></a> Свойство `defaults`

Свойство `defaults` может быть `хэшом` или `функцией`, которое определяет значения для опции по умолчанию
для вашего поведения. Опции по умолчанию из `defaults` будут переопределенны в зависимости от того, 
что вы установили в качестве опций в поведении (это работает анологично опциям по умолчанию из
`backbone.model`).

```js
Marionette.Behavior.extend({
  defaults: function() {
    return {
      'deepSpace': 9
    }
  }
});
```

```js
Marionette.Behavior.extend({
  defaults: {
    'dominion': 'invasion',
    'doge': 'amaze'
  }
});
```

### <a name="view"></a> Свойство `view`

Свойство `view` это ссылка на экземпляр представления, в котором добавлено `поведение`.

```js
Marionette.Behavior.extend({
  handleDestroyClick: function() {
    this.view.destroy();
  }
});
```
