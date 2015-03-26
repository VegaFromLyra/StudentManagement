var app = angular.module("myApp");

app.controller('SignInController', ['$scope', '$location', 'UserService', function($scope, $location, userService){

    $scope.loginSuccessful = false;

    $scope.hasFormBeenSubmitted = false;

    $scope.signin = function() {

        if ($scope.signin_form.$valid) {

            userService.logIn($scope.signin.username, $scope.signin.password)
                .then(function(results) {
                    $scope.userAuthenticated(results);
                }, function(error) {
                    $scope.userNotAuthenticated(error);
                });
        }
    }

    $scope.userAuthenticated = function(results) {
        $scope.loginSuccessful = true;

        $scope.hasFormBeenSubmitted = true;

        $location.path('/dashboard');
    }

    $scope.userNotAuthenticated = function(error) {
        $scope.hasFormBeenSubmitted = true;

        $scope.loginSuccessful = false;
    }

}]);
