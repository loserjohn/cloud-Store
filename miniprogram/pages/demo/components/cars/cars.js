// pages/cars/cars.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    "addGlobalClass": true
  },
  properties: {
    selectFood: { // 属性名
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {}, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        // console.log('c')
        // console.log(newVal)
        this._toArray(newVal)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    amount:0,
    selectFoods: [],
    listSwicth: false
  },
  ready: function () {
    // console.log(0)

  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    onShow: function () {

    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 控制显示已选的食物
    _toggleList: function () {
      var _this = this
      // this.data.selectFoods.length == 0 || (function (){
      //   // console.log(3)
      //   _this.setData({
      //     listSwicth: !_this.data.listSwicth
      //   }) 
      // })()
      this.data.selectFoods.length == 0 || (() => {
        _this.setData({
          listSwicth: !_this.data.listSwicth
        })
      })()
    },
    // 将购物车对象转化为数组
    _toArray: function (value) {
      let obj = value;
      var arr = []
      for (var i in value) {
        let food = value[i];
       
        if (food.count>0){
          arr.push(food)
        }
       
      }
      //  console.log(arr); 
      if (arr.length == 0) {
        // 购物车没有数据则清空 隐藏
        this.setData({
          listSwicth: false
        })
      }
      this.setData({
        selectFoods: arr
      })
      this._scalAmount()
      // console.log(this.data.selectFoods)  
    },
    // 计算总价格
    _scalAmount:function(){
      let arr = this.data.selectFoods;
      let amount = 0
      arr.map(function (item,index){
        // console.log(parseFloat(item.amout))
        amount += parseFloat(item.amout)
      })
      // console.log(amount)
      this.setData({
        amount: amount.toFixed(1)
      })
    },
    // 点击选择数量
    _select: function (e) {
      let food = e.detail;
      this.triggerEvent('select', food)
    },
    // 清空购物车
    _deleteAll:function(){
      this.triggerEvent('deleteAll', {})
    },
    // 点击扎罩关闭莫泰框
    _close:function(){
      this.setData({
        listSwicth: false
      })
    }

  }
})
