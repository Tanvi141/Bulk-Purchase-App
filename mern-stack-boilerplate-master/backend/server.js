const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken')

const app = express();
const PORT = 4000;
const userRoutes = express.Router();


let User = require('./models/user');
let Products = require('./models/products');

app.use(cors());
app.use(bodyParser.json());

// Connection to mongodb
mongoose.connect('mongodb://127.0.0.1:27017/users', { useNewUrlParser: true });
// mongoose.connect('mongodb://127.0.0.1:27017/products', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB database connection established succesfully.");
})

// API endpoints

// Getting all the users
userRoutes.route('/').get(function (req, res) {
    User.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
});

// Adding a new user
userRoutes.route('/add').post(function (req, res) {

    let send={
        status:"-1",
        msg:"temp"
    };

    let user = new User(req.body);
    const { username, password, user_type } = req.body;
    if (!username || !password || !user_type) {
        send.msg="Incomplete fields";
        send.status="2";
        res.json(send)
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                send.msg="Username exists already";
                send.status="3";
                res.json(send)
            }

            const newuser = new User({
                username,
                password,
                user_type
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newuser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newuser.password = hash;
                    newuser.save()

                    send.msg="Successfully Added";
                    send.status="0";
                    res.json(send)
                    
                })      
            })
        })
});

// Login an existing user
userRoutes.route('/login').post(function (req, res) {

    let send={
        status:"-1",
        msg:"temp"
    };

    let Username = req.body.username;
    let Password = req.body.password;

    User.findOne({ username: Username })
        .then(user => {
            if (!user) {
                send.msg="User does not exist";
                send.status="2";
                res.json(send)
            }

            bcrypt.compare(Password, user.password)
                .then(isMatch => {
                    if (!isMatch) {
                        send.msg="Wrong password";
                        send.status="3";
                        res.json(send)
                    }

                    else{
                        send.msg="Credentials Valid";
                        send.status="0";
                        send.id=user._id
                        res.json(send)
                    }
                })
        })

});

//Seller adds a product
userRoutes.route('/seller/add_product').post(function (req, res) {

    let send={
        status:"-1",
        msg:"temp"
    };

    let product = new Products(req.body);
    const { name, price, quantity, quantity_left, seller_id } = req.body;

    // all fields need to be present
    if (!name || !quantity || !price) {
        send.msg="Incomplete fields";
        send.status="2";
        res.json(send)
    }


    //make sure is logged in as a Seller
    User.findOne({ username:seller_id })
        .then(user => {
            if (user.user_type==="Buyer"){
                send.msg="Must be logged in as a Seller";
                send.status="2";
                res.json(send)
            }
            else{
                Products.find({ name: name, seller_id: seller_id}, function(err, product) {
                    if (err)
                        console.log(err);
                    else {
                        if (product.length!=0 ) {
                            send.msg="Product exists already with this name registered by you";
                            send.status="3";
                            res.json(send)
                        }

                        else{   
                            const newproduct = new Products({
                                name,
                                price,
                                quantity,
                                quantity_left,
                                seller_id
                            });

                            newproduct.save()
                            send.msg="Successfully Added";
                            send.status="0";
                            res.json(send)
                        }  
                    }
                });
            }
        })

});

//Seller views all registered products
userRoutes.route('/seller/view').post(function (req, res) {
    Products.find({seller_id: req.body.user},function(err, result) {
        if (err) throw err;
        res.json(result)
    });
});

// Getting a user by id
userRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    User.findById(id, function (err, user) {
        res.json(user);
    });
});

app.use('/', userRoutes);

app.listen(PORT, function () {
    console.log("Server is running on port: " + PORT);
});
