// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  try {
    console.log(event);
    let defalut = {
      // current: event.current ? event.current : 0,
      pageIndex: event.pageIndex ? event.pageIndex : 1,
      pageSide: event.pageSide ? event.pageSide : 1,
    }
    let data = {
      openid: openid
    }
    // if (parseInt(defalut.current) != 0) {
    //   data.order_status = {
    //     value: parseInt(defalut.current),
    //   }
    // }
    console.log(data);
    let count = await db.collection('refundList').where(data).count()
    console.log(count);
    let infos = await db.collection('refundList').where(data).limit(defalut.pageSide).skip((defalut.pageIndex - 1) * defalut.pageSide).orderBy('refundTime', 'desc').get()
    console.log(infos);
    infos.total = count.total
    infos.success = true

    return infos

  } catch (e) {
    return {
      success: false,
      msg: e
    }
  }
}