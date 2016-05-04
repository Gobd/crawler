/**
 * Created by Tom on 2/19/2016.
 */

angular.module('myApp').controller('homeControl', ($scope, service) => {

    //menu options
    $scope.diffOptions = ["Beginner", "Intermediate", "Difficult"];
    $scope.lenOptions = ["5", "10", "20", "A lot"];
    $scope.distOptions = ["10", "20", "50", "Really far"];

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
    $scope.$watch('zip', (newValue, oldValue) => {
        if (newValue) {
            let isNum = /^\d+$/.test(newValue);
            if (newValue.length > 5 || !isNum) {
                $scope.zip = oldValue;
            }
        }
    });

    let request = {};
    $scope.submitForm = () => {
        request.zip = $scope.zip;
        request.difficulty = $scope.difficulty;
        request.length = $scope.length;
        request.distance = $scope.distance;
        service.postForm(request);
    };

});