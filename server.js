var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('./modules/utils/mongo.js');
var Session = require('./modules/session');
var Whiteboard = require('./modules/whiteboard');
var Videos = require('./modules/videos');

app.use(express.static('client'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', function(socket){
  new Session(socket, io);
  new Whiteboard(socket, io);
  new Videos(socket, io);
});

http.listen(process.env.PORT, process.env.IP, function(){
  console.log('Welcome !');
});
