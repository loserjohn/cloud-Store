// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database(
  {
    throwOnNotFound: false,
  }
)
// 云函数入口函数
exports.main = async(event, context) => {

  try {


    const result = await db.runTransaction(async transaction => {
      // console.log(0, event)
      // let arg = {
      //   pro_id: event.pid
      // } 
      let id = event.id
      const pro = await transaction.collection('products').doc(id).get()
      // const bbbRes = await transaction.collection('account').doc('bbb').get()
      console.log(pro)
      if (pro.data ) {
        let res = pro.data

        const sto = await transaction.collection('stores').doc(res.pro_store_id).get()
        console.log(`transaction succeeded`)
        console.log(sto)
        // 会作为 runTransaction resolve 的结果返回
        res.pro_store_logo = sto.data.store_logo
        res.pro_store_name = sto.data.store_name
        console.log(res)
        
        return res
      } else {
        // 会作为 runTransaction reject 的结果出去
        await transaction.rollback(-100)
      }
    })
    console.log(result)
    return {
      success: true,
      data: result
    }
  } catch (e) {
    console.error(`transaction error`, e)

    return {
      success: false,
      error: e
    }
  }


  // let arg = {
  //   pro_id: event.pid
  // } 

  // var product = await db.collection('products')
  //   .where(arg)
  //   .limit(1)
  //   .get()


  // return product
}