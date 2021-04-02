const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
require('dotenv').config();

module.exports = (passport) => {
    passport.use(new JWTstrategy(
        {
            secretOrKey: `${process.env.JWT_KEY}`,
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token'),
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (err) {
                return done(err);
            }
        },
    ));
};
