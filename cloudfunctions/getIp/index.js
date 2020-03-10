// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require("axios");
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
  let response = await axios({
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    url: 'http://ip-api.com/json',
  })
  console.log(response)
  return response.data.query

}