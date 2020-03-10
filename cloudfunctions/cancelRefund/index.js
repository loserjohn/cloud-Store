
// 用户撤销退款申请
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  throwOnNotFound: false,
})
// 云函数入口函数
exports.main = async (event, context) => {

  try {
    // let data = event
    console.log(event)
    let id = event.oid
    let t = new Date().getTime()
    let data = {
      refundMsg: {
        refund_status: 6,
        refund_status_text: '撤销退款，交易关闭'
      },
      refundTime: t
    }


    const result = await db.runTransaction(async transaction => {
      // 获取原状态
      let order = await transaction.collection('refundList').doc(id).get();
      console.log(order)

      data.order_status =  order.data.originalStatus
      console.log(data)   
      let r1 = await transaction.collection('refundList').doc(id).update({
        data: data
      })
      console.log(r1)
      let r2 = await transaction.collection('orderlist').doc(id).update({ data: data })
      console.log(r2)
      if (order.data && r1.stats.updated == 1 && r2.stats.updated == 1) {
        
        
      } else {
        await transaction.rollback(-100)
      }
    })
    return {
      success: true,

    }

  } catch (e) {
    return {
      success: false,
      error: '云函数事务错误'
    }
  }

}