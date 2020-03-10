// miniprogram/pages/product_detail/product_detail.js
const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid: '',
    item: '',
    store: '',
    actions: [
      {
        name: '分享',
        id:1,
        subname: '立即分享给小伙伴',
        openType: 'share'
      },
      {
        name: '生成海报',
        id: 2,
      }
    ],
    show:{
      show1:false,
      show2: false,
      show3: false,
    },
    drawing: [
        {
          type: 'image',
          url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1581245249159&di=8ad859057c5ee7b5e88f2069dec76187&imgtype=0&src=http%3A%2F%2Fci.xiaohongshu.com%2F2cbf57db-9cad-4de9-9222-b9a399d454c5%40r_750w_750h_ss1.jpg',
          left: 0,
          top: 0,
          width: 650,
          height: 650
        },
        {
          type: 'text',
          textType: 'CN',
          content: '商品标题',
          fontSize: 32,
          color: '#333',
          textAlign: 'left',
          left: 20,
          top: 690,
          width: 650,
        },
        {
          type: 'text',
          textType: 'CN',
          content: '商品简介',
          fontSize: 28,
          color: '#666',
          textAlign: 'left',
          left: 20,
          top: 740,
          width: 650,
        },
        {
          type: 'text',
          textType: 'CN',
          content: '￥72.0',
          fontSize: 46,
          color: 'orangered',
          textAlign: 'left',
          left: 20,
          top: 820,
          width: 650,
        },
        {
          type: 'image',
          url: 'http://src.onlinedown.net/images/xcs/10/2017-09-18_59bf6a2170092.jpg',
          top: 690,
          left:410,
          width: 200,
          height: 200
        },
      ],
    savebtnText:'保存图片',
    canvasbg:'rgba(0,0,0,.6)',
    showPoster:false,
    count:1,  //购买数量
    amount:0 , //总金额
    action:'creatOrder',
    cartsNum:0,
    loading:true
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // debugger
    this.setData({
      id: options.id
    })
    this._loadData()
    this.setData({
      cartsNum:app.globalData.shoppingCart.length
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // this.setData({
    //   store: app.globalData.storeInfo
    // })
    // console.log(this.store)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  // 选择部分  1为加入购物车  2为生成订单
  _readyOrder(e){
    if (!app.globalData.isLogin) {
      Dialog.alert({
        title: '小贴士提醒您',
        message: '直接前往注册/登录，获取更多优惠资讯'
      }).then(() => {
        wx.switchTab({
          url: '../mine/mine',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      });
      return
    }
    let t = e.currentTarget.dataset.type;
    if(t==1){
      this.data.show.show2 = true
      this.setData({
        action: 'addCard',
        show: this.data.show
      })
    }else{
      this.data.show.show2 = true
      this.setData({
        action: 'creatOrder',
        show: this.data.show
      })
    }

  },
  // 下一步
  _nextStep(){
    if(this.data.action =='addCard') {
      this._addCard()
    }else{
      this._creatOrder()
    }
    this.data.show.show2 = false
    this.setData({
      show: this.data.show
    })
  },

  // 模态框控制
  onToggle(e) {
    // debugger
    let t = e.currentTarget.dataset.type;
    console.log(e)
    this.data.show[`show${t}`] = !this.data.show[`show${t}`]
    this.setData({
      show: this.data.show
    })
  },
  // 步进器选择
  stepChoose(event){
    let a = event.detail,m
    
    if(!a){
      m = 0.0
    }else{
      m = (a * this.data.item.pro_prize.value).toFixed(1)
    }
    this.setData({
      count:a,
      amount:  m
    })

  },
  // 操作选择
  onSelect(e) {
    // debugger
    let id = e.detail.id;
    console.log(id)
    switch (id){
      case 1:
        // this.onShareAppMessage()
        break;  
      case 2:
        this.setData({
          showPoster:true
        })
        break;
    }
  },
  // 保存海报
  saveImage(e){
    this.setData({
      showPoster: false
    })
  },
  completed(e) {
    // this.setData({
    //   showPoster: false
    // })
  },
  _readBuy() {

  },
  // 创建订单  //构建数据
  _creatOrder() {
    
    let  arr = [];
    let  item = {
      pro_name: this.data.item.pro_name,
      _id: this.data.item._id,
      pro_prize: this.data.item.pro_prize,
      pro_pre: this.data.item.pro_pre,
      pro_des: this.data.item.pro_des,
      pro_ems: this.data.item.pro_ems,
      pro_store_id: this.data.item.pro_store_id,
      pro_store_logo: this.data.item.pro_store_logo,
      pro_store_name: this.data.item.pro_store_name,

      count: this.data.count
    } 
    arr.push(item)
    // debugger
    wx.showLoading({})
    app.createrOrder(arr)
  },

  // 返回首页
  _toHome() {
    wx.navigateBack({})
  },
  // 加入购物车
  _addCard() {
    
    let item = this.data.item;
    let arr = app.globalData.shoppingCart ? app.globalData.shoppingCart:[];
    
    let i = 0
    let  isnew = true
    while (i < arr.length) {
      if (item._id == arr[i]._id){
        arr[i].count+= this.data.count
        isnew = false
        break
      }
      i++;
    }
    if(isnew){
      // 新商品 机制及构造数据添加
      let nitem = {
        pro_name: this.data.item.pro_name,
        _id: this.data.item._id,
        pro_prize: this.data.item.pro_prize,
        pro_pre: this.data.item.pro_pre,
        pro_des: this.data.item.pro_des,
        pro_ems: this.data.item.pro_ems,
        pro_store_id: this.data.item.pro_store_id,
        pro_store_logo: this.data.item.pro_store_logo,
        pro_store_name: this.data.item.pro_store_name,

        count: this.data.count
      } 
      app.globalData.shoppingCart.push(nitem)
      
    }
    
    app._syncStorege()
   
    wx.showToast({
      title: '已成功添加购物车',
    })
    this.setData({
      cartsNum: app.globalData.shoppingCart.length
    })
  },
  _loadData() {
    // 加载商品
    // console.log(this.data.pid)
    wx.cloud.callFunction({
      name: 'getProDetail',
      data: {
        id: this.data.id
      },
      success: res => {
        console.log('详情', res)
        this.setData({
          item: res.result.data,
          amount: res.result.data.pro_prize.value,
          loading:false
        })

      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  _goCarts(){
    wx.switchTab({
      url: '/pages/carts/carts',
    })
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
  onShareAppMessage: function () {
    console.log(11)
    var that = this;
    var shareimg = [
      "https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/01/01/ChMkJ1mhRcaISLHUAAaIAQtVJyoAAf_UAJK9e8ABogZ224.jpg",
    ]
    var randomImg = shareimg[Math.floor(Math.random() * shareimg.length)];
    return {
      title: '自定义内容',
      desc: '',
      path: 'www.baidu.com',
      imageUrl: randomImg, // 可以更换分享的图片
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
          icon: "none"
        });
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享失败',
          icon: "none"
        })
      }
    }
  },

})