let myBehavior = require('../../common/baseBehavior')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    order:'',
    // totalEms: 0,
    totalSum: 0, //商品总金额
    totalAmount: 0, //总金额
    loading:true
  },
  behaviors: [myBehavior],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
   
  },
  _refresh() {
    // this._loadData()
    wx.navigateBack()
  },
  _loadData() {
    // 加载订单
    wx.cloud.callFunction({
      name: 'getOrderDetail',
      data: {
        id: this.data.id
      },
      success: res => {
        console.log('详情', res)
        this.setData({
          order: res.result.data,
          loading:false
        })
        this._calcAmount()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  // 计算总金额
  _calcAmount() {
    let ems = 0
    let sum = 0
    let amount = 0
    this.data.order.goods.forEach(item => {
      let s_ems = item.pro_ems;
      sum += item.count * item.pro_prize.value
      ems += s_ems;
    })

    amount = parseInt((ems + sum) * 100)
    console.log(ems, sum, amount)

    this.setData({
      totalSum: sum.toFixed(2), //商品总金额
      totalAmount: amount
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
  onShow: function () {
    this._loadData()
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