import angular from 'angular';

export default function createService(type, name, target) {
    let namePieces = name.split('.'),
        serviceName = namePieces.pop(),
        moduleName = namePieces.join('.');

    Object.defineProperty(target, '$$name', {
        value: serviceName
    });
    Object.defineProperty(target, '$$module', {
        value: moduleName
    });
    angular.module(moduleName)[type](serviceName, target);
}
