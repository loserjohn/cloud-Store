const app = getApp()
module.exports = Behavior({
  behaviors: [],
  properties: {
    myBehaviorProperty: {
      type: String
    }
  },
  data: {
    myBehaviorData: {},
    cartsNum:0
  },
  attached: function() {
    // console.log('213123')
  },
  created() {
    console.log('公用函数')
  },
 
  methods: {
    myBehaviorMethod: function() {},
    // 去支付
    _toPay(e) {
      let arr = [e.currentTarget.dataset.oid];
      this._readtoPay(arr)
    },
    _readtoPay(orders) {
      wx.showLoading({
        title: '处理中',
        mask: true
      })
      let that = this
      wx.cloud.callFunction({
        //云函数的名字，这里我定义为payment
        name: "getIp",
        //需要上传的数据
        data: {}
      }).then(res => {
        //这个res就是云函数返回的5个参数
        console.log('ip', res)
        that.__toPay(res.result, orders)
      }).catch(err => {
        wx.showToast({
          title: JSON.stringify(err),
        })
        wx.hideLoading()
      })
    },
    __toPay(IP, orders) {
      let that = this
      // wx.showToast({
      //   title: '立即支付'
      // })
      let uploadData = {
        "orders": orders,
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
        console.log('支付', res)

        // wx.showToast({
        //   title: '支付成功',
        // })
        that.success(orders)
        //通过wx.requestPayment发起支付
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
        //     wx.hideLoading()
        //     that._refresh()

        //   },
        //   fail: err => {
        //     //支付失败
        //     wx.showToast({
        //       title: '支付失败',
        //     })
        //     wx.hideLoading()
        //   }
        // })
      }, (err) => {
        console.log('失败1' + err)
        wx.hideLoading()
      })
    },
    // 取消订单
    _cancelOrder(e) {
      let oid = e.target.dataset.oid;
      wx.showLoading({
        title: '请稍后...',
      })
      // 加载订单
      wx.cloud.callFunction({
        name: 'deleteOrder',
        data: {
          id: oid
        },
        success: res => {

          console.log(res);
          wx.hideLoading()
          wx.showToast({
            title: '删除成功',
          })
          this._refresh()

        },
        fail: err => {
          wx.hideLoading()
          console.error('[云函数] [login] 调用失败', err)
        }
      })

    },
    // 支付成功回调
    success(orders) {
      wx.cloud.callFunction({
        //云函数的名字，这里我定义为payment
        name: "success",
        //需要上传的数据
        data: {
          orders:orders
        }
      }).then(res => {
        console.log('success',res)
        wx.showToast({
          title: '支付成功',
        })
      
      }, (err) => {
        console.log('失败' + err)
        wx.hideLoading()
      })
    },
    // 提醒发货
    _remind(e){
      let oid = e.target.dataset.oid;
      wx.showLoading({
        title: '请稍后',
        mask:true
      })
      wx.cloud.callFunction({
        //云函数的名字，这里我定义为payment
        name: "remindOrder",
        //需要上传的数据
        data: {
          id: oid
        }
      }).then(res => {
        console.log('success', res)
        wx.hideLoading()
        if (res.result.success){
          wx.showToast({
            title: '提醒成功',
          })
        }else{
          wx.showToast({
            title: res.result.msg,
            icon:'none'
          })
        }
      }, (err) => {
        console.log('失败' + err)
        wx.hideLoading()
      })
    },
    // 确认收货
    _sureReceive(e){
      let oid = e.target.dataset.oid;
      wx.showLoading({
        title: '请稍后',
        mask: true
      })
      wx.cloud.callFunction({
        //云函数的名字，这里我定义为payment
        name: "surReceive",
        //需要上传的数据
        data: {
          id: oid
        }
      }).then(res => {
        console.log('success', res)
        wx.hideLoading()
        if (res.result.success) {
          wx.showToast({
            title: '确认收货成功',
          })
          this._refresh()
        } else {
          wx.showToast({
            title: res.result.msg,
            icon: 'none'
          })
        }
      }, (err) => {
        console.log('失败' + err)
        wx.hideLoading()
      }) 
    },
    // 退货
    _toRefund(e){
      // let oid = e.target.dataset.oid;
      let oid = e.currentTarget.dataset.oid;
      // debugger
      wx.navigateTo({
        url: '/pages/refund/refund?id=' + oid,
      })
    }
  }
})