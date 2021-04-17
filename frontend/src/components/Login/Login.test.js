import React from 'react';
import { shallow } from 'enzyme';

import Login from './Login';

describe('<Login />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<Login />);
    });
    it('should render the site container', () => {
        expect(wrapper.exists('Container')).toEqual(true);
    });
    it('should render the login form', () => {
        expect(wrapper.find('Container').at(0).children().exists('Form')).toEqual(true);
    });
    it('should render the button component', () => {
        expect(wrapper.find('Form').at(0).children().exists('Button')).toEqual(true);
    });
});