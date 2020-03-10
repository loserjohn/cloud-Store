// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database(
  {
    throwOnNotFound: false,
  }
)


//云函数入口函数
exports.main = async (event, content) => {
  const openid = cloud.getWXContext().OPENID
  let t = new Date().getTime()
  try {
    let orderList = event.orders
    console.log(orderList)

    const re = await db.runTransaction(async transaction => {
      let s = 0
      // let r = orderList.every( async (item)=>{
      //   console.log(0,item)
      //   let data = order_status = {
      //     text: "待发货",
      //     value: 2
      //   }
      //   let a = await transaction.collection('orderlist').doc(item).update({ data: data })
      //   console.log(1,a)
      //   // await transaction.rollback(-100)
      //   if (a.stats.updated == 1) {
      //     return true
      //   } else {
      //     await transaction.rollback(-100)
      //     return false
      //   }
      // })
      for (let i = 0; i < orderList.length; i++) {
        let item = orderList[i];
        console.log(0,item)
        let  data = {
          order_status:{
            text: "待发货",
            value: 2,
          }, 
          payTime: t 
        }  
        let a = await transaction.collection('orderlist').doc(item).update({ data: data})
        console.log(1,a)    
        // await transaction.rollback(-100)
        if (a.stats.updated == 1){
          continue
        }else{
          await transaction.rollback(-100)
          break
        }
      }
    })
    console.log(re)
    return {
      success: true,
      msg: '成功'
    }

  } catch (e) {
    console.error(`transaction error`, e)
    return {
      success: false,
      error: e,
      msg: '订单生成失败'
    }
  }

}

