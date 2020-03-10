// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  try {
    let infos = await db.collection('stores').where({
      _openid: openid
    }).get()
    console.log(infos)
    let result = infos.data[0];
    if (infos.data.length > 0) {
      let pro_class = event.pro_class
      let data = {
        store_pro_class: pro_class
      }
      console.log(data)
      let re = await db.collection('stores').where({
        _openid: openid
      }).update({ data: data })
      console.log(re)
      if (re.stats.updated == 1) {
        res = {
          success: true,
          data: data
        }
      } else {
        res = {
          success: false,
          msg: '商店信息丢失'
        }
      }
    } else {
      res = {
        success: false,
        msg: '商店信息丢失'
      }
    }








    return res

  } catch (e) {
    return e
  }

}