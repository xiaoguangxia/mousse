// pages/mys/collect/index.js
const app = getApp();
let http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    active: '',
    // 打分类
    tabMenuArr:[{
      name:'套餐足迹',
      val:'package'
    },
    {
      name:'商品足迹',
      val:'goods'
    },
    {
      name:'方案足迹',
      val:'project'
    }],
    // 分页
    pages:{
      page:1,
      limit:10
    },
    // 总条数
    total:null,
    // 足迹数据
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.tabsChange({
      detail:{
        active:that.data.tabMenuArr[0].val,
        name:that.data.tabMenuArr[0].val
      }
    });
    // tab数据返回后对tab重绘
    that.selectComponent('#tabs').resize();
  },
  // 跳转商品或套餐或方案详情
  toShopDetail(e){
    let that = this;
    let data = that.data;
    let item = e.currentTarget.dataset.item;
    // 判断是商品、套餐、方案
    let url = '';
    // 套餐足迹
    if(data.active=='package'){
      url = '../../home/setMealDetail/index?id='+item.package.id;
    }
    // 方案足迹
    if(data.active=='project'){
      url = '../../pleaseds/pleasedDetail/index?id='+item.project.id;
    }
    // 商品足迹
    if(data.active=='goods'){
      url = '../../home/goodsDetail/index?id='+item.goods.id;
    }
    wx.navigateTo({
      url:url
    })
  },
  // 选项改变触发
  tabsChange(e){
    let that = this;
    let item = e.detail;
    // 请求足迹数据
    http.postData('/api/footprint/list', {
      type:item.name
    }, (rep) => {
  
      if(rep.code==1){
        that.setData({
          active:item.name,
          list:rep.data.rows,
          total:rep.data.total
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
  // 加载更多
  getListData(){
    let that = this;
    let obj = that.data.pages;
    obj.page+=1;
    obj['type'] = that.data.active;
    // 请求商品列表数据
    http.postData('/api/footprint/list', obj, (rep) => {
      that.setData({
        list:[...that.data.list,...rep.data.rows],
        total:rep.data.total
      });
    })
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