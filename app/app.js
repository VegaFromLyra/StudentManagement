var app = angular.module('myApp', []).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'HomeController',
        templateUrl: 'home.html'
    });
        $routeProvider.when('/signUp', {
        controller: 'SignUpController',
        templateUrl: 'signUp.html'
    });
        $routeProvider.when('/signIn', {
        controller: 'SignInController',
        templateUrl: 'signIn.html'
    });
        $routeProvider.when('/dashboard', {
        controller: 'DashboardController',
        templateUrl: 'dashboard.html'
    });
        $routeProvider.when('/registerStudent', {
        controller: 'RegistrationController',
        templateUrl: 'registerStudent.html'
    });
        $routeProvider.when('/deregisterStudent', {
        controller: 'RegistrationController',
        templateUrl: 'deRegisterStudent.html'
    })
        .otherwise({redirectTo: '/'});
}]);