import React from 'react';
import { shallow } from 'enzyme';

import Ai from './Ai';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
        location: {
            state: {
            }
        }
    }),
}));

describe('<Ai />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<Ai />);
    });

    it('should render the AI Container', () => {
        expect(wrapper.find('.ai-container').exists()).toEqual(true);
    });
    it('should render the Algorithms container', () => {
        expect(wrapper.find('.algorithms').exists()).toEqual(true);
    });
    it('should render the Mean algorithm section', () => {
        expect(wrapper.find('.mean').exists()).toEqual(true);
    });
    it('should render the Momentum algorithm section', () => {
        expect(wrapper.find('.momentum').exists()).toEqual(true);
    });
    it('should render the Candlesticks algorithm section', () => {
        expect(wrapper.find('.candlesticks').exists()).toEqual(true);
    });
});