import React from 'react';
import { shallow } from 'enzyme';

import App from './App';

describe('<App />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<App />);
    });
    it('should render Router', () => {
        expect(wrapper.exists('BrowserRouter')).toEqual(true);
    });
    it('should render Header', () => {
        expect(wrapper.exists('Header')).toEqual(true);
    });
    
    describe('Registration Page Route', () => {
        let route;
        beforeEach(() => {
            route = wrapper.find('Switch').at(0).children().at(0);
        });
        it('should render the Registration Page', () => {
            expect(route.exists('Register')).toEqual(true);
        });

        it('should pass the correct path into Registration Page ', () => {
            expect(route.prop('path')).toEqual('/user/register');
        });
    });

    describe('Login Page Route', () => {
        let route;
        beforeEach(() => {
            route = wrapper.find('Switch').at(0).children().at(1);
        });
        it('should render the Login Page', () => {
            expect(route.exists('Login')).toEqual(true);
        });

        it('should pass the correct path into Login Page ', () => {
            expect(route.prop('path')).toEqual('/user/login');
        });
    });

    describe('Home Page Route', () => {
        let route;
        beforeEach(() => {
            route = wrapper.find('Switch').at(0).children().at(2);
        });
        it('should render the Home Page Page', () => {
            expect(route.exists('Home')).toEqual(true);
        });

        it('should pass the correct path into Home Page Page ', () => {
            expect(route.prop('path')).toEqual('/home');
        });
    });

    describe('Create League Page Route', () => {
        let route;
        beforeEach(() => {
            route = wrapper.find('Switch').at(0).children().at(3);
        });
        it('should render the Create League Page', () => {
            expect(route.exists('CreateLeague')).toEqual(true);
        });

        it('should pass the correct path into Create League Page ', () => {
            expect(route.prop('path')).toEqual('/league/create');
        });
    });

    describe('Join League Page Route', () => {
        let route;
        beforeEach(() => {
            route = wrapper.find('Switch').at(0).children().at(4);
        });
        it('should render the Join League Page', () => {
            expect(route.exists('JoinLeague')).toEqual(true);
        });

        it('should pass the correct path into Join League Page ', () => {
            expect(route.prop('path')).toEqual('/league/join');
        });
    });

    describe('League Management Page Route', () => {
        let route;
        beforeEach(() => {
            route = wrapper.find('Switch').at(0).children().at(5);
        });
        it('should render the League Management Page', () => {
            expect(route.exists('LeagueManagement')).toEqual(true);
        });

        it('should pass the correct path into League Management Page ', () => {
            expect(route.prop('path')).toEqual('/league/manage');
        });
    });

    describe('Individual Stock Page Route', () => {
        let route;
        beforeEach(() => {
            route = wrapper.find('Switch').at(0).children().at(6);
        });
        it('should render the Individual Stock Page', () => {
            expect(route.exists('IndividualStockPage')).toEqual(true);
        });

        it('should pass the correct path into Individual Stock Page ', () => {
            expect(route.prop('path')).toEqual('/stock');
        });
    });

    describe('Trade Page Route', () => {
        let route;
        beforeEach(() => {
            route = wrapper.find('Switch').at(0).children().at(7);
        });
        it('should render the Trade Page', () => {
            expect(route.exists('Trade')).toEqual(true);
        });

        it('should pass the correct path into Trade Page ', () => {
            expect(route.prop('path')).toEqual('/trade');
        });
    });

    describe('Current Leagues Page Route', () => {
        let route;
        beforeEach(() => {
            route = wrapper.find('Switch').at(0).children().at(8);
        });
        it('should render the Current Leagues Page', () => {
            expect(route.exists('CurrentLeagues')).toEqual(true);
        });

        it('should pass the correct path into Current Leagues Page ', () => {
            expect(route.prop('path')).toEqual('/league/view');
        });
    });

    describe('Portfolio Page Route', () => {
        let route;
        beforeEach(() => {
            route = wrapper.find('Switch').at(0).children().at(9)
        });
        it('should render the Portfolio Page', () => {
            expect(route.exists('Portfolio')).toEqual(true);
        });

        it('should pass the correct path into Portfolio Page ', () => {
            expect(route.prop('path')).toEqual('/portfolio');
        });
    });

    describe('Symbol Lookup Page Route', () => {
        let route;
        beforeEach(() => {
            route = wrapper.find('Switch').at(0).children().at(10)
        });
        it('should render the Symbol Lookup Page', () => {
            expect(route.exists('SymbolLookup')).toEqual(true);
        });

        it('should pass the correct path into Symbol Lookup Page ', () => {
            expect(route.prop('path')).toEqual('/lookup');
        });
    });

    describe('News Page route', () => {
        let route;
        beforeEach(() => {
            route = wrapper.find('Switch').at(0).children().at(11)
        });
        it('should render the News Page Page', () => {
            expect(route.exists('News')).toEqual(true);
        });

        it('should pass the correct path into News Page ', () => {
            expect(route.prop('path')).toEqual('/news');
        });
    });

    describe('AI Page Route', () => {
        let route;
        beforeEach(() => {
            route = wrapper.find('Switch').at(0).children().at(12)
        });
        it('should render the AI Page', () => {
            expect(route.exists('AIPage')).toEqual(true);
        });

        it('should pass the correct path into AI Page ', () => {
            expect(route.prop('path')).toEqual('/ai');
        });
    });

    describe('Summary Page Route', () => {
        let route;
        beforeEach(() => {
            route = wrapper.find('Switch').at(0).children().at(13)
        });
        it('should render the Summary Page', () => {
            expect(route.exists('Summary')).toEqual(true);
        });

        it('should pass the correct path into Summary Page ', () => {
            expect(route.prop('path')).toEqual('/summary');
        });
    });

    describe('Centralized League Page Route', () => {
        let route;
        beforeEach(() => {
            route = wrapper.find('Switch').at(0).children().at(14)
        });
        it('should render the Centralized League Page', () => {
            expect(route.exists('CentralizedLeague')).toEqual(true);
        });

        it('should pass the correct path into Centralized League Page ', () => {
            expect(route.prop('path')).toEqual('/centralizedleague');
        });
    });
});
