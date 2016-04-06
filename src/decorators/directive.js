import createService from '../create-service';

export default function Directive(name) {
    return function (target) {

        createService('directive', name, ['$injector', function ($injector) {

            //inject dependencies and return a directive definition
            var definition = $injector.instantiate(target);

            //bind link and compile to proper context
            if (target.prototype.link) {
                target.prototype.link = target.prototype.link.bind(definition);
            } else if (target.prototype.compile) {
                target.prototype.compile = target.prototype.compile.bind(definition);
            }

            //return definition
            return definition;

        }]);

    };
}
