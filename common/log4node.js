/**
 * Created by Echonessy on 2018/10/19.
 */

const path = require("path");
const log4js = require("log4js");

log4js.configure(path.join(__dirname, "../config/log.json"));

exports.logger = (name) =>{
    let dateFileLog = log4js.getLogger(name);
    dateFileLog.setLevel(log4js.levels.INFO);
    return dateFileLog;
};

exports.info = (content) =>{
    let dateFileLog = log4js.getLogger('daily');
    dateFileLog.setLevel(log4js.levels.INFO);
    dateFileLog.info(content);
};

exports.warn = (content) =>{
    log4js.getLogger().warn(content);
};

exports.error = (content) => {
    try {
        log4js.getLogger().error(content);
    } catch (e) {
        console.error(e);
    }
};

exports.appLog = () =>{
    return log4js.connectLogger(log4js.getLogger("app"), {level: log4js.levels.INFO});
};