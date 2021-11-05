// pages/home/setMeal/index.js
const app = getApp();
let http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    active: -1,
    tabMenuArr:[],
    // 套餐分类id
    package_category_id:null,
    // 套餐列表
    list:[]
  },
  // 跳转详情
  toDetail(e){
    let curr = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../setMealDetail/index?id='+curr.id
    })
  },
  //选择风格触发
  tabChange(e){
    let that = this;
    let det = e.detail;
    let package_category_id = that.data.package_category_id;
    let obj = {
      package_category_id
    }
    // 如果不是全部 -1：全部
    if(det.name!=-1){
      obj['style_id'] = det.name;
    }
    // 请求后台套餐列表接口
    http.postData('/api/package/index', obj, (res) => {
      // 显示弹窗广告
      if(res.data && res.data.rows){
        that.setData({
          list:res.data.rows
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.id){
      // 请求后台套餐列表接口
      http.postData('/api/package/index', {
        package_category_id:options.id
      }, (res) => {
        // 显示弹窗广告
        if(res.data && res.data.rows){
          that.setData({
            package_category_id:options.id,
            list:res.data.rows
          });
          
        }
      })
      // 查询风格
      http.postData('/api/category/list', {
        type:'style',
        pid:0
      }, (res) => {
        // 
        if(res.data && res.data.length>0){
          that.setData({
            tabMenuArr:[{
              id:-1,
              name:'全部'
            },...res.data]
          });
          // tab数据返回后对tab重绘
          that.selectComponent('#tabs').resize();
        }
      })
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})