const mongoose = require('mongoose');

const User = mongoose.model(
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role',
            },
        ],
    }),
);

module.exports = User;
