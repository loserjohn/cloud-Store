// miniprogram/pages/search/search.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    hisBooksList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // 加载历史数据
      
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this._getHisBooks()  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
   
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
// 获取扫描历史记录
  _getHisBooks:function(){
   var _this = this
    // if (!app.globalData.openid) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请先登陆',
    //     success(res) {
    //       if (res.confirm) {
    //         wx.switchTab({ url: '../index/index'})
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    //   return;
    // }
    // console.log('获取数据')
    db.collection('allBooksHistory')
      .where({
        //_openid: app.globalData.openid, // 填入当前用户 openid 
       
        _openid: 'owRL60HOFkFSKDhmI0Ur7U-jNBJ0',
      })
      .limit(10) // 限制返回数量为 10 条
      .get()
      .then(res => {
        
        // _this.hisBooksList = res.data;
        _this.setData({
          hisBooksList: res.data
        })
        console.log(_this.data.hisBooksList[0])
      })
      .catch(err => {
        console.error(err)
      })

  },  
// 扫描二维码
  _scanCode:function(){
    
    var _this =this
    wx.scanCode({
      success:function(res){
          // console.log(res)
        let code = res.result;
        wx.cloud.callFunction({
          name: 'bookInfo',
          data: {
            bookCode: code 
          }, 
          success: res => {
            // console.log(res.result) 
            var bookData = JSON.parse(res.result)
            console.log(bookData);
            _this.addNewBook(bookData)

          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err) 
          }
        })
      },
      fail:function(err){
        console.log(err)
      }
    })
  },
  // 自发动添加扫描记录到历史记录
  addNewBook: function (bookData){
    db.collection('allBooksHistory').add({
        // data 字段表示需新增的 JSON 数据
      data: bookData
      })
      .then(res => {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
      })
      .catch(console.error)
  }
})