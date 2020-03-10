// miniprogram/pages/merchant/ productsManage/productsManage.js
import Notify from '@vant/weapp/notify/notify.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option1: [{
        text: '全部分类',
        value: 0
      } ],
    value1: 0,
    list:[],
    allSelectStatus:false,  //全选状态
    listParams: {
      pro_store_id:'',
      pageIndex: 1,
      pageSide: 10,
    },
    loadmore: 0,    //0加载跟多  1加载中 2到底啦朋友
    manage:false  //编辑模式
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.listParams.pro_store_id = options.sid
    
    this.setData({
      listParams: this.data.listParams
    })
    
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
    let arr = [{
      text: '全部分类',
      value: 0
    }]
    let a = app.globalData.storeInfo.store_pro_class.map(item=>{
      return {
        text: item.name,
        value: item.value
      }
    })
    arr = arr.concat(a) 
    // debugger
    this.setData({
      option1:arr
    })
    this._loadData('refresh')
  },
  // 加载店铺数据
  _loadData(mark) {

    this.data.listParams.pro_class = this.data.value1
    // debugger
    if (mark == 'refresh') {
      this.data.listParams.pageIndex = 1
    } else {
      this.data.listParams.pageIndex += 1
    }
    // console.log(this.data.listParams)
    this.setData({
      loadmore: 1
    })
    wx.cloud.callFunction({
      name: 'mer_products',
      data: this.data.listParams,
      success: res => { 
        const { result } = res
        if (result.success) {
          result.data.forEach(item=>{
            item.checked =false
          }) 

          if (mark == 'refresh') {
            // 刷新
            this.setData({
              list: result.data, 
            })
            wx.stopPullDownRefresh()
            if (result.total == 0) {
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
            this.data.list = this.data.list.concat(result.data)
            this.setData({
              list: this.data.list, //预生成订单
            })
            if (this.data.list.length >= result.total) {
              // 没数据了
              this.setData({
                loadmore: 2
              })
            }
          }
          this._allSelect()
        } else {
          wx.showModal({
            title: '出错啦',
            content: '商品丢失啦',
            showCancel: fale,
            success() {
              wx.navigateBack({

              })
            }
          })
        }
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  // 切换分类
  _change(e){
    // debugger
    
    this.setData({
      value1:e.detail
    })
    // console.log(e.detail)
    this._loadData('refresh')
  },
  // 进入编辑模式
  _toggleManage(){
    this.setData({
      manage: !this.data.manage
    })
  },
  // 单个选中
  _checkOne(event){
    let index = event.target.dataset.index;
    let o = this.data.list[index].checked
    // debugger
    let name = `list[${index}].checked`
    this.setData({
      [name]: !o
    })
    this._allSelect()
  },
  // 全选状态判断
  _allSelect(){
    let res = this.data.list.every(item=>{
      // console.log(item.checked)
      return item.checked
    })
    this.setData({
      allSelectStatus:res 
    })  
  },
  // 全选
  _allSelec(){
    let o = this.data.allSelectStatus;
    this.data.list.forEach(item=>{
      item.checked = !o
    })
    this.setData({
      list:this.data.list,
      allSelectStatus:!o
    })
  },
  // 批量删除
  _delectMul(){
    let arr= []
    let res = false
    this.data.list.forEach(item=>{
      if(item.checked){
        res = true;
        arr.push(item._id)
      }
    })
    if(!res){
      Notify({ type: 'danger', message: '请选择操作条目' });  
      return;
    }
    console.log(arr);
    this.__delete(arr)
  },
  __delete(arr){
    wx.showLoading({
      title: '请稍后',
    })

    wx.cloud.callFunction({
      name: 'mer_productDelete',
      data: {
        pros:arr
      },
      success: res => {
        console.log('删除成功', res)
        wx.hideLoading()
        const { result } = res;
        if (result.success) {
          wx.showToast({
            title: '删除成功'
          })
          this._refresh()
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none'
          })
        }
      },
      fail: err => {
        wx.hideLoading()  
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  // 刷新
  _refresh(){
    this._loadData('refresh')
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
  onPullDownRefresh: function () {
    // 触发  对应子组件方法
    this._refresh()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})