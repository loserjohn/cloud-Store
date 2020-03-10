// pages/components/orders_module.js
import ORDERS from '../../../../mockData/orders.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    orders: []
  },
  ready: function () {
    this.setData({
      orders: ORDERS.items
    });
    // console.log(ORDERS.items[0])
  },
  /**
   * 组件的方法列表
   */
  methods: {
    upper: function () {
      console.log('下拉刷新')
    },
    lower: function () {
      console.log('上拉加载')
    },
    refresh: function(key){
      console.log('刷新数据'+key)
    }
  },
  
})
