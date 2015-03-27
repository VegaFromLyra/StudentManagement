var app = angular.module("myApp");

app.service('RegistrationService',
    ['$q', '$rootScope', 'ClassService',
    function($q, $rootScope, classService) {

        this.loadRegistrations = function(classes) {

            var promises = [];

            angular.forEach(classes, function(classItem) {

                var deferred = $q.defer();

                var registration = {};
                registration.students = [];
                registration.classItem = classItem;

                var relation = classItem.relation("contains");

                relation.query().find().then(function(students){

                    _.each(students, function(student){
                        registration.students.push(student);
                    });

                    deferred.resolve(registration);
                    $rootScope.$apply();
                    // TODO - Ask Bansal if this is the right way to notify controller
                    // Added the apply since deferred.resolve does not notify
                    // the controller without apply from a callback
                });

                promises.push(deferred.promise);
            });

            return $q.all(promises);
        }
}]);
