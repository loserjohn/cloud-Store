// pages/home/home.js
import SET from '../../mockData/set.js'
import ALLSTORES from '../../mockData/restaurants.js'
let myBehavior = require('../../common/baseBehavior')

const app = getApp()
Page({
  behaviors: [myBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图
    banner:[],
    imgheights: [],
    current: 0,
    // 菜单icon
    menus:[],
    // 公告内容
    notices:[],
      
    allstores:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._initStore()
    this._loadData()
  }, 
  
  // 加载商铺 商品信息
  _loadData(){
    wx.cloud.callFunction({
      name: 'products', 
      data: {},
      success: res => {
        console.log('商品',res)
        this.setData({
          allstores: res.result.data
        })

      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  // 加载店铺基本信息
  _initStore(){
    // debugger
    wx.cloud.callFunction({
      name: 'storeInfo',
      data: {},
      success: res => {
        // console.log(333,res)
        app.globalData.storeInfo = res.result.data
        console.log('店铺',app.globalData.storeInfo)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  scan(e){
    // debugger
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../product_detail/product_detail?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(ALLSTORES.items[0])
    this.setData({
      banner: SET.banner,
      menus: SET.menus,
      // allstores: ALLSTORES.items,
      notices:SET.notices
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
  // 监听轮播图的索引
  bindchange: function (e) {
    // console.log(e.detail.current)
    this.setData({ current: e.detail.current })
  },
  // 轮播图自适应高度
  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    // console.log(imgwidth, imgheight, e.target.dataset.id)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    // console.log(imgheights)
    this.setData({
      imgheights: imgheights
    })
  },
  

})