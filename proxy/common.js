/**
 * Created by Echonessy on 2018/10/19.  config
 */
var request = require('superagent');
var Promise = require("bluebird");
var logger = require('../common/log4node.js');



//GET
module.exports.getMethod = function (source_url) {
    return new Promise(function (resolve, reject) {
        request.get(source_url)
            .end(function (err, result) {
                console.log("访问：" + source_url);
                console.log("响应：" + JSON.stringify(result));
                if (err || !result.ok) {
                    reject(err || "响应异常");
                }
                else {
                    console.log("收到响应：");
                    console.log(result.text);
                    resolve(result.text);
                }
            });
    });
};

//POST
module.exports.postMethod = function (source_url, json) {
    return new Promise(function (resolve, reject) {
        if (!json) {
            json = {};
        }
        console.log("访问：" + source_url);
        console.log("参数：" + JSON.stringify(json));
        request.post(source_url)
            .send(json)
            .end(function (err, res) {
                if (!res) {
                    reject(new Error("请求没有响应"));
                    logger.error("请求没有响应");
                    return;
                }
                console.log("响应:" + res.text);
                if (err || !res.ok) {
                    reject(err)
                    logger.error(err);
                }
                var obj;
                try {
                    obj = JSON.parse(res.text);
                    if (res.ok && (obj.respCode=="200")) {
                        resolve(obj);
                    } else {
                        reject(new Error(obj.ErrMsg || ''));
                    }
                } catch (e) {
                    reject(new Error(res.text || '服务端异常！'));
                }
            });
    });
};

//工具post
module.exports.postToolMethod = function (source_url, json) {
    return new Promise(function (resolve, reject) {
        if (!json) {
            json = {};
        }
        console.log("访问：" + source_url);
        console.log("参数：" + JSON.stringify(json));
        request.post(source_url)
            .send(json)
            .end(function (err, res) {
                if (!res) {
                    reject(new Error("请求没有响应"));
                    logger.error("请求没有响应");
                    return;
                }
                console.log("响应:" + res.text);
                var obj;
                try {
                    obj = JSON.parse(res.text);
                    resolve(obj);
                } catch (e) {
                    reject(new Error(res.text || '服务端异常！'));
                }
            });
    });
};




