/**
 * Created by Tom on 2/19/2016.
 */

angular.module("myApp", ["ui.router"]).constant('_', window._);

angular.module("myApp").config(function ($stateProvider, $urlRouterProvider) {

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
            url:"/nothing",
            templateUrl:"routes/nothing/nothing.html",
            controller:"nothingControl"
        })

});