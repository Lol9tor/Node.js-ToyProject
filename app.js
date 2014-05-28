var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/user');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/notepad');

app = express();

// view engine setup
app.set('port', process.env.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname + '/public')));
app.use('/static', express.static(__dirname + '/public'));
app.use(app.router);

app.get('/', routes.index);
app.get('/service', users.userlist);
app.get('/check', users.checklogin);
app.post('/service', users.adduser);
app.del('/service/:user_login', users.delete);
app.put('/service', users.update);

app.locals.db = db;

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
