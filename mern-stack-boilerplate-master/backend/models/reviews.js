const mongoose = require('mongoose');

let Reviews = new mongoose.Schema({
    seller_id: {
        type: String
    },
    product_name: {
        type: String
    },
    review: {
        type: String
    },
    rating: {
        type: Number
    },
    buyer_id: {
        type: String
    },
    product_id:{
        type: String
    }
});

module.exports = mongoose.model('Reviews', Reviews);