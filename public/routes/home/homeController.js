/**
 * Created by Tom on 2/19/2016.
 */

angular.module('myApp').controller('homeControl', function ($scope, service, $http) {

    //menu options
    $scope.diffOptions = {
        availableOptions: [
            {id: 1, name: "Beginner"},
            {id: 2, name: "Intermediate"},
            {id: 3, name: "Advanced"}
        ],
        selectedOption: {id: 1, name: "Beginner"}
    };
    $scope.lenOptions = {
        availableOptions: [
            {id: 1, name: "5"},
            {id: 2, name: "10"},
            {id: 3, name: "20"},
            {id: 4, name: "A lot"}
        ],
        selectedOption: {id: 1, name: "5"}
    };
    $scope.distOptions = {
        availableOptions: [
            {id: 1, name: "10"},
            {id: 2, name: "20"},
            {id: 3, name: "50"},
            {id: 4, name: "Really far"}
        ],
        selectedOption: {id: 1, name: "10"}
    };

    //TODO get update working with minlength so that form is only valid once full zip is entered
    //var oldValue = "";
    //$scope.update = function (event) {
    //    console.log(event);
    //    console.log($scope.zip);
    //    var numCheck = 48<=event.which<=57;
    //    var lenCheck = $scope.zip.length <=5;
    //    if (!numCheck || lenCheck) {
    //        $scope.zip = oldValue;
    //    }else{
    //        oldValue = $scope.zip;
    //    }
    //
    //};

    //validate
    $scope.$watch('zip', function (newValue, oldValue) {
        if (newValue) {
            var isNum = /^\d+$/.test(newValue);
            if (newValue.length > 5 || !isNum) {
                $scope.zip =  oldValue;
            }
        }
    });

    var request = {};
    $scope.submitForm = function () {
        request.zip = $scope.zip;
        request.difficulty = $scope.diffOptions.selectedOption;
        request.length = $scope.lenOptions.selectedOption;
        request.distance = $scope.distOptions.selectedOption;

        $http.get();

    };

});