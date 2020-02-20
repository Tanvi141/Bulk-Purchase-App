const mongoose = require('mongoose');

let User = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String 
    },
    user_type: {
        type: String
    },
    sum_ratings: {
        type: Number,
    },
    num_ratings: {
        type: Number
    }
});

module.exports = mongoose.model('User', User);