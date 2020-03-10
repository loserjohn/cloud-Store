// miniprogram/pages/mine/mine.js

const app = getApp()
let myBehavior = require('../../common/baseBehavior')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    userInfo:'',
    show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  behaviors: [myBehavior],
  // 相关跳转
  _href(e){
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo,
      carsNums: app.globalData.shoppingCart.length
    })
    let l = app.globalData.shoppingCart.length;
    console.log('show', l)
    if (l == 0) {
      wx.removeTabBarBadge({
        index: 1,
      })
    } else {
      // console.log(666, l)
      wx.setTabBarBadge({
        index: 1,
        text: l + ''
      })
    } 
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
  // 获取用户信息登录操作
  _getUserInfo(e){
    let _this = this
    wx.getUserInfo({
      success: res => {
        let userInfo = res.userInfo
        console.log(userInfo)
        wx.cloud.callFunction({
          name: 'userLogin',
          data: userInfo,
          success: res => {
            app.globalData.userInfo = userInfo
            app.globalData.isLogin = true
            wx.showToast({
              title: '同步成功',
            })
            _this.setData({
              isLogin:true
            })
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          }
        })
      }
    });
    // this.setData({
    //   show:false
    // })
  },
  // 微信地址
  chooseAddress(){
    console.log(0)
    wx.chooseAddress({
      success(res) {
      }
    })
  },
  // 同步授权微信
  _authorization(){
    this.setData({
      show:true
    })
  },

})