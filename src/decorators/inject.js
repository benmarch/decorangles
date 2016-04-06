export default function Inject(...dependencies) {
    return function (target, name, descriptor) {
        let inject = [];
        dependencies.forEach(function (dep) {
            inject.push(dep.$$name ? dep.$$name : dep);
        });

        if (descriptor) {
            descriptor.value.$inject = inject;
        } else {
            target.$inject = inject;
        }
    };
};
