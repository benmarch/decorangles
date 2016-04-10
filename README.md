# Decor@ngles

A small set of opinionated, pure ES2016 decorators for cutting down on boilerplate AngularJS 1.x code.

## Decorators

| Name                      | Target          | Description                                                      |
| ------------------------- | --------------- | ---------------------------------------------------------------- |
| [@Module](#module)        | class           | Creates a module with provided name and dependencies             |
| [@Provider](#provider)    | class           | Creates an Angular provider                                      |
| [@Service](#service)      | class           | Creates an Angular service (use for factories also)              |
| [@Controller](#controller)| class           | Creates an Angular controller                                    |
| [@Directive](#directive)  | class           | Creates an Angular directive                                     |
| [@Inject](#inject)        | class/method    | Injects providers/services into a constructor or method          |
| [@AutoInject](#autoInject)| class           | Injects providers/services and makes them available to instances |

### @Module

`@Module(name[, requires])` creates a new module with optional module dependencies, config and run blocks, values, and constants.

#### Creating a module in ES5

```js
var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
});

myApp.run(['myService', function (myService) {
    myService.init();
});

myApp.value({
    appKey: '12345678',
    secret: '14159265'
});

myApp.constant({
    userId: 123
});
```

#### Creating a module with decorangles

```js
import {Module} from 'decorangles';

@Module('myApp', ['ngRoute'])
class MyApp {

    @Inject('$locationProvider')
    config($locationProvider) {
        $locationProvider.html5Mode(true);
    }

    @Inject('myService')
    run(myService) {
        myService.init();
    }

    value() {
        return {
           appKey: '12345678',
           secret: '14159265'
        };
    }

    constant() {
        return {
           userId: 123
        };
    }
}
```

### Services

The service decorators (@Provider, @Service, @Controller, @Directive) use a naming convention for associating them with
a module. This was done to prevent the having to use another decorator just to do the association. For example, if you
have created a module named "myApp" and you want to create a service called "myService", the @Service decorator would look
like `@Service('myApp.myService')`. This convention will work even if your module name has a "." in it. For example,
`@Directive('bm.uiTour.tourStep')` would create a directive named 'tourStep' on the 'bm.uiTour' module.

### @Provider

`@Provider(name)` creates a provider. Dependency injection is available for the constructor and the $get method.

#### Creating a provider in ES5

```js
var myApp = angular.module('myApp', ['ngRoute']);

myApp.provider('MyConfiguration', ['$locationProvider', function ($locationProvider) {
    var mode = 'legacy';

    this.setMode = function (_mode) {
        mode = _mode;

        if (mode === 'html5') {
            $locationProvider.html5Mode(true);
        } else {
            $locationProvider.html5Mode(false);
        }
    }

    this.$get = ['$location', function ($location) {
        var service = {};

        service.getMode() {
            return mode;
        }

        service.getHost() {
            return $location.host();
        }

        return service;
    }];
}]);

```

#### Creating a provider with decorangles

```js
import {Provider} from 'decorangles';

let mode = 'legacy';

@Provider('myApp.MyConfiguration')
@AutoInject('$locationProvider')
class MyConfiguration {
    setMode(_mode) {
        mode = _mode;

        if (mode === 'html5') {
            this.$locationProvider.html5Mode(true);
        } else {
            this.$locationProvider.html5Mode(false);
        }
    }

    @Inject('$location')
    $get($location) {
        var service = {};

        service.getMode() {
            return mode;
        }

        service.getHost() {
            return $location.host();
        }

        return service;
    }
}
```

### @Service and @Controller

`@Service(name)` creates a service. There is no @Factory decorator because factories are essentially services that use
objects instead of instances, and it doesn't make sense to do it that way with classes.

`@Controller(name)` creates a controller. The patterns for @Service and @Controller are identical, so to cut down on contrived
examples I am combining them here.

#### Creating a service/controller in ES5

```js
var myApp = angular.module('myApp');

myApp.service('myService', ['$http', function ($http) {
    var service = {};

    service.getById = function (id) {
        return $http.get('/things/' + id);
    };

    return service;
}]);

myApp.controller('MyController', ['myService', function (myService) {

    myService.getById(123).then(function (response) {
        this.thing = response.data;
    }.bind(this));

}]);
```

#### Creating a service/controller with decorangles

```js
import {Service, Controller, Inject} from 'decorangles';

@Service('myApp.myService')
@Inject('$http')
class MyService {
    constructor($http) {
        this.$http = $http;
    }

    getById(id) {
        return this.$http.get('/things' + id);
    }
}

@Controller('myApp.MyController')
@Inject(MyService)
class MyController {
    constructor(myService) {
        myService.getById(123).then(res => {
            this.thing = res.data;
        });
    }
}
```

### @Directive

`@Directive(name)` creates a directive. The class will be instantiated and the resulting object will become the directive
 definition object.

#### Creating a directive in ES5

```js
var myApp = angular.module('myApp');

myApp.directive('myComponent', ['$http', function ($http) {

    return {
        restrict: 'EA',
        scope: {},
        bindToController: {
            id: '@'
            asset: '='
        },
        controller: ['$anchorScroll', function ($anchorScroll) {
            this.anchor = $anchorScroll;
        }],
        link: function (scope, element, attrs, ctrl) {
            scope.populate = function () {
                $http.get('/things').then(function (res) {
                    scope.things = res.data;
                    ctrl.anchor(element);
                });
            };
        }
    };

}]);
```

#### Creating a directive with decorangles

```js
import {Directive, AutoInject, Inject} from 'decorangles';

@Directive('myApp.myComponent')
@AutoInject('$http')
class MyComponent {
    constructor() {
        this.restrict = 'EA';
        this.scope = {};
        this.bindToController = {
            id: '@'
            asset: '='
        };
    }

    @Inject('$anchorScroll')
    controller($anchorScroll) {
        this.anchor = $anchorScroll;
    }

    link(scope, element, attrs, ctrl) {
        scope.populate = function () {
            $http.get('/things').then(function (res) {
                scope.things = res.data;
                ctrl.anchor(element);
            });
        };
    }
}
```

### @Inject

`@Inject(...dependencies)` will add an $inject annotation to your constructor or method. A dependency can either be a
string (just like in ES5) or a reference to a class that you want to inject. Note, if you use a reference to inject, the
injected class must be annotated with @Service or @Provider.

#### Dependency injection in ES5

```js
var myApp = angular.module('myApp');

myApp.service('myService', ....);

myApp.controller('MyController', ['$http', 'myService', function ($http, myService) {
    this.doSomething() {
        $http.get(...);
    }
}]);
```

#### Dependency injection with decorangles

```js
import {Service, Controller, Inject} from 'decorangles';

@Service('myApp.myService')
class MyService {...}

@Controller('myApp.MyController')
@Inject('$http', MyService)
class MyController {
    constructor($http, myService) {
        this.$http = $http;
        this.myService = myService;
    }

    doSomething() {
        this.$http.get(...);
    }
}
```

### @AutoInject

`@AutoInject(...dependencies)` is just like @Inject except that it will automatically attach the injected dependencies
into the instance so they can be used in methods. Note, this can only be used on classes, not on methods.

#### Using @Inject

```js
import {Service, Controller, Inject} from 'decorangles';

@Service('myApp.myService')
class MyService {...}

@Controller('myApp.MyController')
@Inject('$http', MyService)
class MyController {
    constructor($http, myService) {
        this.$http = $http;
        this.myService = myService;
    }

    doSomething() {
        this.$http.get(...);
    }
}
```

#### Using @AutoInject

```js
import {Service, Controller, AutoInject} from 'decorangles';

@Service('myApp.myService')
class MyService {...}

@Controller('myApp.MyController')
@AutoInject('$http', MyService)
class MyController {
    doSomething() {
        this.$http.get(...);    //no constructor necessary
    }
}
```


[![Travis build status](http://img.shields.io/travis/benmarch/decorangles.svg?style=flat)](https://travis-ci.org/benmarch/decorangles)
[![Code Climate](https://codeclimate.com/github/benmarch/decorangles/badges/gpa.svg)](https://codeclimate.com/github/benmarch/decorangles)
[![Test Coverage](https://codeclimate.com/github/benmarch/decorangles/badges/coverage.svg)](https://codeclimate.com/github/benmarch/decorangles)
[![Dependency Status](https://david-dm.org/benmarch/decorangles.svg)](https://david-dm.org/benmarch/decorangles)
[![devDependency Status](https://david-dm.org/benmarch/decorangles/dev-status.svg)](https://david-dm.org/benmarch/decorangles#info=devDependencies)
