
const Router = require('koa-router')
//路由模块
const  router = new Router()
const { upload } = require('../controllers/home')

router.post('/upload',upload)

module.exports = router;