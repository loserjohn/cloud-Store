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
    showEms:false,
    // resons: [
    //   {
    //     name: '该商品属于不可退',
    //     value:1
    //   },
    //   {
    //     name: '商品破损',
    //     value: 2
    //   },
    //   {
    //     name: '商品与用户描述问题不符',
    //     value: 3
    //   },
    //   {
    //     name: '咋地，就是不给退',
    //     value: 4
    //   }

    // ],
    // showReason: false,
    emsNum:''  //订单号
  },
  behaviors: [myBehavior],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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
          loading: false
        })
        this._calcAmount()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  // 驳回
  _refuceRefund(data){
    // debugger
    wx.showLoading({
      title: '',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'mer_refuse',
      data: {
        oid:this.data.id,
        refuse_reson_text: data.name,
        refuse_reson: data.value
      },
      success: res => {
        const { result } = res
        if (result.success) {
          wx.showToast({
            title: '操作成功',
          })
          this._loadData()
          wx.hideLoading()
        } else {
          wx.hideLoading()
          Notify({ type: 'danger', message: result.msg });
        }

      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  // 同意退款
  // _toRefund(){
  //   wx.showLoading({
  //     title: '',
  //     mask: true
  //   })
  //   wx.cloud.callFunction({
  //     name: 'mer_agreeRefund',
  //     data: {
  //       oid: this.data.id
  //     },
  //     success: res => {
  //       const { result } = res
  //       if (result.success) {
  //         wx.showToast({
  //           title: '已同意退款',
  //         })
  //         this._loadData()
  //         wx.hideLoading()
  //       } else {
  //         wx.hideLoading()
  //         Notify({ type: 'danger', message: result.msg });
  //       }

  //     },
  //     fail: err => {
  //       console.error('[云函数] [login] 调用失败', err)
  //     }
  //   })
  // },
  // 立即发货
  _dispatch(e){
    
    if (!this.data.emsNum){
      Notify({ type: 'danger', message: '请输入有效物流订单号' });
      return;
    }
    wx.showLoading({
      title: '',
      mask:true
    })
    wx.cloud.callFunction({
      name: 'mer_dispatch',
      data: {
        oid: this.data.id,
        emsNum: this.data.emsNum
      },
      success: res => {
        const {result } = res
        if(result.success){
          wx.showToast({
            title: '发件成功',
          })
          this._loadData()
          wx.hideLoading()
        }else{
          wx.hideLoading()
          Notify({ type: 'danger', message: result.msg });
        }
        
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  // _toggleReason(){
  //   this.setData({
  //     showReason: !this.data.showReason
  //   })
  // },
  // 选择原因
  onReson(e){
    let val = e.detail;
    // debugger
    this._refuceRefund(val)
  },
  onchange(event ){
    let val = event.detail
    this.setData({
      emsNum: val
    })
  },
  _toggleEmsCode(){
    this.setData({
      showEms: !this.data.showEms
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