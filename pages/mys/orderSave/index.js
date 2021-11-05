// pages/mys/orderSave/index.js
const app = getApp();
let http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    totalPrice:0,
    count:0,
    list:[],
    // 选择的地址
    addressVal:{},
    // 备注
    des:''
  },
  // 选择地址
  toAddAddress(){
    wx.setStorage({
      key:"getAddress",
      data:1,
      success:()=>{
        wx.navigateTo({
          url: '../addressList/index',
        })
      }
    })
    
  },
  // 提交订单
  saveHandle(){
    let that = this;
    let addressVal = that.data.addressVal;
    console.log(addressVal);
    if(!addressVal.id){
      wx.showToast({
        icon:'none',
        title: '请先选择地址',
      })
      return
    }
    let list = that.data.list;
    let obj = {};
    let cart_ids = '';
    list.forEach((im,idx)=>{
      cart_ids+=((cart_ids?',':'')+im.id);
    });

    // 请求商品列表数据
    http.postData('/api/cart/add_order', {
      cart_ids,
      address_id:that.data.addressVal.id,
      remark:that.data.des
    }, (rep) => {
      if(rep.code==1){
        wx.showToast({
          icon:'none',
          title: '提交成功',
          success:()=>{
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1,
              })
            },2000);
          }
        })
      }
    })
  },
  // 富文本编辑
  textareaChange(e){
    let val = e.detail.value;
    let that = this;
    that.setData({
      des:val
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (op) {
    let that = this;
    let totalPrice = that.data.totalPrice;
    wx.getStorage({
      key: 'shopCart',
      success (res) {
        
        res.data.map(w=>{
          totalPrice = totalPrice+((w.goods.saleswitch==1?w.goods.sale_price:w.goods.price) * w.goods_num);
        });
        that.setData({
          list:res.data,
          totalPrice,
          count:res.data.length
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
    let that = this;
    wx.getStorage({
      key: 'addressVal',
      success (res) {
        that.setData({
          addressVal:res.data
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