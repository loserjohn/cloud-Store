// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database(
  {
    throwOnNotFound: false,
  }
)

// 商品删除

// 云函数入口函数
exports.main = async (event, context) => {
  let wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  try {
    console.log(event)
    let proList = event.pros
    
    const result = await db.runTransaction(async transaction => {
      for (let i = 0; i < proList.length; i++) {
        let id = proList[i];      
        let a = await transaction.collection('products').doc(id).remove()
        console.log(a)
        if (a.stats.removed==1) {
          continue
        } else {
          await transaction.rollback(-100)
          break
        }
      }
    })
    console.log(result)
    return {
      success: true
    }
  } catch (e) {
    console.error(`transaction error`, e)

    return {
      success: false,
      error: e,
      msg: '删除失败'
    }
  }
}
