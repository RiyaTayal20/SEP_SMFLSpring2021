require('dotenv').config();

const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = db.user;
const Role = db.role;

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });
}


