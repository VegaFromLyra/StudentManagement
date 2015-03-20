var app = angular.module('myApp', []).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'HomeController',
        templateUrl: 'home.html'
    });
        $routeProvider.when('/newAccount', {
        controller: 'NewAccountController',
        templateUrl: 'newAccount.html'
    });
        $routeProvider.when('/login', {
        controller: 'LoginController',
        templateUrl: 'login.html'
     })
        .otherwise({redirectTo: '/'});
}]);

app.controller('HomeController', ['$scope', '$location', function($scope, $location) {

    $scope.go = function ( path ) {
        $location.path( path );
    };

}]);

app.controller('NewAccountController', ['$scope', '$log', function($scope, $log) {

    $scope.showConfirm = false;

    $scope.signupForm = function() {

        if ($scope.signup_form.$valid) {

            var UserAccount = Parse.Object.extend("UserAccount");

            var userAccount = new UserAccount();

            userAccount.set("name", $scope.signup.name);
            userAccount.set("email", $scope.signup.email);
            userAccount.set("password", $scope.signup.password);

            userAccount.save(null, {
                success: function(object) {
                    $log.info('User saved');
                    $scope.$apply($scope.newUserAccountCreated());
                },
                error: function(model, error) {
                    $log.info('User not saved with error' + error.message);
                }
            });
        }
    }

    $scope.newUserAccountCreated = function() {
        $scope.showConfirm = true;
    }

}]);

app.directive('areEqual', [ function() {

    function link(scope, element, attrs, ctrl) {

        // viewValue is the value passed in by the input
        var validate = function(viewValue) {
            var comparisonModel = attrs.areEqual;

            if(!viewValue || !comparisonModel){
                // It's valid because we have nothing to compare against
                ctrl.$setValidity('areEqual', true);
            }

            // It's valid if model is equal to the model we are comparing against
            ctrl.$setValidity('areEqual', viewValue === comparisonModel);
            return viewValue;
        };

        // If the value is edited in the input then the parser is invoked
        ctrl.$parsers.unshift(validate);

        // If the backing model is modified then the formatter is invoked
        ctrl.$formatters.push(validate);
    }

    return {
        require: 'ngModel',
        link: link
    };
}]);

app.controller('LoginController', ['$scope', function($scope){

    $scope.loginSuccessful = false;

    $scope.hasFormBeenSubmitted = false;

    $scope.signin = function() {

        $scope.hasFormBeenSubmitted = true;

        if ($scope.signin_form.$valid) {

            var UserAccount = Parse.Object.extend("UserAccount");

            var query = new Parse.Query(UserAccount);

            query.equalTo("email", $scope.signin.email);

            query.find({
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

        // Assumes email addresses are unique
        var user = results[0];

        if ($scope.signin.password === user.get('password')) {
            $scope.loginSuccessful = true;
        }
    }

    $scope.userNotAuthenticated = function(error) {
        $scope.loginSuccessful = false;
    }

}]);




