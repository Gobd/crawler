/**
 * Created by Tom on 2/19/2016.
 */

angular.module('myApp', ['ui.router']);

angular.module('myApp').config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'views/home.html',
            controller: 'homeControl'
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            url: '/about',
            templateUrl: ' views/about.html',
            controller: 'aboutControl'
        })

        .state('form', {
            url: '/form',
            templateUrl: 'views/form.html',
            controller: 'formControl'
        });


});