# Marionette.AppRouter (В процессе перевода)

Reduce the boilerplate code of handling route events and then calling a single method on another object.
Have your routers configured to call the method on your object, directly.

## Содержание

* [Настройка роутов](#configure-routes)
* [Настройка роутов в конструкторе](#configure-routes-in-constructor)
* [Добавление роутов при выполнения приложения](#add-routes-at-runtime)
* [Указание контроллера](#specify-a-controller)

## Настройка роутов

Configure an AppRouter with `appRoutes`. The route definition is passed on to Backbone's standard routing handlers. This means that you define routes like you normally would.  However, instead of providing a callback method that exists on the router, you provide a callback method that exists on the controller, which you specify for the router instance (see below.)

```js
MyRouter = Backbone.Marionette.AppRouter.extend({
  // "someMethod" must exist at controller.someMethod
  appRoutes: {
    "some/route": "someMethod"
  },

  /* standard routes can be mixed with appRoutes/Controllers above */
  routes : {
	"some/otherRoute" : "someOtherMethod"
  },
  someOtherMethod : function(){
	// do something here.
  }

});
```

You can also add standard routes to an AppRouter with methods on the router.

## Настройка роутов в конструкторе

Также роуты могут быть определены в качестве параметра конструктора. 
Для этого констуктору нужно передать объект `appRoutes`.

```js
var MyRouter = new Marionette.AppRouter({
  controller: myController,
  appRoutes: {
    "foo": "doFoo",
    "bar/:id": "doBar"
  }
});
```

This allows you to create router instances without having to `.extend`
from the AppRouter. You can just create the instance with the routes defined
in the constructor, as shown.

## Добавление роутов при выполнения приложения

In addition to setting the `appRoutes` for an AppRouter, you can add app routes
at runtime, to an instance of a router. This is done with the `appRoute()`
method call. It works the same as the built-in `router.route()` call from
Backbone's Router, but has all the same semantics and behavior of the `appRoutes`
configuration.

```js
var MyRouter = Marionette.AppRouter.extend({

});

var router = new MyRouter();
router.appRoute("/foo", "fooThat");
```

## Указание контроллера

Роутеры приложения могут использовать только один контроллер. Вы можете указать 
используемый контроллер при определении роутера: 

```js
someController = {
  someMethod: function(){ /*...*/ }
};

Backbone.Marionette.AppRouter.extend({
  controller: someController
});
```

... или в качестве параметра конструктора:

```js
myObj = {
  someMethod: function(){ /*...*/ }
};

new MyRouter({
  controller: myObj
});
```

К объекту, который используется как `controller`, не предъявляются никакие требования, за исключением того, что он должен содержать методы, которые были указаны в качестве обработчиков в `appRoutes`.

Рекомендуется разделять ваши контроллеры на небольшие кусочки со связанной функциональностью и иметь несколько роутеров / контроллеров вместо одного большого роутера и контроллера.
