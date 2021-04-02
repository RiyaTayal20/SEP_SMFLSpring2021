const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');

require('dotenv').config();

describe('User registration', () => {

    beforeAll(async () => {
        await mongoose.connect(process.env.TEST_DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
        });
    });

    it('should be able to create a user', async () => {
        const userReqBody = {
            'username': 'user1',
            'email': 'user1@email.com',
            'password': 'user1password'
        };
        const expectedResponse = {
            'leagues': [],
            'username': 'user1',
            'email': 'user1@email.com'
        };
        const res = await request(app)
            .post(`/user/register`)
            .set('Content-Type', 'application/json')
            .send(userReqBody);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(expectedResponse);
    });

    it('should reject a registration without username', async () => {
        const userReqBody = {
            'username': '',
            'email': 'user1@email.com',
            'password': 'user1password'
        };
        const res = await request(app)
            .post(`/user/register`)
            .set('Content-Type', 'application/json')
            .send(userReqBody);
        expect(res.statusCode).toEqual(422);
    });

    it('should reject a registration without email', async () => {
        const userReqBody = {
            'username': 'user1',
            'email': '',
            'password': 'user1password'
        };
        const res = await request(app)
            .post(`/user/register`)
            .set('Content-Type', 'application/json')
            .send(userReqBody);
        expect(res.statusCode).toEqual(422);
    });

    it('should reject a registration without password', async () => {
        const userReqBody = {
            'username': 'user1',
            'email': 'user1@email.com',
            'password': ''
        };
        const res = await request(app)
            .post(`/user/register`)
            .set('Content-Type', 'application/json')
            .send(userReqBody);
        expect(res.statusCode).toEqual(422);
    });

    it('should reject a registration with the same username', async () => {
        const userReqBody = {
            'username': 'user1',
            'email': 'newuser1@email.com',
            'password': 'newuser1password'
        };
        const res = await request(app)
            .post(`/user/register`)
            .set('Content-Type', 'application/json')
            .send(userReqBody);
        expect(res.statusCode).toEqual(422);
    });

    afterAll(async () => {
        await mongoose.connection.db.dropCollection('users');
        mongoose.disconnect();
        done();
    });

});

describe('User login', () => {

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
        const res = await request(app)
            .post(`/user/register`)
            .set('Content-Type', 'application/json')
            .send(userReqBody);
    });

    it('should be able to authenticate a user', async () => {
        const userReqBody = {
            'username': 'user1',
            'password': 'user1password'
        };
        const res = await request(app)
            .post(`/user/login`)
            .set('Content-Type', 'application/json')
            .send(userReqBody);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({ 'username': 'user1' })
        expect(res.body).toHaveProperty('token');
    });

    it('should reject an invalid username', async () => {
        const userReqBody = {
            'username': 'user0',
            'password': 'user1password'
        };
        const res = await request(app)
            .post(`/user/login`)
            .set('Content-Type', 'application/json')
            .send(userReqBody);
        expect(res.statusCode).toEqual(401);
    });

    it('should reject an invalid password', async () => {
        const userReqBody = {
            'username': 'user1',
            'password': 'user0password'
        };
        const res = await request(app)
            .post(`/user/login`)
            .set('Content-Type', 'application/json')
            .send(userReqBody);
        expect(res.statusCode).toEqual(401);
    });

    afterAll(async () => {
        await mongoose.connection.db.dropCollection('users');
        mongoose.disconnect();
        done();
    });
});

describe('Get endpoints', () => {

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
        const res = await request(app)
            .post(`/user/register`)
            .set('Content-Type', 'application/json')
            .send(userReqBody);
    });

    it('should get a list of leagues for a user', async () => {
        const expectedLeagues = [];
        const res = await request(app)
            .get(`/user/user1/league`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(expectedLeagues);
    })

    afterAll(async () => {
        await mongoose.connection.db.dropCollection('users');
        mongoose.disconnect();
        done();
    });

});
