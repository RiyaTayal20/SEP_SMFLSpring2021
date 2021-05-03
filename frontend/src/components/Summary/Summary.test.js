import React from 'react';
import { shallow } from 'enzyme';

import Summary from './Summary';

describe('<Summary />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<Summary />);
    });

    it('should render the Summary Container', () => {
        expect(wrapper.find('.summary-page').exists()).toEqual(true);
    });
    it('should render the Dropdown components', () => {
        expect(wrapper.exists('DropdownButton')).toEqual(true);
    });
});