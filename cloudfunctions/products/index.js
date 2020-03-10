// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  try {
    // let id = event.pro_store_id
    let data = {
      // pro_store_id:id
    }
    // if (event.pro_class){
    //   data.pro_class = event.pro_class
    // }
    // console.log(data)
    let infos = await db.collection('products').where(data).get()
    // console.log(infos)
    infos.success = true
    return infos

  } catch (e) {
    console.error(e)
  }
}