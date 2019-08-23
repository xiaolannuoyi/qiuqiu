let proptemplate = {
  '/a/b': [
    "/aa/1",
    "/aa/2",
    "/bb/3"
  ],
  // '/a':[
  //   "/abs-config/abs.properties",
  //   "/abs-config/demo",
  //   "/abs-system-config/persistence.properties"
  // ]
}
let targets = []
for (let key in proptemplate) {
  for(let item of proptemplate[key]){
    let start = item.lastIndexOf("/");
    let configGroup = item.slice(1, start);
    let check = item.slice(start + 1);
    if(targets.length >0){
      for(let item of targets){
        if(item.configGroup == configGroup){
          item.checkedDomains.push(check)
        }else{
          let arr =[]
          arr.push(check);
          targets.push({
          configGroup: configGroup,
          targetPath: key,
          checkedDomains: arr,
          checkAll: true,
          isIndeterminate: true,
          domains: arr
        });
        continue;
        }
      }
    }else{
      let arr =[]
      arr.push(check);
      targets.push({
          configGroup: configGroup,
          targetPath: key,
          checkedDomains: arr,
          checkAll: true,
          isIndeterminate: true,
          domains: arr
        });
    }
  }

}

console.log('=gf=',targets)



















// let nodelist = [
//   {
//     "devices": [
//       {
//         "name": "/dev/sdb",
//         "storage": {
//           "total": 20836352,
//           "free": 18726912,
//           "used": 2109440
//         },
//         "id": "d891898ece2c9b32fab19b84b51d21a2",
//         "state": "online",
//         "bricks": [
//           {
//             "id": "4c53864699098832730787990fa9e4a1",
//             "path": "/var/lib/heketi/mounts/vg_d891898ece2c9b32fab19b84b51d21a2/brick_4c53864699098832730787990fa9e4a1/brick",
//             "device": "d891898ece2c9b32fab19b84b51d21a2",
//             "node": "ed908467662f1cf6551a2ff69f2d86bc",
//             "volume": "3dac7a773da483b71a6714f575ee6497",
//             "size": 2097152
//           }
//         ]
//       }
//     ]
//   }
// ]

// let v = [
//   {
//     "id": "3dac7a773da483b71a6714f575ee6497",
//   }
// ]
// for(let item of v){

//   for(let {devices} of nodelist){
//     for(let {storage,bricks} of devices){

//       for(let {volume} of bricks){
//         if(volume === item.id){
//           item.storage = storage
//         }
//       }
//     }
//   }
// }

// console.log('====',v)