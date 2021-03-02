const { check, validationResult } = require('express-validator');
const User = require('../models/userModel');

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
