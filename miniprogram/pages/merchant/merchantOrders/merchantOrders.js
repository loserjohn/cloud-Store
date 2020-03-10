// pages/orders/orders.js
// import SET from '../../../mockData/set.js';
const SET = {
  orderType: [
    {
      name:'全部',
      value: 0
    },
    {
      name: '待发货',
      value: 2
    },
    {
      name: '运输中',
      value: 3
    },
    {
      name: '已完成',
      value: 4
    }]
}
let myBehavior = require('../../../common/baseBehavior')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderType: [],
    currentType: 0,
    allOrderList: [],
    listParams: {     
      pageIndex: 1,
      pageSide: 6,
    },
    store_id: '',
    currentType: 0,
    currentTap:0,
    loadmore: 0    //0加载跟多  1加载中 2到底啦朋友
  },
  behaviors: [myBehavior],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderType: SET.orderType,
      currentTap: options.current,
      currentType: SET.orderType[options.current].value,
      store_id: app.globalData.storeInfo._id
    })
    
    // this._loadData('refresh');
  },
  // 加载订单数据  云函数
  _loadData(mark) {
    this.data.listParams.current = this.data.currentType
    this.data.listParams.store_id = this.data.store_id
    console.log(this.data.listParams)
    if (mark == 'refresh') {
      this.data.listParams.pageIndex = 1

    } else {
      this.data.listParams.pageIndex += 1
    }
    wx.showLoading({
      title: '请稍后',
    })
    this.setData({
      loadmore: 1
    })
    wx.cloud.callFunction({
      name: 'mer_orders',
      data: this.data.listParams,
      success: res => {
        console.log('订单列表', res)
        if (mark == 'refresh') {
          // 刷新
          this.setData({
            allOrderList: res.result.data, //预生成订单
          })
          wx.stopPullDownRefresh()
          if (res.result.total == 0) {
            this.setData({
              loadmore: 2
            })
          } else {
            this.setData({
              loadmore: 0
            })
          }

        } else {
          // 更多
          this.data.allOrderList = this.data.allOrderList.concat(res.result.data)
          // console.log(this.data.allOrderList)
          this.setData({
            allOrderList: this.data.allOrderList, //预生成订单
          })
          if (this.data.allOrderList.length >= res.result.total) {
            // 没数据了
            this.setData({
              loadmore: 2
            })
          }
        }
        wx.hideLoading()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.hideLoading()
        this.setData({
          loadmore: 0
        })
      }
    })
  },
  // 跳转
  _navi(e) {
    let oid = e.currentTarget.dataset.oid;
    let s = e.currentTarget.dataset.status;
    // debugger
    if (s == 5) {
      wx.navigateTo({
        url: '../mer_refundDetails/mer_refundDetails?id=' + oid,
      })
    } else {
      wx.navigateTo({
        url: '../mer_orderDetails/mer_orderDetails?id=' + oid,
      })
    }
  },
  _naviRefund(e){
    let oid = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '../mer_refundDetails/mer_refundDetails?id=' + oid,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 触发  对应子组件方法
    this._refresh('refresh')
  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    if (this.data.loadmore == 2) {
      // 没数据啦
      return
    }
    this._loadData('add')
  },
  // 切换tab
  _swichTypeTab: function (e) {
    let i = e.target.dataset.index
    let type = this.data.orderType[i]
    this.setData({
      currentTap:i,
      currentType: type.value
    })
    // console.log(this.data.currentType)
    this._refresh()
  },
  _refresh() {
    this._loadData('refresh')
  },
  // 改变分类
  _swichType: function (e) {
    this.setData({
      currentType: e.detail.current
    })
    // console.log(this.data.currentType)
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
    this._loadData('refresh');
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})