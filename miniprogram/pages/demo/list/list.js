// pages/list/list.js
import SET from '../../../mockData/set.js';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex:0,
    active:1,
    fooType:0,
    foodType:[],
    show:false,
    filtershow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      foodType: SET.menus,
    })
    wx.startPullDownRefresh()
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
      // console.log("下拉了");
      setTimeout(function(){
        wx.stopPullDownRefresh()
      },1500)
     
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
  _filter:function(){
    this.setData({
      show: true
    })
  },
  _filterBoxToggle: function () {
    this.setData({
      filtershow: true
    })
  },
  _onClose:function(){
    this.setData({
      show: false,
      filtershow:false
    })
  },
  _chooseType:function(event){

    // console.log(event.target.dataset.typeid)
    this.setData({
      fooType: event.target.dataset.typeid
    })
  }
})