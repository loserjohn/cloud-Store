// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let wxContext = cloud.getWXContext()
  const store_id = event.store_id
  try {
    console.log(event);
    let defalut = {
      current: event.current ? event.current : 0,
      pageIndex: event.pageIndex ? event.pageIndex : 1,
      pageSide: event.pageSide ? event.pageSide : 10,
    }
    let data = {
      store_id: store_id
    }
    if (parseInt(defalut.current) != 0) {
      data.order_status = {
        value: parseInt(defalut.current),
      }
    }
    console.log(data);
    let count = await db.collection('orderlist').where(data).count()
    console.log(count);
    let infos = await db.collection('orderlist').where(data).limit(defalut.pageSide).skip((defalut.pageIndex - 1) * defalut.pageSide).orderBy('createTime', 'desc').get()
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