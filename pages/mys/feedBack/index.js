// pages/mys/feedback/index.js
const app = getApp();
let http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    // 留言类型
    type:0,
    // 留言
    content:'',
    // 图片
    images:[]
  },
  // 删除图片
  deleteImg(e){
    let that = this;
    let idx = e.currentTarget.dataset.idx;
    let images = that.data.images;
    images.splice(idx,1);
    that.setData({
      images
    });
  },
  // 提交意见反馈
  saveFeedBack(){
    let that = this;
    let obj = that.data;
    if(!obj.type){
      wx.showToast({
        icon:'none',
        title: '请先选择类型',
      })
      return
    }
    if(!obj.content){
      wx.showToast({
        icon:'none',
        title: '请先留言',
      })
      return
    }
    if(obj.images.length==0){
      wx.showToast({
        icon:'none',
        title: '请上传图片',
      })
      return
    }
    // 请求足迹数据
    http.postData('/api/feedback/add', {
      // 留言类型
      type:obj.type,
      // 留言
      content:obj.content,
      // 图片
      images:obj.images.join(',')
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
  // 上传图片
  uploadImg(){
    let that = this;
    let token = '';
    // 获取本地缓存token
    wx.getStorage({
      key: 'token',
      success(res) {
        token = res.data;
      },
      complete(){
        wx.chooseImage({
          success: function(res) {
            let tempFilePaths = res.tempFilePaths
            wx.uploadFile({
              header: {
                "Content-Type": "multipart/form-data",
                "token": token
              },
              url: that.data.domain+'/api/common/upload', //仅为示例，非真实的接口地址
              filePath: tempFilePaths[0],
              name: 'file',
              success: function(res){
                let data = (res.data && JSON.parse(res.data))?JSON.parse(res.data):{};
                console.log(data);
                //判断是否是未登录
                if (data.code==401) { // 如果有token保存下来，下次请求带着token访问
                  wx.reLaunch({
                    url: '/pages/login/index',
                  })
                }else if(data.code==0){
                  wx.showToast({
                    title: '上传失败！',
                    icon: 'error',
                    duration: 2000
                  })
                }else if(data.code==1){
                  if(data.data.url){
                    let images = that.data.images;
                    images.push(data.data.url.replace(/\\/g,""));
                    that.setData({
                      images
                    });
                    
                  }
                }else{
                  wx.showToast({
                    title: '请求失败！',
                    icon: 'error',
                    duration: 2000
                  })
                }
                
              }
            })
          }
        })
      }
    })
  },
  // 改变留言类型
  onChange(e){
    let that = this;
    that.setData({
      type:e.detail
    });
  },
  // 改变留言
  textChange(e){
    let that = this;
    that.setData({
      content:e.detail.value
    });
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