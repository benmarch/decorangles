import createService from '../create-service';

export default function Provider(name) {
    return function (target) {
        createService('provider', name, target);
    };
};
