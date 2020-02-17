const mongoose = require('mongoose');

let Bookings = new mongoose.Schema({
    product_id: {
        type: String
    },
    buyer_id: {
        type: String
    },
    quantity:{
        type: Number
    }
});

module.exports = mongoose.model('Bookings', Bookings);