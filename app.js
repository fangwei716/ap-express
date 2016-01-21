var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
// var RedisStore = require('connect-redis')(session);

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/ap-express');

var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//sessions
// var options = {
//      "host": "127.0.0.1",
//      "port": "6379",
//      "ttl": 60 * 60 * 24 * 30,   //Session的有效期为30天
// };

app.use(session({
     // store: new RedisStore(options),
     secret: 'ap-express is powerful',
     saveUninitialized: true,
     resave: false,
     cookie: { secure: true }
}));

//mongodb
app.use(function(req,res,next){
    req.db = db;
    next();
});

//index.js routes
app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
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


module.exports = app;