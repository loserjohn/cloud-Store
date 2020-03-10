// miniprogram/pages/orderDetail'/orderDetail.js
import ORDER_DETAIL from '../../../mockData/orderDetail.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    orderMsg:'',
    orderShop:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.orderId);
    this.setData({
      orderId: options.orderId
    });
    this._getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      orderMsg: ORDER_DETAIL.status,
      orderShop: ORDER_DETAIL.snapshot
    });
    console.log(this.data.orderShop)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
// 获取订单详情
  _getData(){
    var _this = this
    // wx.request({
    //   url: `https://h5.ele.me/restapi/bos/v2/users/2312755058/orders/${this.data.orderId}/status`, //仅为示例，并非真实的接口地址
    //   data: {},
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     console.log(res.data)
    //   }
    // })
  }


})