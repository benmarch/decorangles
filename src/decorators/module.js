import angular from 'angular';

export default function Module(name, dependencies) {
    return function (Target) {
        let module = new Target();

        //add name string and create module
        Object.defineProperty(Target, '$$name', {
            value: name
        });
        angular.module(name, dependencies || []);

        //set run and config blocks
        if (module.run) {
            angular.module(name).run(module.run);
        }
        if (module.config) {
            angular.module(name).config(module.config);
        }

        //set values and constants
        if (module.value) {
            angular.module(name).value(module.value());
        }
        if (module.constant) {
            angular.module(name).constant(module.constant());
        }

    };
};
