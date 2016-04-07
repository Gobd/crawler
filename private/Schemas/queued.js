/**
 * Created by Tom on 4/5/2016.
 */
"use strict";

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var queuedItem = new Schema({
    "link": {
        type: String,
        required: true,
        unique: true
    }});

module.exports = Mongoose.model("queuedItems", queuedItem);