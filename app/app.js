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
    });
        $routeProvider.when('/dashboard', {
        controller: 'DashboardController',
        templateUrl: 'dashboard.html'
    })
        .otherwise({redirectTo: '/'});
}]);

app.controller('HomeController', ['$scope', '$location', function($scope, $location) {

    $scope.go = function ( path ) {
        $location.path( path );
    };

}]);

app.controller('NewAccountController', ['$scope', '$log', '$location', function($scope, $log, $location) {

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

        $location.path('/login');
    }

    $scope.errorInNewAccount = function() {
        $scope.showUserNameTaken = true;
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

app.controller('LoginController', ['$scope', '$location', function($scope, $location){

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

app.controller('DashboardController', ['$scope', '$location', function($scope, $location) {


    $scope.displayStudents = function() {
        $scope.showStudents = true;
        $scope.showClasses = false;
        $scope.showEnrollments = false;
        $scope.loadStudents();

    }

    $scope.displayClasses = function() {
        $scope.showStudents = false;
        $scope.showClasses = true;
        $scope.showEnrollments = false;

    }

    $scope.displayEnrollments = function() {
        $scope.showStudents = false;
        $scope.showClasses = false;
        $scope.showEnrollments = true;
    }

    $scope.addStudent = function() {

        if ($scope.addStudent_form.$valid) {

            var Student = Parse.Object.extend("Student");

            var student = new Student();
            student.set("firstName", $scope.student.firstname);
            student.set("lastName", $scope.student.lastname);
            student.set("age", $scope.student.age);

            // TODO - set photo

            student.save(null, {
                success: function(student) {
                    $scope.$apply($scope.newStudentCreated())
                },
                error: function(student, error) {

                }
            });
        }
    }

    $scope.loadStudents = function() {

        var Student = Parse.Object.extend("Student");
        var query = new Parse.Query(Student);

        query.find({
            success: function(results){

                $scope.$apply($scope.studentsLoaded(results));
            },
            error: function(error) {

            }
        });
    }

    $scope.newStudentCreated = function() {
        $scope.shouldShowStudentForm = false;
        $scope.loadStudents();
    }

    $scope.studentsLoaded = function(results) {

        $scope.students = [];

        _.each(results, function(result){
            $scope.students.push(result.attributes)
        });

        // $scope.students = results;
    }

    $scope.showStudentForm = function() {
        $scope.shouldShowStudentForm = true;
    }

}]);


