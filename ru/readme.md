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

### Основные преимущества

* Масштабируемость: приложения строятся на модулях и событийной архитектуре;
* Sensible defaults: Underscore templates are used for view rendering
* Легкая модифицируемость: make it work with your application's specific needs
* Reduce boilerplate for views, with specialized view types
* Build on a modular architecture with an `Application` and modules that attach to it
* Compose your application's visuals at runtime, with the `Region` and `Layout` objects
* Nested views and layouts within visual regions
* Встроенное управление памятью и zombie-killing in views, regions and layouts
* Событийная архитектура с `Backbone.Wreqr.EventAggregator`;
* Flexible, "as-needed" architecture allowing you to pick and choose what you need
* И многое, многое другое

## Из чего состоит marionette.js

**Представления**

* [**Marionette.ItemView**](docs/marionette.itemview.md): представление, предназначенное для рендеринга одного элемента (например, из коллекции);
* [**Marionette.CollectionView**](docs/marionette.collectionview.md): представление, которое проходит по всем моделям коллекции и рендерит для каждой модели ее собственный `ItemView` (это представление не имеет собственного шаблона);
* [**Marionette.CompositeView**](docs/marionette.compositeview.md): A collection view and item view, for rendering leaf-branch/composite model hierarchies
* [**Marionette.Layout**](docs/marionette.layout.md): A view that renders a layout and creates region managers to manage areas within it
* [**Marionette.View**](docs/marionette.view.md): The base View type that other Marionette views extend from (not intended to be used directly)

**Поведения**

* [**Marionette.Behavior**](docs/marionette.behavior.md): an encapsulated `View` interaction layer that can be mixed into any `view`, helping to DRY up your view code.
* [**Marionette.Behaviors**](docs/marionette.behaviors.md): A helper class to glue your behaviors to your views.

**Управление представлениями**

* [**Marionette.Region**](docs/marionette.region.md): Manage visual regions of your application, including display and removal of content
* [**Marionette.RegionManager**](docs/marionette.regionmanager.md): Manage a group of related Regions
* [**Marionette.Renderer**](docs/marionette.renderer.md): Render templates with or without data, in a consistent and common manner
* [**Marionette.TemplateCache**](docs/marionette.templatecache.md): Cache templates that are stored in `<script>` blocks, for faster subsequent access
* [&rarr;] [**Backbone.BabySitter**](https://github.com/marionettejs/backbone.babysitter): Manage child views for your Backbone.View (and other parents)

**Инфраструктура приложения**

* [**Marionette.Application**](docs/marionette.application.md): Объект, который запускает ваше приложение с помощью инициализаторов и прочего.
* [**Marionette.Module**](docs/marionette.application.module.md): Объект, который создает модули и подмодули в вашем приложении.
* [**Marionette.Controller**](docs/marionette.controller.md): Объект общего назначения, который используется для управления модулями, роутерами, представлениями. Реализован на основе паттерна **медиатор**(посредник).

**Инфраструктура обмена сообщениям**

* [**Marionette.Commands**](docs/marionette.commands.md): Расширение Backbone.Wreqr.Commands, инструмент для выполнения команд.
* [**Marionette.RequestResponse**](docs/marionette.requestresponse.md): Расширение Backbone.Wreqr.RequestResponse, инструмент для выполнения запросов и получения ответов на них.
* [&rarr;] [**Backbone.Wreqr.EventAggregator**](https://github.com/marionettejs/backbone.wreqr): Агрегатор событий, предназначенный для работы событийной архитектуры. Является часть набора шаблонов обмена сообщениями.
* [&rarr;] [**Backbone.Wreqr.Commands**](https://github.com/marionettejs/backbone.wreqr): Система выполнения команд.
* [&rarr;] [**Backbone.Wreqr.RequestResponse**](https://github.com/marionettejs/backbone.wreqr): Система выполнения запросов и получения ответов на них.

**Другое**

* [**Marionette.AppRouter**](docs/marionette.approuter.md): Reduce your routers to nothing more than configuration
* [**Marionette.Callbacks**](docs/marionette.callbacks.md): Manage a collection of callback methods, and execute them as needed
* [**Marionette.functions**](docs/marionette.functions.md): A suite of helper functions and utilities for implementing common Marionette behavior in your objects

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