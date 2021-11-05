// pages/mys/orderList/index.js
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp();
let http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    active: 0,
    // 分页
    pages:{
      page:1,
      limit:10
    },
    // 列表
    list:[],
    // 总条数
    total:null,
    // 大分类
    tabMenuArr:[
      {
        id:0,
        name:'全部'
      },
      {
        id:1,
        name:'待提交'
      },
      {
        id:2,
        name:'待发货'
      },
      {
        id:3,
        name:'待收货'
      },
      {
        id:4,
        name:'已完成'
      },
      {
        id:5,
        name:'已取消'
      },
    ],
    status:0
  },
  // 确认收货
  confirmReceipt(e){
    let that = this;
    let curr = e.currentTarget.dataset;
    Dialog.confirm({
      title: '确认收货吗？',
    }).then(() => {
      http.postData('/api/orders/confirm', {
        id:curr.id
      }, (res) => {
        if (res.code == 1) {
          wx.showToast({
            icon:'none',
            title: '收货成功',
          })
          that.pullDataList();
        }
  
      })
    });
    
  },
  // 订单状态切换
  tabChange(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    
    that.setData({
      pages:{
        page:1,
        limit:10
      },
      active:id,
      list:[]
    });
    that.pullDataList();
  },
  // 跳转详情
  toDetail(e){
    let curr = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../orderDetail/index?id='+curr.id+'&express_no='+curr.express_no,
    })
  },
  // 查询列表
  pullDataList(){
    let that = this;
    let obj = that.data.pages;
    let active = that.data.active;
    if(active>0){
      obj['status'] = active;
    }
    // 请求商品列表数据
    http.postData('/api/orders/list', obj, (rep) => {
      that.setData({
        list:rep.data.rows,
        total:rep.data.total
      });
    })
  },
  // 导出订单
  outOrder(e){
    let that = this;
    let curr = e.currentTarget.dataset;
    http.postData('/api/orders/export', {
      id:curr.id
    }, (res) => {
      if (res.code == 1) {
        wx.downloadFile({
          url: that.data.domain+res.data,
          success (resp) {
            const tempFilePath = resp.tempFilePath;
            Dialog.confirm({
              confirmButtonText:'预览',
              cancelButtonText:'复制',
              title: '导出文件是否预览？',
            }).then(() => {
              // 保存文件
              wx.saveFile({
                tempFilePath,
                success: function (rep) {
                  const savedFilePath = rep.savedFilePath;
                  // 打开文件
                  wx.openDocument({
                    filePath: savedFilePath,
                    showMenu: true,
                    success: function (result) {
                      
                    },
                  });
                  console.log(savedFilePath);
                  
                },
                fail: function (err) {
                  console.log('保存失败：', err)
                }
              });
            }).catch(err=>{
              // 将下载文件的地址粘贴到剪贴板，提示用户去手动下载
              wx.setClipboardData({
                data: that.data.domain+res.data,
                success: function (r) {
                  wx.showToast({
                    title: '下载地址已粘贴到剪贴板，请前往浏览器下载！',
                    icon: 'none',
                    duration: 2000,
                  });
                }
              })

            });
           
            
          }
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
    let val = op && op.status?op.status:that.data.active;
    // 我的订单状态
    that.setData({
      active:val
    });
    obj['status'] = val;
    http.postData('/api/orders/list', obj, (res) => {
      if(res.code==1){
        that.setData({
          list:res.data.rows,
          total:res.data.total
        });
      }
    })
    
    wx.getStorage({
      key: 'addressVal',
      success (res) {
        that.setData({
          addressVal:res.data
        });
      }
    })
  },
  // 提交订单
  saveOrderHandle(e){
    let that = this;
    let curr = e.currentTarget.dataset;
    http.postData('/api/orders/commit', {
      id:curr.id
    }, (res) => {
      if(res.code==1){
        wx.showToast({
          icon:'none',
          title: '提交成功',
        })
        that.onLoad();
      }
      
    })
  },
  // 取消订单
  cancelOrderHandle(e){
    let that = this;
    let curr = e.currentTarget.dataset;
    http.postData('/api/orders/cancel', {
      id:curr.id
    }, (res) => {
      if(res.code==1){
        wx.showToast({
          icon:'none',
          title: '取消成功',
        })
        that.onLoad();
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
  // 加载更多
  getListData(){
    let that = this;
    let obj = that.data.pages;
    obj.page+=1
    
    // 请求商品列表数据
    http.postData('/api/goods/index', obj, (rep) => {
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
    if(that.data.list.length<that.data.total){
      that.getListData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})