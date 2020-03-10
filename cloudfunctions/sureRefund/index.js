// 云函数入口文件
// 发起退款
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  throwOnNotFound: false,
})
// 云函数入口函数
exports.main = async(event, context) => {

  try {
    // let data = event
    console.log(event)
    let id = event.oid
    let t = new Date().getTime()
    let data = {
      order_status: {
        text: '退货中',
        value: 5
      },
      refundMsg: {
        refund_status: 1,
        refund_status_text: '待商家处理',
        remark: event.remark,
        problem_pics: event.problem_pics,
        reason: event.reason
      },
      refundTime: t
    }
    


    const result = await db.runTransaction(async transaction => {
      // 获取原状态
      let order = await transaction.collection('orderlist').doc(id).get();
      console.log(order)

      // let ostatus = {
      //   originalStatus: order.data.order_status  
      // } 
      data.originalStatus = order.data.order_status  
      let r1 = await transaction.collection('orderlist').doc(id).update({
        data: data
      })
      console.log(r1)
      if (order.data &&  r1.stats.updated == 1) {
        
        let newval = { ...order.data, ...data}
        console.log(newval)
        let r2 = await transaction.collection('refundList').add({ data: newval})
        console.log(r2)       
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