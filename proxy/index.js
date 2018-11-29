/**
 * Created by Echonessy on 2018/10/19.  config
 */
var path = require('path');
var common = require("./common");


module.exports.netWorkPort = function (data) {
    var reqUrl = netWorkPortData(data).Url;
    var reqData = netWorkPortData(data).Data;
    return common.postToolMethod(reqUrl,reqData);
};
//创建数据
function netWorkPortData(data) {
    var reqData = {};
    var flag = data.Flag;
    //body请求方式
    if(flag == '0000') {
        reqData.Url = data.Url;
        reqData.Data = data.ReqJson.Data;
    } else {
        reqData.Url = creatWapUrl(data);
        reqData.Data = creatKeyData(data);
    }
    return reqData;
}

//链接拼接
function creatWapUrl(data) {
    var keyValue = data.ReqKeyValue;
    var url = ''
    if(!keyValue) {
        return url;
    }
    if(keyValue.length > 0) {
        url = data.Url+'?'+keyValue[0].key+'='+keyValue[0].value;
        for(var i = 1; i < keyValue.length; i++) {
            url+= '&'+keyValue[i].key+'='+keyValue[i].value;
        }
    }
    return url;
}

//key-value转Json
function creatKeyData(data) {
    var keyValue = data.ReqKeyValue;
    var reqData = {};
    if(!keyValue) {
        return reqData
    }
    var jsonStr = '{'
    if (keyValue.length > 0) {
        for(var i = 0; i < keyValue.length; i++) {
            jsonStr+= '"'+keyValue[i].key+'":'+'"'+keyValue[i].value+'",'
        }
        jsonStr = jsonStr.substr(0, jsonStr.length - 1);
    }
    jsonStr += '}';
    reqData = JSON.parse(jsonStr)
    console.log(reqData)
    return reqData;
}
