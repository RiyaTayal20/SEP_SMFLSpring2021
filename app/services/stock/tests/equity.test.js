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

    it('should get intraday price data', async () => {
        const res = await request(app)
            .get(`/equity/intraday/${TEST_EQUITY}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).not.toBeUndefined();
    });

    it('should get current price data', async () => {
        const res = await request(app)
            .get(`/equity/current/${TEST_EQUITY}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('price')
    });

    it('should get historical price data', async () => {
        const res = await request(app)
            .get(`/equity/historical/${TEST_EQUITY}?timeframe=5d`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).not.toBeUndefined();
    });

    it('should get equity statistics', async () => {
        const res = await request(app)
            .get(`/equity/statistics/${TEST_EQUITY}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('peRatio');
        expect(res.body).toHaveProperty('dividend');
        expect(res.body).toHaveProperty('beta');
        expect(res.body).toHaveProperty('volume');
    });

    it('should get valid tickers', async () => {
        const res = await request(app)
            .get(`/equity/tickers/${TEST_EQUITY}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('exists');
    });

    afterAll(async () => {
        await mongoose.connection.db.dropCollection('equities');
        mongoose.disconnect();
        done();
    });
});