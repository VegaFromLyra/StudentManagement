var app = angular.module('myApp', []).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'HomeController',
        templateUrl: 'templates/home.html'
    });
        $routeProvider.when('/signUp', {
        controller: 'SignUpController',
        templateUrl: 'templates/signUp.html'
    });
        $routeProvider.when('/signIn', {
        controller: 'SignInController',
        templateUrl: 'templates/signIn.html'
    });
        $routeProvider.when('/dashboard', {
        controller: 'DashboardController',
        templateUrl: 'templates/dashboard.html'
    });
        $routeProvider.when('/registerStudent', {
        controller: 'RegistrationController',
        templateUrl: 'templates/registerStudent.html'
    });
        $routeProvider.when('/deregisterStudent', {
        controller: 'RegistrationController',
        templateUrl: 'templates/deRegisterStudent.html'
    })
        .otherwise({redirectTo: '/'});
}]);

Parse.initialize("KGxHRY1i2W1plkO5rWORg8YQLaKjcwTvs9BIpjyj", "poeOwB2Rw12qXJh90fsXkRhfCBgTIDkQzvb9B0JI");