const { check, validationResult } = require('express-validator');
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

exports.authValidation = [
    check('Authorization')
        .not()
        .isEmpty()
        .withMessage('Authorization is required for this action')
        .isString()
        .withMessage('Authorization must be a string'),
    (req, res, next) => {
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
        next();
    },
];
