var app = angular.module("myApp");

app.controller('RegistrationController', ['$scope', '$routeParams', '$log', '$location',
function($scope, $routeParams, $log, $location){

    $scope.initialiseStudentAndClass = function(student, classItem) {
        $scope.student = student;
        $scope.classItem = classItem;

        $scope.registration = {};
        $scope.registration.class = classItem.get('name');
        $scope.registration.studentFirstName = student.get('firstName');
        $scope.registration.studentLastName = student.get('lastName');
    }

    $scope.findClassAndStudent = function(classId, studentId) {

        var Student = Parse.Object.extend("Student");

        var query = new Parse.Query(Student);

        query.equalTo("objectId", studentId);

        query.find({
            success: function(results) {

                var student = results[0];

                var Class = Parse.Object.extend("Class");

                var query = new Parse.Query(Class);

                query.equalTo("objectId", classId);

                query.find({
                    success: function(results) {
                        $scope.$apply($scope.initialiseStudentAndClass(student, results[0]));
                    }
                })

            }
        });
    }

    if ($routeParams.className) {

        $scope.registration = {};

        $scope.getClass = function(className) {
            var Class = Parse.Object.extend("Class");

            var query = new Parse.Query(Class);

            query.equalTo("name", className);

            query.find({
                success: function(results) {

                    if (results.length > 1) {
                        $log.info("Multiple classes with same name: " + results[0].get('name'));
                    }
                    $scope.$apply($scope.classRetrieved(results));
                },
                error: function(error) {
                    $log.error("Could not find class with name: " + $scope.registration.class);
                }
            });
        }

        $scope.getClass($routeParams.className);
    }
    else if ($routeParams.classId && $routeParams.studentId) {

        $scope.findClassAndStudent($routeParams.classId, $routeParams.studentId);
    }

    $scope.register_form_submit = function() {

        $scope.register_form.submitted = false;

        if ($scope.register_form.$valid) {
            var student = $scope.findAndRegisterStudent($scope.registration.studentFirstName, $scope.registration.studentLastName);
        }
    }

    $scope.deregister_form_submit = function() {
        var containsRelation = $scope.classItem.relation("contains");
        containsRelation.remove($scope.student);
        $scope.classItem.save();
        $location.path('/dashboard');
    }

    $scope.classRetrieved = function(results) {
        $scope.class = results[0];
        $scope.registration.class = results[0].get('name');
    }

    $scope.registerRetrievedStudent = function(results) {
        $scope.register_form.submitted = true;
        $scope.register_form.studentDoesNotExist = false;

        $scope.student = results[0];

        var relation = $scope.class.relation("contains");
        relation.add($scope.student);
        $scope.class.save();

        $location.path('/dashboard');
    }

    $scope.noStudentRetrieved = function(firstName, lastName) {
        $scope.register_form.submitted = true;
        $scope.register_form.studentDoesNotExist = true;
    }

}]);
