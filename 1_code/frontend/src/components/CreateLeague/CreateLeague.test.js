import React from 'react';
import { shallow } from 'enzyme';

import CreateLeague from './CreateLeague';

describe('<CreateLeague />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<CreateLeague />);
    });
    it('should render the Create League container', () => {
        expect(wrapper.find('.create-league-container').exists()).toEqual(true);
    });
    it('should render the Create League form', () => {
        expect(wrapper.find('.create-league-form').exists()).toEqual(true);
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
        wrapper.find('.create-league-form').simulate('submit', formEventMocked);
        expect(formEventMocked.preventDefault).toHaveBeenCalled();
    });
});