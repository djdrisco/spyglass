var fs = require('fs');
var http = require('http');
var path = require('path');
var express = require('express');
var session = require('express-session');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Load application settings
var settings = require("./settings.js");

var MongoDBStore = require('connect-mongodb-session')(session);
var app = express();
var router = express.Router();

var port = process.env.PORT || settings.serverPort || 3000;

var store = new MongoDBStore({
  uri:'mongodb://'+ settings.mongodb.host + ':' + settings.mongodb.port + '/' +settings.dbs.session,
  collection: 'mySessions'
});

//catch errors
store.on('error', function(error){
  assert.ifError(error);
  assert.ok(false);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', port);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  secret: settings.webserver.cookieSecret,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  store: store}));

app.use(settings.baseUrl || '/', express.static(path.join(__dirname, 'public')));

process.stdout.write((new Date()).toString() + 'Spyglass started...\n');

//using auth-check to do authentication verification, if not logged in redirects to login page
//auth-check is a re-usable module to verify that a user is logged in
var authCheck = require('auth-check');
authCheck.init(app,'/login?login-required&referrer=');
app.use(authCheck.authenticationVerification);

// =======================================================================================

app.get(settings.baseUrl || '/', function(req, res, next) {
  res.render('index', {settings: settings});
});

fs.readdirSync(path.join(__dirname, 'routes')).forEach(function(file) {
  if (file.match(/^\./)) return; // ignore hidden files
  var mod = require(path.join(__dirname, 'routes', file));
  app.use(settings.baseUrl || '/', mod);
});

// catch 404 and forward to error handlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
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
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
