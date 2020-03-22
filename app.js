var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const database = require('./database');
const engines = require("consolidate");

var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const imagesRouter = require('./routes/images');
const actionsRouter = require('./routes/actions');
const searchRouter = require('./routes/search');
const contentRouter = require('./routes/content');
const bufferRouter = require('./routes/buffer');

const demouploadRouter = require('./routes/demoupload');

var app = express();

mongoose.connect(`mongodb://localhost/${database.db_name}`);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("ejs", engines.ejs);
app.set("view engine", "ejs");

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/images', imagesRouter);
app.use('/actions', actionsRouter);
app.use('/search', searchRouter);
app.use('/content', contentRouter);
app.use('/buffer', bufferRouter);

app.use('/demoupload', demouploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('404.....');
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log('error handler.....', err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
