/**
 * This is the DecorAngles test suite. It is a showcase of all the features of this library,
 * and as long everything is working, the page will display "Success". If any feature is not
 * working exactly as expected, the page will display "Failed".
 */

import {Module, Controller, Service, Inject, Directive, AutoInject, Provider} from '../src/decorangles';

let checks = {
    config: false,
    run: false,
    value: false,
    constant: false,
    controller: false,
    service: false,
    autoInject: false,
    autoInjectError: false,
    inject: false,
    directive: false,
    provider: false,
    compile: false,
    link: false
};



//Create a module
@Module('decorangles')
class DecoranglesApp {

    @Inject('myConfigurableServiceProvider')
    config(myConfigurableServiceProvider) {
        myConfigurableServiceProvider.setValue(true);
        checks.config = true;
    }

    @Inject('$http', 'myValue', 'myConstant')
    run($http, myValue, myConstant) {
        if ($http) {
            checks.run = true;
        }
        if (myValue) {
            checks.value = true;
        }
        if (myConstant) {
            checks.constant = true;
        }
    }

    value() {
        return {
            myValue: 'This is a good value.'
        }
    }

    constant() {
        return {
            myConstant: 'This is a good constant. Not really, it should probably be externed.'
        }
    }
}



//Create a provider
@Provider('decorangles.myConfigurableService')
class MyConfigurableService {
    setValue(value) {
        this.value = value;
    }

    @Inject('$http')
    $get($http) {
        if ($http) {
            checks.provider = true;
            return this.value;
        }
    }
}



//Create a service that consumes the provider
@Service('decorangles.MyService')
@AutoInject('myConfigurableService')
class MyService {
    constructor() {
        if (this.myConfigurableService) {
            checks.autoInject = true;
        }
    }

    testService() {
        checks.service = true;
    }

}



//Create a controller that consumes MyService
@Controller('decorangles.MyController')
@Inject(MyService)
class MyController {
    constructor(myService) {
        this.myService = myService;

        if (myService) {
            myService.testService();
            checks.inject = true;
        }
    }

    ctrlCheck() {
        checks.controller = true;
    }
}



//create a directive that consumes MyService and has a link function
@Directive('decorangles.myDirective')
@Inject(MyService)
class MyDirective {
    constructor(myService) {
        this.myService = myService;

        this.restrict = 'EA';
        this.template = '<test-element>{{ myValue }}</test-element>';
    }

    link(scope) {
        let allChecks = true;

        checks.directive = true;
        checks.link = true;

        angular.forEach(checks, function (value, key) {
            if (!value) {
                scope.myValue = `Failed: ${key}`;
                allChecks = false;
            }
        });

        if (allChecks) {
            scope.myValue = 'Success!';
        }
    }
}



//create a directive that consumes MyService and has a compile function
@Directive('decorangles.compileTest')
@Inject(MyService)
class CompileTestDirective {
    constructor(myService) {
        this.myService = myService;

        this.restrict = 'EA';
    }

    compile() {
        if (this.myService) {
            checks.compile = true;
        }
        return function (scope) {

        }
    }
}



//@AutoInject should throw an error if used improperly
try {
    @Service('decorangles.autoInjectFailure')
    class ShouldThrow {
        @AutoInject('$http')
        run() {

        }
    }
} catch (e) {
    checks.autoInjectError = true;
}
