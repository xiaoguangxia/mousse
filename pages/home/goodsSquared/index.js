// pages/home/goodsSquared/index.js
import { writePhotosAlbum } from '../../../utils/util'
let http = require('../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    // 分享图片
    list: [],
    htmlSnip:''
  },
  // 保存文字和图片到手机
  saveImageText() {
    let that = this;
    let str = `
    【名称】现代轻奢现代轻奢现代轻奢现代轻奢
    【简介】现代轻奢现代轻奢现代轻奢现代轻奢现代轻奢现代轻奢现代轻奢现代轻奢现代轻奢现代轻奢
    ----------------
    优惠价：￥210
    抢购链接：http://mannnnnnnnnnnnnnnnnnnnnnnnnnnnvzxccccccvvvvv
    `;
    // 复制文字
    wx.setClipboardData({
      data: that.data.htmlSnip,
      success: function (res) {
        console.log("复制成功:", res)
      },
    })
    that.downloadImgs();
  },
  // 下载图片
  downloadImgs() {
    var _this = this
    // 获取保存到相册权限
    writePhotosAlbum(
      function success() {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        // 调用保存图片promise队列
        let list = [];
        _this.data.list.map(v=>{
          list.push(_this.data.domain+v);
        });
        console.log(list);
        _this.queue(list).then(res => {
            wx.hideLoading()
            wx.showToast({
              title: '下载完成'
            })
          })
          .catch(err => {
            wx.hideLoading()
            console.log(err)
          })
      },
      function fail() {
        wx.showToast({
          title: '您拒绝了保存到相册'
        })
      }
    )
  },
  // 队列
  queue(urls) {
    let promise = Promise.resolve()
    urls.forEach((url, index) => {
      promise = promise.then(() => {
        return this.download(url)
      })
    })
    return promise
  },
  // 下载
  download(url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: url,
        success: function (res) {
          var temp = res.tempFilePath
          wx.saveImageToPhotosAlbum({
            filePath: temp,
            success: function (res) {
              resolve(res)
            },
            fail: function (err) {
              reject(res)
            }
          })
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 如果是套餐商品
    if(options.id && options.type == 'meal'){
      // 请求后台套餐详情接口
      http.postData('/api/package/info', {
        id:options.id
      }, (res) => {
        // 
        if(res.data && res.code==1){
          let arr = res.data.images.split(',');
          that.setData({
            htmlSnip:res.data.share_text,
            list:arr
          });
        }
      })
    }
    if(options.id && options.type == 'goods'){
      // 请求后台套餐详情接口
      http.postData('/api/goods/info', {
        id:options.id
      }, (res) => {
        // 
        if(res.data && res.code==1){
          let arr = res.data.images.split(',');
          that.setData({
            htmlSnip:res.data.share_text,
            list:arr
          });
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