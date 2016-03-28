/**
 * Created by Tom on 2/19/2016.
 */

angular.module('myApp').controller('homeControl', function ($scope, service) {

    //menu options
    $scope.diffOptions = {
        availableOptions: [
            {id: "Beginner", name: "Beginner"},
            {id: "Intermediate", name: "Intermediate"},
            {id: "Difficult", name: "Difficult"}
        ],
        selectedOption: {id: "Beginner", name: "Beginner"}
    };
    $scope.lenOptions = {
        availableOptions: [
            {id: 5, name: "5"},
            {id: 10, name: "10"},
            {id: 20, name: "20"},
            {id: 100, name: "A lot"}
        ],
        selectedOption: {id: 5, name: "5"}
    };
    $scope.distOptions = {
        availableOptions: [
            {id: 10, name: "10"},
            {id: 20, name: "20"},
            {id: 50, name: "50"},
            {id: 300, name: "Really far"}
        ],
        selectedOption: {id: 10, name: "10"}
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
        request.difficulty = $scope.diffOptions.selectedOption.id;
        request.length = $scope.lenOptions.selectedOption.id;
        request.distance = $scope.distOptions.selectedOption.id;
        service.postForm(request);
    };

});