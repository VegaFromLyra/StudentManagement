var app = angular.module("myApp");

app.service('UserService', ['$q', '$location', '$log',
    function($q, $location, $log){

    this.createUser = function(username, password, email) {

        var deferred = $q.defer();

        var user = new Parse.User();

        user.set("username", username);
        user.set("password", password);
        user.set("email", email);

        user.signUp(null, {
            success: function(user) {
                deferred.resolve(user);
            },
            error: function(error) {
                deferred.reject(error);
            }
        });

        return deferred.promise;
    }
}]);
