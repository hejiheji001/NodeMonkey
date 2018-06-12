const express = require('express');
const AnyProxy = require("anyproxy");
const exec = require('child_process').exec;
const conf = require('./config/conf.js');
const port = conf.proxyPort;
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const users = require('./routes/users');
const monkey = require('./routes/monkey');

const app = express();

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
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
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

app.listen(3000, function () {
    console.log('Activate Your Script By Access http://localhost:3000/monkey?name={RuleFileName}')
});

(function () {
    if (!AnyProxy.utils.certMgr.ifRootCAFileExists()) {
        AnyProxy.utils.certMgr.generateRootCA((error, keyPath) => {
            // let users to trust this CA before using proxy
            if (!error) {
                let certDir = require('path').dirname(keyPath);
                console.log('The cert is generated at', certDir);
                let isWin = /^win/.test(process.platform);
                if (isWin) {
                    exec('start .', { cwd: certDir });
                } else {
                    exec('open .', { cwd: certDir });
                }
            } else {
                console.error('error when generating rootCA', error);
            }
        });
    }

    let options = {
        port: port,
        rule: require("./proxy/startAnyProxy.js"),
        webInterface: {
            enable: true,
            webPort: 8002
        },
        throttle: 1000000,
        forceProxyHttps: true,
        wsIntercept: false, // 不开启websocket代理
        silent: true
    };

    let proxyServer = new AnyProxy.ProxyServer(options);
    proxyServer.start();

    process.on("exit", function () {
        console.log("Close Proxy");
        proxyServer.close();
    })
})();

module.exports = app;
