var app = angular.module("myApp");

app.service('RegistrationService',
    ['$q', '$rootScope', 'ClassService', 'StudentService',
    function($q, $rootScope, classService, studentService) {

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
                });

                promises.push(deferred.promise);
            });

            return $q.all(promises);
        }

        this.registerStudentForClass = function(firstName, lastName, classItem) {

            var deferred = $q.defer();

            studentService.findStudentUsingName(firstName, lastName).then(function(results) {

                var student = results[0];
                var relation = classItem.relation("contains");
                relation.add(student);
                classItem.save();

                deferred.resolve(student);
            }, function(error) {

                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.deregisterStudentFromClass = function(student, classItem) {
            var containsRelation = classItem.relation("contains");
            containsRelation.remove(student);
            classItem.save();
        }



}]);
