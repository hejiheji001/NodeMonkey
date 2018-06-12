/**
 * Created by FireAwayH on 12/06/2018.
 */
const fs = require("fs"), conf = require("../config/conf.js"), code = [];

const getInsertionCode = () => {
    console.log("Loading Script: " + conf.insertion);
    fs.readFile('./rules/' + conf.insertion + '.js', 'utf8', function (err, data) {
        if (err) {
            return console.log("Error: " + err);
        }

        console.log("Load Script: " + data.length);

        let match = data.split("\@match")[1].split("// ")[0].trim();
        console.log("Load Script: " + match.length);

        let script = data.split("// ==/UserScript==")[1];
        console.log("Load Script: " + script.length);

        code = [match, script];

        if (data.split("// ==/UserScript==").length == 3) {
            code.push(data.split("// ==/UserScript==")[2]);
        }

        console.log("Load Script: " + code.length);
    });
},
    stringToFunction = funcStr => {
        let fn = new Function("return " + funcStr);
        return fn();
    }

module.exports = {
    *beforeSendResponse(requestDetail, responseDetail) {
        const newResponse = responseDetail.response;
        newResponse.header["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0";
        newResponse.header["Pragma"] = "no-cache";
        newResponse.header["Expires"] = 0;


        if (code.length > 0) {
            let script = code;
            let match = script[0].trim().replace("http://", "").replace("https://", "");
            if (new RegExp(match, "i").test(requestDetail.url)) {

                try {
                    newResponse.body = newResponse.body.toString().replace("</head>", '<script type="text/javascript">' + script[1] + "</script></head>");
                    console.log("Code Injected");
                } catch (e) {
                    console.log("\x1b[31m", `Error: ${e}`);
                }
            }
        } else {
            console.log("Retry");
            this.getInsertionCode();
        }

        return {
            response: newResponse
        };
    }
};