// pages/my/index.js
const app = getApp();
let http = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    userInfo:{}
  },
  // 跳转购物车
  toShoppingCart(){
    wx.navigateTo({
      url: '../mys/shoppingCart/index',
    })
  },
  // 跳转我的消息
  toTidings(){
    wx.navigateTo({
      url: '../mys/tidings/index',
    })
  },
  // 跳转我的收藏
  toCollect(){
    wx.navigateTo({
      url: '../mys/collect/index',
    })
  },
  // 跳转用户信息编辑
  toUserInfo(){
    wx.navigateTo({
      url: '../mys/userInfo/index',
    })
  },
  // 跳转我的足迹
  toTracks(){
    wx.navigateTo({
      url: '../mys/myTracks/index',
    })
  },
  // 跳转意见反馈
  toFeedBack(){
    wx.navigateTo({
      url: '../mys/feedBack/index',
    })
  },
  // 跳转我的方案
  toMyPlan(){
    wx.navigateTo({
      url: '../pleaseds/addPleased/index',
    })
  },
  // 跳转邀请好友
  toInviteFriends(){
    wx.navigateTo({
      url: '../mys/inviteFriends/index',
    })
  },
  toMyPlan(){
    wx.navigateTo({
      url: '../pleaseds/addPleased/index',
    })
  },
  // 跳转地址管理
  toAddress(){
    wx.navigateTo({
      url: '../mys/addressList/index',
    })
  },
  // 跳转订单
  toAllOrder(e){
    let curr = e.currentTarget.dataset;
    let link = '../mys/orderList/index';
    let statusStr = curr.status?('?status='+curr.status):'';
    wx.navigateTo({
      url: link+statusStr
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    let that = this;
    http.postData('/api/user/index', {}, (res) => {
      if(res.code==1){
        that.setData({
          userInfo:res.data
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