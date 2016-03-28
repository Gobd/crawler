/**
 * Created by Tom on 3/11/2016.
 */
"use strict";


var Trail = require('../Schemas/trail');
var config = require('../../config');
var GoogleMapsAPI = require("googlemaps");

var publicConfig = {
    key: config.googleAPIKey,
    stagger_time: 1000, // for elevationPath
    encode_polylines: false,
    secure: true // use https
};
var gmAPI = new GoogleMapsAPI(publicConfig);

module.exports = {

    //posts trails to db
    postTrails: function (request, response) {
        var errs = [];
        var ss = [];

        if (!request.body) {
            response.status(500).json("some junk broke");
            return;
        }

        Trail.create(request.body, function (err, s) {
            err ? errs.push(errs) : ss.push(s);
        });
        return errs.length > 0 ? response.status(500).json(errs) : response.status(200).json(ss);

    },
    //gets trails based on form input
    getTrail: function (request, response) {

        //gets zipcode to translate to lat/long
        console.log(request.body);
        if (request.body.zip) {
            //TODO check data for validity
            let zip = {"address": request.body.zip};

            //get user coordinates
            gmAPI.geocode(zip, function (err, result) {

                //if success
                if (!err) {
                    //noinspection JSUnresolvedVariable
                    let coords = [result.results[0].geometry.location.lng,
                        result.results[0].geometry.location.lat];

                    //search database for trails
                    Trail.find({
                        "location": {
                            $near: {
                                $geometry: {
                                    type: "Point",
                                    coordinates: coords
                                },
                                $maxDistance: parseInt(request.body.distance)*1609.34
                            }
                        }
                        ,
                        difficulty: request.body.difficulty,
                        length: {$lt: request.body.length}
                    }, function (err, s) {
                        console.log('butts');
                        console.log(s);
                        return err || s.length == 0 ? response.status(500).json(err) : response.status(200).json(s);
                    });
                } else {
                    console.trace(err);
                    response.status(500).json("idk")
                }
            });
        } else {
            response.status(500).json("something messed up, sorry")
        }


    }
};