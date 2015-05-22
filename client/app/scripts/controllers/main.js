'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $http) {
    var baseUrl = "http://localhost:5000";

    $scope.signedIn = false;

    $scope.signIn = function(user) {
      var url = baseUrl + "/signin?email=" + user.email + "&password=" + user.password;

      $http
        .post(url)
        .success(function(data, status, headers, config) {
          $scope.signedIn = true;
          $scope.getFriends();
        })
        .error(function(data, status, headers, config) {
          if(window.console&&window.console.log)console.log(arguments);
        });
    };

    $scope.getFriends = function() {
      var url = baseUrl + "/friends";

      $http
        .get(url)
        .success(function(data, status, headers, config) {
          $scope.friends = data.friendList;
        });
    };
  });
