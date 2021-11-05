// pages/pleaseds/pleased/index.js
const app = getApp();
let http = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
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
    list:[]
  },
  // 跳转方案详情
  toPleaDetail(e){
    let  that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../pleaseds/pleasedDetail/index?id='+id,
    })
  },
  // 跳转我的方案
  toAddPlea(){
    wx.navigateTo({
      url: '../pleaseds/addPleased/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 选项风格改变
  tabCheck(e){
    let that = this;
    let curr = e.currentTarget.dataset;
    let obj ={
      page:1,
      limit:10
    };
    that.setData({
      tbTypeActive:curr.active,
      pages:obj,
      list:[],
      total:0
    });
    that.getStyleData();
  },
  // 点赞
  dianzanHandle(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    // 请求方案列表接口
    http.postData('/api/project/zan', {
      id
    }, (res) => {
      // 显示弹窗广告
      if(res.code==1){
        wx.showToast({
          icon:'none',
          title: '点赞成功',
        })
        that.onShow();
      }
    })
  },
  // 请求风格方案
  getStyleData(){
    let that = this;
    let obj = that.data.pages;
    if(that.data.tbTypeActive != -1){
      obj['style_id'] = that.data.tbTypeActive;
    }
    // 请求方案列表接口
    http.postData('/api/project/list', {
      ...obj
    }, (res) => {
      // 显示弹窗广告
      if(res.data.rows && res.data.rows.length>0){
        that.setData({
          list:res.data.rows,
          total:res.data.total
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
    let that  =this;
    // 请求风格接口
    http.postData('/api/category/list', {
      type:'style',
      pid:0
    }, (res) => {
      // 显示弹窗广告
      if(res.data && res.data.length>0){
        that.setData({
          tabType:[{
            id:-1,
            name:'全部'
          },...res.data]
        });
      }
    })
    let obj = that.data.pages;
    // 请求方案列表接口
    http.postData('/api/project/list', {
      ...obj
    }, (res) => {
      // 显示弹窗广告
      if(res.data.rows && res.data.rows.length>0){
        that.setData({
          list:res.data.rows,
          total:res.data.total
        });
      }
    })
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
    // 不等于全部
    if(that.data.tbTypeActive != -1){
      obj['style_id'] = that.data.tbTypeActive;
    }
    
    obj.page+=1
    // 请求商品列表数据
    http.postData('/api/project/list', obj, (rep) => {
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
    if(that.data.list.length<that.data.total){
      that.getListData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})