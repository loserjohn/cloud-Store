// miniprogram/pages/carts/carts.js
import Dialog from '@vant/weapp/dialog/dialog.js';
const app = getApp()

let myBehavior = require('../../common/baseBehavior')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allShoppingCart: '', //购车车数据
    allStores:'',   // 店铺数据
    allChoose:false ,
    least:false, //至少存在一个
    totalAmount:0  //总金额
  },
  behaviors: [myBehavior],
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let carts = app.globalData.shoppingCart
    // 格式化
    let sArr = this.filterCartList(carts)
    console.log(carts)
    // debugger
    if (app.globalData.isLogin) {
      this.setData({
        isLogin: app.globalData.isLogin,
        userInfo: app.globalData.userInfo,
        storeInfo: app.globalData.storeInfo,
        allStores: sArr, //购车店铺数据数据
        allShoppingCart: carts, //购车车数据     
      })
    }
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
    this._calcAmount()
  },
  // 过滤购物车方法
  filterCartList(cartist) {
    // console.log(cartist)
    let s_obj = {}
    cartist.forEach((item,index) => {
      // console.log(item,index)
      if (!s_obj[item.pro_store_id]) {
        // 异店数据
        item.checked = true
        s_obj[item.pro_store_id] = {
          store_id: item.pro_store_id,
          store_name: item.pro_store_name,
          store_logo: item.pro_store_logo,
          all_ems: item.pro_ems,
          checked : true,
          goods: [index]
        }

      } else {
        // 同店数据
        let t = s_obj[item.pro_store_id]
        item.checked = true
        t.goods.push(index);
        if (item.pro_ems > t.all_ems) {
          t.all_ems = item.pro_ems
        }
      }
    })
    // console.log(s_obj)
    let arr = Object.values(s_obj)
    return arr

  },

  // 是否选中商品底下所有商品
  shopChooseGoods(e){
    // debugger
    let idx = e.currentTarget.dataset.idx;
    // console.log(idx, this.data.allShoppingCart[idx])
    let o = this.data.allStores[idx].checked

    this.data.allStores[idx].goods.forEach(item=>{
      this.data.allShoppingCart[item].checked = !o  
    })
    this.data.allStores[idx].checked = !o
    this.setData({  
      allShoppingCart: this.data.allShoppingCart, //购车车数据
      allStores: this.data.allStores, 
    }) 
    this._calcAmount()
  },

  // 是否选中当个商品
  chooseSingleGoods(e){
    let idx = e.currentTarget.dataset.idx;   //商铺索引号
    let ind = e.currentTarget.dataset.ind;  //关联商品索引号
    // console.log(idx, ind)
    let o = this.data.allShoppingCart[ind].checked
    this.data.allShoppingCart[ind].checked = !o
    
    let all = this.data.allStores[idx].goods.every(item=>{
      return this.data.allShoppingCart[item].checked
    })
    if(all){
      this.data.allStores[idx].checked = true
    }else{
      this.data.allStores[idx].checked = false
    }
    this.setData({
      allShoppingCart: this.data.allShoppingCart, //购车车数据
      allStores: this.data.allStores,
    })
    this._calcAmount()
  },

  // 计算总金额
  _calcAmount(){
    let amount =0
    let all = true
    let least = false
    this.data.allShoppingCart.forEach(item => {
      if(item.checked){
        amount += item.count * item.pro_prize.value
        least = true
      }else{
        all = false
      }
    })
    this.setData({
      least: least,
      totalAmount: parseInt(amount*100),
      allChoose: all
    }) 
  },
  // 全选按钮
  _allChoose(){
    let o = this.data.allChoose
    this.data.allStores.forEach(item => {
      item.checked = !o
    })
    this.data.allShoppingCart.forEach(item => {
      item.checked = !o
    })
    this.setData({
      allShoppingCart: this.data.allShoppingCart, //购车车数据
      allStores: this.data.allStores
    }) 
    this._calcAmount()
  },
  //创建订单
  _submitOrder(){
    let arr = []
    this.data.allShoppingCart.forEach(item => {
      if(item.checked){
        arr.push(item)
      }
    })
    if(arr.length==0){
      wx.showToast({
        title: '请选择商品',
      })
      return
    }
    wx.showLoading({})
    // app.globalData.shoppingCart = []
    // app._syncStorege()
    // app._syncCarts()
    app.createrOrder(arr)
   
  },

  // 删除购物车
  _clear(){
    wx.showLoading({
      title: '请稍后',
    })
    let newArr = []
    this.data.allShoppingCart.forEach((item,index) => {
      if (!item.checked) {
        newArr.push(item)
      }
    })

    app.globalData.shoppingCart = newArr
    let sArr = this.filterCartList(newArr)

    if (app.globalData.isLogin) {
      this.setData({
        allStores: sArr, //购车店铺数据数据
        allShoppingCart: newArr, //购车车数据     
      })
    }
    app._syncStorege()
    app._syncCarts()
    this._calcAmount()
    wx.hideLoading()
    wx.showToast({
      title: '删除成功',
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
  // onShow: function () {

  // },

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