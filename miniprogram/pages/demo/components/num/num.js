// pages/components/num/num.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

    food: { // 属性名
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {}, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        // console.log(newVal);

      }
    },
    num:{
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      // value: 0, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        // console.log('o' + oldVal);
        // console.log('n'+newVal);
        // this.setData({
        //   count: newVal
        // })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _addNum:function(){
     
      // this.setData({
      //   count:++this.data.count
      // })
      let count = this.data.num+1
      let obj = {
        foodID: this.data.food.item_id,
        count: count,
        amout: (count * this.data.food.specfoods[0].price).toFixed(1),
        foodMsg: this.data.food
      }
      this.triggerEvent('select', obj)
    },
    _subNum:function(){
      console.log(1)
      if (this.data.num<=0)return;
      let count = this.data.num -1
      // this.setData({
      //   count: --this.data.count
      // })
      let obj = {
        foodID: this.data.food.item_id,
        count: count,
        amout: (count* this.data.food.specfoods[0].price).toFixed(1),
        foodMsg: this.data.food
      }
      this.triggerEvent('select', obj)
      
    }
  }
})
