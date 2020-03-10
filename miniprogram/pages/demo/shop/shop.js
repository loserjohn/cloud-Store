// miniprogram/pages/shop/shop.js
import SHOPMsg from '../../../mockData/shop.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rst: '',
    menu: [],
    recomment: [],
    active: 0,
    selectFood:{} //已选食物，会进入购物车
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(SHOPMsg);
    this.setData({
      rst: SHOPMsg.rst,
      menu: SHOPMsg.menu,
      recommend: SHOPMsg.recommend
    })
    // console.log(SHOPMsg.rst)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  },
  // 切换tab
  onChange: function(event) {
    let key = event.detail.index
  },
  // 子组件选择食物的回调
  _select: function (e) {
    // console.log(1);
    let food = e.detail;
    // this.triggerEvent('select', food);
    var sf = this.data.selectFood;
    // if (food.count == 0){
    //   // if (sf[food.foodID] ){
    //      delete sf[food.foodID];
    //      console.log(food.foodID)
    //   // }
    // }else{
    //   sf[food.foodID] = food;
    // }
    sf[food.foodID] = food;
    this.setData({
      selectFood: sf 
    }) 
    // console.log(this.data.selectFood)
  },
  // 清空购物车
  _deleteAll:function(){
    this.setData({
      selectFood: {}
    })
  }

})