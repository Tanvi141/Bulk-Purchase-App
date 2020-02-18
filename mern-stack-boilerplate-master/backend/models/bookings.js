const mongoose = require('mongoose');

let Bookings = new mongoose.Schema({
    product_id: {
        type: String
    },
    buyer_name: {
        type: String
    },
    quantity:{
        type: Number
    },
    status_by_buyer:{
        type: String
    }
});

module.exports = mongoose.model('Bookings', Bookings);