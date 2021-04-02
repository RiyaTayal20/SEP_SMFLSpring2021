import React from 'react';
import { shallow } from 'enzyme';

import Trade from './Trade';

describe('<Trade />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<Trade />);
    });
    it('should render the Trade container', () => {
        expect(wrapper.find('.trade-page').exists()).toEqual(true);
    });
    it('should render the Trade form', () => {
        expect(wrapper.find('.trade-form').exists()).toEqual(true);
    });
    it('should account details information session', () => {
        expect(wrapper.find('.account-details-information').exists()).toEqual(true);
    });
    it('should call handleSubmit on form submit', () => {
        global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ res: { ok: true, json: () => Promise.resolve('resolved') }}));
        const formEventMocked = ({
            currentTarget: {
                checkValidity: () => true
            },
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        });
        wrapper.find('.trade-form').simulate('submit', formEventMocked);
        expect(formEventMocked.preventDefault).toHaveBeenCalled();
    });
});