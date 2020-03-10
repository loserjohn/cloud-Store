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
exports.main = async (event, context) => {
  let wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  try {
    console.log(event)
    let t = new Date().getTime()
    let data = {
      _id: `${t}pros${parseInt(Math.random() * 10)}`,
      pro_class: event.pro_class,
      pro_class_text: event.pro_class_text,
      pro_des: event.pro_des, 
      pro_ems: parseInt(event.pro_ems) ,
      pro_name: event.pro_name,  
      pro_prize:{
        original:  event.pro_prize_original, 
        unit: event.pro_prize_unit, 
        value: event.pro_prize_value, 
      },
      pro_rest: event.pro_rest,
      pro_shortName: event.pro_shortName,
      pro_store_id: event.pro_store_id,
    }
    // pro_detailsPic: event.pro_detailsPic,
    // pro_pre: event.pro_detailsPic,
    // product_imgs: event.product_imgs,
    data.pro_detailsPic = event.pro_detailsPic.map(item=>{
      return item.url
    })
    data.pro_pre = event.pro_pre[0].url
    data.product_imgs = event.product_imgs.map(item => {
      return item.url
    })
    console.log(data)
    let a = await db.collection('products').add({ data: data })
    console.log(a)
    if (a._id) {
      return {
        success: true,
        data: a._id
      }
    } else {
      return {
        success: false,
        msg: '商品生成错误无措'
      }
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
