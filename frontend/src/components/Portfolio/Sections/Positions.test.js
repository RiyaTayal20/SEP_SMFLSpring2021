import React from 'react';
import { shallow } from 'enzyme';

import Positions from './Positions';

describe('<Positions />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<Positions />);
    });
    it('should render the portfolio positions container', () => {
        expect(wrapper.find('.portfolio-positions-container').exists()).toEqual(true);
    });
    it('should render the Positions List table', () => {
        expect(wrapper.find('.positions-list').exists()).toEqual(true);
    });
});