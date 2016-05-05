"use strict";

angular.module("myApp").service("service", function ($http, $q, $state) {

    let trails;
    let count = 0;

    this.postForm = (request) => {
        $http.post("/", request)
            .success(function (result) {
                console.log(result);
                trails = result;
                $state.go("trail");
                // return result;
            }).error(function () {
            $state.go("nothing");
        });
    };
    //
    // this.getTrail = () => {
    //     if (count < trails.length) {
    //         let ret = trails[count];
    //         count++;
    //         return ret;
    //     }
    // };

    this.getTrails = () => {
        return trails;
    };

});