var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const sequelize = require('./models/db');
const { init } = require('./modules/fiblo/index');

const w3 = init();

require('./models/db');
require('./security/passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const usuario = require('./routes/usuarioRoutes');
app.use('/api/usuarios', usuario);

const proyecto = require('./routes/proyectoRoutes');
app.use('/api/proyectos', proyecto);

const categoria = require('./routes/categoriaRoutes');
app.use('/api/categorias', categoria);

require('./models/relations');

if (process.env.NODE_ENV === 'development')
  // Sincroniza las definiciones de los modelos en la base de datos
  sequelize.sync();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
