/**
 * Created by Echonessy on 2015/5/24.15:17
 * http响应常用方法
 */
var logger = require('./log4node.js');

//异常等级
var errLevel = {
    info:0,
    warning:1,
    error:2,
    fatal:3
};

//http异常status
var httpStatus={
    Success:200,
    Created:201,//[POST/PUT/PATCH]：用户新建或修改数据成功
    Accepted:202,//[*]：表示一个请求已经进入后台排队（异步任务）
    NoContent:204,//[DELETE]：用户删除数据成功。
    InvalidRequest:400,//[POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
    Unauthorized:401,//[*]：表示用户没有权限（令牌、用户名、密码错误）。
    Forbidden:403,//[*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
    NotFind:404,//[*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
    NotAcceptable:406,//[GET]：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
    Gone:410,//[GET]：用户请求的资源被永久删除，且不会再得到的。
    ServerException:500//[*]：服务器发生错误，用户将无法判断发出的请求是否成功。
};

var returnCode = {
    success:0,
    invalidParameter:-1,
    systemError:-2,
    unauthorized:-3,
    invalidContext:-4//无效的上下文，未登录或session过期
}

exports.errLevel=errLevel;
exports.statusCode = httpStatus;
exports.returnCode = returnCode;


// http响应提示
exports.statusTip = function (res, statusCode, obj) {
    return res.status(statusCode).send(obj);
};
//服务器端异常的提示
exports.serverExceptionTip = function (res, message) {
    return res.status(httpStatus.ServerException).send(backResult(returnCode.systemError, message && message.Error || message, errLevel.error));
};
//服务器端异常的页面
exports.serverExceptionPage = function (res) {
    //res.render('error/ecodeErr',{"ERR_CODE":"-2","ERR_MSG":"服务器去月亮旅游了，很快就回来....."});
    //this.EcodepayErrPage(res,'服务器异常，请联系相关人员处理...',"ServerError!");
    this.EcodepayErrPage(res,'请联系相关管理人员处理...',"ooops!");
};

//交易失败提示页面
exports.EcodepayErrPage = function (res,message,errcode) {
    if(arguments.length==1 ){
        message="ooops! that's an err.";
        errcode="-1";
    }
    if(arguments.length==2 ){
        errcode="-1";
    }
    res.render('error/ecodeErr',{"ERR_CODE":errcode,"ERR_MSG":message});
};

/**
 * 成功的提示
 * @param res
 * @param tip
 * @returns {*}
 */
exports.successTip = function (res, tip) {
    return res.json(backResult(returnCode.success, tip));
};
exports.successTipwithdata = function (res, tip,data) {
    return res.json(backResult(returnCode.success, tip,data));
};

/**
 * 错误提示，给api使用，异常正常返回，在返回字段中标识.默认是参数不正确errorCode
 * @param res
 * @param status
 * @param tip
 * @returns {*}
 */
exports.errorTip = function (res, status, tip) {
    if (!isNaN(status)) {
        return res.json(backResult(status, tip));
    }
    return res.json(backResult(returnCode.invalidParameter, status ,errLevel.warning));
};

exports.unauthorizedTip = function (res, tip) {
    return res.json(backResult(returnCode.unauthorized, tip ,errLevel.warning));
};

exports.returnData = function ( res, data) {
    res.json(data);
};



exports.handlerPromiseError = function (promise, res) {
    promise.error(function (e) {
        if (e instanceof Error) {
            logger.error(e);
            return exports.serverExceptionTip(res, e.message);
        } else {
            logger.warn(e);
            res.status(httpStatus.Success).send(e);
        }
    }).catch(function (e) {
        logger.error(e);
        if (e instanceof Error) {
            return exports.serverExceptionTip(res, e.message);
        } else {
            res.status(httpStatus.ServerException).send(e);
        }
    });
}

function backResult(status, message, errorLevel){
    if(arguments.length==1 ){
        return {
            status:returnCode.success,
            msg: status
        };
    }
    if(arguments.length ==2 ){
        return {
            status:status,
            msg: message
        };
    }

    return {
        msg: message, //信息
        status:status, //对应enum中的backResultCode
        errLevel: errorLevel//异常等级，用来标记底座或页面应该怎么显示提示信息
    };
}
function backResult(status, message,data, errorLevel){
    if(arguments.length==1 ){
        return {
            status:returnCode.success,
            msg: status
        };
    }
    if(arguments.length ==2 ){
        return {
            status:status,
            msg: message
        };
    }
    if(arguments.length==3){
        return {
            status:status,
            msg: message,
            data:data
        };
    }

    return {
        msg: message, //信息
        status:status, //对应enum中的backResultCode
        data:data,
        errLevel: errorLevel//异常等级，用来标记底座或页面应该怎么显示提示信息
    };
}

exports.backResult=backResult;
exports.dynamicResponse=function(req,res,status,tip){
    if (req.headers.accept.indexOf('text/html')>-1) {
        switch (status){
            case 403:
                return res.render('error/403');
            default:
                return res.render('error/404');
        }
    } else {
        return res.status(status).send(tip);
    }
}