# Backbone.Marionette

Заставьте ваши Backbone-приложения танцевать!

## О Marionette

Backbone.Marionette это составная библиотека для Backbone, позволяющая упростить разработку крупных Javascript-приложений. Это набор общих паттернов разработки приложений, которые были найдены [Дериком Бейли] (https://github.com/derickbailey) при разработке приложений на Backbone. 

### Архитектура приложения на строительных блоках Backbone

Backbone предоставляет отличный набор строительных блоков для ваших Javascript-приложений. Backbone дает основные конструкции, которые необходимы для разработки небольших приложений, управления событиями DOM или создания одностраничных приложений, которые поддерживают мобильные устройства и крупные корпоративные решения. Но Backbone это не полноценный фреймворк. Это только набор строительных блоков. Backbone перекладывает на разработчика большую часть работы по архитектуре приложения и его масштабируемости, включая управление памятью, представлениями и другим. 

Marionette привносит в Backbone архитектуру приложения вместе с встроенным управлением представлениями и памятью. Marionette создана быть легкой и гибкой библиотекой инструментов над Backbone, предоставляющей фреймворк для разработки масштабируемого приложения.

Так же как и с Backbone, вы не обязаны использовать абсолютно все строительные блоки Marionette только потому, что вам нужна часть из них. Вы можете использовать только те части библиотеки, какие вам нужны. Это позволит вам работать с другими плагинами и фреймворками для Backbone. Это так же говорит о том, что вам нет необходимости заниматься переносом всего приложения на Marionette.

### Ключевые преимущества

* Масштабируемость: приложения строятся на модулях и событийной архитектуре;
* Предустановленные инструменты: для рендеринга представлений используются шаблоны Underscore;
* Легко модифицируется под специфичные нужны вашего приложения;
* Уменьшение шаблонного кода для представлений за счет введения специализированных типов представлений;
* Построена на модульной архитектуре с объектом `Application` и модулями, которые присоединены к нему;
* Формируйте внешний вид вашего приложения в процессе выполнения с помощью объектов `Region` и `Layout`;
* Вложенные представления и макеты внутри видимых частей приложения;
* Встроенное управление и очистка памяти в представлениях, регионах и макетах;
* Событийная архитектура с `Backbone.Wreqr.EventAggregator`;
* Гибкая архитектура, позволяющая выбрать и использовать только то, что вам нужно;
* И многое, многое другое

## Из чего состоит marionette.js

**Представления**

* [**Marionette.ItemView**](marionette.itemview.md): Представление, предназначенное для рендеринга одного элемента (например, из коллекции);
* [**Marionette.CollectionView**](marionette.collectionview.md): Представление, которое проходит по всем моделям коллекции и рендерит для каждой модели ее собственный `ItemView` (это представление не имеет собственного шаблона);
* [**Marionette.CompositeView**](marionette.compositeview.md): Представление, предназначенное для рендеринга составных/древовидных иерархий. По сути это `collectionView`, но с собственным шаблоном.
* [**Marionette.Layout**](marionette.layout.md): Представление, которое рендерит макет и создает для него менеджер регионов.
* [**Marionette.View**](marionette.view.md): Базовый типа представления, который наследуется остальными типами представлений. Не предназначен для непосредственного использования.

**Поведения**

* [**Marionette.Behavior**](marionette.behavior.md): Изолированный слой взаимодействия представлений, который может быть использован в любом `view`. В этот слой может быть вынесен общий функционал части представлений. 
* [**Marionette.Behaviors**](marionette.behaviors.md): Вспомогательный класс, предназначенный для применения поведений в ваших представлениях.

**Управление представлениями**

* [**Marionette.Region**](marionette.region.md): Управление видимыми частями вашего приложения, включая отображение и удаление их содержимого.
* [**Marionette.RegionManager**](marionette.regionmanager.md): Управление группой связанных регионов.
* [**Marionette.Renderer**](marionette.renderer.md): Объект, который единым образом рендерит шаблоны, как с данными, так и без них.
* [**Marionette.TemplateCache**](marionette.templatecache.md): Кеширование шаблонов, которые хранятся в блоках `<script>`, для быстрого доступа к ним.
* [&rarr;] [**Backbone.BabySitter**](https://github.com/marionettejs/backbone.babysitter): Управление представлениями-потомками для вашего `Backbone.View` (и других родителей).

**Инфраструктура приложения**

* [**Marionette.Application**](marionette.application.md): Объект, который запускает ваше приложение с помощью инициализаторов и прочего.
* [**Marionette.Module**](marionette.application.module.md): Объект, который создает модули и подмодули в вашем приложении.
* [**Marionette.Controller**](marionette.controller.md): Объект общего назначения, который используется для управления модулями, роутерами, представлениями. Реализован на основе паттерна **медиатор** (посредник).

**Инфраструктура обмена сообщениям**

* [**Marionette.Commands**](marionette.commands.md): Расширение Backbone.Wreqr.Commands, инструмент для выполнения команд.
* [**Marionette.RequestResponse**](marionette.requestresponse.md): Расширение Backbone.Wreqr.RequestResponse, инструмент для выполнения запросов и получения ответов на них.
* [&rarr;] [**Backbone.Wreqr.EventAggregator**](https://github.com/marionettejs/backbone.wreqr): Агрегатор событий, предназначенный для работы событийной архитектуры. Является часть набора шаблонов обмена сообщениями.
* [&rarr;] [**Backbone.Wreqr.Commands**](https://github.com/marionettejs/backbone.wreqr): Система выполнения команд.
* [&rarr;] [**Backbone.Wreqr.RequestResponse**](https://github.com/marionettejs/backbone.wreqr): Система выполнения запросов и получения ответов на них.

**Другое**

* [**Marionette.AppRouter**](marionette.approuter.md): Объект, который позволяет убрать из роутеров логику, оставив в них только конфигурацию, задающую для каждого роута свой метод обработчик.
* [**Marionette.Callbacks**](marionette.callbacks.md): Объект, который управляет набором коллбеков и выполняет их по требованию.
* [**Marionette.functions**](marionette.functions.md): Набор хелперов и утилит, предназначенных для применения базового функционала Marionette в ваших объектах.

**Устаревшее**

* [&rarr;] [**Backbone.EventBinder**](https://github.com/marionettejs/backbone.eventbinder): Устарел для версии Backbone v0.9.9 и выше. Инструмент для более простой работы с событиями в Backbone v0.9.2.


## Исходный код и загрузка

Последнюю версию (в том числе и amd-сборки) вы можете скачать с [официального сайта](http://marionettejs.com#download) или из папки [lib](https://github.com/marionettejs/backbone.marionette/tree/master/lib) репозитория на [github.com](https://github.com/marionettejs/backbone.marionette).

В дополнение к существующей документации исходный код marionette.js был [прокомментирован](http://marionettejs.com/docs/backbone.marionette.html). 

### Доступные пакеты

Marionette.js неофициально доступна в различных пакетных менеджерах, таких как RubyGems, Node Package Manager, Nuget и других. 
Пакеты для этих систем поддерживаются сообществом и не являются частью ядра Backbone.Marionette. Посмотреть список доступных пакетов можно [тут](https://github.com/marionettejs/backbone.marionette/wiki/Available-packages).

## Совместимость и требования

На данный момент для работы marionette.js требуются следующие библиотеки:

* [jQuery](http://jquery.com) v1.8+
* [Underscore](http://underscorejs.org) v1.4.4 - 1.6.0
* [Backbone](http://backbonejs.org) v1.0.0 - 1.1.2 (версии v0.9.9 и v0.9.10 тоже должны подойти) 
* [Backbone.Wreqr](https://github.com/marionettejs/backbone.wreqr)
* [Backbone.BabySitter](https://github.com/marionettejs/backbone.babysitter)

Использовать иные версии перечисленных выше библиотек вы можете только на свой страх и риск.

Не смотря на то, что существует совместимость с Zepto.js и Ender.js, официально тестирование совместимости с ними не проводилось.

## Сообщество

* [Github Issues](//github.com/marionettejs/backbone.marionette/issues);
* Marionette на [StackOverflow](http://stackoverflow.com/questions/tagged/backbone.marionette);
* [Google Group Mailing List](https://groups.google.com/forum/#!forum/backbone-marionette);
* сообщество на [Google+](https://plus.google.com/communities/111798429561476246318)
* канал `#marionette` на [FreeNode.net](http://freenode.net).

Copyright (c) 2012 Derick Bailey; Muted Solutions, LLC

Распространяется под лицензией [MIT](http://mutedsolutions.mit-license.org/).