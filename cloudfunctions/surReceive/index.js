// 云函数入口文件
// 确认收货
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

  try {
    let id = event.id
    console.log(id)
    let t = new Date().getTime()
    let data = {
      order_status: {
        text:'已完成',
        value:4
      },
      receiveTime:t
    }

    let order = await db.collection('orderlist').doc(id).get();
    
    if (order.data) {
      let result = await db.collection('orderlist').doc(id).update({ data: data })
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

    } else {
      return {
        success: false,
        error: '云函数错误',
        msg: '订单丢失'
      }
    }

  } catch (e) {
    return {
      success: false,
      error: '云函数错误'
    }
  }

}
