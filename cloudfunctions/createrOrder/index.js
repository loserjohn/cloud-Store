// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database(
  {
    throwOnNotFound: false,
  }
)

// 订单的数据格式

// 云函数入口函数
exports.main = async(event, context) => {
  let wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
    try {
      console.log(event)  
      let orderList = event.goods
      let orderCodes = []
      const result = await db.runTransaction(async transaction => {
        for (let i = 0; i < orderList.length;i++){
          let item = orderList[i];
          item._id = `${new Date().getTime()}ord${parseInt(Math.random() * 10)}`
          item.createTime = new Date().getTime()  //添加创建时间
          item.openid = openid
          item.order_status = {
            value: 1,
            text: '待付款'
          };
          item.selfReseive=event.selfReseive, //是否自取
          item.receive_info = event.receive_info
          console.log(item._id)
          let totalSum=0  //商品总金额
          // let totalAmount = 0  //全部金额
          item.goods.forEach(it=>{
            totalSum += it.count * it.pro_prize.value
          })
          item.all_sum = parseFloat(totalSum.toFixed(2))
          item.all_totalAmount = item.all_sum + item.all_ems
          console.log(item)
          let a = await transaction.collection('orderlist').add({ data: item })
          console.log(a)
          if (a._id) {
            orderCodes.push(item._id)
            continue
          } else {
            await transaction.rollback(-100)
            break
          }  
        }
      })
      console.log(result)
      return {
        success: true,
        data: orderCodes
      }
    } catch (e) {
      console.error(`transaction error`, e)

      return {
        success: false,
        error: e,
        msg:'订单生成失败'
      }
    }
}


    // const transaction = await db.startTransaction()
    // let goodArr = event.goods
    // goodArr.forEach()

    // let data = {
    //   order_id:new Date().getTime()+''+ Math.random()*10,
    //   goods: event.goods,
    // }
    // let data = {
    //   // order_id: '12345678456',
    //   goods: [{
    //     _id: '20200209pro001',
    //     pro_store_id:'sdfasdf',
    //     pro_pre:'sasdaf',
    //     num: 5,
    //     prize: 16.8,
    //     ems: 0
    //   }],
    //   // receiveWay:1,   //1邮寄,0自取 , 
    //   selfReseive:false,   //是否自取
    //   receive_infor: {
    //     receive_name: '小大寒',
    //     receive_address: '福建省福州市山东科技发快了就16栋30号',
    //     receive_phone: '15059254852',
    //   },
    //   // order_status: {
    //   //   value: 1,
    //   //   text: '代付款'
    //   // },

    // }