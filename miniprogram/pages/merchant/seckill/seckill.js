// miniprogram/pages/merchant/seckill/seckill.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:'',
    sid:'',
    show:false,
    selectedList:[],
    formList:[] ,  //提交的表单
    currentTime: '12:00',
    minHour: 10,
    maxHour: 20,
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    columns: [8, 10,12,14,16,18,20,22,24],
    showDate:false,
    showTime:false,
    active:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let a = app.globalData.storeInfo.store_pro_class
    let sid = app.globalData.storeInfo._id
    this.setData({
      options: a,
      sid: sid
    })
  },
  _none(){},
  _togglePro(){
    this.setData({
      show:!this.data.show
    })
  },
  _toggleDate(e){
    if (!this.data.showDate){
      let i = e.currentTarget.dataset.index
      // debugger
      this.setData({
        active: i
      })
    }
    this.setData({
      showDate: !this.data.showDate
    })
  },
  _toggleTime(e){
    if (!this.data.showTime) {
      let i = e.currentTarget.dataset.index
      // debugger
      this.setData({
        active: i
      })
    }
    this.setData({
      showTime: !this.data.showTime
    })
  },
  onChange(e){
    let i = e.currentTarget.dataset.index
    let r = e.detail
    let name = `formList[${i}].activity_prize`
    this.setData({
      [name]: parseInt(r) 
    })
  },
  _setDate(e){
    console.log(1,e)
    let r =e.detail;
    let i = this.data.active;
    // this.data.formList[i].activity_date = r;

    let name = `formList[${i}].activity_date`
    this.setData({
      [name]:r
    })
    this._toggleDate()
  },
  _setTime(e){
    console.log(2,e)
    let r = e.detail.value
    let i = this.data.active;
    // this.data.formList[i].activity_time = r
    let name = `formList[${i}].activity_time`
    this.setData({
      [name]: r
    })
    this._toggleTime()
  },
  // 选择产品回调
  _selected(data){
    // debugger
    // 过滤数据
    let formList= []
    data.detail.forEach(item=>{
      formList.push({
        pro_id:item._id,
        activity_prize:'',
        activity_date: '',
        activity_time: '',
      })
    })
    this.setData({
      selectedList:data.detail,
      formList: formList
    })
    console.log(formList)
  },
  _submit(){
    console.log(this.data.formList)
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