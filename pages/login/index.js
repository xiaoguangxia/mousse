// pages/login/index.js
const app = getApp();
let http = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wLink: app.globalData.httpImgUrl,
    phoneNumber: "",
    getUserInfoBool: false,//定义登录弹窗
    spread_id:''
  },
  // 暂不登录
  cancelLogin(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /*微信授权登陆 */
  getUserInfo: function (e) {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          if (e.detail.userInfo) {
            console.log('授权通过');
            let param = {
              rawData: e.detail.rawData,
              code: res.code,
              platform: 'wechatmini'//固定参数
            }
            //推荐人id
            if(that.data.spread_id){
              param['spread_id'] = that.data.spread_id;
              
            }
            // 请求后台登录接口
            http.postData('/api/user/third', param, (res) => {
              wx.setStorage({
                key: "token",
                data: res.data.userinfo.token
              })
              wx.setStorage({
                key: "userinfo",
                data: res.data.userinfo
              })
              wx.setStorage({
                key: "thirdinfo",
                data: res.data.thirdinfo
              })
              app.globalData.userInfo = res.data.userinfo;
              that.setData({
                getUserInfoBool: true
              });
              
            })

          } else {
            that.setData({
              getUserInfoBool: false
            });
          }
        }
      }
    })
  },
  //通过绑定手机号登录
  getPhoneNumber: function (e) {
    let that = this;
    let ivObj = e.detail.iv;
    let telObj = e.detail.encryptedData;
    // 验证session过期没
    wx.checkSession({
      success () {
        // 获取缓存
        wx.getStorage({
          key: 'thirdinfo',
          success (rep) {
            let res = rep.data;
            // 请求后端接口
            http.postData('/api/user/mobile_encryptor', {
              session: res.session_key,
              encryptedData: telObj,
              iv: ivObj
            }, (res) => {
              if (res.code == 1) {
                let mobile = res.data.phoneNumber;
                that.setData({
                  ['userInfo.mobile']:mobile
                });
                wx.showToast({
                  icon: 'none',
                  title: '授权成功',
                })
                that.saveData();
                
              }

            })
          }
        })
      },
      fail () {
      }
    })
  },
  // 提交数据
  saveData() {
    let that = this;
    let userInfo = that.data.userInfo;
    let obj = {};
    if (userInfo.mobile) {
      obj['mobile'] = userInfo.mobile;
    }
    http.postData('/api/user/profile', obj, (res) => {
      if (res.code == 1) {
        wx.showToast({
          icon: 'none',
          title: '绑定成功',
        })
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this;
    wx.getStorage({
      key: 'spread_id',
      success (res) {
        that.setData({
          spread_id:res.data
        })
      }
    })
    
    
    // 判断token是否存在
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data) {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      }
    });
    
  },
  //验证登录是否过期
  checksession: function () {
    let that = this;
    wx.checkSession({
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        that.getUserInfo();
      }
    })
  },
  onShow: function () {
    let that = this;
    that.checksession();
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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