var express = require('express');
var bodyParser = require('body-parser');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var Player = require('player');
var fs = require('fs');
var app = express();
var server = app.listen(4120);
var io = require('socket.io').listen(server);
var Stopwatch = require("node-stopwatch").Stopwatch;
var stopwatch = Stopwatch.create();
app.use(express.static('pages'));
app.use(express.static('public'))
app.use(bodyParser());


app.get('/allfiles',function(req,res) {
  fs.readdir(__dirname+'/public', function(err, filenames) {
     if (err) {
       console.log(err)
       return;
     }
     else{
       res.send(filenames);
     }
   });

})
app.get('/pause',function(req,res){
  if(!player){
    console.log("Player is not playing song")
  }else{
    player.stop();
  }
})

app.post('/upload_image', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file); //create log for file information
  console.log("Uploading Data.....................................On "+req.params.centre);
  //reading file from the path
  fs.readFile(req.file.path, function (err, data) {
        //defining a new path folder in the directory
        var newPath = __dirname+"/public/"+req.file.originalname;
        //writing file to the defined directory
        fs.writeFile(newPath, data, function (err) {
          //sending readed data at the response
          res.send("file uploaded Successfully");
        });
    });
})
var player,songName;
var timestamp;

app.get('/broadcast',function(req,res){
  io.sockets.emit('broadcast',"hello");
  res.send('hello');

});

app.get('/disconnect',function(req,res){
  io.disconnect();
});

app.post('/getsong',function(req,res){


  if(!player){
    timestamp = (new Date() / 1000);
    player = new Player(__dirname +'/public/'+req.body.name);
    player.playing =true
    console.log(__dirname +'/public/'+req.body.name);
  }else{
    timestamp = (new Date() / 1000);
    player.stop();
    delete player;
    player = new Player(__dirname +'/public/'+req.body.name);

  }

  //player.play();
  broadcast_song(req.body.name);
  songName = req.body.name;

});


function broadcast_song(song){
  var songdata ={
    'name':song,
    'time':(new Date() / 1000)-timestamp

  }
  io.sockets.emit('broadcast',songdata)
}

io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });
    var songdata ={
      'name':songName,
      'time':(new Date() / 1000)-timestamp
    }
    client.emit('message', songdata);



});

app.listen(3000,function(){

  console.log("Server Started Successfully");

});
