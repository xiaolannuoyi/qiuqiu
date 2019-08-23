
let dbHelper = require('./dbHelper');
let UserModel = dbHelper.getModel('user');
let IpModel = dbHelper.getModel('iplist');
let IpUserModel = dbHelper.getModel('ipuser');
let configModel = dbHelper.getModel('config');
class UserDBHandel {
  //短链接查找
  shortlinkfind(data) {
    return new Promise((resolve, reject) => {
      UserModel.findOne(data).then(data => {
        console.log('棒棒糖链接查找', data);
        resolve(data)
      }).catch(() => {
        reject('fail');
      });
    });
  }

  //查找id
  findid(data) {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ id: data }).then(data => {
        console.log('查找id', data);
        resolve(data)
      }).catch(() => {
        reject('查找id fail');
      });
    });
  }

  //插入数据到数据库中
  insertData(data) {
    return new Promise((resolve, reject) => {
      UserModel.create(data).then(data => {
        console.log('插入数据到数据库中', data);
        resolve(data)
      }).catch(() => {
        reject('fail');
      });
    });
  }
  //更新
  updateData(_id,url,type) {
    console.log('更新', _id,url,type);
    const obj = {};
    if (type == 1) {
        obj.bbtlink = url;
    } else {
        obj.ldlink = url;
    }
    return new Promise((resolve, reject) => {
      UserModel.findByIdAndUpdate(_id, {
        $set: obj
      }).then(data => {
        console.log('更新', data);
        resolve(data)
      }).catch(() => {
        reject('fail');
      });
    });
  }

  //查找所有用户
  findAlluser() {
    return new Promise((resolve, reject) => {
      UserModel.find({}).then(data => {
        resolve(data)
      }).catch(() => {
        reject('fail');
      });
    });
  }
  //
  // updatebbtlink(data){
  //   return new Promise((resolve, reject) => {
  //     UserModel.update({id:data.id},{
  //       $set: {
  //         bbtlink:data.bbtlink,
  //       }
  //     }).then( data =>{
  //       console.log('更新bbt',data);
  //       resolve(data)
  //     }).catch(() => {
  //       reject('插入数据到数据库中fail');
  //     });
  //   });
  // }

  //               .-------------------------------------------------------------.
  //               '------..-------------..----------..----------..----------..--.|
  //               |       \\            ||          ||          ||          ||  ||
  //               |        \\           ||          ||          ||          ||  ||
  //               |    ..   ||  _    _  ||    _   _ || _    _   ||    _    _||  ||
  //               |    ||   || //   //  ||   //  // ||//   //   ||   //   //|| /||
  //               |_.------"''----------''----------''----------''----------''--'|
  //               .______________________________________________________________|
  //                |)|      |       |       |       |    |      mga|      ||==|  |
  //                | |      |  _-_  |       |       |    |  .-.    |      ||==| C|
  //                | |  __  |.'.-.' |   _   |   _   |    |.'.-.'.  |  __  | "__=='
  //                '---------'|( )|'----------------------'|( )|'----------""
  //                            '-'                          '-'
  //

  //iplist  操作
  //查 某ip是否存在
  findoneip(data) {
    return new Promise((resolve, reject) => {
      IpModel.findOne(data).then(re => {
        if(re){
          resolve(true)
        }else{
          resolve(false)
        }
      }).catch(() => {
        reject('某ip是否存在 fail');
      });
    });
  }
  //查 所有ip
  findAllip() {
    return new Promise((resolve, reject) => {
      IpModel.find({}).then(data => {
        resolve(data)
      }).catch(() => {
        reject('fail');
      });
    });
  }
  //查 ip 某状态
  findipstatus(status) {
    return new Promise((resolve, reject) => {
      IpModel.find({ qqstatus: status }).then(data => {
        resolve(data)
      }).catch(() => {
        reject('fail');
      });
    });
  }
  //查 ip状态为0 和 1
  findipstatus0or1() {
    return new Promise((resolve, reject) => {
      IpModel.find().or([{ qqstatus: 0 }, { qqstatus: 1 }]).then(data => {
        resolve(data)
      }).catch(() => {
        reject('fail');
      });
    });
  }
  //增
  addip(data) {
    return new Promise((resolve, reject) => {
      IpModel.create(data).then(data => {
        resolve(true)
      }).catch(() => {
        reject('增---fail');
      });
    });
  }
  //查询 数量
  ipcount() {
    return new Promise((resolve, reject) => {
      IpModel.estimatedDocumentCount().then(data => {
        console.log('查询集合数量', data);
        resolve(data)
      }).catch(() => {
        reject('ipcount  --- fail');
      });
    });
  }
  findipcount(state){
    return new Promise((resolve, reject) => {
      IpModel.find({qqstatus:state}).count().then(data => {
        console.log('findipcount', data);
        resolve(data)
      }).catch(() => {
        reject('findipcount  --- fail');
      });
    });
  }
  //删 删除集合全部数据
  removeip() {
    return new Promise((resolve, reject) => {
      IpModel.deleteMany({}).then(data => {
        resolve(true)
      }).catch(() => {
        reject('removeip =---fail');
      });
    });
  }
  //修改ip状态
  updateQQStatus(id, status) {
    return new Promise((resolve, reject) => {
      IpModel.findByIdAndUpdate(id, {
        $set: {
          qqstatus: status,
        }
      }).then(data => {
        console.log('修改ip状态', data);
        resolve()
      }).catch(() => {
        reject('removeip =---fail');
      });
    });
  }
  ///ipuser
  //新建user-ip 关联表
  addipuser(userid,ipid,type) {
    return new Promise((resolve, reject) => {
      IpUserModel.create({
        user:userid,
        ip:ipid,
        type:type
      }).then(data => {
        console.log('addipuser', data);
        resolve(true)
      }).catch(() => {
        reject('removeip =---fail');
      });
    });
  }
  //检查ip是否用过
  checkip(userid,ipid,time,type) {
    return new Promise((resolve, reject) => {
      IpUserModel.findOne({
        user:userid,
        ip:ipid,
        date:{ $gte: time },
        type:type
      }).then(data => {
        console.log(userid,'检查ip是否用过', data);
        resolve(data)
      }).catch(() => {
        reject('removeip =---fail');
      });
    });
  }

  //configModel
  //创建config
  createconfig(userid) {
    return new Promise((resolve, reject) => {
      configModel.create({
        user:userid,
          bbtNum:0,
          ldNum:0,
        }
      ).then(data => {
        console.log(userid,'创建config', data);
        resolve(data)
      }).catch(() => {
        reject('createconfig =---fail');
      });
    });
  }
  //添加领取信息
  addconfig(userid,bbtNum,ldNum,time) {
    return new Promise((resolve, reject) => {
      configModel.findOneAndUpdate({
        user:userid,
        date:{ $gte: time },
      },{
          bbtNum:bbtNum,
          ldNum:ldNum,
      },{new:true}).then(data => {
        console.log(userid,'添加领取信息', data);
        resolve(data)
      }).catch(() => {
        reject('addconfig =---fail');
      });
    });
  }

  //查 config
  findconfig(userid,time) {
    return new Promise((resolve, reject) => {
      configModel.findOne({
        user:userid,
        date:{ $gte: time }
      }).then(data => {
        console.log(userid,'查 config', data);
        resolve(data)
      }).catch(() => {
        reject('removeip =---fail');
      });
    });
  }

}
module.exports = new UserDBHandel;