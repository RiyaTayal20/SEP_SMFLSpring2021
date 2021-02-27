/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/userModel');
require('../config/passportConfig')(passport);

exports.register = async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 8),
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
        if (!user) return res.send('Wrong username or password');
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect('/user');
        });
    })(req, res, next);
};

exports.profile = async (req, res) => {
    res.send(req.user);
};
