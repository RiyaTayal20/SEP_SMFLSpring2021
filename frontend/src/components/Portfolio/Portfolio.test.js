import React, { useEffect, useState as useStateMock } from 'react';
import { shallow } from 'enzyme';

import Portfolio from './Portfolio';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));
describe('<Portfolio />', () => {
    let wrapper;
    const setLeague = jest.fn();
    const setLeagueList = jest.fn();
    const setPortfolio = jest.fn();
    const getLeagues = jest.fn();
    beforeEach(() => {
        jest.spyOn(React, 'useEffect').mockImplementation(f => f());
        useStateMock.mockImplementationOnce(f => ['league1', setLeague]);
        useStateMock.mockImplementationOnce(f => [['league1', 'league2'], setLeagueList]);
        useStateMock.mockImplementationOnce(f => ['portfolio', setPortfolio]);
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
    it('should call the getLeagues function', () => {
        expect(getLeagues).toHaveBeenCalled();
    });
});