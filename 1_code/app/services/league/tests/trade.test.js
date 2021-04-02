const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');

require('dotenv').config();

describe('Trading endpoint', () => {

    let token1;
    let token2;

    beforeAll(async () => {
        await mongoose.connect(process.env.TEST_DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
        });
        // Create user for testing
        const userReqBody1 = {
            'username': 'user1',
            'email': 'user1@email.com',
            'password': 'user1password'
        };
        const userReqBody2 = {
            'username': 'user2',
            'email': 'user2@email.com',
            'password': 'user2password'
        };
        const loginReqBody1 = {
            'username': 'user1',
            'password': 'user1password'
        };
        const loginReqBody2 = {
            'username': 'user2',
            'password': 'user2password'
        };
        // Create user 1
        await request(app)
            .post(`/user/register`)
            .set('Content-Type', 'application/json')
            .send(userReqBody1);
        const res1 = await request(app)
            .post(`/user/login`)
            .set('Content-Type', 'application/json')
            .send(userReqBody1);
        token1 = res1.body.token;
        // Create user 2
        await request(app)
        .post(`/user/register`)
        .set('Content-Type', 'application/json')
        .send(userReqBody2);
        const res2 = await request(app)
            .post(`/user/login`)
            .set('Content-Type', 'application/json')
            .send(userReqBody2);
        token2 = res2.body.token;
        // User 1 creates public league
        const createLeagueReqBody1 = {
            'leagueName': 'Public Test League',
            'settings': {
                'balance': 500,
                'aiPlayer': 0,
                'endDate': '2022-04-23T18:25:43',
                'maxPlayers': 5,
                'public': true
            }
        };
        await request(app)
            .post(`/league/create`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token1}`)
            .send(createLeagueReqBody1);
        // User 2 creates private league
        const createLeagueReqBody2 = {
            'leagueName': 'Private Test League',
            'leagueKey': 'myLeagueKey',
            'settings': {
                'balance': 500,
                'aiPlayer': 0,
                'endDate': '2022-04-23T18:25:43',
                'maxPlayers': 5,
                'public': false
            }
        };
        await request(app)
            .post(`/league/create`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token2}`)
            .send(createLeagueReqBody2);
    });

    it('should not allow you to trade in a league you are not in', async() => {
        const tradeBody = {
            'leagueName': 'Public Test League',
            'orderType': 'marketBuy',
            'quantity': 1,
            'tickerSymbol': 'twtr',
            'expiryDate': '2022-04-23T18:25:43'
        };
        const res = await request(app)
            .post(`/trade/submit`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token2}`)
            .send(tradeBody);
        expect(res.statusCode).toEqual(400);
    });

    it('should allow you to trade in a league you are in', async() => {
        const tradeBody = {
            'leagueName': 'Public Test League',
            'orderType': 'marketBuy',
            'quantity': 1,
            'tickerSymbol': 'twtr',
            'expiryDate': '2022-04-23T18:25:43'
        };
        const res = await request(app)
            .post(`/trade/submit`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token1}`)
            .send(tradeBody);
        expect(res.statusCode).toEqual(200);
        expect(res.body.owner).toEqual('user1');
    });

    it('should not allow you to trade with insufficient funds', async () => {
        const tradeBody = {
            'leagueName': 'Public Test League',
            'orderType': 'marketBuy',
            'quantity': 100000,
            'tickerSymbol': 'twtr',
            'expiryDate': '2022-04-23T18:25:43'
        };
        const res = await request(app)
            .post(`/trade/submit`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token1}`)
            .send(tradeBody);
        expect(res.statusCode).toEqual(400);
    })

    afterAll(async () => {
        await mongoose.connection.db.dropCollection('leagues');
        await mongoose.connection.db.dropCollection('users');
        mongoose.disconnect();
        done();
    });
});