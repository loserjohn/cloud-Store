// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
  try {
    let olduser = await db.collection('users')
      .where({
        _openid: openid, // 填入当前用户 openid
      })
      .get()
    let nt = new Date()
    
    if (olduser.data.length == 0) { 
      console.log('新用户')
      // 新用户
      let data = {
        _openid: openid,
        createTime: nt.getTime(),
        loginTime: nt.getTime()
      }
    // 创建用户
      let user = await db.collection('users').add({
        // data 字段表示需新增的 JSON 数据
        data: data
      })
    } else {
      // 更新用户
      console.log('更新用户')
      let data = {
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
    success:true,
    openid: openid
  }

}