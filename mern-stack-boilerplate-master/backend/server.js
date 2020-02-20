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
let Bookings = require('./models/bookings');
let Reviews = require('./models/reviews');

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

    else{
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
                user_type,
                sum_ratings: 0, //default 3
                num_ratings: 0
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
    }
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
    else{
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
    }
});

//Seller views all products of certain type
userRoutes.route('/seller/view').post(function (req, res) {
    //update statuses also
    Products.update({ quantity_left: 0, status:"Available"},{$set:{status:"Posted"}},{multi:true},
        function(err, product) {
            if (err){
                console.log(err);
            }
            else {  
        }
    });

    Products.update({quantity_left:{$ne:0}, status:"Posted"},{$set:{status:"Available"}},{multi:true},
        function(err, product) {
            if (err){
                console.log(err);
            }
            else {  
        }
    });

    Products.find({seller_id: req.body.user, status: req.body.type },function(err, result) {
        if (err) throw err;
        res.json(result)
    });
});

//Buyer search results
userRoutes.route('/buyer/results').post(function (req, res) {
    //update statuses also
    Products.update({ quantity_left: 0, status:"Available"},{$set:{status:"Posted"}},{multi:true},
        function(err, product) {
            if (err){
                console.log(err);
            }
            else {  
        }
    });

    Products.update({quantity_left:{$ne:0}, status:"Posted"},{$set:{status:"Available"}},{multi:true},
        function(err, product) {
            if (err){
                console.log(err);
            }
            else {  
        }
    });

    if(req.body.user_type==="Price"){
        Products.find({name: {$regex: req.body.search}, status:"Available"},function(err, result) {
            if (err) throw err;
            res.json(result)
        }).sort({price: 1});
    }

    else if(req.body.user_type==="Rating"){
        Products.find({name: req.body.search, status:"Available"},function(err, result) {
            if (err) throw err;
            res.json(result)
        }).sort({avg: -1});
    }

    else{
        Products.find({name: req.body.search, status:"Available"},function(err, result) {
            if (err) throw err;
            res.json(result)
        }).sort({quantity_left: -1});
    }
});

//Delete a product by seller
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

//Dispatch a product by a seller
userRoutes.route('/seller/dispatch_product').post(function (req, res) {

    let send={
        status:"-1",
        msg:"temp"
    };

    // const { name, price, quantity, quantity_left, seller_id, status } = req.body;

    Products.findOneAndUpdate({ _id:req.body._id },{$set:{status:"Dispatched"}}, function(err, product) {
        if (err){
            console.log(err);
            send.status=1;
            send.msg="Error in dipatching";
            res.json(send)
        }
        else { 
            send.status=0;
            send.msg="Dispatched";
            res.json(send)  
        }
    });
});

//Try to place an order
userRoutes.route('/buyer/trybuy').post(function (req, res) {

    //update statuses also
    Products.update({ quantity_left: 0, status:"Available"},{$set:{status:"Posted"}},{multi:true},
        function(err, product) {
            if (err){
                console.log(err);
            }
            else {  
        }
    });

    Products.update({quantity_left:{$ne:0}, status:"Posted"},{$set:{status:"Available"}},{multi:true},
        function(err, product) {
            if (err){
                console.log(err);
            }
            else {  
        }
    });

    let send={
        status:"-1",
        msg:"temp"
    };


    console.log(req.body.buyer_name)
    console.log(-1*Number(req.body.value))
    Products.find({$and:[{_id:req.body.item._id},{ quantity_left: { $gte: Number(req.body.value) }},{status:"Available"} ] }, function(err, product) {
        if (err){
            console.log(err)
        }
        else{
            if(product.length===0){
                send.stats=1;
                send.msg="Amount entered too large";
                res.json(send)
            }
            else{
                Products.findOneAndUpdate({$and :[{ _id:req.body.item._id }, { $or : [ { status: "Available" }, { status: "Posted" } ] } ]},{$inc:{quantity_left:-1*Number(req.body.value)}}, function(err, product) {
                    if (err){
                        console.log(err);
                        send.status=2;
                        send.msg="Error in Updating";
                        res.json(send)
                    }
                    else { 
                        const newbooking = new Bookings({
                            product_id:req.body.item._id,
                            buyer_name:req.body.buyer_name,
                            quantity:Number(req.body.value),
                            status_by_buyer:"Active",
                            name: req.body.item.name,
                            price: req.body.item.price,
                            quantity_total: req.body.item.quantity,
                            quantity_left:req.body.item.quantity_left,
                            seller_id: req.body.item.seller_id,
                            status: req.body.item.status
                        });
                        newbooking.save();
                        send.status=0;
                        send.msg="Order succesfully placed!";
                        res.json(send)  
                    }
                });        
            }
        }
    });
});

//Get bookings of a buyer
userRoutes.route('/buyer/view').post(function (req, res) {
    //update statuses also
    Products.update({ quantity_left: 0, status:"Available"},{$set:{status:"Posted"}},{multi:true},
        function(err, product) {
            if (err){
                console.log(err);
            }
            else {  
        }
    });

    Products.update({quantity_left:{$ne:0}, status:"Posted"},{$set:{status:"Available"}},{multi:true},
        function(err, product) {
            if (err){
                console.log(err);
            }
            else {  
        }
    });

    Bookings.find({buyer_name: req.body.user},function(err, result) {
        if (err) throw err;
        res.json(result)
    });
});

