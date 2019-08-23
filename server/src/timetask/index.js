
const mongoose = require('mongoose')
const dbHandle = require('../mongodb/dbHandle')//数据库操作

const {getip} = require('./getIP')
const {changeStatus} = require('./testip')
const {bbtlink,ldlink,getshare,alluser} = require('./getshare')
//数据结构表存入数据库
require('../mongodb/dbHelper')
mongoConnect().catch(err=>{
    console.log('mongoConnect',err)
})
const CronJob = require('cron').CronJob;
//'50 25 14 * * *'

//数据库连接
async function mongoConnect() {
    await mongoose.connect('mongodb://localhost:27017/qiuqiudb', { useNewUrlParser: true });
    console.log('数据库连接成功')
    // timetask.start() //执行定时任务,请修改时间
    task()//立即执行任务,
}
async function task(){
     console.log('定时任务开始');
     await getip(20)//爬ip
     let iplist = await dbHandle.findAllip() //所有
     changeStatus(iplist)//修改状态
     let timer= setTimeout(async function() {
        let count =  await dbHandle.findipcount(1)
        console.log('可用ip数量',count);
        await alluser()
        console.log('任务完成')
        clearTimeout(timer)
     }, 10000);
}
//定时任务
let timetask =new CronJob('00 48 09 * * *',task, null, false, 'Asia/Shanghai');

