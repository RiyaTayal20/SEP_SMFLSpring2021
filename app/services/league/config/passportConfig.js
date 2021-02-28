const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/userModel');

module.exports = (passport) => {
    passport.use(new LocalStrategy(
        (username, password, done) => {
            User.findOne({ username }, (err, user) => {
                if (err) return done(err);
                if (!user) return done(null, false);
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) return done(err);
                    if (!result) {
                        return done(null, false);
                    }
                    return done(null, user);
                });
            });
        },
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};
