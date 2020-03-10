// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    let olduser = await db.collection('users')
      .where({
        _openid: openid, // 填入当前用户 openid
      })
      .get()
    let nt = new Date()

    if (olduser.data.length == 0) {
      return {
        success: false,
        msg: '账户错误'
      }
    } else {
      // 更新用户
      console.log('更新用户')
      console.log(context)
      let info = context.userInfo
      let data = {
        info,
        loginTime: nt.getTime()
      }
      let user = await db.collection('users').where({
        _openid: openid, // 填入当前用户 openid
      }).update({
        // data 字段表示需新增的 JSON 数据
        data: data
      })
    }
  } catch (e) {
    console.log(e)
    return {
      success: false,
      msg: '账户错误'
    }
  }
  // console.log(user);


  return {
    success: true
  }

}