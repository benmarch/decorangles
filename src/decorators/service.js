import createService from '../create-service';

export default function Service(name) {
    return function (target) {
        createService('service', name, target);
    };
};
