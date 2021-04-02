import React from 'react';
import { shallow } from 'enzyme';

import SymbolLookup from './SymbolLookup';

describe('<SymbolLookup />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<SymbolLookup />);
    });

    it('should render the Search container', () => {
        expect(wrapper.find('.search-container').exists()).toEqual(true);
    });
    it('should render the Search form component', () => {
        expect(wrapper.find('.search-component').exists()).toEqual(true);
    });
});