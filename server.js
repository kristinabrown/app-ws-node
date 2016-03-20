//require the libraries
const http     = require('http');
const express  = require('express');
const socketIo = require('socket.io');
const redis    = require('redis');
var url = require('url');

//instantiate the app as an instance of express
const app      = express();

//set the port if no evironmental port exists

var port = process.env.PORT || 3001;

//this connects to our rails redis instance, it is hardcoded in but it is possible that at some point
//heroku will change up our redis instance, that happens, and so if it's not working, the first thing
//to check will be our rails heroku redis url :)
var redisURL = url.parse("redis://h:pebpcfbicj47q63k6m4i5c8iouj@ec2-54-235-164-4.compute-1.amazonaws.com:9849");

var redisClient = redis.createClient(redisURL.port, redisURL.hostname);
redisClient.auth(redisURL.auth.split(":")[1]);


//SERVER
//initialize the server - pass the express app to the http module and have it listen to the port
var server = http.createServer(app)
                 .listen(port, function(){
                    console.log('Listening on port '+ port +'.');
                  });

//initiate socket io using the server instance
const io       = socketIo(server);

//set the redis subscription to method from Rails app
// var redisClient = redis.createClient();
redisClient.subscribe('update');

//set the io connection
io.on('connection', function(socket){

  redisClient.on('message', function(channel, message){
    io.sockets.emit('message', message)
  });

});
