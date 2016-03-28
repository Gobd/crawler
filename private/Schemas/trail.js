/**
 * Created by Tom on 3/23/2016.
 */
"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var trailSchema = new Schema({
    "url": {
        type: String,
        required: true,
        unique: true
    },
    "difficulty": {
        type: String,
        require: true
    },
    "name": {
        type: String,
        require: true,
        unique: true,
        index: true
    },
    "rating": {
        type: Number
    },
    "length": {
        type: Number,
        require: true,
        min: 0
    },
    "gpx": {
        type: String,
        required: true
    },
    "location": {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            require: true
        }
    },
    "desc": {
        type: String,
        require: true
    }
});
trailSchema.index({location: "2dsphere"});
module.exports = mongoose.model("Trails", trailSchema);