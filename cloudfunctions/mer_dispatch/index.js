// 云函数入口文件
// 派送订单
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
      order_status: {
        text: '待收货',
        value: 3
      },
      dispatchTime:t
    }
    let result = await db.collection('orderlist').doc(id).update({ data: data })

    if(result.stats.updated == 1) {
      return {
        success: true
      }
    } else {
      return {
        success: false,
        error: '云函数错误',
        msg: '发货失败'
      }
    }

  } catch (e) {
    return {
      success: false,
      error: '云函数错误'
    }
  }

}
