config = require('./config/config');

var path = require('path');
var express = require('express');
var partials = require('express-partials')
var app = express();
var http = require('http').Server(app);
io = require('socket.io')(http);
var engine = require('./middleware/engine/engine');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// load the express-partials middleware
app.use(partials());
// use middlewares
app.use(express.static(path.join(__dirname, 'public')));




app.get('/', function(req, res){
  res.render('index');
});
app.get('/home', function(req, res){
  res.render('home');
});




io.on('connection', function(socket){
  //console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
  engine.init(io);
  engine.run();
});



