// miniprogram/pages/createOrder/createOrder.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selfReseive: false,
    message: '',
    allOrderList: [],
    totalEms: 0,
    totalSum: 0, //商品总金额
    totalAmount: 0, //总金额
    loading: false,
    address: '' //地址信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let currentOrder = app.globalData.currentOrder
    // 格式化
    let orderArr = this.filterOderList(currentOrder)
    // debugger
    if (app.globalData.isLogin) {
      this.setData({
        isLogin: app.globalData.isLogin,
        userInfo: app.globalData.userInfo,
        storeInfo: app.globalData.storeInfo,
        allOrderList: orderArr, //预生成订单
      })
    }
    this._calcAmount()
  },
  // 计算总金额
  _calcAmount() {
    let ems = 0
    let sum = 0
    let amount = 0
    this.data.allOrderList.forEach(item => {
      let s_ems = item.all_ems;
      console.log(item)
      item.goods.forEach(it => {
        sum += it.count * it.pro_prize.value
      })
      ems += s_ems;
    })

    amount = parseInt((ems + sum) * 100)

    this.setData({
      totalEms: ems.toFixed(2),
      totalSum: sum.toFixed(2), //商品总金额
      totalAmount: amount
    })

  },
  // 过滤订单方法
  filterOderList(orderList) {
    let obj = {}
    orderList.forEach(item => {
      if (!obj[item.pro_store_id]) {
        obj[item.pro_store_id] = {
          store_id: item.pro_store_id,
          store_name: item.pro_store_name,
          store_logo: item.pro_store_logo,
          all_ems: item.pro_ems,
          goods: [item]
        }

      } else {
        let t = obj[item.pro_store_id]
        t.goods.push(item);
        if (item.pro_ems > t.all_ems) {
          t.all_ems = item.pro_ems
        }
      }
    })

    let arr = Object.values(obj)
    return arr

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 提交訂單
  onSubmit() {
    if (!this.data.address) {
      wx.showToast({
        icon: 'none',
        title: '请选择收货地址',
      })
      return
    }
    // console.log(this.data.selfReseive, this.data.receive_infor)
    this.setData({
      loading: true
    })
    let data = {
      goods: this.data.allOrderList,
      selfReseive: this.data.selfReseive, //是否自取
      receive_info: this.data.address
    }
    wx.cloud.callFunction({
      name: 'createrOrder',
      data: data,
      success: res => {
        console.log('创建订单', res)
        let result = res.result
        if (result.success) {
          wx.showToast({
            title: '生成订单成功',
          })
          this._readtoPay(result.data)
        } else {
          wx.showToast({
            title: result.msg,
          })
        }

        this.setData({
          loading: false
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

  },
  _readtoPay(orders){
    console.log('getIp')
    let that = this
    wx.cloud.callFunction({
      //云函数的名字，这里我定义为payment
      name: "getIp",
      //需要上传的数据
      data: {}
    }).then(res => {
      //这个res就是云函数返回的5个参数
      // console.log('ip', res)   
      that._toPay(res.result, orders)
    }).catch(err=>{
      wx.showToast({
        title: JSON.stringify(err),
      })
    })
  },
  _toPay(IP,orders) {
    // wx.redirectTo({
    //   url: '/pages/success/success',
    // })
    // return
    wx.showToast({
      title: '立即支付'
    })
    let uploadData = {
      "orders": orders,
      //此次需要支付的金额，单位是分。例如¥1.80=180
      // "total_fee": "10",
      //用户端的ip地址
      "spbill_create_ip": IP
    }
    //调用云函数
    wx.cloud.callFunction({
      //云函数的名字，这里我定义为payment
      name: "cashPay",
      //需要上传的数据
      data: uploadData
    }).then(res => {
      //这个res就是云函数返回的5个参数
      console.log('支付',res)
      //通过wx.requestPayment发起支付
        wx.cloud.callFunction({
          //云函数的名字，这里我定义为payment
          name: "success",
          //需要上传的数据
          data: {
            orders: orders
          }
        }).then(res => {
          console.log('success', res)
          // wx.showToast({
          //   title: '支付成功',
          // })
          wx.redirectTo({
            url: '/pages/success/success',
          })
        }, (err) => {
          console.log('失败' + err)
          wx.hideLoading()
        })
      // wx.requestPayment({
      //   timeStamp: res.result.data.timeStamp,
      //   nonceStr: res.result.data.nonceStr,
      //   package: res.result.data.package,
      //   signType: res.result.data.signType,
      //   paySign: res.result.data.paySign,
      //   success: res => {
      //     //支付成功
      //     wx.showToast({
      //       title: '支付成功',
      //     })
      //   },
      //   fail: err => {
      //     //支付失败
      //     wx.showToast({
      //       title: '支付失败',
      //     })
      //   }
      // })
      },(err) => {
        console.log('失败1' + err)
      })
  },
  // 切换自取
  reseiveSwitch() {
    // console.log(this.data.selfReseive)
    this.setData({
      selfReseive: !this.data.selfReseive
    })
  },

  // 选择收货地址
  chooseAddress() {
    let that = this
    wx.chooseAddress({
      success(res) {
        console.log('地址', res)
        that.data.address = res;
        that.setData({
          address: that.data.address
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }



})