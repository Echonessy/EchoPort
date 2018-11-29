//系统通用配置
/**
 * Created by Echonessy on 2018/10/19.  config
 */
const path = require('path');
const config = {
    // debug 为 true 时，用于本地调试
    debug: true,
    // 添加到 html head 中的信息
    site_headers: [],
    site_logo: '/static/images/logo.png', // default is `name`
    site_icon: '/static/images/favicon.ico',
    local:{
        protocol: 'http',
        host: '127.0.0.1',//
        port: 5100
    },
    //后台服务端url
    javaServerUrl:'',
    expires: 200 * 60 * 1000,
    ttl:60*60,//过期时间 秒
    session_secret: 'xzcmasadajjhnad@!#@Echonessy(*&$%NBN%$%^HK(Yjhgjhgjhg)',
    auth_cookie_name: 'connect.sid',
    // newrelic 是个用来监控网站性能的服务
    newrelic_key: 'yourkey',
    maxParallel:10//express层定时、轮询功能最大并发数
};


module.exports = config;


