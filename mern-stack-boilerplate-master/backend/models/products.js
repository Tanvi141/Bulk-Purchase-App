const mongoose = require('mongoose');

let Products = new mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: Number 
    },
    quantity: {
        type: Number
    },
    quantity_left: {
        type: Number
    },
    seller_id:{
        // username
        type: String
    }
});

module.exports = mongoose.model('Products', Products);