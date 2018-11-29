/**
 * Created by Echonessy on 2018/10/19.
 */
//用户ip
const getClientIp = (req) =>{
    let Ip =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    return Ip.replace('::ffff:','');
};
// 用户设备
const UserAgent = (req) =>{ return  req.headers['user-agent']; };

exports.RequestkHead = (req,res,next) =>{
    res.setHeader('Version', '1.0');
    res.setHeader('Author', 'Echonessy');
    res.setHeader('User-Ip', getClientIp(req));
    res.setHeader('User-Agent', UserAgent(req));
    res.removeHeader('X-Powered-By');
    next();
};