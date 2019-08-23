const Koa = require('koa')
const mongoose = require('mongoose')
const cors = require('koa2-cors')
const bodyParser = require('koa-bodyparser')
const user = require('./routes/user')//路由
const app = new Koa()

//数据结构表存入数据库
require('./mongodb/dbHelper')
//数据库连接
mongoose.connect('mongodb://localhost:27017/qiuqiudb', { useNewUrlParser: true },(err,res)=>{
    if(!err){
        console.log('数据库连接成功')
    }
})
// 使用ctx.body解析中间件
app.use(bodyParser())
// 处理跨域的配置
app.use(cors({
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
  maxAge: 100,
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));

//路由
app.use(user.routes(), user.allowedMethods())

app.listen(9000);
console.log('app started at port 9000...')
