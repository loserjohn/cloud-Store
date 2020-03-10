// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  try {
    let  infos = await db.collection('stores').where({
      _openid: openid
    }).get()
    console.log(infos)
    let result = infos.data,res;
    if (result.length>0){
      res = {
        success: true,
        data: infos.data[0]
      }
    }else{
      res = {
        success: false,
        msg: '商店信息丢失'
      }
    }
    
    
    return res
    
  } catch (e) {
    return e
  }
}