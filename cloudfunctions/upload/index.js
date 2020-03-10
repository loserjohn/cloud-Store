const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const fileStream = fs.createReadStream(path.join(__dirname, 'demo.jpg'))
  let t = new Date().getTime()
  let file = event.cloudPath
  return await cloud.uploadFile({
    cloudPath: `${file}/${t}.jpg`,
    fileContent: fileStream,
  })
}