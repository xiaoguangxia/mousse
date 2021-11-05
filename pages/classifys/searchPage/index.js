// pages/classifys/searchPage/index.js
const app = getApp();
let http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain: app.globalData.http,
    wLink: app.globalData.httpImgUrl,
    historyList:[],
    findList:[],
    hotList:[],
    // 筛选已选数据
    seaObject: {},
    // 筛选详细规格分类条件
    searchVal: '',
    // 搜索结果显示
    searchBool:false,
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
    // 分页
    pages: {
      page: 1,
      limit: 8
    },
    // 总条数
    total: null,
    // 商品列表
    shopList: [],
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
    // 记录是搜索数据还是显示记录
    seaValBool:false
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
    that.searchHandle();
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
  /**
   * 监听搜索内容
   */
  changeSearch: function(event) {
    let that = this;
    var inputSearch = event.detail.value;
    that.setData({
      ['shaixuan.keyword']: inputSearch
    })
  },
  // 删除搜索记录
  removeHistory(){
    let  that = this;
    try {
      wx.removeStorageSync('searchHistory');
      that.setData({
        historyList:[]
      });
    } catch (e) {
      // Do something when catch error
    }
  },
  // 点击历史搜索记录触发
  historyHandle(e){
    let that = this;
    let curr = e.currentTarget.dataset;
    that.setData({
      ['shaixuan.keyword']: curr.val
    });
    that.searchHandle();
  },
  // 查询商品
  searchHandle(e){
    let that = this;
    try {
      // 搜索记录存入缓存
      let searchHistory = wx.getStorageSync('searchHistory');
      let keyword = that.data.shaixuan.keyword;
      if(searchHistory && searchHistory.length>0){
        searchHistory.push(keyword);
      }else{
        searchHistory = [keyword];
      }
      wx.setStorageSync('searchHistory', searchHistory);
      // 查询商品信息
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
      http.postData('/api/goods/index', obj, (res) => {
        // 
        if (res.data && res.code == 1) {
          that.setData({
            shopList: res.data.rows,
            total: res.data.total,
            seaValBool:true
          });
        }
      })
    } catch (e) {

     }
  },
  // 点击规格筛选 
  ascHandle(e) {
    let that = this;
    let shaixuan = that.data.shaixuan;
    let item = e.currentTarget.dataset.item;
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
      shaixuan[item.type] = item.id;
    }

    let obj = {};
    obj[that.data.searchVal] = item;
    that.setData({
      shaixuan,
      seaObject: { ...that.data.seaObject, ...obj }
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
      shaixuan,
      searchBool: false,
      seaObject: {}
    });
    that.searchHandle();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (op) {
    let that = this;
    try {
      that.setData({
        ['shaixuan.keyword']:op.keyword?op.keyword:''
      });
      if(op.keyword){
        that.searchHandle();
      }
      // 判断是否有搜索记录
      let searchHistory = wx.getStorageSync('searchHistory');
      if(searchHistory && searchHistory.length>0){
        that.setData({
          historyList:searchHistory
        });
      }
    } catch (e) {}
    // 获取发现数据
    http.postData('/api/search/list', {
      type:'find'
    }, (res) => {
      // 
      if (res.data && res.code == 1) {
        that.setData({
          findList:res.data
        });
      }
    })
    // 获取热搜数据
    http.postData('/api/search/list', {
      type:'hot'
    }, (res) => {
      // 
      if (res.data && res.code == 1) {
        that.setData({
          hotList:res.data
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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
    http.postData('/api/goods/index', obj, (res) => {
      // 
      if (res.data && res.code == 1) {
        that.setData({
          shopList: [...that.data.shopList,...res.data.rows],
          total: res.data.total
        });
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})