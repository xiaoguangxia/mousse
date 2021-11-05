// pages/home/goodsList/index.js
const app = getApp();
let http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain: app.globalData.http,
    wLink: app.globalData.httpImgUrl,
    active: 0,
    // 选择的空间
    kongJian: {},
    // 大分类
    tabMenuArr: [],
    // 小分类
    chilType: [],
    // 详细规格分类
    ascListType: [
      {
        title: '综合',
        val: ''
      }, {
        title: '风格',
        val: 'style',
      }, {
        title: '户型',
        val: 'house'
      }, {
        title: '尺寸',
        val: 'size'
      }, {
        title: '材质',
        val: 'texture'
      }, {
        title: '货期',
        val: 'period'
      }, {
        title: '颜色',
        val: 'color'
      }
    ],
    // 规格分类数组
    ascListTypeVal: [],
    // 筛选已选数据
    seaObject: {},
    // 筛选详细规格分类条件
    searchVal: '',
    searchBool: false,

    // 分页
    pages: {
      page: 1,
      limit: 10
    },
    // 总条数
    total: null,
    // 商品列表
    shopList: [],
    // 二级空间选择
    spaceActive: null,
    shaixuan: {
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
    // 选择的空间对象
    kongjianObj:{},
    // 首图内容
    banBool:false,
    classFySpaceId:null
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    let that = this;
    let shaixuan = that.data.shaixuan;
    // 分类点击一级空间触发
    let splace =  options.splace && JSON.parse(options.splace)?JSON.parse(options.splace):{};
    // 判断是否是风格（分类传参）
    let classFy = options.classfy && JSON.parse(options.classfy)?JSON.parse(options.classfy):{};
    // 获取空间数据
    http.postData('/api/category/list', {
      pid: 0,
      type: 'space'
    }, (res) => {
      // 
      if (res.data && res.code == 1) {
        that.setData({
          tabMenuArr: [{
            id:-1,
            name:'全部'
          },...res.data]
        });
        // 默认选中空间
        if(splace && splace.id){
          that.setData({
            // 分类传参点击的空间
            active:splace && splace.id?splace.id:-1
          });
          // tab数据返回后对tab重绘
          that.selectComponent('#tabs').resize();
        }
        
      }
    })
    // 判断是否是特价 saleswitch
    if(options.type && options.type != 'undefined' ){
      shaixuan[options.type] = 1;
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
      let obj = {};
      arr.map(w=>{
        if(w.type == options.type){
          obj['综合'] = w;
        }
      });
      that.setData({
        ascListTypeVal: arr,
        seaObject: { ...that.data.seaObject, ...obj },
        searchVal: '综合',
        shaixuan

      });
    }
    
    // 判断是否是风格（分类传参）
    if(classFy && classFy.type=='style'){
      
      that.setData({
        searchVal: classFy.type_text
      });
      that.ascHandle('style',classFy);
    }
    
    // 二级空间（分类传参）
    if(classFy && classFy.type=='space'){
      
      that.setData({
        active:classFy.pid,
        classFySpaceId:classFy.id
      });
      
    }
    if(!classFy || classFy.type!='space'){
      that.searchGoods();
    }
    
    
  },

  // 跳转详情
  toGoodsDetail(e) {
    let that = this;
    let curr = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../goodsDetail/index?id='+curr.id,
    })
  },
  // 点击规格筛选  classfy分类跳转传值
  ascHandle(e,classfy) {
    let that = this;
    let item = classfy?classfy:e.currentTarget.dataset.item;
    let shaixuan = that.data.shaixuan;
    // 判断是否是货期、颜色
    if (item.type == 'period' || item.type == 'color') {
      shaixuan[item.type] = item.keyword;
      // 判断是否是全部
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
      seaObject: { ...that.data.seaObject, ...obj }
    });
  },
  // 二级空间复选
  checkChilType(e) {
    let that = this;
    let cid = e.currentTarget.dataset.cid;
    let pages = that.data.pages;
    pages.page = 1;
    that.setData({
      spaceActive: that.data.spaceActive == cid ? null : cid,
      pages,
      searchBool: false,
      shopList: [],
      total: 0
    });
    this.searchGoods();
  },
  // 选项卡改变触发
  tabChange(e) {
    let that = this;
    let pages = that.data.pages;
    // 获取二级空间
    http.postData('/api/category/list', {
      pid: e.detail.name,
      type: 'space'
    }, (res) => {
      // 
      if (res.data && res.code == 1) {

        that.setData({
          banBool:that.data.active>-1,
          chilType:res.data
        });
      }
    })
    // 匹配当前选择的空间
    let tabMenuArr = that.data.tabMenuArr;
    let kongjianObj = that.data.kongjianObj;
    tabMenuArr.forEach((item,index)=>{
      if(e.detail.name==item.id){
        kongjianObj = item;
      }
    });
    pages.page = 1;
    let obj_ = {
      active: e.detail.name,
      kongjianObj,
    };
    if(e.detail.name==-1){
      obj_['spaceActive'] = null;
      obj_['classFySpaceId'] = null;
    }else{

    }
    that.setData(obj_);
    that.resetData();
  },
  // 上滑触底加载更多
  getListBoootom() {
    let that = this;
    if (that.data.total == that.data.shopList.length) {
      return
    }
    let pages = that.data.pages;
    pages.page += 1;
    that.setData({
      pages
    });

    that.searchGoods();
  },
  // 查询商品
  searchGoods() {
    let that = this;
    let obj = {
      ...that.data.pages
    };
    // 筛选
    let shaixuan = that.data.shaixuan;
    let arr = Object.keys(shaixuan);
    arr.forEach((w, i) => {
      if (shaixuan[w]) {
        obj[w] = shaixuan[w];
      }
    });
    // 一级空间
    if (that.data.active && that.data.active>-1) {
      obj['space_pid'] = that.data.active;
    }
    // 二级空间
    if (that.data.spaceActive?that.data.spaceActive:(that.data.classFySpaceId?that.data.classFySpaceId:'')) {
      obj['space_id'] = that.data.spaceActive?that.data.spaceActive:that.data.classFySpaceId;
      that.setData({
        spaceActive:obj['space_id']
      });
    }
    http.postData('/api/goods/index', obj, (res) => {
      // 
      if (res.data && res.code == 1) {
        that.setData({
          shopList: [...that.data.shopList, ...res.data.rows],
          total: res.data.total
        });
      }
    })
  },
  // 输入框输入触发
  saeInput(e) {
    let that = this;
    let shaixuan = that.data.shaixuan;
    shaixuan.keyword = e.detail.value;
    that.setData({
      shaixuan
    });
  },
  // 清空筛选
  resetData() {
    let that = this;
    let shaixuan = {
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
    };

    that.setData({
      searchVal:'',
      total: 0,
      shopList: [],
      pages:{
        page: 1,
        limit: 10
      },
      shaixuan,
      spaceActive: null,
      searchBool: false,
      seaObject: {}
    });
    that.searchGoods();
  },
  //确定筛选
  cfmClick(e) {
    let that = this;
    let pages = that.data.pages;
    pages.page = 1;
    that.setData({
      searchBool: false,
      pages,
      shopList: [],
      total: 0
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
  onReachBottom: function () {
    let that = this;
    that.getListBoootom();
  }
})