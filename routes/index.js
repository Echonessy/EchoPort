/*!Index 路由*/
const express = require('express');
const router = express.Router();
const index = require('../controllers/index');
router.get(/(^\/$)|^(\/index)/, index.index);

//首页
router.get("/index", index.index);//首页
//工具
router.get("/tool", index.tool);//
router.post("/tool", index.tool);//
//请求借口
router.post("/netWorkPort", index.netWorkPort);//
//错误页
router.get("/404", index.i404);//404
router.get("/403", index.i403);//403
router.get("/400", index.i400);//400
router.get("/500", index.i500);//500
router.get("/503", index.i503);//503



module.exports = router;