const http     = require('http');
const express  = require('express');
const socketIo = require('socket.io');
const redis    = require('redis');
var url        = require('url');
const app      = express();

app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index', { message: 'you can do this!'});
});

var port = process.env.PORT || 3001;

var redisURL = url.parse("redis://h:pebpcfbicj47q63k6m4i5c8iouj@ec2-54-235-164-4.compute-1.amazonaws.com:9849");

var redisClient = redis.createClient(redisURL.port, redisURL.hostname);
redisClient.auth(redisURL.auth.split(":")[1]);

var server = http.createServer(app)
                 .listen(port, function(){
                    console.log('Listening on port '+ port +'.');
                  });

const io       = socketIo(server);

redisClient.subscribe('update');

io.on('connection', function(socket){

  redisClient.on('message', function(channel, message){
    io.sockets.emit('message', message)
  });

});
