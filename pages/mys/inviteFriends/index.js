// pages/mys/inviteFriends/index.js
import poster from '../../../miniprogram_npm/wxa-plugin-canvas/poster/poster';
const app = getApp();
let http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    vertical: false,
    autoplay: false,
    duration: 500,
    currentIndex: 0,
    // 海报列表
    list:[],
    // 海报配置
    posterConfig:{},
    // 海报弹出
    posterBool:false,
    // 生成海报的地址
    posterLink:'',
    userInfo:{}
  },
  /* 这里实现控制中间凸显图片的样式 */
  handleChange(e) {
    let that = this;
    console.log(e.detail.current);
    that.setData({
      currentIndex: e.detail.current
    })
  },
  // 生成海报
  onCreatePoster: function () {
    let that = this;
    that.creatArticlePoster();

  },
  // 生成海报成功
  onPosterSuccess(e){
    let that = this;
    const { detail } = e;
    that.setData({
      posterLink:detail,
      posterBool:true
    });
  },
  // 生成海报失败
  onPosterFail(e){
    
  },
  // 保存图片到相册
  saveImage() {
    let that = this;
    wx.showLoading({
      title: '保存中..',
    })
    // wx.downloadFile({
    //     url: that.data.posterLink,
    //     success: function (res) {
            wx.saveImageToPhotosAlbum({
                filePath: that.data.posterLink, // 此为图片路径
                success: (res) => {
                    console.log(res)
                    wx.hideLoading('保存成功，请到相册中查看');
                    wx.hideLoading();                       
                },
                fail: (err) => {
                    console.log(err)
                    wx.hideLoading('保存失败，请稍后重试');
                }
            })
    //     }
    // })
  },
  closePop(){
    let that = this;
    that.setData({
      posterBool:false
    });
  },
  // 创建海报
  creatArticlePoster() {
    let that = this;
    let obj = that.data.list[0];
    console.log(obj);
    // 小程序码
    let wxQrcode = '';
    
    // 创建海报所需数据
    let posterConfig = {
      width: 616,
      height: 987,
      backgroundColor: '#fff',
      debug: false
    }
    let texts = [
      {
        x: 30,
        y: 740,
        text: '美学空间研究院',
        fontSize: 36,
        lineHeight:1,
        color: '#141414',
        width: 520,
        lineNum: 2
      },
      {
        x: 82,
        y: 814,
        text: that.data.userInfo.mobile,
        fontSize: 28,
        color: '#333333',
        lineNum: 1
      },
      // {
      //   x: 218,
      //   y: 936,
      //   text: '保存海报即可分享',
      //   fontSize: 20,
      //   color: '#999999',
      //   lineNum: 1
      // }
    ];
    wxQrcode = that.data.domain+obj.qrcode;
    let images = [
      {
        width: 616,
        height: 640,
        x: 0,
        y: 0,
        url: that.data.domain+obj.image,//海报主图
      },
      {
        width: 32,
        height: 32,
        x: 35,
        y: 792,
        url: that.data.wLink+'/images/phone-icon.png',//图标
      },
      {
        width: 170,
        height: 170,
        x: 416,
        y: 670,
        url:wxQrcode,//二维码的图
      }
    ];
    // let blocks = [
    //   {
    //     width: 616,
    //     height: 1,
    //     x: 0,
    //     y: 905,
    //     backgroundColor: '#F5F5F5',
    //     zIndex: 100,
    //   }
    // ]
    // posterConfig.blocks = blocks;//海报元素
    posterConfig.texts = texts; //海报的文字
    posterConfig.images = images;//海报内的图片
    that.setData({ posterConfig: posterConfig }, () => {
      wx.showToast({
        duration:2000,
        title: '正在生成',
        icon:'none'
      })
      poster.create(true);    //生成海报图片
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (op) {
    let that = this;
    http.postData('/api/user/qrcode', {}, (res) => {
      if(res.code==1){
        that.setData({
          list:[res.data]
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