Reduce the boilerplate code of handling route events and then calling a single method on another object.
Have your routers configured to call the method on your object, directly.

## Содержание

* [Настройка роутов](#configure-routes)
* [Настройка роутов в конструкторе](#configure-routes-in-constructor)
* [Добавление роутов при выполнения приложения](#add-routes-at-runtime)
* [Указание контроллера](#specify-a-controller)
* [Коллбэк onRoute](#onroute)

## Настройка роутов

Для настройки роутера используется `appRoutes`. Определение роута осуществляется точно таким же образом, как и в роутере Backbone. 

Однако, в отличие от Backbone, где роуту назначается один из методов самого роутера, в Marionette роуту назначается один из методов контроллера, указанного при создании роутера.  

{% highlight javascript %}
MyRouter = Backbone.Marionette.AppRouter.extend({
  // "someMethod" должен существовать как controller.someMethod
  appRoutes: {
    "some/route": "someMethod"
  },

  /* Так же можно задать и обычные роуты */
  routes : {
    "some/otherRoute" : "someOtherMethod"
  },
  someOtherMethod : function(){
    // тело метода
  }

});
{% endhighlight %}

В AppRouter мы можете указать обычные роуты Backbone, но в этом случае методы обработчики этих роутов должны определяться в самом роутере, а не в контроллере.

## Настройка роутов в конструкторе

Также роуты могут быть определены с помощью аргументов функции конструктора. Для этого констуктору нужно передать объект `appRoutes`.

{% highlight javascript %}
var MyRouter = new Marionette.AppRouter({
  controller: myController,
  appRoutes: {
    "foo": "doFoo",
    "bar/:id": "doBar"
  }
});
{% endhighlight %}

Этот способ позволяет вам создать экземпляр роутера без использования метода `.extend`.

## Добавление роутов при выполнения приложения

В дополнение к предварительной настройке через определение `appRoutes`, вы можете добавлять роуты в момент выполнения приложения. Для этого вам нужно воспользоваться методом `appRoute()`.

Этот метод работает так же, как и метод `router.route()` Backbone, но вторым аргументом в него передается не обработчик роута, а имя метода обработчика из контроллера.

{% highlight javascript %}
var MyRouter = Marionette.AppRouter.extend({

});

var router = new MyRouter();
router.appRoute("/foo", "fooThat");
{% endhighlight %}

## Указание контроллера

Роутеры приложения могут использовать только один контроллер, который может быть указан при определении роутера: 

{% highlight javascript %}
someController = {
  someMethod: function(){ /*...*/ }
};

Backbone.Marionette.AppRouter.extend({
  controller: someController
});
{% endhighlight %}

... или в качестве параметра конструктора:

{% highlight javascript %}
myObj = {
  someMethod: function(){ /*...*/ }
};

new MyRouter({
  controller: myObj
});
{% endhighlight %}

К объекту, который используется как `controller`, не предъявляются никакие требования, за исключением того, что он должен содержать методы, которые были указаны в качестве обработчиков в `appRoutes`.

Рекомендуется разделять ваши контроллеры на небольшие кусочки со связанной функциональностью и иметь несколько роутеров / контроллеров вместо одного большого роутера и контроллера.

## Коллбэк onRoute

Если в роутере определен коллбэк `onRoute`, то он будет вызываться каждый раз, когда пользователь совершит действие, которое изменит роут. Этот коллбэк принимает три аргумента: имя, путь и параметры роута.
