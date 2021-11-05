// 自定义规格组件
const app = getApp();
let http = require('../../../utils/request.js');
Component({
  // 接受父组件传参
  properties: {
    // 父组件传过来的值
    goodsObj: {
      type:Object,
      value: {},
      observer(newVal,oldVal){
        let that = this;
        let sku_list = JSON.parse(newVal.sku_list)?JSON.parse(newVal.sku_list):[];
        let spec_list = JSON.parse(newVal.spec_list)?JSON.parse(newVal.spec_list):[];
        let checkSpecObj = that.data.checkSpecObj;
        let chilObj  = newVal;
        let arr = [];
        spec_list.map((item,index)=>{
          item['sidx'] = 0;
          arr.push(item.child[0]);
        });
        sku_list.map((item,index)=>{
          if(item.value.length === arr.length && item.value.sort().toString() === arr.sort().toString()){
            checkSpecObj = item;
            chilObj.price = item.price;
            chilObj.sale_price = item.sale_price;
            chilObj.image = item.image;
          }
        });
        that.setData({
          chilObj,
          sku_list,
          spec_list,
          checkSpecObj,
          checkSpec:arr
        });
        
      }
    }
  },
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    chilObj:{},
    // 规格属性
    spec_list:[],
    // 规格属性值
    sku_list:[],
    // 已选规格属性
    checkSpec:[],
    // 匹配选中属性值对象
    checkSpecObj:{},
    // 数量
    num:1
  },
  methods: {
    // 添加数量
    addNum(e){
      let that = this;
      let num = that.data.num;
      num+=1;
      that.setData({
        num
      });
    },
    // 减少数量
    removeNum(e){
      let that = this;
      let num = that.data.num;
      
      if(num==0){
        wx.showToast({
          icon:'error',
          title: '数量不能小于0！',
        })
        return
      }
      num-=1;
      that.setData({
        num
      });
    },
    // 选择规格属性触发
    checkSpeHandle(e){
      let that = this;
      let fidx = e.currentTarget.dataset.fidx;// 获取父级下标
      let idx = e.currentTarget.dataset.idx;// 获取下标
      let checkSpecObj = that.data.checkSpecObj;
      // 规格属性
      let spec_list = that.data.spec_list;
      // 规格属性值
      let sku_list = that.data.sku_list;
      // 商品对象
      let chilObj = that.data.chilObj;
      // 赋值选中规格数据
      let item = sku_list[idx];
      spec_list[fidx]['sidx'] = idx;
      spec_list[fidx]['item'] = item;
      spec_list[fidx]['price'] = item.price;
      
      checkSpecObj = item;
      chilObj.price = item.price;
      chilObj.sale_price = item.sale_price;
      chilObj.image = item.image;
      that.setData({
        checkSpecObj,
        chilObj,
        sku_list,
        spec_list
      });
      console.log(spec_list);
    },
    // 确定规格属性
    saveShopping(){
      let that = this;
      let checkSpec = [];
      let spec_list = that.data.spec_list;
      let num = that.data.num;

      spec_list.forEach((item,index)=>{
        checkSpec.push(item.child[item.sidx]);
      });
      that.triggerEvent('saveShopping',{
        checkSpec,
        price:that.data.chilObj.price,
        num
      });
    },
    // 关闭规格选择
    closeStandards(){
      let that = this;
      that.triggerEvent('closeShopping',false);
    }

  }
})