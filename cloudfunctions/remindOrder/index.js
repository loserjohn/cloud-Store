// 云函数入口文件
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
      overRemindTime: t + 86400000
    }
    
    let order = await db.collection('orderlist').doc(id).get();
    console.log(order.data)
    console.log(t, order.data.overRemindTime)
    if (!order.data.overRemindTime){
      let result = await db.collection('orderlist').doc(id).update({ data: data})
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
      
    }else{
      
      if (t <= order.data.overRemindTime){
        return {
          success: false,
          msg: '您近期已经催发过该订单！'
        }
      }else{
        let result = await db.collection('orderlist').doc(id).update({ data: data });
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
      }    
    }

  } catch (e) {
    return {
      success: false,
      error: '云函数错误'
    }
  }

}
