/**
 * updated by Tom on 4/4/2016.
 */
"use strict";

const Trail = require("../Schemas/trail");
const Log = require("../Schemas/log");
const Queued = require("../Schemas/queued");
const Visited = require("../Schemas/visited");
const q = require("q");
const mongoose = require('mongoose');


// mongoose.set("debug", true);
mongoose.connect("mongodb://127.0.0.1:27017/trails");
mongoose.connection.once("open", function () {
    console.log("connected to mongodb")
});

module.exports = {
    postTrail: (trail) => {
        Trail.findOneAndUpdate({url: trail.url}, trail, {upsert: true, overwrite: true}, (err, s) => {
            console.log(err ? err : s);
            //todo write log
        });
    },
    queue: (url) => {
        Queued.create({link: url}, (err, s) => {
            //todo write log
        });

    },
    visit: (url) => {
        Visited.create({link: url}, (err, s) => {

            //todo write log
        });

    },
    log: (entry) => {
        Log.create({entry: entry}, (err, s) => {

            //todo write log
        });
    },
    getQueued: () => {
        let defer = q.defer();
        Queued.find({}, (err, response)=> {
            if (err) {
                defer.reject(new Error(err));
            } else {
                let ret = [];
                for (var i = 0; i < response.length; i++) {
                    ret.push(response[i].link);
                    Queued.remove({_id: response[i]._id}, (err)=> {
                    })
                }
                defer.resolve(ret);
                console.log("removed");
            }
        }).limit(100);
        return defer.promise;
    },
    getVisit: () => {
        let defer = q.defer();
        Visited.find({}, (err, response)=> {
            if (err) {
                defer.reject(new Error(err));
            } else {
                defer.resolve(response);
            }
        });
        return defer.promise;
    },
    close: () =>{
        mongoose.close();
    }
};