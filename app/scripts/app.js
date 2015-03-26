var app = angular.module('myApp', []).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'HomeController',
        templateUrl: 'templates/home/home.html'
    });
        $routeProvider.when('/signUp', {
        controller: 'SignUpController',
        templateUrl: 'templates/signUp/signUp.html'
    });
        $routeProvider.when('/signIn', {
        controller: 'SignInController',
        templateUrl: 'templates/signIn/signIn.html'
    });
        $routeProvider.when('/dashboard', {
        controller: 'DashboardController',
        templateUrl: 'templates/dashboard/dashboard.html'
    });
        $routeProvider.when('/registerStudent', {
        controller: 'RegistrationController',
        templateUrl: 'templates/registration/registerStudent.html'
    });
        $routeProvider.when('/deregisterStudent', {
        controller: 'RegistrationController',
        templateUrl: 'templates/registration/deRegisterStudent.html'
    })
        .otherwise({redirectTo: '/'});
}]);

Parse.initialize("KGxHRY1i2W1plkO5rWORg8YQLaKjcwTvs9BIpjyj", "poeOwB2Rw12qXJh90fsXkRhfCBgTIDkQzvb9B0JI");