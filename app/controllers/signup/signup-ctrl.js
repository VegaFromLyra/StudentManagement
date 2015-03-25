var app = angular.module('myApp');

app.controller('SignUpController', ['$scope', '$log', '$location', function($scope, $log, $location) {

    $scope.showConfirm = false;

    $scope.showUserNameTaken = false;

    $scope.signupForm = function() {

        if ($scope.signup_form.$valid) {

            var user = new Parse.User();

            user.set("username", $scope.signup.username);
            user.set("password", $scope.signup.password);
            user.set("email", $scope.signup.email);

            user.signUp(null, {
                success: function(object) {
                    $log.info('User saved');
                    $scope.$apply($scope.newUserAccountCreated());
                },
                error: function(model, error) {
                    $log.info('User not saved with error' + error.message);
                    $scope.$apply($scope.errorInNewAccount());
                }
            });
        }
    }

    $scope.newUserAccountCreated = function() {
        $scope.showConfirm = true;

        $location.path('/signIn');
    }

    $scope.errorInNewAccount = function() {
        $scope.showUserNameTaken = true;
    }

}]);

