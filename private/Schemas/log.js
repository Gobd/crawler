/**
 * Created by Tom on 4/5/2016.
 */
"use strict";

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var log = new Schema({
    "entry":[{
        type:String,
        required: true,
        unique: true
    }]
});

module.exports = Mongoose.model("logs", log);