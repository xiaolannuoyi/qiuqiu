
const router = require('koa-router')()
const server = require('../common/server')//请求处理

router.prefix('/user')

router.post('/bbt', server.bbt);
router.post('/ld', server.ld);
module.exports = router