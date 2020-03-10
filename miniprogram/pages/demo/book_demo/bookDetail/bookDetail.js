// miniprogram/pages/bookDetail/bookDetail.js
const db = wx.cloud.database()
// import Dialog from '../vant/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId:'',
    bookMsg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      bookId: options.id
    })
    this._getBookDetail()
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
   
    this.setData({
      show:true
    })

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
  _getBookDetail:function(){
    var _this = this
    console.log(_this.data.bookId)
    db.collection('allBooksHistory')
      .doc(_this.data.bookId)
      .get()
      .then(res => {
        _this.setData({
          bookMsg: res.data
        })
        console.log(res)

      })
      .catch(err => {
        console.error(err)
      })
  },
  onClose:function(){
    this.setData({
      show: false
    });
  }

})