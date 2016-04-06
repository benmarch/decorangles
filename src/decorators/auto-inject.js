import angular from 'angular';
import Inject from './inject';

export default function AutoInject(...dependencies) {
    return function (target, name, descriptor) {
        if (descriptor) {
            throw new Error('@AutoInject is only for classes!');
        }

        //do a regular inject first
        Inject(...dependencies)(target);

        //create a getter for each
        target.$inject.forEach(depName => {
            Object.defineProperty(target.prototype, depName, {
                get: function () {
                    return angular.injector(['ng', target.$$module]).get(depName);
                }
            });
        });

    };
};
