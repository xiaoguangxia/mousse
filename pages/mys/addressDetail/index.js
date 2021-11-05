// pages/mys/addressDetail/index.js
const app = getApp();
let http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    addressObj:{
      consignee:'',
      phone:null,
      province:'',
      city:'',
      area:'',
      address:'',
      default:''
    },
    addressId:null
  },
  //通过微信添加地址
  wxAddress () {
    var that=this;
    wx.chooseAddress({
      success: function (res) {
        that.setData({     
          ['addressObj.province']: res.provinceName,
          ['addressObj.city']: res.cityName,
          ['addressObj.area']: res.countyName,
          ['addressObj.phone']: res.telNumber,
          ['addressObj.consignee']: res.userName,
          ['addressObj.address']: res.provinceName+res.cityName+res.countyName
        });
        // 提交导入地址信息数据
        http.postData('/api/address/add', that.data.addressObj, (rep) => {
          if(rep.code==1){
            wx.showToast({
              icon:'none',
              title: '导入成功',
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
      fail: () => {
        // this.openConfirm()   // 如果获取地址权限失败，弹出确认弹窗，让用户选择是否要打开设置，手动去开权限
      }
    })
  }, 
  // 保存地址
  saveAddress(){
    let that = this;
    let addressObj = that.data.addressObj;
    let myreg=/^[1][3,4,5,7,8,9][0-9]{9}$/;
    let keys = Object.keys(addressObj);
    keys.forEach(w=>{
      if(!addressObj[w]){
        wx.showToast({
          icon:'none',
          title: '信息不能为空',
        })
        return
      }
    });
    if (!myreg.test(addressObj.phone)) {
        wx.showToast({
          title: '手机号不正确',
        })
        return
    }
    let addressId = that.data.addressId;
    let link = '';
    if(addressId){
      addressObj['id'] = addressId;
      link = '/api/address/edit';
    }else{
      link = '/api/address/add';
    }
    // 提交地址信息数据
    http.postData(link, addressObj, (rep) => {
      if(rep.code==1){
        wx.showToast({
          icon:'none',
          title: (addressId?'编辑':'新增')+'成功',
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
  // 改变输入时触发
  texChange(e){
    let that = this;
    let curr = e.currentTarget.dataset;
    let addressObj = that.data.addressObj;
    addressObj[curr.type] = e.detail.value;
    that.setData(addressObj);
  },
  // 选择位置
  selectMap(){
    let that = this;
    wx.chooseLocation({
      success(res) {
        let reg = /.+?(省|市|自治区|自治州|县|区)/g;
        let adList = res.address.match(reg);
        let obj = { 
          province:adList[0],
          city:adList[1],
          area:adList[2]?adList[2]:adList[1],
          address:res.address
        };
        that.setData({
          ['addressObj.province']:obj.province,
          ['addressObj.city']:obj.city,
          ['addressObj.area']:obj.area,
          ['addressObj.address']:obj.address,
        });

      },
      fail(res) {
        console.log(res, '失败回调')
      },
      complete(res) {
        console.log(res, '结束回调')
      }
    })
  },
  // 删除地址
  delAddress(){
    let that = this;
    let addressId = that.data.addressId;
    // 提交地址信息数据
    http.postData('/api/address/del', {
      ids:addressId
    }, (rep) => {
      if(rep.code==1){
        wx.showToast({
          icon:'none',
          title: '删除成功',
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
  // 改变默认地址触发
  checkboxChange(e){
    let that = this;
    console.log(e);
    that.setData({
      ['addressObj.default']:e.detail?1:0
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (op) {
    let that = this;
    let item = JSON.parse(op.item)?JSON.parse(op.item):{};
    let addressObj = that.data.addressObj;
    if(item.id){
      that.setData({
        addressId:item.id,
        ['addressObj.consignee']:item.consignee,
        ['addressObj.phone']:item.phone,
        ['addressObj.province']:item.province,
        ['addressObj.city']:item.city,
        ['addressObj.area']:item.area,
        ['addressObj.address']:item.address,
        ['addressObj.default']:item.default
      });
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