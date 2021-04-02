import React from 'react';
import { shallow } from 'enzyme';

import Registration from './Registration';

describe('<Registration />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<Registration />);
    });
    it('should render the site container', () => {
        expect(wrapper.exists('Container')).toEqual(true);
    });

    it('should render the registration form', () => {
        expect(wrapper.find('Container').at(0).children().at(0).exists('Form')).toEqual(true);
    });

    it('should render the button component', () => {
        expect(wrapper.find('Form').at(0).children().exists('Button')).toEqual(true);
    });
});