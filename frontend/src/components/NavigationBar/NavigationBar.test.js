import React from 'react';
import { shallow } from 'enzyme';

import Navigationbar from './NavigationBar';

describe('<NavigationBar />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<Navigationbar />);
    });
    it('should render the accordion component', () => {
        expect(wrapper.exists('Accordion')).toEqual(true);
    });
    it('should render the Card components', () => {
        expect(wrapper.exists('Card')).toEqual(true);
    });
});