// pages/components/shopFood/shopFood.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    "addGlobalClass": true
  },
  properties: {
    // 已选食物
    selectFood: { // 属性名
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {}, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        // console.log('s')
        // console.log(newVal)
      }
    },
    // 商家推荐
    recommend: { // 属性名
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: [], // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        // console.log(newVal)
      }
    },
    // 食物
    foodMenus: { // 属性名
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: [], // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        // console.log(newVal)
        // 计算分类长度数据
        var arr = [];
        newVal.forEach(function (item, index) {
          // console.log(item.foods);
          let l = item.foods.length;
          arr.push(l * 240)
        })
        // console.log(arr);

        this._buildHeightList(arr)
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 0,
    activeId: 'typeId0',
    heightList: [],
    selectFood: [],
    toggle:false,
    currentFood:{}
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

    // 点击切换食物分类
    _foodType: function (event) {
      // console.log(event.target.dataset.typekey);
      let t = event.target.dataset.typekey;
      this.setData({
        active: t,
        activeId: 'typeId' + t
      })
    },
    // 滚动监听
    _scroll: function (e) {

      let s = e.detail.scrollTop * 2;
      // console.log(s);
      // 判定左边的类型变化
      this._swichMenus(s)

    },
    // 判定当前的类别
    _swichMenus: function (e) {
      // console.log('in')
      var list = this.data.heightList
      // console.log(e)
      var s = this.data.active;
      if (list[list.length - 1] < e) {
        this.setData({
          active: list.length - 1
        })
        return;
      }
      for (let i = 0; i < list.length; i++) {
        if (list[i] >= e) {
          if (i != s + 1) {
            // console.log(i)
            this.setData({
              active: i
            })
            break
          }
        }
      }
    },
    // 构建高度数组
    _buildHeightList: function (arr) {
      var list = [];
      arr.forEach(function (item, index) {
        let h = 0
        if (index > 0) {
          for (let i = 1; i <= index; i++) {
            h += arr[i - 1]
          }
        }
        list.push(h)
      })
      this.setData({
        heightList: list
      })
      // console.log(this.data.heightList)
    },
    // 数字选择框选择数量的回传事件
    _select: function (e) {
      // console.log(e.detail);
      let food = e.detail;
      this.triggerEvent('pselect', food)
    },
    // 查看详情页
    _toDetail:function(food){
      // console.log(food.target.dataset.food);
      food = food.target.dataset.food
      this.setData({
        currentFood: food,
        toggle: true
      })
    },
    // 关闭详情页
    _close:function(){
      this.setData({
        toggle: false
      }) 
    } 

  }
})