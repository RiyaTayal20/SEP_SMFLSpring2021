import React, { useState as useStateMock } from 'react';
import { shallow } from 'enzyme';

import Portfolio from './Portfolio';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        selectedUser: {
            league: 'league',
            username: 'username'
        }
    })
}))
describe('<Portfolio />', () => {
    let wrapper;
    const setLeague = jest.fn();
    const setLeagueList = jest.fn();
    const setPortfolio = jest.fn();
    const setLowBalance = jest.fn();
    const setViewUser = jest.fn();
    const setLeagueObj = jest.fn();
    beforeEach(() => {
        useStateMock.mockImplementationOnce(f => ['league1', setLeague]);
        useStateMock.mockImplementationOnce(f => [['league1', 'league2'], setLeagueList]);
        useStateMock.mockImplementationOnce(f => ['portfolio', setPortfolio]);
        useStateMock.mockImplementationOnce(f => [false, setLowBalance]);
        useStateMock.mockImplementationOnce(f => ['username', setViewUser]);
        useStateMock.mockImplementationOnce(f => [null, setLeagueObj]);
        wrapper = shallow(<Portfolio />);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should render the portfolio container', () => {
        expect(wrapper.find('.portfolio-container').exists()).toEqual(true);
    });
    it('should render the dropdown', () => {
        expect(wrapper.exists('DropdownButton')).toEqual(true);
    });
});