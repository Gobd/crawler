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
var config = require('./../config');
var mainCtrl = require('./Controllers/mainCtrl');

//create app and specify port
var app = express();
var port = 8080;

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

app.post('/trails', mainCtrl.postTrails);
app.get('/', maintCtrl.getTrail);
