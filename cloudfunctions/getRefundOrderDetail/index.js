// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

  try {
    let id = event.id
    console.log(id)
    let result = await db.collection('refundList').doc(id).get()

    // console.log(event,result)
    result.success = true
    return result
  } catch (e) {

    return {
      success: false,
      error: e
    }
  }

}
