/**
 * Created by Tom on 3/23/2016.
 */
"use strict";

angular.module('myApp').controller('trailControl', function ($scope, service, _) {

    $scope.more = false;
    $scope.info = false;
    $scope.trails = service.getTrails();
    // $scope.trails = service.getTrails();
    $scope.trail = _.sample($scope.trails);

    $scope.distance = 0;

    if ($scope.trails.length > 1) {
        $scope.more = true;
    }
    $scope.tryAgain = () => {
        $scope.trail = _.sample($scope.trails);
    };

});