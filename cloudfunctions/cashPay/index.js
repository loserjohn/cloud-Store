// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database(
  {
    throwOnNotFound: false,
  }
)
const appid = 'wx7e46ba8e959d25d9'
const mch_id = '1491411822'
const random = randomFn()
const body = "代码力量-福利购"
const notify_url = 'https://v2.api.haodanku.com'
const trade_type = 'JSAPI'
const key = '1a79a4d60de6718e8e5b326e338ae533'
const crypto = require("crypto")
// const requestData = requestDataFn()
// const request = require("request")
const axios = require("axios");
const xmlreader = require("xmlreader")

//云函数入口函数
exports.main = async (event, content) => {
  const openid = cloud.getWXContext().OPENID
  const out_trade_no = Date.parse(new Date()).toString()
  let total_fee = 0  //全部金额
  let spbill_create_ip = event.spbill_create_ip  //ip
  const orders = event.orders
  try {
    console.log(event)
    let orderList = event.orders
    const allfee = await db.runTransaction(async transaction => {
      let s = 0
      for (let i = 0; i < orderList.length; i++) {
        let item = orderList[i];
        console.log(item)
        let a = await transaction.collection('orderlist').doc(item).get()
        console.log(a)
        s += a.data.all_totalAmount
      }
      return s
    })
    console.log(allfee)
    total_fee = parseInt(allfee * 100) 
    let stringA = `appid=${appid}&body=${body}&mch_id=${mch_id}&nonce_str=${random}&notify_url=${notify_url}&openid=${openid}&out_trade_no=${out_trade_no}&spbill_create_ip=${spbill_create_ip}&total_fee=${total_fee}&trade_type=${trade_type}&key=fjdmll2019XiaoHan4343199108050Xh`
    console.log(stringA)
    var sign = crypto.createHash('md5').update(stringA).digest('hex').toUpperCase()
    console.log(sign)
    let dataBody = requestDataFn(
      appid,
      mch_id,
      random,
      sign,
      body,
      out_trade_no,
      total_fee,
      spbill_create_ip,
      notify_url,
      trade_type,
      openid
    )
    console.log(dataBody)

    let response = await axios({
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      data: dataBody
    })
    console.log(response)
    let bd = response.data
    // return bd
    //   "<xml><return_code><![CDATA[SUCCESS]]></return_code>
    //     < return_msg >< ![CDATA[OK]] ></return_msg >
    //       <appid><![CDATA[wx7e46ba8e959d25d9]]></appid>
    //       <mch_id><![CDATA[1491411822]]></mch_id>
    //       <nonce_str><![CDATA[nzBB3pNPUQgj2Id5]]></nonce_str>
    //       <sign><![CDATA[6939EA425C7CE447864961DD92B6E97E]]></sign>
    //       <result_code><![CDATA[FAIL]]></result_code>
    //       <err_code><![CDATA[PARAM_ERROR]]></err_code>
    //       <err_code_des><![CDATA[无效的openid]]></err_code_des>
    // </xml > "
    let return_code = bd.match(/<return_code><!\[CDATA\[(\S*)\]\]><\/return_code>/)[1]

    // if (return_code == 'SUCCESS' ) {
    //   let prepay_id = bd.match(/<prepay_id><!\[CDATA\[(\S*)\]\]><\/prepay_id>/)[1]

    //   let timeStamp = Date.parse(new Date()).toString()
    //   let str = `appId=${appid}&nonceStr=${random}&package=prepay_id=${prepay_id}&signType=MD5&timeStamp=${timeStamp}&key=fjdmll2019XiaoHan4343199108050Xh`
    //   let paySign = crypto.createHash('md5').update(str).digest('hex').toUpperCase()
    //   return {
    //     success: true,
    //     data: {
    //       timeStamp: timeStamp,
    //       nonceStr: random,
    //       package: `prepay_id=${prepay_id}`,
    //       signType: 'MD5',
    //       paySign: paySign
    //     }
    //   }
    // } else {
    //   return {
    //     success: false,
    //     msg: '云函数出现错误了'
    //   }
    // }

    return new Promise((reslove, reject) => {
      xmlreader.read(bd, (err, res) => {
        if (err) {
          reject({
            success: false,
            msg: '云函数出现错误了'
          })
          return
        };
        console.log(res.xml.return_code.text())
        let status = res.xml.return_code.text()
        if (status == 'SUCCESS') {
          let prepay_id = res.xml.prepay_id.text()
          let timeStamp = Date.parse(new Date()).toString()
          let str = `appId=${appid}&nonceStr=${random}&package=prepay_id=${prepay_id}&signType=MD5&timeStamp=${timeStamp}&key=fjdmll2019XiaoHan4343199108050Xh`
          let paySign = crypto.createHash('md5').update(str).digest('hex').toUpperCase()
          //返回上面的五个参数 
          reslove({
            success: true,
            data: {
              timeStamp: timeStamp,
              nonceStr: random,
              package: `prepay_id=${prepay_id}`,
              signType: 'MD5',
              paySign: paySign
            }
          })
        } else {
          reject({
            success: false,
            msg: '云函数出现错误了'
          })
        }
      })

    })


  } catch (e) {
    console.error(`transaction error`, e)

    return {
      success: false,
      error: e,
      msg: '订单生成失败'
    }
  }




  console.log(random, random.length)
  
}

// xml文件
function requestDataFn(
  appid,
  mch_id,
  nonce_str,
  sign,
  body,
  out_trade_no,
  total_fee,
  spbill_create_ip,
  notify_url,
  trade_type,
  openid
) {
  let data = "<xml>"
  data += "<appid>" + appid + "</appid>"
  data += "<mch_id>" + mch_id + "</mch_id>"
  data += "<nonce_str>" + nonce_str + "</nonce_str>"
  data += "<sign>" + sign + "</sign>"
  data += "<body>" + body + "</body>"
  data += "<out_trade_no>" + out_trade_no + "</out_trade_no>"
  data += "<total_fee>" + total_fee + "</total_fee>"
  data += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"
  data += "<notify_url>" + notify_url + "</notify_url>"
  data += "<trade_type>" + trade_type + "</trade_type>"
  data += "<openid>" + openid + "</openid>"
  data += "</xml>"
  return data
}

// 随机数生成
function randomFn() {
  var result = ''
  const wordList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2',
    '3', '4', '5', '6', '7', '8', '9', '0'
  ]
  for (let i = 0; i < 32; i++) {

    let r = Math.round(Math.random() * 35)
    // console.log(r)
    result += wordList[r]
  }
  return result.slice(0, 32)
}