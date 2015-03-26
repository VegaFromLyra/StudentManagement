var app = angular.module('myApp');

app.controller('SignUpController', ['$scope', '$log', '$location', 'UserService',
    function($scope, $log, $location, userService) {

    $scope.showConfirm = false;
    $scope.showUserNameTaken = false;

    $scope.signupForm = function() {

        if ($scope.signup_form.$valid) {
            userService.createUser($scope.signup.username, $scope.signup.password, $scope.signup.email)
                .then(function (createdUser) {
                    $scope.showConfirm = true;
                    $location.path('/signIn');
                }).catch(function (error) {
                    $scope.showUserNameTaken = true;
                }).finally(function () {
                    $log.info("finally called");
                });
        }
    }
}]);

