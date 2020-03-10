// components/loadMore/loadMore.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loadmore:{
        type: Number,
        // value: 0,
        observer: function (newVal, oldVal) {
          // if()
          // console.log(newVal)
          switch (newVal){
            case 0:
              this.setData({
                text:'上拉加载'
              })
            break
            case 1:
              this.setData({
                text: '加载中'
              })
              break
            case 2:
              this.setData({
                text: '到底啦朋友'
              })
              break
          }
        }
      }
  },
  
  /**
   * 组件的初始数据
   */
  data: {
      text:'上拉加载'
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
