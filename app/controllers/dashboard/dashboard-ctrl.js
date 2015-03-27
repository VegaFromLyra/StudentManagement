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

        $scope.submitStudentForm = function() {

            if ($scope.addStudent_form.$valid) {
                if ($scope.student.id != null) {
                    $scope.editExistingStudent($scope.student);
                }
                else {
                    $scope.saveNewStudent();
                }
            }
        }

        $scope.setStudentProperties = function(student) {
            student.set("firstName", $scope.student.firstName);
            student.set("lastName", $scope.student.lastName);
            student.set("age", $scope.student.age);
            student.set("photoUrl", $scope.student.photoUrl);
        }

        $scope.saveNewStudent = function() {
            var Student = Parse.Object.extend("Student");
            var student = new Student();

            $scope.setStudentProperties(student);

            student.save(null, {
                success: function(student) {
                    $scope.$apply($scope.studentUpdated())
                },
                error: function(student, error) {

                }
            });
        }

        $scope.editExistingStudent = function(student) {
            var Student = Parse.Object.extend("Student");
            var query = new Parse.Query(Student);

            query.equalTo("objectId", student.id);

            query.find({
                success: function(results) {
                    $scope.saveEditedStudent(results[0]);
                },
                error: function(error) {
                    $log.error("Could not find " + student.id);
                    $log.error("Error code: " + error.code + "Error message " + error.message);
                }
            });
        }

        $scope.saveEditedStudent = function(student) {

            $scope.setStudentProperties(student);

            student.save(null, {
                success: function(student) {
                    $scope.$apply($scope.studentUpdated())
                },
                error: function(student, error) {

                }
            });
        }

        $scope.fileNameChanged = function(element) {
            $scope.uploadPhoto(element.files[0]);
        }

        $scope.selectFile = function() {
            $("#file").click();
        }

        $scope.uploadPhoto = function(file) {
            var serverUrl = 'https://api.parse.com/1/files/' + file.fileName;

            $.ajax({
                type: "POST",
                beforeSend: function (request) {
                    request.setRequestHeader("X-Parse-Application-Id", 'KGxHRY1i2W1plkO5rWORg8YQLaKjcwTvs9BIpjyj');
                    request.setRequestHeader("X-Parse-REST-API-Key", 'RRlhxpPRl3B55yYBQiZ60ODVYpVgKDGaBCKpKYCJ');
                    request.setRequestHeader("Content-Type", file.type);
                },
                url: serverUrl,
                data: file,
                processData: false,
                contentType: false,
                success: function (data) {
                    $scope.$apply($scope.photoUploaded(data));
                },
                error: function (data) {
                    var obj = jQuery.parseJSON(data);
                    $log.error(obj.error);
                }
            });
        }

        $scope.photoUploaded = function(data) {
            $log.info("File available at: " + data.url);
            $scope.student.photoUrl = data.url;
        }

        $scope.studentUpdated = function() {
            $scope.shouldShowStudentForm = false;
            $scope.loadStudents();
        }


        $scope.findAndDeleteStudent = function(studentId) {
            var Student = Parse.Object.extend("Student");
            var query = new Parse.Query(Student);

            query.equalTo("objectId", studentId);

            query.find({
                success: function(results) {
                    $scope.deleteStudent(results[0]);
                },
                error: function(error) {
                    $log.error("Could not find " + studentId);
                    $log.error("Error code: " + error.code + "Error message " + error.message);
                }
            });
        }

        $scope.deleteStudent = function(student) {
            student.destroy({
                success: function(student) {
                    $scope.$apply($scope.loadStudents());
                },
                error: function(object, error) {
                    $log.error("Error code " + error.code + "and error message " + error.message);
                }
            });
        }

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