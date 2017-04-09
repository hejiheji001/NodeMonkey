var express = require('express');
var proxy = require("anyproxy");
var conf = require('./config/conf.js');
var port = conf.proxyPort;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var monkey = require('./routes/monkey');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/monkey', monkey);
//app.use('/proxy', monkey.proxy);

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

app.listen(3000, function () {
  console.log('Activate Your Script By Access http://localhost:3000/monkey?name={RuleFileName}')
});

(function () {
    //create cert when you want to use https features
    //please manually trust this rootCA when it is the first time you run it
    !proxy.isRootCAFileExists() && proxy.generateRootCA(function(){});
    var options = {
        type          : "http",
        port          : port,
        hostname      : "localhost",
        rule          : require("./proxy/startAnyProxy.js"),
        dbFile        : null,  // optional, save request data to a specified file, will use in-memory db if not specified
        webPort       : 8002,  // optional, port for web interface
        socketPort    : 8003,  // optional, internal port for web socket, replace this when it is conflict with your own service
        disableWebInterface : false, //optional, set it when you don't want to use the web interface
        setAsGlobalProxy : false, //set anyproxy as your system proxy
        silent        : false, //optional, do not print anything into terminal. do not set it when you are still debugging.
        interceptHttps: true
    };
    var server = new proxy.proxyServer(options);
    process.on("exit", function(){
        console.log("Close Proxy");
        server.close();
    })
})();

module.exports = app;
