// pages/components/shop_comment/shop_comment.js
import COMMENT from '../../../../mockData/comment.js'

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
    comments:[],
    rating:'',
    tags:[],
    level:'',
    shopId:'',//上级闯进来的,
    commentType:0,
    checked: true
  },
  created:function(){
    
  },
  ready: function () {
    var obj = COMMENT.rating;
    var o = {}
    for (var i in obj) {
      o[i] = obj[i].toFixed(1);
    }
    this.setData({
      comments: COMMENT.comments,
      rating: o,
      tags: COMMENT.tags
    })
    // console.log(this.data.comments)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 过滤器
    _toFixed: function (value, key){
      console.log(value)
      return value.toFixed(key)
    },
    // 切换分类标签
    _swichType:function(event){
      // console.log(event.target.dataset.typekey)
      let key = event.target.dataset.typekey
      this.setData({
        commentType: key
      })
    },
    // 是否只显示有内容
    _onChange:function(){
      this.setData({
        checked: !this.data.checked
      })
      console.log(this.data.checked)
    }
  }
})
