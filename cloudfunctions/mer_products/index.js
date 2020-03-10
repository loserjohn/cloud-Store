// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  try {
    let id = event.pro_store_id
    let data = {
      pro_store_id: id,
     
    }
    let pageArg = {
      pageIndex: event.pageIndex ? event.pageIndex : 1,
      pageSide: event.pageSide ? event.pageSide : 1,
    }
    if (event.pro_class) {
      data.pro_class = event.pro_class
    }
    console.log(data)
    let count = await db.collection('products').where(data).count()
    let infos = await db.collection('products').where(data).limit(pageArg.pageSide).skip((pageArg.pageIndex - 1) * pageArg.pageSide).get()
    console.log(count,infos)
    infos.total = count.total
    infos.success = true
    return infos

  } catch (e) {
    console.error(e)
  }
}