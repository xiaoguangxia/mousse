// 自定义规格组件
// 方案确定
const app = getApp();
Component({
  // 接受父组件传参
  properties: {
    // 父组件传过来的值
    planList: {
      type:Array,
      value: [],
      observer: function (newVal, oldVal) {
        let that = this;
        let checkArr = [];
        let arr = newVal;
        arr.forEach((item,index)=>{
          checkArr.push(item.id);
        });
        that.setData({
          activeNames:checkArr
        });
      }
    },
    standardsList: {
      type:Array,
      value: [],
      observer(newVal,oldVal){
        let that = this;
        let arr = [];
        newVal.forEach((item,index)=>{
          item['num'] = item.num>0?item.num:1;
          arr.push(item);
        })
        that.setData({
          standardsArr:arr
        });
      }
    }
  },
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    activeNames: [],
    checkboxVal:[],
    num:1,
    standardsArr:[],
    // 已选数量
    selectList:[],
    // 合计
    total:0
  },
  
  methods: {
    // 添加更多商品
    addGoodsHandle(e){
      
      let that = this;
      let plObj = e.currentTarget.dataset.plobj;
      that.triggerEvent('addGoodsHandle',plObj);
    },
    // 删除选中的
    removeAll(e){
      let that = this;
      let id = e.currentTarget.dataset.id;
      let list = that.data.standardsArr;
      let selectList = that.data.selectList;
      // 判断是否选择
      if(selectList.length==0){
        wx.showToast({
          icon:'none',
          title: '请先选择商品',
        })
        return
      }
      wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success: function (sm) {
          if (sm.confirm) {
            // 用户点击了确定 可以调用删除方法了
            let array =list.filter(item=>!selectList.some(ele=>ele.goods_id===item.goods_id))
            selectList.splice(0,selectList.length);
            that.setData({
              standardsArr:array,
              selectList
            });
          }
        }
      })
    },
    
    // 添加数量
    addNum(e){
      let that = this;
      let idx = e.currentTarget.dataset.index;
      let list = that.data.standardsArr;
      let total = that.data.total;
      list[idx].num+=1;
      let selectList = that.data.selectList;
      // 判断是否选择
      if(selectList.length>0){
        // 判断是否是特价商品
        if(list[idx].saleswitch==1){
          total+=list[idx].sale_price;
        }else{
          total+=list[idx].price;
        }
      }
      
      
      that.setData({
        standardsArr:list,
        total
      });
    },
    // 减少数量
    removeNum(e){
      let that = this;
      let idx = e.currentTarget.dataset.index;
      let list = that.data.standardsArr;
      let total = that.data.total;
      let selectList = that.data.selectList;
      // 判断是否选择
      if(selectList.length>0){
        // 判断是否是特价商品
        if(list[idx].saleswitch==1){
          total-=list[idx].sale_price;
        }else{
          total-=list[idx].price;
        }
      }
      if(list[idx].num==0){
        wx.showToast({
          icon:'none',
          title: '数量不能小于0！',
        })
        return
      }
      list[idx].num-=1;
      that.setData({
        standardsArr:list,
        total
      });
    },
    // 全选
    checkboxAllChange(e){
      let that = this;
      let arr = that.data.standardsArr;
      let list = that.data.selectList;
      let total = 0;
      if(arr.length== list.length && arr.length>0){
        arr.map(((w,i)=>{
          w['planBool'] = false;
        }));
        that.setData({
          standardsArr:arr,
          selectList:[],
          total
        });
      }else{
        arr.map(((w,i)=>{
          // 判断是否是特价商品
          if(w.saleswitch==1){
            // 乘以数量
            total=total+(w.sale_price * w.num);
          }else{
            // 乘以数量
            total=total+(w.price * w.num);
          }
          w['planBool'] = true;
        }));
        that.setData({
          standardsArr:arr,
          selectList:arr,
          total
        });
      }
    },
    // 删除商品
    deleteShop(e){
      let that = this;
      let id = e.currentTarget.dataset.id;
      let idx = e.currentTarget.dataset.idx;
      let list = that.data.standardsArr;
      let selectList = that.data.selectList;
      // 用户点击了确定 可以调用删除方法了
      list.map((item,index)=>{
        if(id==item.goods_id){
          list.splice(index,1);
        }
      })
      selectList.map((item,index)=>{
        if(id==item.goods_id){
          list.splice(index,1);
        }
      })
      console.log(list,selectList);
      that.setData({
        standardsArr:list,
        selectList
      });
    },
    // 选择触发
    checkboxChange(e) {
      let that = this;
      let arr = that.data.standardsArr;
      let list = that.data.selectList;
      // 解决内存指向问题
      let array = list.concat();
      let idx = e.currentTarget.dataset.idx;
      let id = e.currentTarget.dataset.id;
      let total = 0;
      arr[idx]['planBool'] = e.detail;
      if(e.detail){
        arr.forEach((item,index)=>{
          if(item.planBool){
            // 判断是否是特价商品
            if(item.saleswitch==1){
              // 乘以数量
              total=total+(item.sale_price * item.num);
            }else{
              // 乘以数量
              total=total+(item.price * item.num);
            }
            array = [...new Set([...array,item])];
          }
        })
      }else{
        arr.map(((w,i)=>{
          if(w.id === id){
            w['planBool'] = e.detail;
          }else{
            // 判断是否是特价商品
            if(w.saleswitch==1){
              // 乘以数量
              total=total+(w.sale_price * w.num);
            }else{
              // 乘以数量
              total=total+(w.price * w.num);
            }
          }
        }));
        
        
        array.splice(array.findIndex(item => item.id === id),1);
      }
      that.setData({
        total,
        standardsArr:arr,
        selectList:array
      });
    },
    onChange(event) {
      let that = this;
      this.setData({
        activeNames: event.detail,
      });
    },
    // 提交已选择
    savePlanHandle(){
      let that = this;
      let selectList = that.data.selectList;
      // 判断是否选择
      if(selectList.length==0){
        wx.showToast({
          icon:'none',
          title: '请先选择商品',
        })
        return
      }
      that.triggerEvent('savePlanHandle',that.data.selectList);
    },
  }
})