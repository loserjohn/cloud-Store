// miniprogram/pages/merchant/classManage/classManage.js
import Notify from '@vant/weapp/notify/notify.js';
import Dialog from '@vant/weapp/dialog/dialog.js';
// import SET from '../../../mockData/set.js';
const app = getApp()
const defaultClass = [{
    name: '牛肉',
    value: 1,
    checked: false
  },
  {
    name: '零食',
    value: 2,
    checked: false
  },
  {
    name: '早餐',
    value: 3,
    checked: false
  },
  {
    name: '点心',
    value: 4,
    checked: false
  },
  {
    name: '熟食',
    value: 5,
    checked: false
  },
  {
    name: '养生',
    value: 6,
    checked: false
  },
  {
    name: '健身',
    value: 7,
    checked: false
  },
  {
    name: '减脂',
    value: 8,
    checked: false
  }, {
    name: '非油炸',
    value: 9,
    checked: false
  },
  {
    name: '特色小吃',
    value: 10,
    checked: false
  },
  {
    name: '五谷杂粮',
    value: 11,
    checked: false
  },
  {
    name: '营养早餐',
    value: 12,
    checked: false
  }, {
    name: '5a牛肉',
    value: 13,
    checked: false
  },
  {
    name: '其他',
    value: 14,
    checked: false
  }
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classList: [],
    currentValue: 0,
    newName: '',
    ls: [], //用于操作的选择数组
    // indexList: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    list: [], //用于展示的选项数组
    result: [], //选择的结果数组
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initClass()

  },
  // 初始化选择项
  initClass() {
    wx.showLoading({
      mask: true
    })

    let r = []
    let l = new Array()
    // let l = defaultClass.map(item => {
    //   console.log(item)
    //   item.checked = false
    //   return item
    // })
    for (let i = 0; i < defaultClass.length; i++) {
      let item = defaultClass[i]
      l.push({
        name: item.name,
        value: item.value,
        checked: false
      })
    }
    console.log('默认列表', l)
    this.setData({
      classList: app.globalData.storeInfo.store_pro_class, //已选列表
      ls: l //全部选项列表
    })
    console.log('已选列表', this.data.classList)
    console.log('全部选项列表', this.data.ls)
    // this.data.classList = app.globalData.storeInfo.store_pro_class;


    // this.data.classList.forEach(item => {
    //   // console.log(item)
    //   this.data.ls[parseInt(item.value) - 1].checked = true
    // })
    for (let i = 0; i < this.data.classList.length; i++) {
      let item = this.data.classList[i]
      r.push(item.value+'')
      this.data.ls[parseInt(item.value) - 1].checked = true
    }

    console.log('r', r)
    this.setData({
      result:r,
      list: this.data.ls //未选列表
    })
   
    wx.hideLoading()
  },
  // 多选选择
  onChangeCheck(event) {
    console.log(event)
    this.setData({
      result: event.detail
    });
  },
  _none() {},
  // 选项框 单项显示
  toggleCheck(event) {
    // debugger
    const {
      index
    } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    // console.log(`.checkboxes-${index}`)
    checkbox.toggle();
  },
  // 显示分类项
  _toggleClass() {
    this.setData({
      show: !this.data.show
    })
  },
  // 确认选择分类
  _sureClass() {
    if (!this.data.result.length > 0) {
      this._toggleClass();
      return;
    }
    let arr = this.data.result;
    arr.forEach(item => {
      // console.log(this.data.result,parseInt(item) - 1)
      this.data.ls[parseInt(item) - 1].checked = true
    })
    let list = []
    this.data.ls.forEach(item => {
      if (item.checked) {
        list.push({
          name: item.name,
          value: item.value
        })
      }
    })
    console.log(list)
    this._updateClass(list)
    this._toggleClass();
  },
  // 计算当前合适的键值
  // calcValue() {
  //   let {
  //     classList
  //   } = this.data;
  //   let i = 1
  //   let val = ''
  //   while (!val) {
  //     let re = this.findOne(i)
  //     if (re) {
  //       i++;
  //       continue
  //     } else {
  //       val = i;
  //       break

  //     }
  //   }
  //   this.setData({
  //     currentValue: i
  //   })
  // },
  // findOne(i) {
  //   let {
  //     classList
  //   } = this.data;
  //   return classList.some(item => {
  //     let v = item.value;
  //     if (i == v) {
  //       return true
  //     } else {
  //       return false
  //     }
  //   })
  // },
  // 更新分类信息
  _updateClass(data) {
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    // debugger
    wx.cloud.callFunction({
      name: 'mer_classUpdated',
      data: {
        pro_class: data
      },
      success: res => {
        console.log('更新成功', res)
        wx.hideLoading()
        const {
          result
        } = res;
        if (result.success) {
          wx.showToast({
            title: '更新成功'
          })
          this.setData({
            classList: result.data.store_pro_class
          })
          // this.calcValue()
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
  // // 点击新增加
  // _addNewClass() {
  //   // if (!this.data.newName) {
  //   //   Notify({
  //   //     type: 'danger',
  //   //     message: '请输入分类名称'
  //   //   });
  //   //   return;
  //   // }
  //   // let data = {
  //   //   name: this.data.newName,
  //   //   value: this.data.currentValue
  //   // }
  //   wx.showLoading({
  //     title: '请稍后',
  //     mask: true
  //   })
  //   let data = [];
  //   this.data.result.forEach(item => {
  //     data.push(this.data.list[parseInt(item) - 1])
  //   })
  //   // debugger
  //   wx.cloud.callFunction({
  //     name: 'mer_classAdd',
  //     data: {
  //       pro_class: data
  //     },
  //     success: res => {
  //       console.log('新建成功', res)
  //       wx.hideLoading()
  //       const {
  //         result
  //       } = res;
  //       if (result.success) {
  //         wx.showToast({
  //           title: '新建成功'
  //         })
  //         this.setData({
  //           classList: result.data.store_pro_class
  //         })
  //         this.calcValue()
  //         this._refresh()

  //       } else {
  //         wx.showToast({
  //           title: result.msg,
  //           icon: 'none'
  //         })
  //       }
  //     },
  //     fail: err => {
  //       wx.hideLoading()
  //       console.error('[云函数] [login] 调用失败', err)
  //     }
  //   })
  // },
  // 输入
  // onChange(e) {
  //   this.setData({
  //     newName: e.detail
  //   })
  // },
  // 删除分类
  _delect(e) {
    // debugger
    let val = e.target.dataset.val;
    Dialog.confirm({
      title: '您确认要删除该分类?',
      message: '此操作将删除您店铺中所有此分类的商品'
    }).then(() => {
      // on confirm
      this.__deleteClass(val)
    }).catch(() => {
      // on cancel
    });
  },
  __deleteClass(val) {
    // debugger
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'mer_classDelete',
      data: {
        pro_class: val
      },
      success: res => {
        console.log('删除成功', res)
        wx.hideLoading()
        const {
          result
        } = res;
        if (result.success) {
          wx.showToast({
            title: '删除成功'
          })
          console.log(`.checkboxes-${val}`)
          const checkbox = this.selectComponent(`.checkboxes-${val}`);
          checkbox.toggle();
          this.setData({
            classList: result.data.store_pro_class
          })
          this._refresh()
          // this.initClass()
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
  // 刷新商店数据
  _refresh() {
    wx.cloud.callFunction({
      name: 'storeInfo',
      data: {},
      success: res => {
        // console.log('商店', res)
        const {
          result
        } = res
        if (result.success) {
          app.globalData.storeInfo = result.data
          this.initClass()
        } else {
          wx.showModal({
            title: '出错啦',
            content: '店铺丢失',
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