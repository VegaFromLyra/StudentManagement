var app = angular.module("myApp");

app.service('ClassService', ['$q', '$rootScope',
    function($q, $rootScope) {

        this.loadClasses = function() {

            var deferred = $q.defer();

            var Class = Parse.Object.extend("Class");
            var query = new Parse.Query(Class);

            query.find({
                success: function(results){
                    deferred.resolve(results);
                    $rootScope.$apply();
                }
                // TODO: Handle error
            });

            return deferred.promise;
        }
    }]);
