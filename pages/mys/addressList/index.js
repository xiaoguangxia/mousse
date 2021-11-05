// pages/mys/addressList/index.js
const app = getApp();
let http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    // 分页
    pages:{
      page:1,
      limit:10
    },
    
    // 总条数
    total:null,
    list:[],
    // 提交订单
    orderType:0
  },
  // 跳转地址详情
  toAddressDetail(){
    let that = this;
    wx.navigateTo({
      url: '../addressDetail/index',
    })
  },
  // 返回提交订单页面
  cancelSaveOrder(e){
    let that = this;
    let item = e.currentTarget.dataset.item;
    console.log(that.data.orderType);
    if(that.data.orderType==0){
      return
    }
    wx.setStorage({
      key:"addressVal",
      data:item,
      success:()=>{
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (op) {
    let that = this;
    let obj = that.data.pages;
    wx.getStorage({
      key: 'getAddress',
      success () {
      },
      complete:(res)=>{
        // 请求商品列表数据
        http.postData('/api/address/list', {}, (rep) => {
          if(rep.code==1){
            that.setData({
              orderType:res.data == 1?1:0,
              list:rep.data
            });
          }
        })
      }
    })
    
  },
  // 跳转编辑地址
  editAddress(e){
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../addressDetail/index?item='+JSON.stringify(item),
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
    this.onLoad();
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

    // 请求商品列表数据
    http.postData('/api/address/list', obj, (rep) => {
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
    // if(that.data.list.length<that.data.total){
    //   that.getListData();
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})