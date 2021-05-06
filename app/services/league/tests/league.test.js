const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');

const League = require('../models/leagueModel');
const User = require('../models/userModel');

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
        const league = await League.findOne(
            { leagueName: 'My Test League' },
        );
        expect(league).not.toBeNull();
    });

    it('should allow an authenticated user to create a private league', async () => {
        const createLeagueReqBody = {
            'leagueName': 'My Private Test League',
            'leagueKey': 'myLeagueKey',
            'settings': {
                'balance': 500,
                'aiPlayer': 0,
                'endDate': '2022-04-23T18:25:43',
                'maxPlayers': 5,
                'public': false
            }
        };
        const expectedResponse = {
            'settings': {
                'balance': 500,
                'aiPlayer': 0,
                'endDate': '2022-04-23T22:25:43.000Z',
                'maxPlayers': 5,
                'public': false
            },
            'leagueName': 'My Private Test League',
            'leagueKey': 'myLeagueKey',
            'leagueManager': 'user1'

        };
        const res = await request(app)
            .post(`/league/create`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(createLeagueReqBody);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(expectedResponse);
        const league = await League.findOne(
            { leagueName: 'My Private Test League' },
        );
        expect(league).not.toBeNull();
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

describe('Joining, leaving, and disbanding leagues', () => {

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
        // User 1 creates full public league
        const createLeagueReqBody3 = {
            'leagueName': 'Public Test Full League',
            'settings': {
                'balance': 500,
                'aiPlayer': 0,
                'endDate': '2022-04-23T18:25:43',
                'maxPlayers': 1,
                'public': true
            }
        };
        await request(app)
            .post(`/league/create`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token1}`)
            .send(createLeagueReqBody3);
    });

    it('should be able to join a public league', async () => {
        const joinLeagueReqBody = {
            'leagueName': 'Public Test League'
        };
        const res = await request(app)
            .post(`/league/join`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token2}`)
            .send(joinLeagueReqBody);
        expect(res.statusCode).toEqual(200);
        const league = await League.findOne(
            { leagueName: 'Public Test League' },
        );
        expect(league.playerList).toEqual(expect.arrayContaining(['user2']));
    });

    it('should not be able to join a private league with an incorrect password', async () => {
        const joinLeagueReqBody = {
            'leagueName': 'Private Test League',
            'leagueKey': 'wrongKey'
        };
        const res = await request(app)
            .post(`/league/join`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token1}`)
            .send(joinLeagueReqBody);
        expect(res.statusCode).toEqual(400);
        const league = await League.findOne(
            { leagueName: 'Private Test League' },
        );
        expect(league.playerList).toEqual(expect.not.arrayContaining(['user1']));
    });

    it('should be able to join a private league', async () => {
        const joinLeagueReqBody = {
            'leagueName': 'Private Test League',
            'leagueKey': 'myLeagueKey'
        };
        const res = await request(app)
            .post(`/league/join`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token1}`)
            .send(joinLeagueReqBody);
        expect(res.statusCode).toEqual(200);
        const league = await League.findOne(
            { leagueName: 'Private Test League' },
        );
        expect(league.playerList).toEqual(expect.arrayContaining(['user1']));
    });

    it('should not be able to join a league you are already in', async () => {
        const joinLeagueReqBody = {
            'leagueName': 'Public Test League'
        };
        const res = await request(app)
            .post(`/league/join`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token1}`)
            .send(joinLeagueReqBody);
        expect(res.statusCode).toEqual(422);
    });

    it('should not be able to join a league that is full', async () => {
        const joinLeagueReqBody = {
            'leagueName': 'Public Test Full League'
        };
        const res = await request(app)
            .post(`/league/join`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token2}`)
            .send(joinLeagueReqBody);
        expect(res.statusCode).toEqual(400);
        const league = await League.findOne(
            { leagueName: 'Public Test Full League' },
        );
        expect(league.playerList).toEqual(expect.not.arrayContaining(['user2']));
    });

    it('should not be able to leave a league you are not in', async () => {
        const leaveReqBody = {
            'leagueName': 'Nonexistant League'
        };
        const res = await request(app)
            .post(`/league/leave`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token2}`)
            .send(leaveReqBody);
        expect(res.statusCode).toEqual(422);
    });

    it('should be able to leave a league', async () => {
        const leaveReqBody = {
            'leagueName': 'Public Test League'
        };
        const res = await request(app)
            .post(`/league/leave`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token2}`)
            .send(leaveReqBody);
        expect(res.statusCode).toEqual(200);
        const league = await League.findOne(
            { leagueName: 'Public Test League' },
        );
        expect(league.playerList).toEqual(expect.not.arrayContaining(['user2']));
    });

    it('should not be able to disband a league you are not in', async () => {
        const disbandReqBody = {
            'leagueName': 'Public Test Full League'
        };
        const res = await request(app)
            .post(`/league/disband`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token2}`)
            .send(disbandReqBody);
        expect(res.statusCode).toEqual(401);
        const league = await League.findOne(
            { leagueName: 'Public Test Full League' },
        );
        expect(league).not.toBeNull();
    });

    it('should not be able to disband a league you are not the league manager of', async () => {
        const disbandReqBody = {
            'leagueName': 'Public Test League'
        };
        const res = await request(app)
            .post(`/league/disband`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token2}`)
            .send(disbandReqBody);
        expect(res.statusCode).toEqual(401);
        const league = await League.findOne(
            { leagueName: 'Public Test League' },
        );
        expect(league).not.toBeNull();
    });

    it('should be able to disband a league you are the league manager of', async () => {
        const beforeDisband = await League.findOne(
            { leagueName: 'Private Test League' },
        );
        const leagueId = beforeDisband._id;
        const disbandReqBody = {
            'leagueName': 'Private Test League'
        };
        const res = await request(app)
            .post(`/league/disband`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token2}`)
            .send(disbandReqBody);
        expect(res.statusCode).toEqual(200);
        const league = await League.findOne(
            { leagueName: 'Private Test League' },
        );
        expect(league).toBeNull();
        const user1 = await User.findOne(
            { username: 'user1' },
        );
        const user2 = await User.findOne(
            { username: 'user2' },
        );
        expect(user1.leagues).toEqual(expect.not.arrayContaining([leagueId]));
        expect(user2.leagues).toEqual(expect.not.arrayContaining([leagueId]));
    });

    afterAll(async () => {
        await mongoose.connection.db.dropCollection('leagues');
        await mongoose.connection.db.dropCollection('users');
        mongoose.disconnect();
        done();
    });
});


describe('Get endpoints', () => {

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
        // User 1 creates full public league
        const createLeagueReqBody3 = {
            'leagueName': 'Public Test Full League',
            'settings': {
                'balance': 500,
                'aiPlayer': 0,
                'endDate': '2022-04-23T18:25:43',
                'maxPlayers': 1,
                'public': true
            }
        };
        await request(app)
            .post(`/league/create`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token1}`)
            .send(createLeagueReqBody3);
    });

    it('should get a list of all leagues', async () => {
        const res = await request(app)
            .get(`/league/find/all`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining(
            {
                leagueName: 'Public Test League'
            },
            {
                leagueName: 'Private Test League'
            },
            {
                leagueName: 'Public Test Full League'
            }
        )]));
    });

    it('should get a list of all league names', async () => {
        const res = await request(app)
            .get(`/league/find/names`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining(
            {
                leagueName: 'Public Test League'
            },
            {
                leagueName: 'Private Test League'
            },
            {
                leagueName: 'Public Test Full League'
            }
        )]));
    });

    it('should get a league by name', async () => {
        const queryLeague = 'Public Test League';
        const res = await request(app)
            .get(`/league/find/${queryLeague}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.leagueName).toEqual('Public Test League');
    });

    it('should not get a portfolio for a league you are not in', async () => {
        const queryLeague = 'Fake League';
        const res = await request(app)
            .get(`/league/portfolio/${queryLeague}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token1}`);
        expect(res.statusCode).toEqual(422);
    });

    it('should get a portfolio for a league you are in', async () => {
        const queryLeague = 'Public Test League';
        const res = await request(app)
            .get(`/league/portfolio/${queryLeague}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token1}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('currentNetWorth');
        expect(res.body).toHaveProperty('cashAvailable');
        expect(res.body).toHaveProperty('holdings');
        expect(res.body).toHaveProperty('netWorth');
    });


    it('should get all the tooltips', async () => {
        const res = await request(app)
            .get(`/league/tooltips/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token1}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('previousclose');
    });

    it('should get the portfolio of another specified user', async () => {
        const queryLeague = 'Public Test League';
        const queryUser = 'user1';
        const res = await request(app)
            .get(`/league/specifiedportfolio/${queryLeague}/${queryUser}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token1}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('currentNetWorth');
        expect(res.body).toHaveProperty('cashAvailable');
    });

    it('should get news related to a user portfolio', async () => {
        const queryLeague = 'Public Test League';
        const res = await request(app)
            .get(`/league/news/${queryLeague}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token1}`);
        expect(res.statusCode).toEqual(200);

    });

    afterAll(async () => {
        await mongoose.connection.db.dropCollection('leagues');
        await mongoose.connection.db.dropCollection('users');
        mongoose.disconnect();
        done();
    });
});
