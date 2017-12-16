// Globals
METADATA = require('./package.json');
config = require('./config/config'); // Custom general configuration params

var logger = require('./config/logger');
var path = require('path');
var express = require('express');
var session = require('express-session'); // Sessiones de express
var methodOverride = require('method-override');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var partials = require('express-partials') // Middleware for view templates
var passportLocalConf = require('./config/passport-strategies/local'); // Pssport middleware configuratio
var passport = require('passport'); // Middleware for authetication;
var Strategy = require('passport-local').Strategy; // Passport local strategy utility
var flash = require('connect-flash'); // Middleware to flas messages on login erros
var app = express();
var http = require('http').Server(app);
io = require('socket.io')(http); // Socket.io as global
var Engine = require('./middleware/engine/engine'); // Engine for call center traffic sim

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/img/favicon.ico'));
// Middleware for post forms from view to server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// load the express-partials middleware for templates use
app.use(partials());
// use middlewares to serve static contents
app.use(express.static(path.join(__dirname, 'public')));
// use express sessions
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: {}
}));
// Use flash messages
app.use(flash());


// Install passport configuration
passportLocalConf();

  
// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


const sessionController = require('./controllers/session.controller');

app.use(function (req, res, next) {
  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

app.get('/', function(req, res){
  res.render('index', {
    error: req.flash('loginMessage')
  });
});
app.get('/home', sessionController.loginRequired, function(req, res){
  res.render('home');
});

app.post('/login', 
  passport.authenticate('local', { 
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
  })
);

app.get('/logout', sessionController.destroy);

/*
 * io connection implementation
 */
io.on('connection', function(socket){
  //console.log('a user connected');
});

// Start http server
http.listen(3000, function(){
  console.log('listening on *:3000');
  var engine = new Engine({agents: 16});
  engine.init(io);
  engine.run();
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found: ' + req.path);
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    logger.log('error', err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  logger.log('error', err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
