import React from 'react';
import { shallow } from 'enzyme';

import News from './News';

describe('<News />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<News />);
    });

    it('should render the News Container', () => {
        expect(wrapper.find('.news-container').exists()).toEqual(true);
    });
    it('should render the Articles component', () => {
        expect(wrapper.exists('Articles')).toEqual(true);
    });
});