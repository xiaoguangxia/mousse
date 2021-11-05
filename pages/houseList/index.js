// pages/houses/list/index.js
const app = getApp();
let http = require('../../utils/request.js');
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
    
    // 总条数
    total:null,
    // 打分类
    tabMenuArr:[],
    // 小分类
    chilType:[],
    childActive:null,
    // 列表
    list:[],
    // 检索条件
    searObj:{
      keyword:'',
      pid:null
    }
  },
  // 
  tabsChange(e){
    let that = this;
    that.setData({
      pages:{
        page:1,
        limit:10
      },
      active:e.detail.name,
      chilType:[],
      list:[],
      childActive:null,
      keyword:'',
      searObj:{
        pid:e.detail.name
      }
    });
    that.pullDataType();
    that.pullDataList();
  },
  // 二级筛选
  chilSearch(e){
    let that = this;
    let curre = e.currentTarget.dataset;
    that.setData({
      pages:{
        page:1,
        limit:10
      },
      list:[],
      childActive:curre.id==that.data.childActive?null:curre.id,
      keyword:'',
      searObj:{
        id:curre.id,
        pid:curre.id==that.data.searObj.pid?0:curre.id
      }
    });
    that.pullDataList();
  },
  // 查询类型
  pullDataType(){
    let that = this;
    if(that.data.active==0){
      that.setData({
        chilType:[]
      });
    }else{
      // 查询二级
      http.postData('/api/category/list', {
        type:'house',
        pid:that.data.active
      }, (res) => {
        that.setData({
          chilType:res.data
        });
      })
    }
    
  },
  // 查询列表
  pullDataList(){
    let that = this;
    let obj = that.data.pages;
    let searObj = that.data.searObj;
    let keys = Object.keys(searObj);
    keys.map((item,index)=>{
      if(searObj[item]){
        obj[item] = searObj[item];
      }
    });
    if(that.data.keyword !=''){
      obj['keyword'] = that.data.keyword;
    }else{
      delete obj.keyword
    }
    console.log(obj);
    // 请求商品列表数据
    http.postData('/api/category/house', obj, (rep) => {
      that.setData({
        list:rep.data.rows,
        total:rep.data.total
      });
    })
  },
  // 搜索输入触发
  inpchange(e){
    let that = this;
    let keyword = e.detail.value;
    that.setData({
      keyword
    });
  },
  // 跳转到户型库详情
  toHouseDetail(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../house/detail/index?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
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
    let obj = that.data.pages;
    obj['pid'] = 0;
    // 请求户型列表数据
    http.postData('/api/category/list', {
      type:'house',
      pid:0
    }, (rep) => {
      that.setData({
        tabMenuArr:[{
          id:0,
          name:'全部'
        },...rep.data]
      });
      // // 查询二级
      // if(rep.data.length>0){
      //   http.postData('/api/category/list', {
      //     type:'house',
      //     pid:rep.data[0].id
      //   }, (res) => {
      //     that.setData({
      //       chilType:res.data
      //     });
      //   })
      // }
      // tab数据返回后对tab重绘
      that.selectComponent('#tabs').resize();
    })
    // 查询户型列表
    http.postData('/api/category/house', obj, (res) => {
      if(res.code==1){
        that.setData({
          list:res.data.rows,
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
    let searObj = that.data.searObj;
    obj.page+=1
    let keys = Object.keys(searObj);
    keys.map((item,index)=>{
      if(searObj[item]){
        obj[item] = searObj[item];
      }
    });
    // 请求商品列表数据
    http.postData('/api/category/house', obj, (rep) => {
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