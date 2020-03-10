//app.js
import Dialog from '@vant/weapp/dialog/dialog.js';
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env:"demo-7c3852",
        env: "demo-g77kp",
        traceUser: true,
      })
    }
    let his = wx.getStorageSync('shopingCarts')
    this.globalData = {
      isLogin:false,
      userInfo:'',
      shoppingCart: his?his:[],
      currentOrder:''  //当前创建订单的数据容器
    }
    
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    let _this = this
    // 直接登录
    // _this.onGetOpenid()
    // 测试直接获取opid
    

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.cloud.callFunction({
            name: 'openIdLogin',
            data: {  },
            success: res => {
              // wx.showToast({
              //   title: 'openIdLogin登录',
              // })
              let openid = res.result.openid
              _this.globalData.openid = openid
              _this.globalData.isLogin = true
              console.log(res)
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            }
          })
        } else {
          Dialog.alert({
            title: '小贴士提醒您',
            message: '直接同步微信授权，获取更多优惠资讯',
            showCancelButton:false
          }).then(() => {
            wx.switchTab({
              url: '../mine/mine',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          });
        }
      }
    })
    this._syncCarts()
    // wx.setTabBarItem({
    //   index: 2,
    //   text: '商户中心',
    //   iconPath: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=456321494,929600936&fm=11&gp=0.jpg',
    //   selectedIconPath: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=456321494,929600936&fm=11&gp=0.jpg'
    // })
    
  },
  onHide:function(){
    wx.setStorageSync('shopingCarts', this.globalData.shoppingCart)
  },
  // 创建订单
  createrOrder(list){ 
    // 构建订单数据
    this.globalData.currentOrder = [...list]
    wx.hideLoading()
    wx.navigateTo({
      url: '/pages/createOrder/createOrder',
    })
    
  } ,

  // 更新本地储存
  _syncStorege(){
    wx.setStorageSync('shopingCarts', this.globalData.shoppingCart)
  },
  // 同步购物车
  _syncCarts(){
    let l = this.globalData.shoppingCart.length;
    if(l==0){
      wx.removeTabBarBadge({
        index: 1,
      })
    }else{
  
      wx.setTabBarBadge({
        index: 1,
        text: l+''
      })
    }
  }
})
