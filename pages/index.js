var app = angular.module('music',[]);



app.controller('musiclist',function($scope,$http){
  $scope.currentsong="Please Select a song to play"
  var list;
  connect();
  //var audio = new Audio("http://localhost:3000/01 - Tu Jaane Na - Atif Aslam [www.DJMaza.Com].mp3");
  //audio.currentTime = 10;
  //audio.play();

  function setAudio(data){
    if(data.name == null){
      return;
    }
    var audio = $('#player');
    var src = $('#mysource');
    src.attr('src',"/"+data.name);
    $scope.currentsong=data.name;
    audio[0].load();
    audio[0].play();
    audio[0].currentTime=data.time;
  }
  function connect(){

    var socket = io.connect('http://192.168.0.5:4120/');


    socket.on('broadcast', function (data) {
     console.log(data);

     setAudio(data);
    });

    socket.on('message', function(data) {
      console.log(data);

      setAudio(data);
   });


  }


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
    /*
    var audio = $('#player');
    var src = $('#mysource');
    src.attr('src',"/"+song);
    audio[0].load();
    audio[0].play();
    audio[0].currentTime=10;
    */
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
