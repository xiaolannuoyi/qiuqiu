const dbHandle = require('../mongodb/dbHandle')//数据库操作
const {bbturlfindid,ldurlfindid} = require('./index')

const {bbtlink,ldlink,getshare} = require('../timetask/getshare')
class server {
    /**
    * bbt
    */
    async bbt(ctx, next) {
        let user = await bbturlfindid(ctx.request.body);
        console.log('user',user.id,user._id)
        let result = await getshare(bbtlink(user.id),5,user._id,1)
        if(typeof result === 'number'){
            ctx.response.body = {
                       code:200,
                       msg:"ok",
                       result:result
                   }
        }
    }
    //ld
    async ld(ctx, next) {
        let user = await ldurlfindid(ctx.request.body);
        console.log('user',user.id,user._id)
        let result = await getshare(ldlink(user.id),30,user._id,2)
        if(typeof result === 'number'){
            ctx.response.body = {
                       code:200,
                       msg:"ok",
                       result:result
                   }
        }
    }


}
module.exports = new server