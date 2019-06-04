// Application main javascript function.
'use strict'; 

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var expressLayouts = require('express-ejs-layouts');
var expressValidator = require('express-validator');
var logger = require('morgan');
var passport = require('passport');

// Related modules.
var hookJWTStrategy = require('./services/passportStrategy');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var botRouter   = require('./routes/bots');

// Initialize application.
var app = express();

// Set application send the request with HTTP.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";

// view engine setup
app.engine('ejs', ejs.renderFile);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(expressLayouts);

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/bot', botRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// From - https://github.com/ctavan/express-validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
 
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
// End of express-validator

// Hook up Passport.
app.use(passport.initialize());

// Hook the passport JWT strategy.
hookJWTStrategy(passport);

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
