var app = angular.module("myApp");

app.controller('DashboardController',
    ['$scope', '$log', '$location', '$routeParams', 'StudentService', 'ClassService', 'RegistrationService',
    function($scope, $log, $location, $routeParams, studentService, classService, registrationService) {

        $scope.displayStudents = function() {
            $scope.showStudents = true;
            $scope.showClasses = false;
            $scope.showRegistrations = false;
            $scope.loadStudents();
        }

        $scope.displayClasses = function() {
            $scope.showStudents = false;
            $scope.showClasses = true;
            $scope.showRegistrations = false;
            $scope.loadClasses();
        }

        $scope.displayRegistrations = function() {
            $scope.showStudents = false;
            $scope.showClasses = false;
            $scope.showRegistrations = true;
            $scope.loadRegistrations();
        }

        $scope.loadStudents = function() {
            studentService.loadStudents().then(function(results) {
                $scope.studentsLoaded(results);
            });
        }

        $scope.studentsLoaded = function(results) {

            $scope.students = [];

            _.each(results, function(result){

                var student = {}
                student.id = result.id;
                student.firstName = result.get('firstName');
                student.lastName = result.get('lastName');
                student.age = result.get('age');
                student.photoUrl = result.get('photoUrl') || '/profile.png';


                $scope.students.push(student)
            });
        }

        $scope.loadClasses = function() {
            classService.loadClasses().then(function(results) {
                $scope.classesLoaded(results);
            });
        }

        $scope.classesLoaded = function(classes) {

            $scope.classes = [];

            _.each(classes, function(classItem){
                $scope.classes.push(classItem);
            });
        }

        $scope.loadRegistrations = function() {

            $scope.registrations = [];

            classService.loadClasses().then(function(results) {
                $scope.classesLoaded(results);

                // TODO - Ask Bansal if this is the right way to chain
                registrationService.loadRegistrations($scope.classes).then(function(results){
                    $scope.registrationsLoaded(results);
                });

            });
        }

        $scope.registrationsLoaded = function(registrations) {

            _.each(registrations, function(registration) {
                $scope.registrations.push(registration);
            });
        }

        // Student methods

        $scope.addStudent = function() {

            $scope.addStudent_form.title = "Add Student";

            $scope.addStudent_form.submitText = "Add Student";

            $scope.student = {};

            $scope.student.photoUrl = '/profile.png';

            // TODO - Fix bug where form is not getting reset correctly
            $scope.addStudent_form.$pristine = true;

            $scope.shouldShowStudentForm = true;
        }

        $scope.editStudent = function(student) {

            $scope.addStudent_form.title = "Edit Student";

            $scope.addStudent_form.submitText = "Edit Student";

            $scope.student = student;

            $scope.shouldShowStudentForm = true;
        }

        $scope.submitStudentForm = function() {

            if ($scope.addStudent_form.$valid) {
                if ($scope.student.id != null) {
                    studentService.findStudent($scope.student.id).then(function(results){

                        studentService.modifyAndSaveStudent(
                            results[0],
                            $scope.student.firstName,
                            $scope.student.lastName,
                            $scope.student.age,
                            $scope.student.photoUrl).then(function(student) {
                                $scope.studentUpdated()
                            }, function(error) {
                                $log.error("Error code: " + error.code + "Error message " + error.message);
                            });
                    });
                }
                else {
                    studentService.addStudent(
                        $scope.student.firstName,
                        $scope.student.lastName,
                        $scope.student.age,
                        $scope.student.photoUrl).then(function(student) {
                            $scope.studentUpdated();
                        }, function(error) {
                            $log.error("Error code: " + error.code + "Error message " + error.message);
                        })
                }
            }
        }

        $scope.studentUpdated = function() {
            $scope.shouldShowStudentForm = false;
            $scope.loadStudents();
        }

        $scope.deleteStudent = function(studentId) {
            studentService.deleteStudent(studentId).then(function(student) {
                $scope.loadStudents();
            }, function(error) {
                $log.error("Could not delete because of error code " + error.code + "and error message " + error.message);
            });
        }

        $scope.fileNameChanged = function(element) {
            studentService.uploadPhoto(element.files[0]).then(function(data) {
                $scope.photoUploaded(data);
            }, function(error) {
                var obj = jQuery.parseJSON(error);
                $log.error(obj.error);
            });
        }

        $scope.selectFile = function() {
            $("#file").click();
        }

        $scope.photoUploaded = function(data) {
            $scope.student.photoUrl = data.url;
        }

        // Class methods

        $scope.saveClassUsingForm = function(classItem) {

            classItem.set("name", $scope.class.name);
            classItem.set("buildingName", $scope.class.buildingName);
            classItem.set("floor", $scope.class.floor);

            classItem.save(null, {
                success: function (classItem) {
                    $scope.$apply($scope.classSaved());
                },
                error: function (classItem, error) {
                    $scope.$apply($scope.errorSavingClass());
                }
            })
        }

        $scope.submitClassForm = function() {

            if ($scope.addClass_form.$valid) {

                var Class = Parse.Object.extend("Class");

                if ($scope.class.id != null) {

                    var query = new Parse.Query(Class);

                    query.equalTo("objectId", $scope.class.id);

                    query.find({
                        success: function(results) {
                            $scope.savedEditedClass(results[0]);
                        },
                        error: function(error) {
                            $log.error("Could not find class with ID " + classItem.id);
                        }
                    })
                }
                else {

                    var classItem = new Class();

                    $scope.saveClassUsingForm(classItem);
                }
            }

        }

        $scope.classSaved = function() {
            $scope.addClass_form.submitted = true;
            $scope.shouldShowClassForm = false;
            $scope.loadClasses();
        }

        $scope.errorSavingClass = function() {
            $scope.addClass_form.submitted = true;
            $scope.addClass_form.errorSave = true;
        }

        $scope.addClass = function() {

            $scope.class = {};

            // TODO - Figure out how to reset form

            $scope.shouldShowClassForm = true;

            $scope.addClass_form.title = "Add Class";

            $scope.addClass_form.submitText = "Submit";
        }

        $scope.editClass = function(classItem) {
            // Set form fields
            $scope.shouldShowClassForm = true;

            $scope.class = {};

            $scope.class.id = classItem.id;
            $scope.class.name = classItem.get('name');
            $scope.class.buildingName = classItem.get('buildingName');
            $scope.class.room = classItem.get('floor');

            $scope.addClass_form.title = "Edit Class";

            $scope.addClass_form.submitText = "Edit";
        }

        $scope.savedEditedClass = function(classItem) {
            $scope.saveClassUsingForm(classItem);
        }

        $scope.deleteClass = function(classItem) {
            classItem.destroy({
                success: function(classItem) {
                    $scope.$apply($scope.loadClasses());
                },
                error: function(classItem, error) {
                    $log.error("Could not delete " + classItem.id);
                }
            })
        }

        $scope.registerStudent = function(classItem) {
            $location.path('/registerStudent/').search({className : classItem.get('name')});
        }

        $scope.removeStudentFromClass = function(student, classItem) {
            $location.path('/deregisterStudent/').search({classId: classItem.id, studentId: student.id});
        }

    }]);