import {module, inject} from 'angular-mocks';
import './test';

describe('decorangles', () => {

    let $compile,
        $rootScope,
        template = `
            <div ng-controller="MyController as ctrl">
                <my-directive ng-init="ctrl.ctrlCheck()"></my-directive>
                <compile-test></compile-test>
            </div>
        `;

    beforeEach(module('decorangles'));

    beforeEach(inject((_$compile_, _$rootScope_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should pass all checks', () => {

        //when
        let element = $compile(template)($rootScope.$new());
        $rootScope.$digest();

        //then
        expect(element.find('my-directive').text()).toBe('Success!');

    });
});
