// pages/pleaseds/add_pleased/index.js
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
    // 已选商品总价
    totalPrice:0,
    // 风格
    styleBool:false,
    styleList:[],
    // 选择商品值
    standardsList:[],
    // 编辑时方案值
    pleasedObj:{},
    // 选中的风格值
    styList:[],
    // 方案
    planBool:false,
    planList:[],
    // 方案空间idlist
    planIds:[],
    // 方案添加更多商品
    addGoodsBool:false,
    // 商品筛选条件
    goodOption:{},
    // 提交方案
    savePlanBool:false,
    // 选择规格值
    checkSpec:[],
    // 分页
    pages:{
      page:1,
      limit:10
    },
    // 总条数
    total:null,
    list:[]
  },
  // 接受子组件规格确认参数
  saveShopping(e){
    let that = this;
    // 获取列表数组数据
    let goodsObj = that.data.goodsObj;
    let arr = [];
    // 判断是否是多规格，是则取第一个
    // 判断是否是多规格
    // if(goodsObj.skuswitch == 1 && goodsObj.sku_list && goodsObj.sku_list!=''){
    //   let list = JSON.parse(goodsObj.sku_list)?JSON.parse(goodsObj.sku_list):[];
    //   goodsObj['sku'] = list[0].value.join(',');
    // }else{
      goodsObj['sku'] = e.detail.checkSpec.join(',');
    // }

    goodsObj['num'] = e.detail.num;
    arr.push(goodsObj);
    that.setData({
      addShoppingBool:false,
      planBool:true,
      standardsList:[...that.data.standardsList,...arr],
      checkSpec:e.detail.checkSpec
    });
  },
  // 接受规格子组件关闭传值
  closeShopping(e){
    let that = this;
    that.setData({
      addShoppingBool:e.detail
    });
  },
  // 创建方案
  addFangan(e){
    let that = this;
    // 风格styList
    // 已选商品planIds
    let detail = e.detail;
    let obj = {
      name:detail.faname,
      image:detail.fmtLink,
      idea:detail.lnVal,
      style_ids:that.data.styList.join(',')
    };
    let msg = '创建成功';
    // 判断是编辑还是新建
    if(that.data.pleasedObj.id){
      obj['id'] = that.data.pleasedObj.id;
      msg = '修改成功'
    }
    
    let arr = [];
    that.data.planIds.forEach((item,index)=>{
      arr.push({
        goods_id:item.goods_id?item.goods_id:item.id,
        name:item.name,
        image:item.image,
        price:item.price,
        fname:item.fname,
        style_ids:item.style_ids,
        space_pid:item.space_pid,
        spec_list:item.spec_list,
        sku_list:item.sku_list,
        skuswitch:item.skuswitch,
        saleswitch:item.saleswitch,
        sale_price:item.sale_price,
        sale_start_time:item.sale_start_time,
        sale_end_time:item.sale_end_time,
        num:item.num
      });
      // 判断是否是多规格
      if(item.skuswitch && item.skuswitch==1){
        let skuobj = JSON.parse(item.sku_list)?JSON.parse(item.sku_list):[];
        arr[index]['sku'] = skuobj[0].value.join(',');
      }else{
        arr[index]['sku'] = item.sku;
      }
    })
    obj['goods'] = String(JSON.stringify(arr));
    
    //创建方案
    http.postData('/api/project/add', obj, (res) => {
      // 
      if(res.code==1){
        wx.showToast({
          icon:'none',
          title:msg,
        })
        that.setData({
          savePlanBool:false,
          pleasedObj:{}
        });

        that.onLoad();
      }
    })
  },
  // 编辑方案
  editPleased(e){
    let that = this;
    let item = e.currentTarget.dataset.item;
    let obj = {};
    // 获取空间数据
    http.postData('/api/category/list', {
      pid:0,
      type:'space'
    }, (res) => {
      // 
      if(res.data && res.code==1){
        let pleasedObj = that.data.pleasedObj;
        pleasedObj['id'] = item.id;
        pleasedObj['pleaname'] = item.name;
        pleasedObj['idea'] = item.idea;
        pleasedObj['pleaimage'] = item.image;
        obj['standardsList'] = JSON.parse(item.goods)?JSON.parse(item.goods):[];
        obj['pleasedObj'] = pleasedObj;
        obj['planList'] = res.data;
        obj['planBool'] = true;
        obj['styList'] = item.style_ids.split(',');
        console.log(item);
        
        that.setData(obj);
      }
    })
    
  },
  // 商品加入方案
  saveFaHandle(e){
    let that = this;
    
    let obj = {
      addGoodsBool:false
    };
    // 判断是否是套餐商品
    if(e.detail.skuswitch==0){
      obj['standardsList'] = [...that.data.standardsList,e.detail];
    }
    if(e.detail.pleasedG && e.detail.pleasedG==1){
      obj['goodsObj'] = e.detail;
      if(e.detail.skuswitch==1){
        obj['addShoppingBool'] = true;
      }else{
        obj['planBool'] = true;
      }
      
      
    }else{
      obj['planBool'] = true;
    }
    that.setData(obj);
  },
  // 方案创建取消
  closeFun(e){
    let that = this;
    that.setData({
      savePlanBool:e.detail,
      planBool:!e.detail
    });
  },
  // 点击方案添加商品
  addGoodsHandle(e){
    let that = this;
    // 获取二级空间数据
    http.postData('/api/category/list', {
      pid:e.detail.id,
      type:'space'
    }, (res) => {
      // 
      if(res.data && res.code==1){
        that.setData({
          planBool:false,
          addGoodsBool:true,
          goodOption:e.detail,
          spaceList:res.data
        });
      }
    })
    
  },
  // 关闭添加商品到方案弹窗
  closeHandle(e){
    let that = this;
    
    that.setData({
      addGoodsBool:e.detail,
      planBool:!e.detail
    });
  },
  // 接受子组件方案提交参数
  savePlanHandle(e){
    let that = this;
    console.log(e);
    that.setData({
      planBool:false,
      savePlanBool:true,
      planIds:e.detail
    });
  },
  // 接受子组件风格提交参数
  saveStyleHandle(e){
    let that = this;
    // 获取空间数据
    http.postData('/api/category/list', {
      pid:0,
      type:'space'
    }, (res) => {
      // 
      if(res.data && res.code==1){
        that.setData({
          styleBool:false,
          planBool:true,
          planList:res.data,
          styList:e.detail
        });
      }
    })
    
  },

  // 接受风格子组件传值
  closeStyle(e){
    let that = this;
    that.setData({
      styleBool:e.detail
    });
  },
  // 添加方案
  doAddPleaHandle(e){
    let that = this;
    // 获取风格数据
    http.postData('/api/category/list', {
      pid:0,
      type:'style'
    }, (res) => {
      // 
      if(res.code && res.code==1){
        that.setData({
          styleList:res.data,
          styleBool:true
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that  =this;
    let obj = that.data.pages;
    // 查询自已创建的方案
    obj['type'] = 'my';
    // 请求方案列表接口
    http.postData('/api/project/list', {
      ...obj
    }, (res) => {
      // 显示弹窗广告
      if(res.data.rows && res.data.rows.length>0){
        that.setData({
          list:res.data.rows,
          total:res.data.total
        });
      }
    })
  },
  // 删除方案
  delPleased(e){
    let that = this;
    let curr = e.currentTarget.dataset;
    Dialog.confirm({
      title: '确认删除吗？',
    }).then(() => {
      http.postData('/api/project/del', {
        ids:curr.id
      }, (res) => {
        // 显示弹窗广告
        if(res.code==1){
          let list = that.data.list;
          list.splice(curr.index,1);
          that.setData({
            list
          });
          wx.showToast({
            icon:'none',
            title: '删除成功！',
          })
        }
      })
    });
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
    // 查询自已创建的方案
    obj['type'] = 'my';
    obj.page+=1
    // 请求商品列表数据
    http.postData('/api/project/list', obj, (rep) => {
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