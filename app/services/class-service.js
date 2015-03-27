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

        this.addClass = function(name, buildingName, floor) {

            var deferred = $q.defer();

            var Class = Parse.Object.extend("Class");

            var classItem = new Class();

            classItem.set("name", name);
            classItem.set("buildingName", buildingName);
            classItem.set("floor", floor);

            classItem.save(null, {
                success: function (classItem) {
                    deferred.resolve(classItem);
                    $rootScope.$apply();
                },
                error: function (classItem, error) {
                    deferred.reject(error);
                    $rootScope.$apply();
                }
            })

            return deferred.promise;
        }

        this.findClass = function(classId) {
            var deferred = $q.defer();

            var Class = Parse.Object.extend("Class");

            var query = new Parse.Query(Class);

            query.equalTo("objectId", classId);

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

        this.editClass = function(classItem, name, buildingName, floor) {

            var deferred = $q.defer();

            classItem.set("name", name);
            classItem.set("buildingName", buildingName);
            classItem.set("floor", floor);

            classItem.save(null, {
                success: function (classItem) {
                    deferred.resolve(classItem);
                    $rootScope.$apply();
                },
                error: function (classItem, error) {
                    deferred.reject(error);
                    $rootScope.$apply();
                }
            })

            return deferred.promise;
        }

        this.deleteClass = function(classItem) {

            var deferred = $q.defer();

            classItem.destroy({
                success: function(classItem) {
                    deferred.resolve(classItem);
                    $rootScope.$apply();
                },
                error: function(classItem, error) {
                    deferred.reject(error);
                    $rootScope.$apply();
                }
            });

            return deferred.promise;
        }

    }]);
