// pages/home/index.js
const app = getApp();
let http = require('../../utils/request.js');
Page({
  /** 页面的初始数据 */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    // 轮播
    background: [],
    // 套餐
    package_category:[],
    // 特价
    sale:[],
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    currentSwiper:0,
    // 自营商品分类
    tabType:[],
    tbTypeActive:-1,
    // 分页
    pages:{
      page:1,
      limit:10
    },
    // 总条数
    total:null,
    // 商品列表
    shopList:[],
    // 弹窗广告
    adList:[],
    adIndex:1,
    advertShow:false,//广告弹窗
    // 公司简介
    company_intro:''
  },
  closePop(){
    let that = this;
    that.setData({
      advertShow:false
    });
  },
  // 点击轮播跳转
  toBanDetail:function(e){
    let curr = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../home/detail/index?id='+curr.id
    })
  },
  // 跳转套餐列表
  toFatherMealList:function(e) {
    let curr = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../home/fatherMeal/index?id='+curr.id
    })
  },
  // 跳转秒杀特价
  msHandle(e){
    let that = this;
    let curr = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../home/goodsList/index?type='+curr.type
    })
  },
  // 跳转商品详情
  toShopDetail:function(e) {
    let curr = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../home/goodsDetail/index?id='+curr.id
    })
  },
  // 跳转商品列表
  toShopDetailList:function(e) {
    wx.navigateTo({
      url: '../home/goodsList/index'
    })
  },
  // 切换自营商品类型
  tabCheck:function(e) {
    let that = this;
    let curre = e.currentTarget.dataset;
    let obj ={
      page:0,
      limit:10
    };
    if(curre.active !=-1){
      obj['space_id'] = curre.active;
    }else{
      
    }
    that.setData({
      tbTypeActive:curre.active,
      pages:obj,
      shopList:[],
      total:0
    });
    that.getListData();
  },
  // 轮播图切换触发
  swiperChange: function(e) {
    let {current, source} = e.detail;
    if(source === 'autoplay' || source === 'touch') {
      //根据官方 source 来进行判断swiper的change事件是通过什么来触发的，autoplay是自动轮播。touch是用户手动滑动。其他的就是未知问题。抖动问题主要由于未知问题引起的，所以做了限制，只有在自动轮播和用户主动触发才去改变current值，达到规避了抖动bug
      this.setData({
        currentSwiper: current
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 邀请人id
    if(options.scene){
      wx.setStorage({
        key:"spread_id",
        data:options.scene
      })
    }
    // 请求后台广告接口
    http.postData('/api/index/ad', {}, (res) => {
      // 显示弹窗广告
      if(res.data && res.data.length>0){
        that.setData({
          adList:res.data,
          advertShow: true
        });
      }
    })
    // 请求首页数据
    http.postData('/api/index/index', {}, (rep) => {

      if(rep.data){
        
        that.setData({
          background:rep.data.banner,
          package_category: rep.data.package_category,
          sale:rep.data.sale,
          company_intro:rep.data.company_intro.replace(/\<img/gi, '<img style="max-width:100%;height:auto"'),
          tabType:[{
              id:-1,
              name:'全部'
          },...rep.data.space]
        });
      }
    })
    // 请求商品列表数据
    http.postData('/api/goods/index', that.data.pages, (rep) => {
      that.setData({
        shopList:rep.data.rows,
        total:rep.data.total
      });
      
    })
    // 判断是否登录
    // wx.getStorage({
    //   key: 'token',
    //   success: function (res) {
    //     if(!res.data){
    //       wx.reLaunch({
    //         url: '/pages/login/index',
    //       })
    //     }else{
          
    //     }
    //   },
    //   fail:()=>{
    //     wx.reLaunch({
    //       url: '/pages/login/index',
    //     })
    //   }
    // });
  },
  //关闭广告
  adverHandle: function () {
    var that = this;
    that.setData({
      advertShow: false
    });
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
  // 加载更多
  getListData(){
    let that = this;
    let obj = that.data.pages;
    obj.page+=1
    // 请求商品列表数据
    http.postData('/api/goods/index', obj, (rep) => {
      that.setData({
        shopList:[...that.data.shopList,...rep.data.rows],
        total:rep.data.total
      });
    })
  },
  // 广告轮播图切换触发
  adChangeSwiper: function(e) {
    let {current, source} = e.detail;
    if(source === 'autoplay' || source === 'touch') {
      //根据官方 source 来进行判断swiper的change事件是通过什么来触发的，autoplay是自动轮播。touch是用户手动滑动。其他的就是未知问题。抖动问题主要由于未知问题引起的，所以做了限制，只有在自动轮播和用户主动触发才去改变current值，达到规避了抖动bug
      this.setData({
        adIndex: current
      })
    }
    
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if(that.data.shopList.length<that.data.total){
      that.getListData();
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})