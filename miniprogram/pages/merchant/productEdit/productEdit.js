// miniprogram/pages/merchant/productEdit/productEdit.js
import graceChecker from '../../../util/graceChecker.js'
import Notify from '@vant/weapp/notify/notify.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    show2:false,
    formParams:{},
    units:[
      {
        name: '/份',
      },
      {
        name: '/件',
      },
      {
        name: '/个',
      },
      {
        name: '/斤',
      },
      {
        name: '/公斤',
      },
      
    ],
    actions:[],
    formRule:[
      {
        name: 'pro_name',
        checkType: 'string',
        checkRule: '1,',
        errorMsg: '请输入商品名称'
      },
      {
        name: 'pro_shortName',
        checkType: 'string',
        checkRule: '1,',
        errorMsg: '请输入商品短标题'
      },
      {
        name: 'pro_prize_value',
        checkType: 'int',
        checkRule: '1,',
        errorMsg: '请输入商品现价'
      },
      {
        name: 'pro_prize_original',
        checkType: 'int',
        checkRule: '1,',
        errorMsg: '请输入商品原价'
      },

      {
        name: 'pro_prize_unit',
        checkType: 'string',
        checkRule: '1,',
        errorMsg: '请输入价格单位'
      },
      {
        name: 'pro_class_text',
        checkType: 'string',
        checkRule: '1,',
        errorMsg: '请选择商品分类'
      },
      {
        name: 'pro_ems',
        checkType: 'int',
        checkRule: '1,',
        errorMsg: '请输入邮费'
      },
      {
        name: 'pro_rest',
        checkType: 'int',
        checkRule: '1,',
        errorMsg: '请输入商品数量'
      },
      {
        name: 'pro_des',
        checkType: 'string',
        checkRule: '1,',
        errorMsg: '请填写商品简介'
      },
    ],
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    this.setData({
      id: app.globalData.storeInfo._id,
      actions: app.globalData.storeInfo.store_pro_class,
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
  onShow: function () {

  },
  onClose(){
    this.setData({
      show:false,
      show2:false
    })
  },
  // 表单填入
  onChange(event){
    let pro = event.target.dataset.pro;
    let val = event.detail
    let proname = `formParams.${pro}`
    this.setData({
      [proname]: val
    })
  },
  // 选择分类显示
  _selectClass(){
    this.setData({
      show:true
    })
  },
  // 选择单位显示
  _selectUnit(){
    this.setData({
      show2: true
    })
  },
  // 选择单位
  onSelectUnit(e){
    console.log(e);
    let val = e.detail;
    let proname1 = `formParams.pro_prize_unit`
    this.setData({
      [proname1]: val.name,
    })
  },
  // 选择分类
  onSelect(e){
    console.log(e);
    let val = e.detail;
    let proname1 = `formParams.pro_class`
    let proname2 = `formParams.pro_class_text`
    this.setData({
      [proname1]: val.value,
      [proname2]: val.name
    })
  },
  // 创建订单
  _submit(){
    console.log(this.data.formParams)
    const checkRes = graceChecker.check(this.data.formParams, this.data.formRule)
    console.log(checkRes, graceChecker.error)
    if (!checkRes) {
      
        Notify({ type: 'danger', message: graceChecker.error });
      return
    } 

    if (!this.data.formParams.pro_pre || this.data.formParams.pro_pre.length==0 ){
      Notify({ type: 'danger', message: '请上传封面图' });
      return 
    }
    if (!this.data.formParams.product_imgs || this.data.formParams.product_imgs.length == 0) {
      Notify({ type: 'danger', message: '请上传商品图片' });
      return
    }
    if (!this.data.formParams.pro_detailsPic || this.data.formParams.pro_detailsPic.length == 0) {
      Notify({ type: 'danger', message: '请上传详情图' });
      return
    }
    this._savePro()
  },
  // 云函数创建商品
  _savePro(){
    wx.showLoading({
      title: '请稍等',
    })
    console.log(this.data.formParams)
    this.data.formParams.pro_store_id = this.data.id
    wx.cloud.callFunction({
      name: 'mer_productAdd',
      data: this.data.formParams,
      success: res => {
        console.log('创建成功', res)
        wx.hideLoading()
        const { result } = res;
        if (result.success){
          wx.showToast({
            title: '新建成功'
          })
          wx.navigateBack({
            
          })
        }else{
          wx.showToast({
            title: result.msg,
            icon:'none'
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  // 删除图片
  delete(event){
    let index = event.detail.index
    let pro = event.currentTarget.dataset.pro;
    let des = `formParams.${pro}`

    this.data.formParams[pro].splice(index, 1)

    this.setData({
      [des]: this.data.formParams[pro]
    });
  },
  // 上传回调
  afterRead(event) {
    const fileList = event.detail.file;
    let pro = event.currentTarget.dataset.pro;
    console.log(event)
    console.log(fileList)
    if (!fileList.length) {
      wx.showToast({
        title: '请选择图片',
        icon: 'none'
      });
    } else {
      let t = new Date().getTime()
      const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(`product${index + t}.png`, file));
      Promise.all(uploadTasks)
        .then(data => {
          console.log(2222, data)
          wx.showToast({
            title: '上传成功',
            icon: 'none'
          });
          let newFileList = data.map(item => {
            return ({
              url: item.fileID
            })
          });
          // console.log(newFileList)
          let name = `formParams.${pro}`
          if (this.data.formParams[pro]){
            newFileList = this.data.formParams[pro].concat(newFileList)
          }
         
          this.setData({
            [name]: newFileList
          });
        })
        .catch(e => {
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          });
          console.log(e);
        });
    }
  },
  uploadFilePromise(fileName, chooseResult) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: chooseResult.path
    });
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