// 云函数入口文件
// 会员 寄件
const cloud = require('wx-server-sdk')

cloud.init()// 云函数入口文件

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

  try {
    let id = event.oid
    console.log(id)
    let data = {
      refundMsg: {
        refund_status: 4,
        refund_status_text: '已寄件'
      }
    }

    let result = await db.collection('refundList').doc(id).update({ data: data })
    if (result.stats.updated == 1) {
      return {
        success: true
      }
    } else {
      return {
        success: false,
        error: '云函数错误',
        msg: '云函数错误'
      }
    }

  } catch (e) {
    return {
      success: false,
      error: '云函数错误'
    }
  }

}


