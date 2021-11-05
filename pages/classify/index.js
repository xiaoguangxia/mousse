// pages/classifys/classify/index.js
const app = getApp();
let http = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    typeArr:[],
    // 主图
    banLink:'',
    typeList:[{
      id:'style',
      name:'风格'
    }],

    activeType:'style',
    // 关键词
    keyword:'',
    // 总条数
    total:null,
    // 列表
    list:[],
    // 空间
    spaceList:{}
  },
  // 输入框搜索值改变触发
  inpuChange(e){
    let that = this;
    that.setData({
      keyword:e.detail.value
    });
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 请求风格数据
    http.postData('/api/category/list', {
      type:'style',
      pid:0
    }, (rep) => {
      that.setData({
        list:rep.data
      });
      
    })
    // 请求空间数据
    http.postData('/api/category/list', {
      type:'space',
      pid:0
    }, (rep) => {
      let arr = rep.data;
      
      let typeList = that.data.typeList;
      that.setData({
        banLink:rep.data[0].image,
        spaceList:[...typeList,...rep.data],
        typeArr:arr
      });
      
    })
  },
  // 跳转商品列表
  toBanGoodsList(e){
    let that = this;
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../home/goodsList/index?splace='+JSON.stringify(item),
    })
  },
  // 跳转商品列表
  toGoodsList(e){
    let that = this;
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../home/goodsList/index?classfy='+JSON.stringify(item),
    })
  },
  // 点击左侧分类触发
  checkType(e){
    let that = this;
    let curr = e.currentTarget.dataset.item;
    if(curr.id=='style'){
      // 请求风格数据
      http.postData('/api/category/list', {
        type:'style',
        pid:0
      }, (rep) => {
        that.setData({
          list:rep.data
        });
      })
    }else{
      // 请求二级空间数据
      http.postData('/api/category/list', {
        type:'space',
        pid:curr.id
      }, (rep) => {
        // 循环遍历匹配四个固定空间
        let list = rep.data;
        let imgArr = curr.images.split(',');
        that.setData({
          banLink:imgArr[0],
          list
        });
        
      })
    }
    that.setData({
      activeType:curr.id
    });
  },
  // 跳转搜索页面
  toSearchPage(){
    let that = this;
    wx.navigateTo({
      url: '../classifys/searchPage/index?keyword='+that.data.keyword,
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