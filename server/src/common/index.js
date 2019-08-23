// 通用方法

const axios = require('axios')
const dbHandle = require('../mongodb/dbHandle')//数据库操作



/**
* 短网址还原
* @param {*} url 
* return url
*/
function ShortURLReduction(data) {
    return new Promise((resolve, reject) => {
        axios.get('https://api.uomg.com/api/dwz2long', {
            params: {
                url: data
            }
        }).then((response) => {
            console.log('response',response)
            if (response.data.code === 1) {
                console.log('==', response.data.ae_url)
                resolve(response.data.ae_url)
            } else {
                reject(false)
            }
        }).catch((error) => {
            console.log('ShortURLReduction',error)
        });
    });
}

/**
 * url 解析  
 * @param {*} url 
 * return obj
 */
function GetRequest(url) {
    let obj = {}
    let params = url.substring(url.indexOf("?") + 1, url.length).split("&");
    for (var i in params) {
        //  keyvalue = params[i].split("=");
        //  key = keyvalue[0];
        //  value = keyvalue[1];
        //  obj[key] = value;
        obj[params[i].split("=")[0]] = params[i].split("=")[1];
    }
    return obj;
}
/**
 * 数据库中是否有此id
 * @param {*} params 
 */
async function Idisexist(params, { type, url }) {
    let id = await dbHandle.findid(params.id);
    console.log('找到 id',id)
    const insertobj = {
        id: params.id,
        Account: decodeURIComponent(params.Account),
    };
    if (type == 1) {
        insertobj.bbtlink = url;
    } else {
        insertobj.ldlink = url;
    }
    
    if (!id) {
        return new Promise((resolve, reject) => {
            dbHandle.insertData(insertobj).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            });
        });
    } else {
        console.log('id', id);
        return new Promise((resolve, reject) => {
            dbHandle.updateData(id._id,url,type).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            });
        });
    }
}
/**
 * 数据库未找到棒棒糖链接的处理
 */
async function bbtfunc(url) {
    let longurl = await ShortURLReduction(url); //短链接转长链接
    let params = GetRequest(longurl);//拿到id
    return await Idisexist(params, { type: 1, url })//判断id是否存在
}
/**
 * bbt通过请求找到对应id
 */
var bbturlfindid = async function (request) {
    let data = await dbHandle.shortlinkfind({ bbtlink: request.url});
    if (!data) {
        console.log('不存在',request.url);
        //不存在
        let a = await bbtfunc(request.url)
        return a
    } else {
        //存在
        console.log('bbt', data);
        return data
    }
}


//====================
/**
 * 数据库未找到龙蛋链接的处理
 */
async function ldfunc(url) {
    let longurl = await ShortURLReduction(url); //短链接转长链接
    let longurl2 = longurl.split('b=')[0] + Buffer.from(longurl.split('b=')[1], 'base64');//拿到id
    let params = GetRequest(longurl2);//拿到id
    console.log('======', params)
    return Idisexist(params, { type: 2, url })//判断id是否存在
}

//龙蛋 通过请求找到对应id
var ldurlfindid = async function (request) {
    let data = await dbHandle.shortlinkfind({ ldlink: request.url });
    if (!data) {
        //不存在
        let a = await ldfunc(request.url)
        return a
    } else {
        //存在
        console.log('ld', data);
        return data
    }
}
module.exports = {ldurlfindid,bbturlfindid}