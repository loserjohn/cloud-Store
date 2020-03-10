// 云函数入口文件
//商家同意退款
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

  try {
    // let data = event
    console.log(event)
    let id = event.oid
    let t = new Date().getTime()
    let data = {
      refundMsg: {
        refund_status: 2,
        refund_status_text: '商家同意退款',
      },
      refundTime: t
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
        msg: '驳回失败'
      }
    }

  } catch (e) {
    return {
      success: false,
      error: '云函数错误'
    }
  }

}
