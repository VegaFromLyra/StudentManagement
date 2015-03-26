var app = angular.module('myApp');

app.controller('SignUpController', ['$scope', '$log', '$location', 'UserService',
    function($scope, $log, $location, userService) {
        
    $scope.signupForm = function() {

        if ($scope.signup_form.$valid) {

            var promise = userService.createUser($scope.signup.username, $scope.signup.password, $scope.signup.email);

            promise.then(function(savedUser) {
                $scope.showConfirm = true;
                $location.path('/signIn');
                $log.info('User saved');
            }, function(error) {
                $scope.showUserNameTaken = true;
                $scope.signup_form.username.$invalid = true;
                $log.info('User not saved: ' + error.message);
            });

        }
    }
}]);

