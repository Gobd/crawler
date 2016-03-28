/**
 * Created by Tom on 3/23/2016.
 */
"use strict";

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var trailSchema = require("./trail");

var trailList = new Schema({
    "trails":[{
        type:Schema.ObjectId, ref:"trailSchema"
    }]
});

// module.exports = Mongoose.model("Trails", trailList);