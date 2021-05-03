import React, { useState as useStateMock } from 'react';
import { shallow } from 'enzyme';

import CentralizedLeague from './CentralizedLeague';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        state: {
            league: 'league',
        }
    })
}))

describe('<CentralizedLeague />', () => {
    let wrapper;
    const setLeague = jest.fn();
    const setLeagueData = jest.fn();
    beforeEach(() => {
        useStateMock.mockImplementationOnce(f => ['league1', setLeague]);
        useStateMock.mockImplementationOnce(f => [{
            portfolios: [{
                currentNetWorth: 150,
                netWorth: [150]
            }]
        }, setLeagueData]);
        wrapper = shallow(<CentralizedLeague />);
    });

    it('should render the Central League page', () => {
        expect(wrapper.find('.central-league-page').exists()).toEqual(true);
    });
    it('should render the Graph', () => {
        expect(wrapper.exists('Line')).toEqual(true);
    });
    it('should render Transaction History', () => {
        expect(wrapper.find('.transaction-table').exists()).toEqual(true);
    });
});