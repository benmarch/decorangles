import createService from '../create-service';

export default function Controller(name) {
    return function (target) {
        createService('controller', name, target);
    };
};
