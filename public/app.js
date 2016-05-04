/**
 * Created by Tom on 2/19/2016.
 */
"use strict";

angular.module("myApp", ["ui.router", "ngMaterial"]).constant('_', window._);

angular.module("myApp").config(($stateProvider, $urlRouterProvider) => {

    $urlRouterProvider.otherwise("/");

    $stateProvider

        .state("home", {
            url: "/",
            templateUrl: "routes/home/home.html",
            controller: "homeControl"
        })

        .state("trail", {
            url: "/trail",
            templateUrl: "routes/trail/trail.html",
            controller: "trailControl"
        })

        .state("nothing", {
            url: "/nothing",
            templateUrl: "routes/nothing/nothing.html",
            controller: "nothingControl"
        })
        .state("background",{
            url:"/background",
            templateUrl:"routes/background/background.html"
        })

});

angular.module("myApp").config(($mdThemingProvider) => {
    $mdThemingProvider.theme('default')
        .primaryPalette("blue-grey", {
            "default": "200",
            "hue-1":"100"
        });
});