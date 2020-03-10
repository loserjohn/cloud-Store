// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  let pro_class = event.pro_class
  try {
    let infos = await db.collection('stores').where({
      _openid: openid
    }).get()
    console.log(pro_class,infos)
    let result = infos.data[0];
    if (infos.data.length > 0) {
      let pro_class = event.pro_class
      let arr = result.store_pro_class;
  
      for(let i=0;i<arr.length;i++){
        if (arr[i].value == pro_class){
          arr.splice(i,1)
        }
      }
      let data = {
        store_pro_class: arr
      }
      console.log(data)
      let re = await db.collection('stores').where({
        _openid: openid
      }).update({ data: data })
      console.log(re)
      if (re.stats.updated==1) {
        let re2 = await db.collection('products').where({
          pro_class: pro_class
        }).remove()
        res = {
          success: true,
          data: data
        }
      } else {
        res = {
          success: false,
          msg: '商品信息丢失'
        }
      }
    
    } else {
      res = {
        success: false,
        msg: '商品信息丢失'
      }
    }
    return res

  } catch (e) {
    return e
  }

}