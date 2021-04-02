import React from 'react';
import { shallow } from 'enzyme';

import JoinLeague from './JoinLeague';

describe('<JoinLeague />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<JoinLeague />);
    });

    it('should render the Join League container', () => {
        expect(wrapper.find('.join-league-container').exists()).toEqual(true);
    });
    it('should render the Join League form', () => {
        expect(wrapper.find('.join-league-form').exists()).toEqual(true);
    });
    it('should render the Join League form', () => {
        expect(wrapper.find('.join-league-form').exists()).toEqual(true);
    });
    it('should render the Modal', () => {
        expect(wrapper.exists('Modal')).toEqual(true);
    });
});