//For the View Status button
userRoutes.route('/buyer/volstatus').post(function (req, res) {
    //update statuses also
    Products.update({ quantity_left: 0, status:"Available"},{$set:{status:"Posted"}},{multi:true},
        function(err, product) {
            if (err){
                console.log(err);
            }
            else {  
        }
    });

    Products.update({quantity_left:{$ne:0}, status:"Posted"},{$set:{status:"Available"}},{multi:true},
        function(err, product) {
            if (err){
                console.log(err);
            }
            else {  
        }
    });

    Products.find({_id: req.body.product_id},function(err, result) {
        if (err) throw err;
        res.json(result)
    });
});

//Get bookings of a buyer
userRoutes.route('/buyer/lol').post(function (req, res) {
    console.log("here")
    Bookings.find({buyer_name: req.body.user},function(err, data) {
        if (err) throw err;
        else{
            var jsondata = JSON.parse(JSON.stringify(data));
            // console.log(jsondata)
            var i;
            for (i=0; i<jsondata.length; i++){
                var prod = jsondata[i].product_id;
                var amt= jsondata[i].quantity;
                // console.log(amt)
                
                Products.find({_id:prod},function(err, result) {
                    if (err) throw err;
                    else{
                        // res.write(JSON.stringify(result));
                        var temp=(JSON.parse(JSON.stringify(result)));
                        // console.log("temp")
                        // console.log(temp[0].name);
                        send={
                            name: temp.name,
                            seller: temp[0].seller_id,
                            price: temp[0].price,
                            quantity: temp[0].quantity,
                            ordered: amt,
                            status: temp[0].status
                        }
                        res.write(JSON.stringify(send),function(lol){
                            if(i===jsondata.length){
                                res.send();
                            }
                        });
                    }
                });
            }
        }
    });
});

//Cancel an order
userRoutes.route('/buyer/cancel').post(function (req, res) {

    let send={
        status:"-1",
        msg:"temp"
    };
    console.log(req)
    Products.findOneAndUpdate({$and :[{name: req.body.item.name, seller_id: req.body.item.seller_id}, { $or : [ { status: "Available" }, { status: "Posted" } ] } ]},{$inc:{quantity_left:Number(req.body.item.quantity)}}, function(err, product) {
        if (err){
            console.log(err);
            send.status=1;
            send.msg="Cannot cancel dispatched/cancelled orders";
            res.json(send)
        }
        else { 
            Bookings.findOneAndUpdate({buyer_name: req.body.user, seller_id: req.body.item.seller_id},{$set:{status_by_buyer:"Cancelled"}}, function(err, product) {
                if (err){
                    console.log(err);
                    send.status=2;
                    send.msg="Error in updating";
                    res.json(send)
                }
                else { 
                    send.status=0;
                    send.msg="Cancelled";
                    res.json(send)  
                }
            });  
        }
    });   
});

//Get specific item
userRoutes.route('/buyer/getitnow').post(function (req, res) {
    Bookings.find({buyer_name: req.body.user, seller_id: req.body.item.seller_id},function(err, result) {
        if (err) throw err;
        res.json(result)
    });
});

//Review an order
userRoutes.route('/addreview').post(function (req, res) {

    let send={
        status:"-1",
        msg:"temp"
    };

    console.log(req.body)
    
    if (req.body.rating==="" || req.body.review==="") {
        send.msg="Incomplete fields";
        send.status="2";
        res.json(send)
    }

    else if(req.body.item.status!="Dispatched"){
        send.msg="Can only write a review for Dispatched products";
        send.status="3";
        res.json(send)
    }

    else{
        Reviews.find({product_id: req.body.item._id,buyer_id: req.body.user}, function(err, product) {
            if (err)
                console.log(err);
            else {
                if (product.length!=0) {
                    send.msg="Already submitted a review for this product";
                    send.status="1";
                    res.json(send)
                }
                else{
                    User.update({username: req.body.item.seller_id},{$inc:{num_ratings:1, sum_ratings:Number(req.body.rating)}},function(err, product) {
                        if (err){
                            console.log(err);
                        }
                        else {  
                            const newentry = new Reviews({
                                seller_id: req.body.item.seller_id,
                                product_name: req.body.item.name,
                                review: req.body.review,
                                rating: Number(req.body.rating),
                                buyer_id: req.body.user,
                                product_id: req.body.item._id
                            });
                            newentry.save()
                            send.msg="Succesfully submitted review";
                            send.status="1";
                            res.json(send)
                        }
                    });
                }
            }
        });
    } 
});

//Get all the reviews of a seller
userRoutes.route('/buyer/getreview').post(function (req, res) {
    
    User.findOne({ username: req.body.seller_id })
        .then(user => {
            Reviews.find({seller_id: req.body.seller_id},function(err, result) {
                if (err) throw err;
                else{

                    if(user.num_ratings===0){
                        send={
                            result: result,
                            avg: "-"
                        }
                        res.json(send)
                    }
                    else{
                        send={
                            result: result,
                            avg: Number(user.sum_ratings)/Number(user.num_ratings)
                        }
                        res.json(send)
                    }
                    
                    
                }
            });
            // console.log(Number(user.sum_ratings)/Number(user.num_ratings))
        })
});

//For viewing in dispatched orders
userRoutes.route('/buyer/viewallreviews').post(function (req, res) {
    Reviews.find({product_id:req.body._id},function(err, result) {
        if (err) throw err;
        res.json(result)
    });
});


app.use('/', userRoutes);

app.listen(PORT, function () {
    console.log("Server is running on port: " + PORT);
});
