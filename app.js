var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const RedisGraph = require('redisgraph.js').Graph;
const graphName = 'users';
const host = 'localhost';
const port = 6379;
const password = '';

global.graph = new RedisGraph(graphName, host, port, { password });
const Pool = require('pg').Pool
global.dbClient = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'access',
  password: 'en257Doks!',
  port: 5432,
})
global.dbClient.connect(async function (err) {
  if (err) throw err;
  console.log("Postgre Db Connected!");
  const { setDataToRedisGraph, inserDataToPostgre } = require('./src/services/process');
  //await setDataToRedisGraph();
  await inserDataToPostgre();
});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
