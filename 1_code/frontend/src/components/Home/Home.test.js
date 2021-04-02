import React from 'react';
import { shallow } from 'enzyme';

import Home from './Home';

describe('<Home />', () => {
    let wrapper;
    beforeEach(() => {
        global.localStorage.setItem('token' , true);
        wrapper = shallow(<Home />);
    }); 
    afterEach(() => {
        global.localStorage.clear();
    });
    it('should render the user profile section', () => {
        expect(wrapper.find('.user-profile-section').exists()).toEqual(true);
    });
    it('should render the league information', () => {
        expect(wrapper.find('.league-information').exists()).toEqual(true);
    });
});