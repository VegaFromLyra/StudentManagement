var app = angular.module("myApp");

app.controller('SignInController', ['$scope', '$location', function($scope, $location){

    $scope.loginSuccessful = false;

    $scope.hasFormBeenSubmitted = false;

    $scope.signin = function() {

        if ($scope.signin_form.$valid) {

            Parse.User.logIn($scope.signin.username, $scope.signin.password, {
                success: function(results) {
                    $scope.$apply($scope.userAuthenticated(results));
                },
                error: function(error) {
                    $scope.$apply($scope.userNotAuthenticated(error));
                }
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
