//定时任务 -- 领取棒棒糖 龙蛋
//为数据库所有用户领取
const moment = require('moment');

const superagent = require('superagent');
require('superagent-proxy')(superagent);
const mongoose = require('mongoose')
const dbHandle = require('../mongodb/dbHandle')//数据库操作

const needbbtnum = 5;
const needldnum = 30;
//棒棒糖地址
const bbtlink = function (id) {
    return `http://cn.battleofballs.com/share?type=1&id=${id}`
}
//龙蛋地址
const ldlink =function (id) {
    return `http://cn.battleofballs.com/share?type=3&id=${id}`
}
//今天
const today = function (){
// console.log('time',moment().startOf('day')._d);
 return moment().startOf('day')._d;
}
//棒棒糖领取数量
//user._id
//{需领取,已领取}
//return {bbtNum,ldNum,bbty,ldy}
const getnum = async function (id) {
    let data = await dbHandle.findconfig(id,today());//是否存在今天的config 信息
    if(!data){
        let data = await dbHandle.createconfig(id);
        return { bbtNum:needbbtnum - data.bbtNum,bbty:data.bbtNum,ldNum:needldnum - data.ldNum,ldy:data.ldNum}
    }
    return { bbtNum:needbbtnum - data.bbtNum,bbty:data.bbtNum,ldNum:needldnum - data.ldNum,ldy:data.ldNum}
}
// //数据结构表存入数据库
// require('../mongodb/dbHelper')
// mongoConnect()
// //数据库连接
// async function mongoConnect() {
//     await mongoose.connect('mongodb://localhost:27017/qiuqiudb', { useNewUrlParser: true });
//     console.log('数据库连接成功')
//     // await dbHandle.addconfig('5d426fdeb10fdbe469fe98d5',5,11)
//     await alluser()
// }
//用代理ip去请求球球地址 判断ip是否可用---领取
function test(proxyurl,url) {
    return new Promise((resolve, reject) => {
        superagent.get(url).proxy(proxyurl).timeout(40000).end((err, res) => {
            if (err) {
                console.log('err');
                resolve(false)
            } else {
                console.log('success',proxyurl ,res.status,res.text);
                if(res.status === 200){
                    resolve(res.text)
                }else{
                    resolve(false)
                }
            }
        })
    })
}
//领取棒棒糖
//分享链接,数量(,user._id)

const  getshare= async function(url,num,userid,type) {
    //取出数据库中状态(qqstatus)1 ip
    let iplist = await dbHandle.findipstatus(1);
    let i=0;
    for (let item of iplist) {
        let iscan = await dbHandle.checkip(userid,item._id,today(),type);//判断当前ip 今天  是否已经领取过(user._id,ip._id)
        if(!iscan){
            const result = await test(item.ip,url);//
            if (result=='ok') {
                console.log(i);
                await dbHandle.addipuser(userid,item._id,type);//向 ipuser 数据库 插入关联数据(user._id,ip._id)
                i++
            }
            if(result == 'error' || i>=num){
                console.log('完成')
                return num
            }
            // if(i>=num){
            //     console.log('完成')
            //     return num
            // }
        }
        
    }
    return i
    
}
async function alluser(){
  let user = await dbHandle.findAlluser();
  for(let item of user) {
      console.log('当前用户',item.id);
      let {bbtNum,ldNum,bbty,ldy} = await getnum(item._id);
      console.log(bbtNum,ldNum,bbty,ldy)
      let bbt=0,ld=0;
      if(bbtNum!==0){
          console.log('bbt')
        bbt =  await getshare(bbtlink(item.id),bbtNum,item._id,1);
      }
      if(ldNum!==0){
        console.log('ld')
        ld = await getshare(ldlink(item.id),ldNum,item._id,2);
      }
      if(!bbtNum && !ldNum){
          
          console.log('下一个用户',item.id);
          continue
      }
      console.log('item._id,bbt+bbty,ld+ldy',item._id,bbt,bbty,ld,ldy);  
      await dbHandle.addconfig(item._id,bbt+bbty,ld+ldy,today())  
  };
  return true
}
module.exports = {bbtlink,ldlink,getshare,alluser,getnum}


