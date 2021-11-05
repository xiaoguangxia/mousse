// pages/house/detail/index.js
const app = getApp();
let http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    background: [],
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    currentSwiper:0,
    info:{},
    htmlSnip:'USB的is挪动in是你哦'
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
  onLoad: function (op) {
    let that = this;

    // 查询二级
    http.postData('/api/category/info', {
      id:op.id
    }, (res) => {
      if(res.code==1){
        let arr = res.data.images.split(',');
        that.setData({
          info:res.data,
          background:arr,
          htmlSnip:res.data.content
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})