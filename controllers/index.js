/**
 * Created by Echonessy on 2018/10/19.
 */
const common = require("./common");
const responseHelper = require('../common/response_helper');
const index = require('../proxy/index');
//默认页面
exports.index = function (req, res) {
    return res.render('void');
};
//默认页面
exports.tool = function (req, res) {
    return res.render('tool/index');
};
//404
exports.i404 = function (req, res) {
    return res.render('error/404');
};
//403
exports.i403 = function (req, res) {
    return res.render('error/403');
};
//400
exports.i400 = function (req, res) {
    return res.render('error/400');
};
//500
exports.i500 = function (req, res) {
    return res.render('error/500');
};
//503
exports.i503 = function (req, res) {
    return res.render('error/503');
};


//工具
exports.netWorkPort = function (req, res,next) {
    var reqData = req.body;
    index.netWorkPort(reqData).then(function (data) {
        setHeader(req, res);
       return res.json(data )
    }).catch(function (e) {
        setHeader(req, res);
        return res.json(e.message);
    });
};

//设置请求头
function setHeader(req, res) {
    var header = req.body.Headers;
    if(!header) {return}
    if (header.length > 0 ) {
        for(var i=0; i<header.length;i++) {
            res.setHeader(header[i].key, header[i].value);
        }
    }
}