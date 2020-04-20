var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const database = require('./database');
const engines = require("consolidate");
const fs = require("fs");
const URL = require('./helpers/path');
const tokenMiddleware = require('./middleware/token');

var bodyParser = require('body-parser');

const usersRouter = require('./routes/users');
const actionsRouter = require('./routes/actions');
const searchRouter = require('./routes/search');
const contentRouter = require('./routes/content');
const videoRouter = require('./routes/video');
const commentsRouter = require('./routes/comments');

const demouploadRouter = require('./routes/demoupload');

if (!fs.existsSync('./files')) {
  fs.mkdirSync('./files');
}

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

app.use('/', express.static(path.join(__dirname)));
app.use('/emoji', express.static(path.join(__dirname, 'emojis')));
app.use('/emoji_urls', (req, res) => {
  let json = {};
  fs.readdirSync('./emojis').forEach((fileName) => {
      json[fileName.slice(0, fileName.indexOf('.')).toUpperCase().replace('-', '_')] = {
        url: URL.generateUrl('', `emoji/${fileName}`),
        value: Math.floor((Math.random() * 10) + 1)
      };
  });
  res.json(json)
});
app.use('/video', videoRouter);
app.use('/users', usersRouter);
app.use('/actions', actionsRouter);
app.use('/search', tokenMiddleware.verify, searchRouter);
app.use('/content', tokenMiddleware.verify, contentRouter);
app.use('/comment', tokenMiddleware.verify, commentsRouter);
app.use('/refreshToken', tokenMiddleware.refresh);

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
  res.locals.message = err;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.json({error: err});
});

module.exports = app;
