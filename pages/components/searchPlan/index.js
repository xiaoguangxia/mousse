// pages/home/goodsList/index.js
const app = getApp();
let http = require('../../../utils/request.js');
Component({
  // 接受父组件传参
  properties: {
    // 父组件传过来的值
    goodOption: {
      type:Object,
      value: {},
      observer: function (newVal, oldVal) {
        let that = this;
        
        that.setData({
          active:newVal.id,
          kongJian:newVal
        });
        
        that.searchGoods();
      }
    },
    // 二级空间数据
    spaceList:{
      type:Array,
      value:[],
      observer: function (newVal, oldVal) {
        let that = this;
        console.log(newVal);
        that.setData({
          chilType:newVal
        });
      }
    },
    // 一级空间数据
    planList:{
      type:Array,
      value:[],
      observer: function (newVal, oldVal) {
        let that = this;
        that.setData({
          tabMenuArr:newVal
        });
      }
    },
    styleList:{
      type:Array,
      value:[],
      observer: function (newVal, oldVal) {
        let that = this;
        that.setData({
          styleArray:newVal
        });
      }
    },
    // 创建方案参数  bool为真
    pleased:{
      type:Number,
      value:0,
      observer: function (newVal, oldVal) {
        let that = this;
        if(newVal==1){
          that.setData({
            pleasedBool:newVal
          });
        }
        
      }
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    active: 0,
    // 大分类
    tabMenuArr:[],
    // 小分类
    chilType:[],
    // 详细规格分类
    ascListType:[
      {
        title:'综合',
        val:''
      },{
        title:'风格',
        val:'style',
      },{
        title:'户型',
        val:'house'
      },{
        title:'尺寸',
        val:'size'
      },{
        title:'材质',
        val:'texture'
      },{
        title:'货期',
        val:'period'
      },{
        title:'颜色',
        val:'color'
      }
    ],
    // 规格分类数组
    ascListTypeVal:[],
    // 筛选已选数据
    seaObject:{},
    // 筛选详细规格分类条件
    searchVal:'',
    searchBool:false,
    
    // 分页
    pages:{
      page:1,
      limit:10
    },
    // 总条数
    total:null,
    // 商品列表
    shopList:[],
    // 二级空间选择
    spaceActive:null,
    shaixuan:{
      // 搜索关键词
      keyword: '',
      // 风格
      style_ids: '',
      // 户型
      house_id: '',
      // 尺寸
      size_id: '',
      // 材质
      texture_id: '',
      // 货期
      period: '',
      // 颜色
      color:'',
      // 现货
      readyswitch: '',
      // 新品
      newswitch: '',
      // 流行
      fashionswitch: '',
      // 热销
      hotswitch: '',
      // 秒杀
      saleswitch: ''
    },
    /**
     * 
     * 添加方案↓↓↓↓↓↓↓↓↓↓
     */
    pleasedBool:false
  },
  methods:{
    // 加入方案
    saveFa(e){
      let that = this;
      let item = e.currentTarget.dataset.item;
      let tabMenuArr = that.data.tabMenuArr;
      tabMenuArr.forEach((c,i)=>{
        if(c.id==that.data.active){
          item['fname'] = c.name;
          return
        }
      });
      // 判断是否是新建方案
      if(that.data.pleasedBool){
        item['pleasedG'] = 1;
      }
      that.triggerEvent('saveFa',item);
    },
    // 点击规格筛选
    ascHandle(e){
      let that = this;
      let item = e.currentTarget.dataset.item;
      let shaixuan = that.data.shaixuan;
      // 判断是否是货期、颜色
      if(item.type=='period' ||item.type=='color'){
        shaixuan[item.type] = item.keyword;
      }else if(String(item.id).indexOf(item.type)>-1){
        that.setData({
          ['shaixuan.readyswitch']:'',
          ['shaixuan.newswitch']:'',
          ['shaixuan.fashionswitch']:'',
          ['shaixuan.hotswitch']:'',
          ['shaixuan.saleswitch']:''
        });
        shaixuan[item.type] = 1;
      } else {
        let keys = Object.keys(shaixuan);
        let str = '';
        keys.forEach((citem,idx)=>{
          if(citem.indexOf(item.type)>-1){
            str = citem;
          }
        });
        shaixuan[str] = item.id;
      }
      
      let obj = {};
      obj[that.data.searchVal] = item;
      that.setData({
        shaixuan,
        seaObject:{...that.data.seaObject,...obj}
      });
    },
    // 二级空间复选
    checkChilType(e){
      let that = this;
      let cid = e.currentTarget.dataset.cid;
      let pages = that.data.pages;
      pages.page=1;
      that.setData({
        spaceActive:that.data.spaceActive==cid?null:cid,
        pages,
        searchBool:false,
        shopList:[],
        total:0
      });
      this.searchGoods();
    },
    // 选项卡改变触发
    tabChange(e) {
      let that = this;
      // 获取二级空间
      http.postData('/api/category/list', {
        pid: e.detail.name,
        type: 'space'
      }, (res) => {
        // 
        if (res.data && res.code == 1) {
          that.setData({
            chilType:res.data
          });
        }
      })
      that.setData({
        active: e.detail.name
      });
      that.resetData();
    },
    // 上滑触底加载更多
    getListBoootom(){
      let that = this;
      if(that.data.total==that.data.shopList.length){
        return
      }
      let pages = that.data.pages;
      pages.page+=1;
      that.setData({
        pages
      });
      
      this.searchGoods();
    },
    // 查询商品
    searchGoods(){
      let that = this;
      let obj = {
        ...that.data.pages
      };
      // 筛选
      let shaixuan = that.data.shaixuan;
      let arr = Object.keys(shaixuan);
      arr.forEach((w,i)=>{
        if(shaixuan[w]){
          obj[w] = shaixuan[w];
        }
      });
      // 一级空间
      if(that.data.active){
        obj['space_pid'] = that.data.active;
      }
      // 二级空间
      if(that.data.spaceActive){
        obj['space_id'] = that.data.spaceActive;
      }
      http.postData('/api/goods/index', obj, (res) => {
        // 
        if(res.data && res.code==1){
          that.setData({
            shopList:[...that.data.shopList,...res.data.rows],
            total:res.data.total
          });
        }
      })
      // tab数据返回后对tab重绘
      that.selectComponent('#tabs').resize();
    },
    // 输入框输入触发
    saeInput(e){
      let that = this;
      let shaixuan = that.data.shaixuan;
      shaixuan.keyword = e.detail.value;
      that.setData({
        shaixuan
      });
    },
    // 清空筛选
    resetData(){
      let that = this;
      let shaixuan = {
        // 搜索关键词
        keyword:'',
        // 风格
        style_ids:'',
        // 户型
        house_id:'',
        // 尺寸
        size_id:'',
        // 材质
        texture_id:'',
        // 货期
        period:''
      };
      that.setData({
        pages:{
          page:1,
          limit:10
        },
        shopList:[],
        searchVal:'',
        total:0,
        shaixuan,
        spaceActive:null,
        searchBool:false,
        seaObject:{}
      });
      this.searchGoods();
    },
    //确定筛选
    cfmClick(e){
      let that = this;
      let pages = that.data.pages;
      pages.page=1;
      that.setData({
        searchBool:false,
        pages,
        shopList:[],
        total:0
      });
      that.searchGoods();
    },
    // 详细规格分类点击触发
  searchClick(e) {
    let that = this;
    let obj = e.currentTarget.dataset.value;
    
    if (obj.title == that.data.searchVal && that.data.ascListTypeVal.length>0) {
      that.setData({
        searchBool: !that.data.searchBool
      });
        return
      
    }
    // 判断是否是综合
    if(obj.title=='综合'){
      let arr = [
        {
          type:'readyswitch',
          id:'allreadyswitch',
          name:'现货'
        },
        {
          type:'newswitch',
          id:'allnewswitch',
          name:'新品'
        },
        {
          type:'hotswitch',
          id:'allhotswitch',
          name:'热销'
        },
        {
          type:'fashionswitch',
          id:'allfashionswitch',
          name:'流行'
        },
        {
          type:'saleswitch',
          id:'allsaleswitch',
          name:'秒杀'
        }
      ];
      that.setData({
        searchBool: !that.data.searchBool,
        ascListTypeVal: arr,
        searchVal: obj.title
      });
      return
    }
    // 判断是否是 货期、颜色
    if (obj.val == 'period' || obj.val == 'color') {
      http.postData('/api/search/list', {
        type: obj.val
      }, (res) => {
        // 
        if (res.data && res.code == 1) {
          that.setData({
            ascListTypeVal: res.data,
            searchVal: obj.title,
            searchBool: true
          });
        }
      })
    } else {
      http.postData('/api/category/list', {
        pid: 0,
        type: obj.val
      }, (res) => {
        // 
        if (res.data && res.code == 1) {
          that.setData({
            ascListTypeVal: res.data,
            searchVal: obj.title,
            searchBool: true
          });
        }
      })
    }
  },

    // 关闭弹出
    closeHandle(){
      let that = this;
      that.triggerEvent('closeHandle',false);
    },
  }
})