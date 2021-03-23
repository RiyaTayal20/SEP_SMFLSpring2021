const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('../config/passportConfig')(passport);
require('dotenv').config();

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

exports.login = async (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(401).send('Invalid username or password.');
        req.logIn(user, { session: false }, (err) => {
            if (err) return next(err);
            const body = { _id: user._id, username: user.username };
            const token = jwt.sign({ user: body }, `${process.env.JWT_KEY}`);

            return res.send(token);
        });
    })(req, res, next);
};

exports.findUserById = async (req, res) => {
    await User.findById(req.body._id, (err, user) => {
        if (err) throw err;
        res.send(user);
    });
};

exports.findUserById = async (req, res) => {
    await User.findById(req.body._id, (err, user) => {
        if (err) throw err;
        res.send(user);
    });
};
