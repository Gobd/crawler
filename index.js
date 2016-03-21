/**
 * Created by Tom on 3/11/2016.
 */
"use strict";

//setup external packages
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var cors = require('cors');

//setup internal packages
var config = require('./config');
var mainCtrl = require('./private/controllers/mainCtrl');

//create app and specify port
var app = express();
var port = 8080;
//var corsOptions = "http://localhost:8080/";

//setup session, listening and parsing
app.use(session({
    secret: config.sessionSecret,
    saveUninitialized: false,
    resave: false
}));
app.use(express.static(__dirname + "/public"));
app.listen(port);
app.use(bodyParser.json());
app.use(cors());

//open connection to mongo
mongoose.set("debug", true);
mongoose.connect("mongodb://localhost/products");
mongoose.connection.once("open", function () {
    console.log("connected to mongodb")
});

//api


// Now let's create the front-end. Feel free to set it up however you like. The only stipulations are that you should have a
// main route/state where you can see all of the products and an admin route/state where you can create, edit, or delete
// products. Don't worry about authentication or protecting your routes at this point. If you have time, start to set up your
// front-end application as you think an eCommerce site should be organized. Introduce some basic styling as well. You could
// use Bootstrap to help get things going visually.
//
// TestPoint: At this point, you should be able to go to the main view and see all of the products that are in your
// database. You should also be able to go to the admin view, where you can create, update, or delete products. As you use
// this interface, you should be able to get responses from the server, and see the data being changed in the database.