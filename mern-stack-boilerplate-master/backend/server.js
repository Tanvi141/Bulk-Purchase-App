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
        msg:"temp",
        type:""
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
                        send.type=user.user_type
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
                Products.find({ $and : [{name: name, seller_id: seller_id}, {$or : [ { status : "Available" }, { status : "Posted"}]}]}, function(err, product) {
                    if (err)
                        console.log(err);
                    else {
                        if (product.length!=0) {
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
                                seller_id,
                                status:"Available"
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
    Products.find({seller_id: req.body.user, status: "Available"},function(err, result) {
        if (err) throw err;
        res.json(result)
    });
});

//Delete a product
userRoutes.route('/seller/delete_product').post(function (req, res) {

    let send={
        status:"-1",
        msg:"temp"
    };

    // const { name, price, quantity, quantity_left, seller_id, status } = req.body;

    Products.findOneAndUpdate({ _id:req.body._id },{$set:{status:"Deleted"}}, function(err, product) {
        if (err){
            console.log(err);
            send.status=1;
            send.msg="Error in deleting";
            res.json(send)
        }
        else { 
            send.status=0;
            send.msg="Deleted";
            res.json(send)  
        }
    });
});


app.use('/', userRoutes);

app.listen(PORT, function () {
    console.log("Server is running on port: " + PORT);
});
