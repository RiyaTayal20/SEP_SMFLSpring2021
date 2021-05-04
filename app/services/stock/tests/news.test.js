const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');

require('dotenv').config();

const TEST_EQUITY = 'twtr';

describe('Get endpoints', () => {

    beforeAll(async () => {
        await mongoose.connect(process.env.TEST_DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
        });
    });

    it('should get news for a specific ticker', async () => {
        const res = await request(app)
            .get(`/news/newsInfo/${TEST_EQUITY}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).not.toBeUndefined();
    });

    it('should reject invalid endpoints', async () => {
        const res = await request(app)
            .get(`/news/gibberish`);
        expect(res.body).toEqual(404);
    });

    afterAll(async () => {
        await mongoose.connection.db.dropCollection('news');
        mongoose.disconnect();
        done();
    });
});