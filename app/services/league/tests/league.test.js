const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');

require('dotenv').config();

describe('League creation', () => {

    let token;

    beforeAll(async () => {
        await mongoose.connect(process.env.TEST_DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
        });
        // Create user for testing
        const userReqBody = {
            'username': 'user1',
            'email': 'user1@email.com',
            'password': 'user1password'
        };
        const loginReqBody = {
            'username': 'user1',
            'password': 'user1password'
        };
        await request(app)
            .post(`/user/register`)
            .set('Content-Type', 'application/json')
            .send(userReqBody);
        const res = await request(app)
            .post(`/user/login`)
            .set('Content-Type', 'application/json')
            .send(userReqBody);
        token = res.body.token;
    });

    it('should allow an authenticated user to create a public league', async () => {
        const createLeagueReqBody = {
            'leagueName': 'My Test League',
            'settings': {
                'balance': 500,
                'aiPlayer': 0,
                'endDate': '2022-04-23T18:25:43',
                'maxPlayers': 5,
                'public': true
            }
        };
        const expectedResponse = {
            'settings': {
                'balance': 500,
                'aiPlayer': 0,
                'endDate': '2022-04-23T22:25:43.000Z',
                'maxPlayers': 5,
                'public': true
            },
            'leagueName': 'My Test League',
            'leagueKey': '',
            'leagueManager': 'user1'

        };
        const res = await request(app)
            .post(`/league/create`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(createLeagueReqBody);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(expectedResponse);
    });

    it('should allow not allow an unauthenticated user to create a league', async () => {
        const createLeagueReqBody = {
            'leagueName': 'My Test League',
            'settings': {
                'balance': 500,
                'aiPlayer': 0,
                'endDate': '2022-04-23T18:25:43',
                'maxPlayers': 5,
                'public': true
            }
        };
        const res = await request(app)
            .post(`/league/create`)
            .set('Content-Type', 'application/json')
            .send(createLeagueReqBody)
        expect(res.statusCode).toEqual(401);
    });

    afterAll(async () => {
        await mongoose.connection.db.dropCollection('leagues');
        await mongoose.connection.db.dropCollection('users');
        mongoose.disconnect();
        done();
    });
});
