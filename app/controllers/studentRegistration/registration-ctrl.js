var app = angular.module("myApp");

app.controller('RegistrationController',
    ['$scope', '$routeParams', '$log', '$location', 'StudentService', 'ClassService', 'RegistrationService',
function($scope, $routeParams, $log, $location, studentService, classService, registrationService){

    $scope.initialiseStudentAndClass = function(student, classItem) {
        $scope.registration = {};
        $scope.registration.class = classItem;
        $scope.registration.student = student;

        $scope.registration.class.name = classItem.get('name');
        $scope.registration.student.firstName = student.get('firstName');
        $scope.registration.student.lastName = student.get('lastName');
    }

    $scope.findClassAndStudent = function(classId, studentId) {
        classService.findClass(classId).then(function(results) {
            var classItem = results[0];

            studentService.findStudent(studentId).then(function(results) {
                var student = results[0];
                $scope.initialiseStudentAndClass(student, classItem);
            })
        });
    }

    if ($routeParams.classId && $routeParams.studentId) {
        $scope.findClassAndStudent($routeParams.classId, $routeParams.studentId);
    }
    else if ($routeParams.classId) {
        classService.findClass($routeParams.classId).then(function(results) {
            $scope.classRetrieved(results);
        }, function(error) {
            $log.error("Could not find class with name: " + $scope.registration.class.name);
        });
    }

    $scope.classRetrieved = function(results) {
        $scope.registration = {};
        $scope.registration.class = results[0];
        $scope.registration.class.name = results[0].get('name');
    }

    $scope.register_form_submit = function() {
        $scope.register_form.submitted = false;

        if ($scope.register_form.$valid) {
            registrationService.registerStudentForClass(
                $scope.registration.student.firstName,
                $scope.registration.student.lastName,
                $scope.registration.class).then(function(student) {
                    $scope.register_form.submitted = true;
                    $location.path('/dashboard');
                }, function(error) {
                    $scope.register_form.submitted = true;
                    $scope.register_form.studentDoesNotExist = true;
                });
        }
    }

    $scope.deregister_form_submit = function() {
        registrationService.deregisterStudentFromClass($scope.registration.student, $scope.registration.class);
        $location.path('/dashboard');
    }
}]);
