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
        if (!user) return next(err);
        req.logIn(user, { session: false }, (err) => {
            if (err) return next(err);
            const body = { _id: user._id, email: user.email };
            const token = jwt.sign({ user: body }, `${process.env.JWT_KEY}`);

            return res.json({ token });
        });
    })(req, res, next);
};

exports.profile = async (req, res) => {
    res.json({
        message: 'You accessed a secure route',
        user: req.user,
        token: req.query.secret_token,
    });
};
