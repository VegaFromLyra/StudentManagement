var app = angular.module("myApp");

app.service('StudentService', ['$q', '$rootScope',
    function($q, $rootScope) {

        this.loadStudents = function() {

            var deferred = $q.defer();

            var Student = Parse.Object.extend("Student");
            var query = new Parse.Query(Student);

            query.find({
                success: function(results){
                    deferred.resolve(results);
                    $rootScope.$apply();
                },
                error: function(error) {
                    // TODO: Handle error
                }
            });

            return deferred.promise;
        }

}]);