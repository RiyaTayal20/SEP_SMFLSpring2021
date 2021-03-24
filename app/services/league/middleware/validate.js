const { check, validationResult } = require('express-validator');
const fetch = require('node-fetch');

const jwtDecode = require('jwt-decode');
const User = require('../models/userModel');
const League = require('../models/leagueModel');

exports.signup = [
    check('username')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Username must be minimum 3 characters')
        .custom((value) => User.findOne({
            username: value,
        }).then((user) => {
            if (user) {
                return Promise.reject(new Error('Username already in use'));
            }
        })),
    check('email')
        .trim()
        .isEmail()
        .withMessage('Not a valid email')
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .custom((value) => User.findOne({
            email: value,
        }).then((user) => {
            if (user) {
                return Promise.reject(new Error('Email already in use'));
            }
        })),
    check('password')
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6, max: 1024 })
        .withMessage('Password must be minimum 6 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
        next();
    },
];

exports.ticker = [
    check('tickerSymbol')
        .trim()
        .toLowerCase()
        .not()
        .isEmpty()
        .withMessage('Ticker is required')
        .custom(async (value) => {
            let tickerExists = false;
            await fetch(`${process.env.STOCK_URL}/equity/tickers/${value}`)
                .then((response) => response.json())
                .then((data) => {
                    tickerExists = data.exists;
                });
            if (!tickerExists) {
                return Promise.reject(new Error('Ticker does not exist'));
            }
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(404).json({ errors: errors.array() });
        next();
    },
];

exports.leagueCreation = [
    check('leagueName')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('League name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('League name must be minimum 3 characters')
        .custom((value) => League.findOne({
            leagueName: value,
        }).then((league) => {
            if (league) {
                return Promise.reject(new Error('League name already in use'));
            }
        })),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
        next();
    },
];

exports.findValidLeague = [
    check('leagueName')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('League name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('League name must be minimum 3 characters'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

        const league = await League
            .findOne({
                leagueName: req.body.leagueName,
            })
            .then((result) => result)
            .catch(() => null);
        if (!league) return res.status(422).json('Error: League not found');
        res.locals.league = league;
        next();
    },
];

exports.authValidation = [
    check('Authorization')
        .not()
        .isEmpty()
        .withMessage('Authorization is required for this action')
        .isString()
        .withMessage('Authorization must be a string'),
    async (req, res, next) => {
        const errors = validationResult(req);
        const spaceSplit = req.headers.authorization.split(' ');
        if (spaceSplit.length !== 2 || spaceSplit[0] !== 'Bearer') {
            return res.status(401).json('Bad Authorization ("Bearer <token>")');
        }
        const dotSplit = spaceSplit[1].split('.');
        if (dotSplit.length !== 3) {
            return res.status(401).json('Bad Authorization. Token should have 3 periods');
        }
        if (!errors.isEmpty()) return res.status(401).json({ errors: errors.array() });
        try {
            const decodedToken = jwtDecode(req.headers.authorization.slice(7));
            res.locals.username = decodedToken.user.username;
        } catch (err) {
            return res.status(401).json('Bad Authorization. Cannot decode token');
        }
        const userCheck = await User.findOne({
            username: res.locals.username,
        }).then((user) => user).catch(() => null);

        if (!userCheck) return res.status(401).json('Bad Authorization. Cannot find decrypted user');
        next();
    },
];
