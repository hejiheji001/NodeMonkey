/**
 * Created by FireAwayH on 09/04/2017.
 */
var bodyParser = require("body-parser"),
    fs = require("fs");

var conf = require("../config/conf.js");
var code = [];
var mapConfig = [],
    configFile = "mapConfig.json";

module.exports = {
    token: Date.now(),
    summary: function () {
        var tip = "the default rule for AnyProxy.";
        return tip;
    },

    shouldUseLocalResponse: function (req, reqBody) {
        //intercept all options request
        var simpleUrl = (req.headers.host || "") + (req.url || "");
        mapConfig.map(function (item) {
            var key = item.keyword;
            if (simpleUrl.indexOf(key) >= 0) {
                req.anyproxy_map_local = item.local;
                return false;
            }
        });


        return !!req.anyproxy_map_local;
    },

    dealLocalResponse: function (req, reqBody, callback) {
        if (req.anyproxy_map_local) {
            fs.readFile(req.anyproxy_map_local, function (err, buffer) {
                if (err) {
                    callback(200, {}, "[AnyProxy failed to load local file] " + err);
                } else {
                    var header = {
                        'Content-Type': utils.contentType(req.anyproxy_map_local)
                    };
                    callback(200, header, buffer);
                }
            });
        }
    },

    getInsertionCode: function(){
        fs.readFile('./rules/' + conf.insertion + '.js', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            var inline = data.replace(/\r\n/g, "");
            var match = inline.split("\@match")[1].split("// ")[0].trim();
            var script = inline.split("// ==/UserScript==")[1];
            code = [match, script];
        });
        return code;
    },

    //replaceRequestProtocol: function (req, protocol) {
    //},
    //
    //replaceRequestOption: function (req, option) {
    //},
    //
    //replaceRequestData: function (req, data) {
    //},
    //
    //replaceResponseStatusCode: function (req, res, statusCode) {
    //},
    //
    //replaceResponseHeader: function (req, res, header) {
    //},

    //替换服务器响应的数据
    replaceServerResDataAsync: function (req, res, serverResData, callback) {
        if(code.length > 0){
            var script = code;
            console.log(script);
            if (new RegExp(script[0].substr(9).trim(), "i").test(req.url)) {
                try {
                    var resStr = serverResData.toString().replace("</body>", "<script type='application/javascript'>" + script[1] + "</script></body>");
                    callback(resStr);
                } catch (e) {
                    console.log(e);
                }
            } else {
                callback(serverResData);
            }
        }else{
            this.getInsertionCode();
            callback(serverResData);
        }
    },

    //pauseBeforeSendingResponse: function (req, res) {
    //},

    shouldInterceptHttpsReq: function (req) {
        return interceptFlag;
    },

    ////[beta]
    ////fetch entire traffic data
    //fetchTrafficData: function (id, info) {
    //},

    setInterceptFlag: function (flag) {
        interceptFlag = flag;
    },

    _plugIntoWebinterface: function (app, cb) {

        app.get("/filetree", function (req, res) {
            try {
                var root = req.query.root || utils.getUserHome() || "/";
                utils.filewalker(root, function (err, info) {
                    res.json(info);
                });
            } catch (e) {
                res.end(e);
            }
        });

        app.use(bodyParser.json());
        app.get("/getMapConfig", function (req, res) {
            res.json(mapConfig);
        });
        app.post("/setMapConfig", function (req, res) {
            mapConfig = req.body;
            res.json(mapConfig);

            saveMapConfig(mapConfig);
        });

        cb();
    },

    _getCustomMenu: function () {
        return [
            // {
            //     name:"test",
            //     icon:"uk-icon-lemon-o",
            //     url :"http://anyproxy.io"
            // }
        ];
    }
};