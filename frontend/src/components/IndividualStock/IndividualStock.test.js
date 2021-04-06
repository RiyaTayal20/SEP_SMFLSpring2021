import React, { useEffect, useState as useStateMock} from 'react';
import { shallow } from 'enzyme';

import IndividualStockPage from './IndividualStock';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
        location: {
            state: {
                tickerSymbol: 'TEST'
            }
        }
    }),
}));

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));
describe('<IndividualStockPage />', () => {
    let wrapper;
    const setState = jest.fn();
    const setcurrPrice = jest.fn();
    const setDate = jest.fn();
    const setDays = jest.fn();
    const setPrices = jest.fn();
    const setStatistics = jest.fn();
    beforeEach(() => {
        jest.spyOn(React, 'useEffect').mockImplementation(f => f());
        useStateMock.mockImplementationOnce(f => ['display', setState]);
        useStateMock.mockImplementationOnce(f => ['1337', setcurrPrice]);
        useStateMock.mockImplementationOnce(f => ['3/31/22', setDate]);
        useStateMock.mockImplementationOnce(f => [[3,2], setDays]);
        useStateMock.mockImplementationOnce(f => [[3,2,1], setPrices]);
        useStateMock.mockImplementationOnce(f => [{
            tickerSymbol: '',
            equityName: '',
            peRatio: '',
            askPrice: '',
            avgVolume: '',
            beta: '',
            dividend: '',
            bidPrice: '',
            dayHigh: '',
            dayLow: '',
            earningsDate: '',
            eps: '',
            exDividend: '',
            openPrice: '',
            volume: '',
            week52High: '',
            week52Low: '',
            previousClose: '',
            marketCap: '',
        }, setStatistics]);
        wrapper = shallow(<IndividualStockPage />);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should render the stock container', () => {
        expect(wrapper.find('.stock-container').exists()).toEqual(true);
    });
    it('should render the graph', () => {
        expect(wrapper.find('.graph').exists()).toEqual(true);
    });
    it('should render the stats', () => {
        expect(wrapper.find('.stats').exists()).toEqual(true);
    });
});