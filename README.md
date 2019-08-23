
# 1. 分析
龙蛋领取网络请求图
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019073114150760.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMTI2MTc1,size_16,color_FFFFFF,t_70)
1. 自己的分享链接 `http://t.cn/*****`,这是个短网址
2. 短网址还原成长网址,并重定向到长网址
棒棒糖的长网址格式 `http://www.battleofballs.com/index_PC.html?id=*****&Account=*****&Channel=*****`拿到id
龙蛋的长网址格式 `http://www.battleofballs.com/share/index.html?b=AAAAAAAAAA------(base64编码) ` 须解码得到id
3. 领取地址
棒棒糖` http://cn.battleofballs.com/share?type=1&id=***`
龙蛋` http://cn.battleofballs.com/share?type=3&id=***`
# 2. 短网址还原
找了一个在线的api,[短网址还原接口地址](https://api.uomg.com/doc-dwz2long.html)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190805160118812.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMTI2MTc1,size_16,color_FFFFFF,t_70)
# 代理ip
请自行百度 代理ip,有很多免费的.

1. 爬取ip并存入数据库
>存入数据库的ip,状态默认为0,(0:未检测.1:可用,-1:不可用)
2. 测试ip是否可用
>用代理ip去访问 球球大作战官网或者百度
>修改数据库 状态置为 1 或者 -1
3. 用状态为1 的代理ip去访问 领取地址

# 定时任务
将执行代码按顺序写到 定时任务中,每天这行并领取.
# 技术
实现的技术有很多,记录下自己实现所用框架.
nodejs+koa2+mongodb
superagent+cheerio+superagent-proxy
```js
"dependencies": {
    "axios": "^0.19.0",
    "babel-plugin-transform-es2015-modules-commonjs": "^6.26.2",
    "babel-register": "^6.26.0",
    "cheerio": "^1.0.0-rc.3",//服务器端需要对DOM进行操作
    "cron": "^1.7.1",//定时任务
    "koa": "^2.7.0",
    "koa-bodyparser": "3",//解析request的body
    "koa-router": "^7.4.0",//路由
    "koa2-cors": "^2.0.6",//解决跨域
    "moment": "^2.24.0",//时间的插件
    "mongoose": "^5.6.7",//MongoDB 
    "nodemon": "^1.19.1",//热重启
    "superagent": "^5.1.0",//爬虫
    "superagent-proxy": "^2.0.0"//superagent代理
  }
```

>这只是个大致的思路,具体实现,还有许多细节需要考虑,这里就不写这么多了

项目目录
>server
```js
.
├──index.js
├──src
	├── common
	│   ├── index.js
	│   └── server.js  前端请求的处理
	├── index.js
	├── mongodb   
	│   ├── dbHandle.js   数据库相关操作
	│   ├── dbHelper.js
	│   └── index.js
	├── routes
	│   ├── index.js  前端请求的路由
	│   └── user.js
	└── timetask   领取棒棒糖龙蛋的任务
	    ├── getIP.js  获取ip
	    ├── getshare.js  领取
	    ├── index.js  定时任务
	    └── testip.js  ip测试
```
>client
>只有一个链接输入,未做其他处理.

>基本功能已实现,有时间会进行优化.欢迎提供意见

定时任务(执行任务) 运行 `cd server `   在   `node src/timetask/index`(先看下这页代码,有两个,一个是定时任务,一个是立即执行任务,自己切换)

