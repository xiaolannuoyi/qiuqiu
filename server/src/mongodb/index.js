//构建数据表
const Schema = require('mongoose').Schema;

module.exports = {
    user: {
        id:Number,
        Account:String,
        bbtlink:String,//棒棒糖分享链接
        ldlink:String,
    },
    iplist:{
        ip:String,
        qqstatus:{
            type:Number,
            default:0,//0 未检测,1 好使,-1不好使
        },
    },
    ipuser:{
        user:{
            type: Schema.ObjectId,
            ref: 'user'
        },
        ip:{
            type: Schema.ObjectId,
            ref: 'iplist'
        },
        date:{
            type:Date,
            default:Date.now
        },
        type:Number//1 bbt,2ld
    },
    config:{
        user:{
            type: Schema.ObjectId,
            ref: 'user'
        },
        date:{ //时间
            type:Date,
            default:Date.now
        },
        bbtNum:Number,
        ldNum:Number,
    }
}