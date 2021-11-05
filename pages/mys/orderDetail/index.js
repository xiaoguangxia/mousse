// pages/mys/orderDetail/index.js
const app = getApp();
let http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    // 物流信息
    stepsInfo: {},
    // 订单信息
    orderInfo:{}
  },
  /**
   * 
   * 复制订单号 
   */
  copyHandle(){
    let that = this;
    if(!that.data.stepsInfo.number){
      wx.showToast({
        icon:'none',
        title: '未获取到订单号',
      })
      return
    }
    // 复制文字
    wx.setClipboardData({
      data: that.data.stepsInfo.number,
      success: function (res) {
        console.log("复制成功:", res)
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (op) {
    let that  = this;
    // 订单id
    let id = op.id;
    // 物流单号
    let express_no = op.express_no;
    http.postData('/api/orders/info', {
      id
    }, (res) => {
      if(res.code==1){
        that.setData({
          orderInfo:res.data
        });
        if(express_no){
          // 查询物流
          http.postData('/api/orders/logistics', {
            express_no
          }, (rep) => {
            if(rep.code==1){
              that.setData({
                stepsInfo:rep.data
              });
            }
          })
        }
        
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