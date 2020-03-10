// components/proSelect/proSelect.js


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    options: {
      type: Array,
      // value: []
      observer: function (newVal, oldVal) {
        // console.log(newVal, oldVal)
        if (newVal.length>0){
          this.setData({        
            currentClass: newVal[0].value
          })
          // return [{ name: '全部', value: 0 }].concat(newVal)    
        }  
        
      }
    },
    sid:{
      type: String,
      // value: ''
      observer: function (newVal, oldVal) {
        // console.log(newVal, oldVal)
        if (newVal) {
          this._loadData('refresh')
        }

      }
    }
  },

  created() {
    // debugger
    this.data.selectedIds=[]
    this.data.selectedList = []
  },
  /**
   * 组件的初始数据
   */
  data: {
    activeKey:0,
    currentClass:0,
    listParams: {     
      pageIndex: 1,
      pageSide: 10,
    },
    loadmore:0,
    selectedIds:[],
    selectedList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 取消返回
    _back(){
      this.triggerEvent('closed')
    },
    // 修改tab
    onChange(event) {
      let index = event.detail
      this.setData({
        currentClass: this.data.options[index].value
      })
      this._loadData('refresh')
    },
    // 選擇一個商品
    _chooseOne(event){
      // debugger
      let status = event.currentTarget.dataset.status ? event.currentTarget.dataset.status:false
      let index = event.currentTarget.dataset.index
      let item = this.data.list[index]
      if(status){
        this.data.selectedIds.splice(index,1)
        this.data.selectedList.splice(index, 1)
      }else{
          // 选中操作
        // if (this.data.selectedIds.indexOf(item._id))
          this.data.selectedIds.push(item._id)
          this.data.selectedList.push(item)
      }
      let name = `list[${index}].selected`
      this.setData({
        [name]: !status,
        selectedIds:this.data.selectedIds
      })
      // this.filterList()
      this.triggerEvent('selected', this.data.selectedList)
    },
    // 过滤返回数据
    filterList(list){
      let { selectedIds } = this.data

      list.forEach(item=>{
        if (selectedIds.indexOf(item._id)>=0  ){
          item.selected = true
        }else{
          item.selected = false
        }
      })
      // console.log('res', selectedIds, res)
      // this.triggerEvent('selected', res)
    },
    // 加载店铺数据
    _loadData(mark) {
      wx.showLoading({
        // title: '',
        mask:true
      })
      this.data.listParams.pro_store_id = this.data.sid
      this.data.listParams.pro_class = this.data.currentClass
      // debugger
      console.log(this.data.listParams)
      if (mark == 'refresh') {
        this.data.listParams.pageIndex = 1
      } else {
        this.data.listParams.pageIndex += 1
      }
      // console.log(this.data.listParams)
      this.setData({
        loadmore: 1
      })
      wx.cloud.callFunction({
        name: 'mer_products',
        data: this.data.listParams,
        success: res => {
          const { result } = res
          if (result.success) {
            // result.data.forEach(item => {
            //   item.checked = false
            // })
            wx.hideLoading()
            this.filterList(result.data );
            console.log(result.data)
            if (mark == 'refresh') {
              // 刷新
              this.setData({
                list: result.data,
              })
              wx.stopPullDownRefresh()
              if (result.total == 0) {
                this.setData({
                  loadmore: 2
                })
              } else {
                this.setData({
                  loadmore: 0
                })
              }

            } else {
              // 更多
              this.data.list = this.data.list.concat(result.data)
              this.setData({
                list: this.data.list, //预生成订单
              })
              if (this.data.list.length >= result.total) {
                // 没数据了
                this.setData({
                  loadmore: 2
                })
              }
            }
          } else {
            wx.hideLoading()
            wx.showModal({
              title: '出错啦',
              content: '商品丢失啦',
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
    _loadMore(){
      if (this.data.loadmore == 2) {
        // 没数据啦
        return
      }
      this._loadData('add')
    } 
  }
})
