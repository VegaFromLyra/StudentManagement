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

        this.findStudent = function(studentId) {

            var deferred = $q.defer();

            var Student = Parse.Object.extend("Student");
            var query = new Parse.Query(Student);

            query.equalTo("objectId", studentId);

            query.find({
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

        this.modifyAndSaveStudent = function(student, firstName, lastName, age, photoUrl){

            var deferred = $q.defer();

            student.set("firstName", firstName);
            student.set("lastName", lastName);
            student.set("age", age);
            student.set("photoUrl", photoUrl);

            student.save(null, {
                success: function(student) {
                    deferred.resolve(student);
                    $rootScope.$apply();
                },
                error: function(student, error) {
                    deferred.reject(error);
                    $rootScope.$apply();
                }
            });

            return deferred.promise;
        }

        this.addStudent = function(firstName, lastName, age, photoUrl) {

            var deferred = $q.defer();

            var Student = Parse.Object.extend("Student");
            var student = new Student();

            student.set("firstName", firstName);
            student.set("lastName", lastName);
            student.set("age", age);
            student.set("photoUrl", photoUrl);

            student.save(null, {
                success: function(student) {
                    deferred.resolve(student);
                    $rootScope.$apply();
                },
                error: function(student, error) {
                    deferred.reject(error);
                    $rootScope.$apply();
                }
            });

            return deferred.promise;
        }

        this.deleteStudent = function(studentId) {
            var deferred = $q.defer();

            this.findStudent(studentId).then(function(results){

                results[0].destroy({
                    success: function(student) {
                        deferred.resolve(student);
                        $rootScope.$apply();
                    },
                    error: function(object, error) {
                        deferred.resolve(error);
                        $rootScope.$apply();
                    }
                })
            });

            return deferred.promise;
        }

        this.uploadPhoto = function(photoFile) {

            var deferred = $q.defer();

            var serverUrl = 'https://api.parse.com/1/files/' + file.fileName;

            // TODO - Should we be using ajax or http?
            $.ajax({
                type: "POST",
                beforeSend: function (request) {
                    request.setRequestHeader("X-Parse-Application-Id", 'KGxHRY1i2W1plkO5rWORg8YQLaKjcwTvs9BIpjyj');
                    request.setRequestHeader("X-Parse-REST-API-Key", 'RRlhxpPRl3B55yYBQiZ60ODVYpVgKDGaBCKpKYCJ');
                    request.setRequestHeader("Content-Type", photoFile.type);
                },
                url: serverUrl,
                data: photoFile,
                processData: false,
                contentType: false,
                success: function (data) {
                    deferred.resolve(data);
                    $rootScope.$apply();
                },
                error: function (error) {
                    deferred.reject(error);
                    $rootScope.$apply();
                }
            });

            return deferred.promise;
        }

        this.findStudentUsingName = function(firstName, lastName) {
            var deferred = $q.defer();

            var Student = Parse.Object.extend("Student");
            var query = new Parse.Query(Student);
            query.equalTo("firstName", firstName);
            query.equalTo("lastName", lastName);
            query.find({
                success: function(results) {

                    if (results.length > 0) {
                        deferred.resolve(results);
                        $rootScope.$apply();
                    } else {
                        deferred.reject("No students found");
                        $rootScope.$apply();
                    }
                },
                error: function(error) {
                    deferred.reject(error);
                    $rootScope.$apply();
                }
            })

            return deferred.promise;
        }

}]);