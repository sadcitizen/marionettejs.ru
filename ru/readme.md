# Backbone.Marionette

Заставьте ваши Backbone-приложения танцевать!

## О Marionette

Backbone.Marionette is a composite application library for Backbone.js that
aims to simplify the construction of large scale JavaScript applications.
It is a collection of common design and implementation patterns found in
the applications that I (Derick Bailey) have been building with Backbone,
and includes various pieces inspired by composite application architectures,
such as Microsoft's "Prism" framework.

### App Architecture On Backbone's Building Blocks

Backbone provides a great set of building blocks for our JavaScript
applications. It gives us the core constructs that are needed to build
small apps, organize jQuery DOM events, or create single page apps that
support mobile devices and large scale enterprise needs. But Backbone is
not a complete framework. It's a set of building blocks. It leaves
much of the application design, architecture and scalability to the
developer, including memory management, view management, and more.

Marionette brings an application architecture to Backbone, along with
built in view management and memory management. It's designed to be a
lightweight and flexible library of tools that sits on top of Backbone,
providing the framework for building a scalable application.

Like Backbone itself, you're not required to use all of Marionette just
because you want to use some of it. You can pick and choose which features
you want to use. This allows you to work with other Backbone
frameworks and plugins easily. It also means that you are not required
to engage in an all-or-nothing migration to begin using Marionette.

### Ключевые преимущества

* Масштабируемость: приложения строятся на модулях и событийной архитектуре;
* Для рендеринга представлений используются шаблоны Underscore;
* Легкая модифицируемость: make it work with your application's specific needs;
* Уменьшение шаблонного кода для представлений за счет введения специализированных типов представлений;
* Построена на модульной архитектуре с объектом `Application` и модулями, которые присоединены к нему;
* Compose your application's visuals at runtime, with the `Region` and `Layout` objects;
* Вложенные представления и макеты внутри видимых частей приложения;
* Встроенное управление и очистка памяти в представлениях, регионах и макетах;
* Событийная архитектура с `Backbone.Wreqr.EventAggregator`;
* Гибкая архитектура, позволяющая выбрать и использовать только то, что вам нужно;
* И многое, многое другое

## Из чего состоит marionette.js

**Представления**

* [**Marionette.ItemView**](docs/marionette.itemview.md): Представление, предназначенное для рендеринга одного элемента (например, из коллекции);
* [**Marionette.CollectionView**](docs/marionette.collectionview.md): Представление, которое проходит по всем моделям коллекции и рендерит для каждой модели ее собственный `ItemView` (это представление не имеет собственного шаблона);
* [**Marionette.CompositeView**](docs/marionette.compositeview.md): Представление, предназначенное для рендеринга составных/древовидных иерархий. По сути это `collectionView`, но с собственным шаблоном.
* [**Marionette.Layout**](docs/marionette.layout.md): Представление, которое рендерит макет и создает для него менеджер регионов.
* [**Marionette.View**](docs/marionette.view.md): Базовый типа представления, который наследуется остальными типами представлений. Не предназначен для непосредственного использования.

**Поведения**

* [**Marionette.Behavior**](docs/marionette.behavior.md): Изолированный слой взаимодействия представлений, который может быть использован в любом `view`. В этот слой может быть вынесен общий функционал части представлений. 
* [**Marionette.Behaviors**](docs/marionette.behaviors.md): Вспомогательный класс, предназначенный для применения поведений в ваших представлениях.

**Управление представлениями**

* [**Marionette.Region**](docs/marionette.region.md): Управление видимыми частями вашего приложения, включая отображение и удаление их содержимого.
* [**Marionette.RegionManager**](docs/marionette.regionmanager.md): Управление группой связанных регионов.
* [**Marionette.Renderer**](docs/marionette.renderer.md): Объект, который единым образом рендерит шаблоны, как с данными, так и без них.
* [**Marionette.TemplateCache**](docs/marionette.templatecache.md): Кеширование шаблонов, которые хранятся в блоках `<script>`, для быстрого доступа к ним.
* [&rarr;] [**Backbone.BabySitter**](https://github.com/marionettejs/backbone.babysitter): Управление представлениями-потомками для вашего `Backbone.View` (и других родителей).

**Инфраструктура приложения**

* [**Marionette.Application**](docs/marionette.application.md): Объект, который запускает ваше приложение с помощью инициализаторов и прочего.
* [**Marionette.Module**](docs/marionette.application.module.md): Объект, который создает модули и подмодули в вашем приложении.
* [**Marionette.Controller**](docs/marionette.controller.md): Объект общего назначения, который используется для управления модулями, роутерами, представлениями. Реализован на основе паттерна **медиатор** (посредник).

**Инфраструктура обмена сообщениям**

* [**Marionette.Commands**](docs/marionette.commands.md): Расширение Backbone.Wreqr.Commands, инструмент для выполнения команд.
* [**Marionette.RequestResponse**](docs/marionette.requestresponse.md): Расширение Backbone.Wreqr.RequestResponse, инструмент для выполнения запросов и получения ответов на них.
* [&rarr;] [**Backbone.Wreqr.EventAggregator**](https://github.com/marionettejs/backbone.wreqr): Агрегатор событий, предназначенный для работы событийной архитектуры. Является часть набора шаблонов обмена сообщениями.
* [&rarr;] [**Backbone.Wreqr.Commands**](https://github.com/marionettejs/backbone.wreqr): Система выполнения команд.
* [&rarr;] [**Backbone.Wreqr.RequestResponse**](https://github.com/marionettejs/backbone.wreqr): Система выполнения запросов и получения ответов на них.

**Другое**

* [**Marionette.AppRouter**](docs/marionette.approuter.md): Объект, который позволяет убрать из роутеров логику, оставив в них только конфигурацию, задающую для каждого роута свой метод обработчик.
* [**Marionette.Callbacks**](docs/marionette.callbacks.md): Объект, который управляет набором коллбеков и выполняет их по требованию.
* [**Marionette.functions**](docs/marionette.functions.md): Набор хелперов и утилит, предназначенных для применения базового функционала Marionette в ваших объектах.

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