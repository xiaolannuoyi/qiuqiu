//定时任务之 -- 爬取ip
const cheerio = require('cheerio');
const superagent = require('superagent');
require('superagent-proxy')(superagent);
const mongoose = require('mongoose')
const dbHandle = require('../mongodb/dbHandle')//数据库操作


const ipAgentLink = 'https://www.xicidaili.com/wt/' //ip代理库地址

// //数据结构表存入数据库
// require('../mongodb/dbHelper')
// mongoConnect().catch(err=>{
//     console.log('mongoConnect',err)
// })

// //数据库连接
// async function mongoConnect() {
//     await mongoose.connect('mongodb://localhost:27017/qiuqiudb', { useNewUrlParser: true });
//     console.log('数据库连接成功')
//     await getip(20)
//     console.log('爬ip完成')
// }


//爬ip
async function crawler(url) {
    return new Promise(resolve => {
        superagent.get(url).end((err, res) => {
            if (err) {
                return err
            }
            let $ = cheerio.load(res.text);
            let iparr = []
            $("#ip_list tr").map(function (index) {
                if (index !== 0) {
                    iparr.push({
                        ip: 'http://' + $(this).children('td').eq(1).text() + ':' + $(this).children('td').eq(2).text()
                    })
                }
            })
            resolve(iparr)
        })
    })
}
//存入数据库
async function storeDB(url) {
    let iparr = await crawler(url);
    for(let item of iparr){
        let result = await dbHandle.findoneip(item);
        if(!result){
            console.log('addip')
            await dbHandle.addip(item);
        }
    }
    return true;
}

//t页 存入数据库
const getip = async function (t){
    let i = 1;
    t=t+1;
    while(i<t){
        let url = (i==1)?ipAgentLink:ipAgentLink+i;
        await storeDB(url);
        let timer= setTimeout(() => {
            console.log(url)
            i++
        }, 2000);
        clearTimeout(timer)
    }
    return true
}

module.exports = {getip}
