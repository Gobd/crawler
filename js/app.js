/**
 * Created by Tom on 2/19/2016.
 */

angular.module('myApp',['ui.router']);

angular.module('myApp').config(function($stateProvider,$urlRouterProvider){

    $urlRouterProvider.otherwise('/home');

    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'home.html'
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            url: '/about',
            templateUrl: 'about.html'
        });


});