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
    },
    name: {
        type: String
    },
    price: {
        type: Number 
    },
    quantity_total: {
        type: Number
    },
    quantity_left: {
        //update
        type: Number
    },
    seller_id:{
        // username
        type: String
    },
    status:{
        //update
        //Available, Placed, Dispatched, Deleted
        type: String
    }
});

module.exports = mongoose.model('Bookings', Bookings);