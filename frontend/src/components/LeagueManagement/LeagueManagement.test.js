import React, { useState as useStateMock } from 'react';
import { shallow } from 'enzyme';

import LeagueManagement from './LeagueManagement';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));

describe('<LeagueManagement />', () => {
    let wrapper;
    const setLeagues = jest.fn();
    const setSelectedLeague = jest.fn();
    const setSelectedPlayer = jest.fn();
    const setAmount = jest.fn();
    const setShowError = jest.fn();
    const setNotifMessage = jest.fn();
    const setShowModal = jest.fn();
    const setShowModalKick = jest.fn();
    const setShowAlert = jest.fn();
    beforeEach(() => {
        useStateMock.mockImplementationOnce(f => [['league1', 'league2'], setLeagues]);
        useStateMock.mockImplementationOnce(f => ['league1', setSelectedLeague]);
        useStateMock.mockImplementationOnce(f => ['player', setSelectedPlayer]);
        useStateMock.mockImplementationOnce(f => [1, setAmount]);
        useStateMock.mockImplementationOnce(f => [false, setShowAlert]);
        useStateMock.mockImplementationOnce(f => [false, setShowError]);
        useStateMock.mockImplementationOnce(f => ['message', setNotifMessage]);
        useStateMock.mockImplementationOnce(f => [false, setShowModal]);
        useStateMock.mockImplementationOnce(f => [false, setShowModalKick]);
        wrapper = shallow(<LeagueManagement />);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the League Management Container', () => {
        expect(wrapper.find('.manage-league-container').exists()).toEqual(true);
    });
    it('should render the Manage League form', () => {
        expect(wrapper.exists('Form')).toEqual(true);
    });
});