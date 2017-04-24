var app = angular.module('music',[]);

app.controller('musiclist',function($scope,$http){
  $scope.currentsong="Please Select a song to play"
  var list;

  $scope.pause = function(){
    $http({
      method: 'GET',
      url: '/pause'
    }).then(function successCallback(response) {

      alert(response.data);


      }, function errorCallback(response) {

      });



  }
  $scope.clickme = function(song){
    var data ={
      'name':song

    }
    $scope.currentsong=song;
    $http.post('/getsong', data).then(function(){

      console.log("posted data!!");


    },function(){});
  }
  $http({
    method: 'GET',
    url: '/allfiles'
  }).then(function successCallback(response) {

    $scope.list = response.data;
    console.log(list);

    }, function errorCallback(response) {

    });


});
