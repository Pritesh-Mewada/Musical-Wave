var app = angular.module('music',[]);

app.controller('musiclist',function($scope,$http){

  var list;
  $http({
    method: 'GET',
    url: '/audio'
  }).then(function successCallback(response) {

    $scope.list = response.data;
    console.log(list);

    }, function errorCallback(response) {

    });


});
