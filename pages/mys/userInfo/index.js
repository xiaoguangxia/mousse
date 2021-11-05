// pages/mys/userInfo/index.js
const app = getApp();
let http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain: app.globalData.http,
    wLink: app.globalData.httpImgUrl,
    userInfo: {},
    bool: false,
    values: '',
    type: ''
  },
  //通过绑定手机号登录
  getPhoneNumber: function (e) {
    let that = this;
    let ivObj = e.detail.iv;
    let telObj = e.detail.encryptedData;
    // 验证session过期没
    wx.checkSession({
      success () {
        console.log(e);
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
                console.log("手机号=", res.data)
                that.setData({
                  ['userInfo.mobile']:mobile
                });
                wx.showToast({
                  icon: 'none',
                  title: '授权成功',
                })
                that.saveHandle();
              }

            })
          }
        })
      },
      fail () {
        wx.reLaunch({
          url: '../../login/index',
        })
      }
    })

    
  },
  // 保存信息
  saveHandle() {
    let that = this;
    let obj = that.data.userInfo;
    let type = that.data.type;
    if (type == 'mobile') {

    }
    obj[type] = that.data.values;
    obj['bool'] = false;
    that.setData(obj);
    that.saveData();
  },
  // 提交数据
  saveData() {
    let that = this;
    let userInfo = that.data.userInfo;
    let obj = {};
    if (userInfo.nickname) {
      obj['nickname'] = userInfo.nickname;
    }
    if (userInfo.mobile) {
      obj['mobile'] = userInfo.mobile;
    }
    http.postData('/api/user/profile', obj, (res) => {
      if (res.code == 1) {
        wx.showToast({
          icon: 'none',
          title: '保存成功',
        })
        that.onLoad();
      }

    })
  },
  // 输入改变值
  textChange(e) {
    let that = this;
    that.setData({
      values: e.detail.value
    });
  },
  // 点击弹出触发
  clickPoup() {
    let that = this;
    that.setData({
      bool: false
    });
  },
  // 显示修改信息
  editInfo(e) {
    let type = e.currentTarget.dataset.type;
    let that = this;
    that.setData({
      type: type,
      values: that.data.userInfo[type],
      bool: true
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    http.postData('/api/user/index', {}, (res) => {
      if (res.code == 1) {
        that.setData({
          userInfo: res.data
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