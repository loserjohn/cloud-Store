let myBehavior = require('../../../common/baseBehavior')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    order: '',
    // totalEms: 0,
    totalSum: 0, //商品总金额
    totalAmount: 0, //总金额
    loading: true,
    emsParam:{
      selfReseive:false,
      ems_number:''
    }
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
      name: 'getRefundOrderDetail',
      data: {
        id: this.data.id
      },
      success: res => {
        console.log('详情', res)
        this.setData({
          order: res.result.data,
          loading: false
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
  // 启用物流二维码
  _scanQr() {
    let _this = this
    wx.scanCode({
      success(res) {
        console.log(res)
        let r = res.result;
        Dialog.confirm({
          title: '使用该订单号？',
          message: res.result
        }).then((e) => {
          // console.log(e)
          let name = 'emsParam.ems_number'
          _this.setData({
            [name]: res.result
          })
        }).catch(() => {
          // on cancel

        });
      },
      fail(err) {
        console.log(err)
      }
    })
  },
   // 是否自行送回
  reseiveSwitch() {
    this.data.emsParam.selfReback = !this.data.emsParam.selfReback
    this.setData({
      emsParam: this.data.emsParam
    })
  },
  // 表单
  onChange(event) {
    // console.log(event);
    let pro = event.target.dataset.pro;
    let val = event.detail
    let proname = `emsParam.${pro}`
    this.setData({
      [proname]: val
    })
  },
  // 立即寄件
  _toEms(){
    let params = this.data.emsParam
    if (!params.selfReback && !params.ems_number) {
      wx.showToast({
        title: '请务必输入物流单号',
        icon: 'none'
      })
      return;
    }
    
    this._ems()
  },
  // 云函数 填写单号api
  _ems(){
    let params = this.data.emsParam
    this.data.emsParam.oid = this.data.id;

    let that = this
    console.log(this.data.emsParam)
    wx.showLoading({
      title: '请稍后',
      mask:true
    })
    wx.cloud.callFunction({
      name: 'sureEms',
      data: this.data.emsParam,
      success: res => {
        wx.hideLoading()
        if (res.result.success) {
          wx.showToast({
            title: '寄件成功,等待商家收货'
          })
          this._loadData()
        } else {
          wx.showToast({
            title: res.result.msg,
            icon: 'none'
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  // 撤销退款申请
  _cancelRefund(){
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'cancelRefund',
      data: {
        oid:this.data.id
      },
      success: res => {
        wx.hideLoading()
        if (res.result.success) {
          wx.showToast({
            title: '取消成功'
          })
          this._loadData()
        } else {
          wx.showToast({
            title: res.result.msg,
            icon: 'none'
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