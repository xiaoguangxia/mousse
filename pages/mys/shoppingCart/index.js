// pages/mys/shoppingCart/index.js
const app = getApp();
import Dialog from '@vant/weapp/dialog/dialog';
let http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    checkAll:false,
    // 选中的数量
    count:0,
    // 分页
    pages:{
      page:1,
      limit:10
    },
    // 总条数
    total:null,
    // 数据数组
    list:[],
    // 合计
    totalPrice:0,
    // 编辑状态
    editBool:false
  },
  // 删除
  delOrder(){
    let that = this;
    Dialog.confirm({
      title: '确认删除吗？',
    }).then(() => {
      let list = that.data.list;
      let arr = [];
      list.forEach((item,index)=>{
        if(item.bool){
          arr.push(item.id);
        }
      });
      http.postData('/api/cart/del', {
        ids:arr.join(',')
      }, (res) => {
        if (res.code == 1) {
          wx.showToast({
            icon:'none',
            title: '删除成功',
          })
          that.setData({
            list:[]
          });
          that.onShow();
        }
  
      })
    });
  },
  // 导出清单
  outOrder(){
    let that = this;
    let list = that.data.list;
    let ids = [];
    list.map(item=>{
      if(item.bool){
        ids.push(item.id);
      }
    });
    // 判断是否选择商品
    if(ids.length==0){
      wx.showToast({
        icon:'none',
        title: '请先选择商品',
      })
      return
    }
    http.postData('/api/cart/export', {
      ids:ids.join(',')
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
  // 提交订单
  toSaveOrder(){
    let that = this;
    let list = that.data.list;
    let array = [];
    list.map(item=>{
      if(item.bool){
        array.push(item);
      }
    });
    // 判断是否选择商品
    if(array.length==0){
      wx.showToast({
        icon:'none',
        title: '请先选择商品',
      })
      return
    }
    wx.setStorage({
      key:"shopCart",
      data:array,
      success:()=>{
        wx.navigateTo({
          url: '../orderSave/index'
        })
      }
    })
    
  },
  // 编辑我的购物车
  editShopCart(){
    let that = this;
    that.setData({
      editBool:!that.data.editBool
    });
  },
  // 全选触发
  checkAllChange(e){
    let that = this;
    let list = that.data.list;
    let totalPrice = 0;
    // 全选
    let count = 0;
    if(e.detail){
      list.map((w,i)=>{
        w['bool'] = true;
        totalPrice = totalPrice+((w.goods.saleswitch==1?w.goods.sale_price:w.goods.price) * w.goods_num);
        count++;
      });
    }else{
      list.map((w,i)=>{
        w['bool'] = false;
      });
    }
    
    that.setData({
      count,
      list,
      totalPrice,
      checkAll:e.detail
    });
  },
  // 添加数量
  addNum(e){
    let that = this;
    let curr = e.currentTarget.dataset;
    let list = that.data.list;

    list[curr.index].goods_num = list[curr.index].goods_num + 1;
    let totalPrice = 0;
    list[curr.index]['bool'] = e.detail;
    // 全选
    let count = 0;
    list.map((w,i)=>{
      if(w.bool){
        totalPrice = totalPrice+((w.goods.saleswitch==1?w.goods.sale_price:w.goods.price) * w.goods_num);
        count++;
      }
    });
    that.setData({
      count,
      totalPrice,
      list
    });
    // 改变数量提交购物车接口
    http.postData('/api/cart/edit', {
      id:curr.id,
      goods_num:list[curr.index].goods_num,
      goods_sku:curr.item.goods_sku,
    }, (res) => {
      if (res.code == 1) {
        wx.showToast({
          icon:'none',
          title: '数量增加成功',
        })
      }

    })
    
  },
  // 减少数量
  removeNum(e){
    let that = this;
    let curr = e.currentTarget.dataset;
    let list = that.data.list;
    if(list[curr.index].goods_num==1){
      return
    }
    list[curr.index].goods_num = list[curr.index].goods_num - 1;
    let totalPrice = 0;
    list[curr.index]['bool'] = e.detail;
    // 全选
    let count = 0;
    list.map((w,i)=>{
      if(w.bool){
        totalPrice = totalPrice+((w.goods.saleswitch==1?w.goods.sale_price:w.goods.price) * w.goods_num);
        count++;
      }
    });
    that.setData({
      totalPrice,
      count,
      list
    });
    // 改变数量提交购物车接口
    http.postData('/api/cart/edit', {
      id:curr.id,
      goods_num:list[curr.index].goods_num,
      goods_sku:curr.item.goods_sku,
    }, (res) => {
      if (res.code == 1) {
        wx.showToast({
          icon:'none',
          title: '数量减少成功',
        })
      }

    })
  },
  // 改变复选触发
  checkChange(e){
    let that = this;
    let curr = e.currentTarget.dataset;
    let list = that.data.list;
    let totalPrice = 0;
    // 设置点击商品选中状态
    list[curr.index]['bool'] = e.detail;
    // 全选
    let count = 0;
    list.map((w,i)=>{
      if(w.bool){
        totalPrice = totalPrice+((w.goods.saleswitch==1?w.goods.sale_price:w.goods.price) * w.goods_num);
        count++;
      }
    });
    that.setData({
      count,
      list,
      checkAll:count==list.length,
      totalPrice
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (op) {
    let that = this;
    
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
    that.setData({
      checkAll:false,
      totalPrice:0,
      total:0,
      count:0
    });
    let pages = that.data.pages;
    http.postData('/api/cart/list', pages, (res) => {
      if (res.code == 1) {
        that.setData({
          list: res.data.rows,
          total:res.data.total
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
  // 加载更多
  getListData(){
    let that = this;
    let obj = that.data.pages;
    obj.page+=1
    // 请求商品列表数据
    http.postData('/api/cart/list', obj, (rep) => {
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