/**
 * Created by Tom on 2/19/2016.
 */

angular.module('myApp', ['ui.router']);

angular.module('myApp').config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

        .state('home', {
            url: '/',
            templateUrl: 'routes/home/home.html',
            controller: 'homeControl'
        })

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