// miniprogram/pages/refund/refund.js
import Dialog from '@vant/weapp/dialog/dialog.js';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    id: '',
    order: '',
    actions: [{
        name: '7天无理由退款',
        value: 1
      },
      {
        name: '产品缺陷',
        value: 2
      },
      {
        name: '质量与图片严重不符',
        value: 3
      },
      {
        name: '物流滞后',
        value: 4
      },
      {
        name: '商家缺货',
        value: 5
      },
      {
        name: '其他',
        value: 6
      },
    ],
    reasonText: '',
    fileList: [],
    loading: true,
    refundParam: {
      oid: '',
      remark: '',
      // ems_number: '',
      // selfReback: false,
      refundType:'0'
    },
    // ems_number: ''
  },
  // 是否只退款
  _swichType(event){
    console.log(event);
    let name = event.detail;
    let proname = `refundParam.refundType`
    this.setData({
      [proname]: name
    })
  },
  // 是否自行送回
  // reseiveSwitch() {
  //   this.data.refundParam.selfReback = !this.data.refundParam.selfReback
  //   this.setData({
  //     refundParam: this.data.refundParam
  //   })
  // },
  // 关闭
  onClose() {
    this.setData({
      show: false
    });
  },
  // 选择
  onSelect(event) {
    console.log(event.detail);
    let des = event.detail
    // this.data.reasonText = des.name
    this.data.refundParam.reason = des.value
    this.setData({
      reasonText: des.name,
      refundParam: this.data.refundParam
    })

  },
  // 上传回调
  afterRead(event) {
    const fileList = event.detail.file;
    // const { fileList } = this.data;
    // console.log(event)
    console.log(fileList)
    if (!fileList.length) {
      wx.showToast({
        title: '请选择图片',
        icon: 'none'
      });
    } else {
      const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(`my-photo${index}.png`, file));
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
          console.log(newFileList)
          this.setData({
            fileList: newFileList
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
  // 删除图片
  delete(event) {
    let index = event.detail.index

    this.data.fileList.splice(index, 1)
    this.setData({
      fileList: this.data.fileList
    });
  },

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    // console.log(options.id)
    this._loadData()
  },
  // 加载订单
  _loadData() {

    wx.cloud.callFunction({
      name: 'getOrderDetail',
      data: {
        id: this.data.id
      },
      success: res => {
        console.log('详情', res)
        this.setData({
          order: res.result.data,
          loading: false
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  // 选择退货原因
  _chooseRs() {
    this.setData({
      show: true
    })
  },
  // 提交退货信息
  _submit() {

    let params = this.data.refundParam
    // if (!params.refundType==0){
    //   if (!params.selfReback && !params.ems_number) {
    //     wx.showToast({
    //       title: '请务必输入物流单号',
    //       icon: 'none'
    //     })
    //     return;
    //   }
    // }
    
    // this.data.refundParam.ems_number = this.data.ems_number;
    this.data.refundParam.oid = this.data.id;
    this.data.refundParam.problem_pics = this.data.fileList.map(item => {
      return item.url
    });

    let that = this
    // console.log(this.data.refundParam)
    // return
    wx.cloud.callFunction({
      name: 'sureRefund',
      data: this.data.refundParam,
      success: res => {
        console.log('退货', res)
        if (res.result.success) {
          wx.showToast({
            title: '申请成功',
            complete() {
              wx.navigateBack({

              })
            }
          })
        } else {
          wx.showToast({
            title: res.result.msg,
            icon: 'none'
          })
        }


      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

  },
  onChange(event) {
    console.log(event);
    let pro = event.target.dataset.pro;
    let val = event.detail
    let proname = `refundParam.${pro}`
    this.setData({
      [proname]: val
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

  }
})