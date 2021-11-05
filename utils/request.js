/**
 * TODO http请求封装
 * zxg
 * 2021年8月24日11点00分
 */

// 配置文件
var app = getApp();

/**
 * POST请求，
 * URL：接口
 * postData：参数，json类型
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 */
function postData(url, postData, doSuccess, doFail) {
  let token = '';
  // 获取本地缓存
  wx.getStorage({
    key: 'token',
    success (res) {
      token = res.data;
    },
    fail:()=>{
    },
    complete:()=>{
      wx.request({
        //项目的真正接口，通过字符串拼接方式实现
        url: app.globalData.http + url,
        // 这个header根据你的实际改！
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': token,
        },
        data: postData,
        method: 'POST',
        success: function (res) {
          //判断是否是未登录
          if (res.data.code==401) { // 如果有token保存下来，下次请求带着token访问
            wx.reLaunch({
              url: '/pages/login/index',
            })
          }else if(res.data.code==0){
            wx.showToast({
              title: '请求失败！',
              icon: 'none',
              duration: 2000
            })
          }else if(res.data.code==1){
            doSuccess(res.data);
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
          
        },
        fail: function () {
        },
      })
    }
  })
  
}

/**
 * GET请求，
 * URL：接口
 * getData：参数，json类型
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 */
function getData(url, getData, doSuccess, doFail) {
  wx.request({
    url: host + url,
    header: {
      'Content-Type': 'application/json',
      'X-Access-Token': config.httpToken,
      'Request-Origin': 'app'
    },
    method: 'GET',
    data: getData,
    success: function (res) {
      doSuccess(res.data);
    },
    fail: function () {
      doFail();
    },
  })
}

/**
 * module.exports用来导出代码
 * js文件中通过var http = require("../util/request.js")  加载
 * 在引入引入文件的时候"  "里面的内容通过../../../这种类型，小程序的编译器会自动提示，因为你可能
 * 项目目录不止一级，不同的js文件对应的工具类的位置不一样
 */
module.exports.postData = postData;
module.exports.getData = getData;