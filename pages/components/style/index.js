// 自定义规格组件
// 选择风格
const app = getApp();
Component({
  // 接受父组件传参
  properties: {
    // 父组件传过来的值
    styleList: {
      type:Array,
      value: [],
    }
  },
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    itemCheckedArr:[]
  },
  methods: {
    // 提交已选择风格
    saveStyleHandle(){
      let that = this;
      if(that.data.itemCheckedArr.length==0){
        wx.showToast({
          icon:'error',
          title: '请选择风格！',
        })
        return
      }
      that.triggerEvent('saveStyleHandle',that.data.itemCheckedArr);
    },
    // 点击复选
    checkboxChange(e){
      let that = this;
      let id = e.currentTarget.dataset.id;
      let idx = e.currentTarget.dataset.idx;
      let arr = that.data.itemCheckedArr;
      let styleList = that.data.styleList;
      styleList[idx]['boolSty'] = !styleList[idx]['boolSty'];
      if(that.data.itemCheckedArr.includes(id)){
        arr.splice(arr.indexOf(id), 1);
      }else{
        arr = [...new Set([...arr,String(id)])];
      }
      
      that.setData({
        itemCheckedArr:arr,
        styleList
      });
    },
    // 关闭规格选择
    closeStyle(){
      let that = this;
      that.triggerEvent('closeStyle',false);
    }
  }
})