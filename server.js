/**
 * Created by Echonessy on 2018/10/19.
 */
const config = require('./config'); global.config = config;
const path = require('path');
const https = require('http');
const express = require('express');
const session = require('express-session');
const _ = require('lodash');
const compress = require('compression');
const bodyParser = require('body-parser');
const multer = require('multer');
const favicon = require('serve-favicon');
const logger = require('./common/log4node.js');
const proxy = require('express-http-proxy');
const request_Head = require('./middlewares/request_Head');
const app = express();

//设置页面模板引擎 采用ejs模板  <engine> 的支持 (ejs|hbs|hjs|jade|pug|twig|vash)
app.set('views', path.join(__dirname, 'views'));
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');
app.use(compress());

//设置静态文件目录
const staticDir = path.join(__dirname, 'static');
app.use('/static', express.static(staticDir));

//设置系统标题栏logo
app.use(favicon(__dirname + config.site_icon));

//启动日志配置
app.use(logger.appLog());

//启用数据 application/json 解析解析  Post:req.body  Get:req.query
app.use(bodyParser.json());

//创建 application/x-www-form-urlencoded 解析
app.use(bodyParser.urlencoded({extended: true,limit:'1024kb'}));

//Cookie 会话保持
app.use(require('cookie-parser')(config.session_secret));

//启动请求头配置
app.use(request_Head.RequestkHead);

//全局变量挂载
_.extend(app.locals, {config: config, assets: {}})

//设置路由解析
const mount = require('mount-routes');
mount(app, __dirname + '/routes', false);

//访问异常处理
app.use((err,req, res,next) => { console.log(err.stack); res.status(500).render('error/500');});
app.use((err,req, res,next) => { console.log(err.stack); res.status(403).render('error/403');});
app.use((err,req, res,next) => { console.log(err.stack); res.status(503).render('error/503');});
app.use((err,req, res,next) => { console.log(err.stack); res.status(400).render('error/400');});
app.use((err,req, res,next) => { console.log(err.stack); res.status(404).render('error/404');});

// 404
app.get('*', function(req, res){return res.status(404).render('error/404');});

//启动服务监听
app.listen(config.local.port, () =>{
    console.log("Local visit your app with " + config.local.protocol + "://" + config.local.host + ':' + config.local.port);
});

module.exports = app;
