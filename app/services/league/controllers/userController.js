/** @module controllers/userController */

const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const League = require('../models/leagueModel');
require('../config/passportConfig')(passport);
require('dotenv').config();

/**
 * Register a user into the system and create a user entity
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
exports.register = async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
};

/**
 * Log a user in and return a JWT to manage the session
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
exports.login = async (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(401).send('Invalid username or password.');
        req.logIn(user, { session: false }, (err) => {
            if (err) return next(err);
            const body = { _id: user._id, username: user.username };
            const token = jwt.sign({ user: body }, `${process.env.JWT_KEY}`);

            return res.send({ token, username: user.username });
        });
    })(req, res, next);
};

// exports.findUserById = async (req, res) => {
//     await User.findById(req.body._id, (err, user) => {
//         if (err) throw err;
//         res.send(user);
//     });
// };

/**
 * Retrieve a league, given a portfolio in that league
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
exports.getLeagueByUser = async (req, res) => {
    await League.find({ 'portfolioList.owner': req.params.username }, (err, result) => {
        if (err) throw err;
        if (!result) res.status(404).send('League not found');
        else res.send(result);
    });
};

/**
 * Get all AI players
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Object} AI user profiles
 */
 exports.getAI = async (req, res) => {
    await User.find({'isBot': true} , (err, result) => {
        if (err) throw err;
        if (!result) res.status(404).send('League not found');
        res.send(result);
    });
};
