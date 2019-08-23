//定时任务之 -- 测试ip可用性
const superagent = require('superagent');
require('superagent-proxy')(superagent);
const axios = require('axios')
const mongoose = require('mongoose')
const dbHandle = require('../mongodb/dbHandle')//数据库操作


const testurl = 'http://www.battleofballs.com' //球球测试地址
//数据结构表存入数据库
// require('../mongodb/dbHelper')
// mongoConnect().catch(err => {
//     console.log('mongoConnect', err)
// })

// // //数据库连接
// async function mongoConnect() {
//     await mongoose.connect('mongodb://localhost:27017/qiuqiudb', { useNewUrlParser: true });
//     console.log('数据库连接成功')
//     //取出数据库中状态(qqstatus)0,1  findipstatus0or1();  //状态为0和1
//     // let iplist = await dbHandle.findipstatus(1)// 状态为 1 或者 -1 或者 0
//     let iplist = await dbHandle.findAllip() //所有
//     await changeStatus(iplist)
//     console.log('测试ip完成')
//     // await dbHandle.findipcount(1)
// }

//用代理ip去请求球球地址 判断ip是否可用
const test = function(proxyurl, url) {
    return new Promise((resolve, reject) => {
        superagent.get(url).proxy(proxyurl).timeout(40000).end((err, res) => {
            if (err) {
                console.log('err', err.errno);
                resolve(false)
            } else {
                console.log('success', res.status);
                if(res.status === 200){
                    resolve(true)
                }else{
                    resolve(false)
                }
            }
        })
        // let p = proxyurl.split('//')[1].split(':');
        // axios.get(url, {
        //     proxy: { host: p[0], port: p[1] },
        //     timeout: 40000
        // }).then(function (res) {
        //     console.log('success', res.status);
        //     if (res.status === 200) {
        //         resolve(true)
        //     } else {
        //         resolve(false)
        //     }
        // }).catch(function (err) {
        //     console.log('err', err.code);
        //     resolve(false)
        // });
    })
}
//修改数据库状态 同步
// async function changeStatus(iplist) {
//     for (let item of iplist) {
//         const result = await test(item.ip, testurl);
//         //修改ip状态为 1好用 ,-1不好用
//         if (result && item.qqstatus !== 1) {
//             await dbHandle.updateQQStatus(item._id, 1);
//         }else if(!result && item.qqstatus !== -1) {
//             await dbHandle.updateQQStatus(item._id, -1);
//         }
//     }
//     console.log('完成')
// }
//异步
//修改ip状态
const changeStatus = function(iplist) {
    for (let item of iplist) {
        test(item.ip, testurl).then((result) => {
            if (result && item.qqstatus !== 1) {
                dbHandle.updateQQStatus(item._id, 1);
            } else if (!result && item.qqstatus !== -1) {
                dbHandle.updateQQStatus(item._id, -1);
            }
        })        
    }
}
module.exports = {changeStatus}
