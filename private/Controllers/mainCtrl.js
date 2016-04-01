/**
 * Created by Tom on 3/11/2016.
 */
"use strict";

//setup required packages
const Trail = require('../Schemas/trail');
const config = require('../../config');
const GoogleMapsAPI = require("googlemaps");

//setup googleMaps api
const publicConfig = {
    key: config.googleAPIKey,
    stagger_time: 1000, // for elevationPath
    encode_polylines: false,
    secure: true // use https
};
const gmAPI = new GoogleMapsAPI(publicConfig);

module.exports = {

    //posts trails to db
    postTrails: (request, response) => {
        let errs = [];
        let ss = [];

        if (!request.body) {
            response.status(500).json("some junk broke");
            return;
        }

        Trail.create(request.body, (err, s) => {
            err ? errs.push(errs) : ss.push(s);
        });
        return errs.length > 0 ? response.status(500).json(errs) : response.status(200).json(ss);

    },
    //gets trails based on form input
    getTrail: (request, response) => {

        //gets zipcode to translate to lat/long
        if (request.body) {
            //TODO check data for validity
            let zip = {"address": request.body.zip};
            if(request.body.length === "A lot"){
                request.body.length = 100;
            }
            if(request.body.distance === "Really far"){
                request.body.distance = 300;
            }

            //get user coordinates
            gmAPI.geocode(zip, (err, result) => {

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
                                $maxDistance: parseInt(request.body.distance) * 1609.34
                            }}
                        // difficulty: new RegExp('\w*(' + request.body.difficulty + ')\w*', "ig"),
                        // length: {$lt: request.body.length}
                    }, (err, s) => {
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

