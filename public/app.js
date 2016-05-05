"use strict";

angular.module("myApp", ["ui.router", "ngMaterial"]).constant('_', window._);

angular.module("myApp").config(($stateProvider, $urlRouterProvider) => {

    $urlRouterProvider.otherwise("/");

    $stateProvider

        .state("home", {
            url: "/",
            templateUrl: "routes/home.html",
            controller: "homeControl"
        })

        .state("trail", {
            url: "/trail",
            templateUrl: "routes/trail.html",
            controller: "trailControl"
        })

        .state("nothing", {
            url: "/nothing",
            templateUrl: "routes/nothing.html",
            controller: "nothingControl"
        })
        .state("background",{
            url:"/background",
            templateUrl:"routes/background.html"
        })

});

angular.module("myApp").config(($mdThemingProvider) => {
    $mdThemingProvider.theme('default')
        .primaryPalette("blue-grey", {
            "default": "200",
            "hue-1":"100"
        });
});