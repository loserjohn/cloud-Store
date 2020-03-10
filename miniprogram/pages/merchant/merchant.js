// miniprogram/pages/merchant/merchant.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 加载店铺数据
  _loadData(){
    wx.showLoading({
      mask: true
    })
    wx.cloud.callFunction({
      name: 'storeInfo',
      data: {},
      success: res => {
        console.log('商店', res)
        wx.hideLoading()
        const {result} = res
        if(result.success){
          this.setData({
            store: result.data
          })
          app.globalData.storeInfo = result.data
        }else{
          wx.showModal({
            title: '出错啦',
            content: '店铺丢失',
            showCancel:fale,
            success(){
              wx.navigateBack({
                
              })
            }
          })
        }
        

      },
      fail: err => {
        wx.hideLoading()
        console.error('[云函数] [login] 调用失败', err)
      }
    })
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

  }
})