var app = angular.module("myApp");

app.service('UserService', ['$q', '$rootScope',
    function($q, $rootScope){

    this.createUser = function(username, password, email) {

        var deferred = $q.defer();

        var user = new Parse.User();

        user.set("username", username);
        user.set("password", password);
        user.set("email", email);

        user.signUp(null, {
            success: function(user) {
                deferred.resolve(user);
                $rootScope.$apply();
            },
            error: function(model, error) {
                deferred.reject(error);
                $rootScope.$apply();
            }
        });

        return deferred.promise;
    }

    this.logIn = function(username, password) {

        var deferred = $q.defer();

        Parse.User.logIn(username, password, {
            success: function(results) {
                deferred.resolve(results);
                $rootScope.$apply();
            },
            error: function(error) {
                deferred.reject(error);
                $rootScope.$apply();
            }
        });

        return deferred.promise;
    }
}]);
