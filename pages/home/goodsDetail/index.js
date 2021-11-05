// pages/home/setMealDetail/index.js
import poster from '../../../miniprogram_npm/wxa-plugin-canvas/poster/poster';
let http = require('../../../utils/request.js');
let util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    background: [],
    // 套餐详情
    goodsObj:{},
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    currentSwiper:0,
    // 套餐合计价格
    total:0,
    // 已选空间
    selectkj:0,
    // 已选商品总价
    totalPrice:0,
    // 海报配置
    posterConfig:{},
    // 海报弹出
    posterBool:false,
    // 生成海报的地址
    posterLink:'',
    // 假如购物车or方案
    addShoppingBool:false,
    // 风格
    styleBool:false,
    styleList:[],
    // 选择商品值
    standardsList:[],
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
    // 特价倒计时
    time:0,
    timeData: {},
    // 加入购物车
    addGwcBool:false
  },
  // 倒计时改变触发
  djsChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  // 接受子组件规格确认参数
  saveShopping(e){
    let that = this;
    // 获取列表数组数据
    let goodsObj = that.data.goodsObj;
    let arr = [];
    goodsObj['sku'] = e.detail.checkSpec.join(',');

    
    goodsObj['price'] = e.detail.price;
    goodsObj['num'] = e.detail.num;
    arr.push(goodsObj);
    // 判断是否是加入购物车选择规格
    if(that.data.addGwcBool){
      that.setData({
        addShoppingBool:false,
        standardsList:arr
      });
      that.submitGwc();
    }else{
      // 获取风格数据
      http.postData('/api/category/list', {
        pid:0,
        type:'style'
      }, (res) => {
        // 
        if(res.code && res.code==1){
          that.setData({
            styleList:res.data,
            addShoppingBool:false,
            styleBool:true,
            checkSpec:e.detail.checkSpec,
            standardsList:arr
          });
        }
      })
    }
    
  },
  // 跳转购物车
  toGwcView(){
    wx.navigateTo({
      url: '../../mys/shoppingCart/index',
    })
  },
  // 接受规格子组件关闭传值
  closeShopping(e){
    let that = this;
    that.setData({
      addGwcBool:false,
      addShoppingBool:e.detail
    });
  },
  // 提交购物车
  submitGwc(){
    let that = this;
    let obj = that.data.standardsList[0];
    // 加入购物车接口
    http.postData('/api/cart/add', {
      goods_id:obj.id,
      goods_num:obj.num,
      goods_sku:obj.sku
    }, (res) => {
      // 
      if(res.code==1){
        wx.showToast({
          title: '加入购物车成功！',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          addGwcBool:false
        });
      }
    })
  },
  // 加入购物车
  saveGwc(e){
    let that = this;
    // 显示规格参数
    that.setData({
      addShoppingBool:true,
      addGwcBool:true
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
    let arr = [];
    that.data.planIds.forEach((item,index)=>{
      arr.push({
        goods_id:item.id,
        name:item.name,
        image:item.image,
        saleswitch:item.saleswitch,
        sale_price:item.sale_price,
        price:(item.saleswitch==1?item.sale_price:item.price),
        space_pid:item.space_pid,
        num:item.num
      });
      // 判断是否是多规格
      if(!item.skuswitch && item.skuswitch==1){
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
          title: '创建成功',
        })
        that.setData({
          savePlanBool:false
        });
      }
    })
  },
  // 商品加入方案
  saveFaHandle(e){
    let that = this;
    that.setData({
      addGoodsBool:false,
      // planBool:true,
      standardsList:[...that.data.standardsList,e.detail]
    });
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
          // planBool:false,
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
    console.log(e.detail);
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
  // 跳转商品详情（搭配推荐）
  toGoodsDet(e){
    let that = this;
    let curr = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../../home/goodsDetail/index?id='+curr.id,
    })
  },

  // 接受风格子组件传值
  closeStyle(e){
    let that = this;
    that.setData({
      styleBool:e.detail
    });
  },
  //  选择商品规格参数
  addShopping(e){
    let that = this;
    that.setData({
      addShoppingBool:true
    });
  },
  // 一键九宫格
  tojiuHandle(){
    let that = this;
    wx.navigateTo({
      url: '../goodsSquared/index?id='+that.data.goodsObj.id+'&type=goods',
    })
  },
  // 保存图片到相册
  saveImage() {
    let that = this;
    wx.showLoading({
      title: '保存中..',
    })
    if( that.data.posterLink){
      // wx.downloadFile({
      //   url: that.data.posterLink,
      //   success: function (res) {
            wx.saveImageToPhotosAlbum({
                filePath: that.data.posterLink, // 此为图片路径
                success: (res) => {
                    console.log(res)
                    wx.hideLoading('保存成功，请到相册中查看');                    
                },
                fail: (err) => {
                    console.log(err)
                    wx.hideLoading('保存失败，请稍后重试');
                }
            })
    //     }
    //   })
    }
    
  },
  //  收藏/取消收藏
  collectHandle(e){
    let that = this;
    http.postData('/api/favorites/add', {
      id:that.data.goodsObj.id,
      type:'goods'
    },(res) => {
      // 
      if(res.code==1){
        let setObj = that.data.goodsObj;
        if(that.data.goodsObj.is_favorites==0){
          setObj.is_favorites = 1;
          that.setData({
            goodsObj:setObj
          });
          wx.showToast({
            icon:'none',
            title: '收藏成功！',
          })
        }else{
          setObj.is_favorites = 0;
          that.setData({
            goodsObj:setObj
          });
          wx.showToast({
            title: '取消收藏！',
          })
        }
        
      }
    })

  },
  // 轮播图切换触发
  swiperChange: function(e) {
    let {current, source} = e.detail;
    if(source === 'autoplay' || source === 'touch') {
      //根据官方 source 来进行判断swiper的change事件是通过什么来触发的，autoplay是自动轮播。touch是用户手动滑动。其他的就是未知问题。抖动问题主要由于未知问题引起的，所以做了限制，只有在自动轮播和用户主动触发才去改变current值，达到规避了抖动bug
      this.setData({
        currentSwiper: current
      })
    }
  },
  // 生成海报
  onCreatePoster: function () {
    let that = this;
    that.creatArticlePoster();

  },
  closePosterPop(){
    let that = this;
    that.setData({
      posterBool:false
    });
  },
  // 生成海报成功
  onPosterSuccess(e){
    let that = this;
    const { detail } = e;
    that.setData({
      posterLink:detail,
      posterBool:true
    });
  },
  // 生成海报失败
  onPosterFail(e){
    
  },
  // 创建海报
  creatArticlePoster() {
    let that = this;
    // 小程序码
    let wxQrcode = '';
    
    // 创建海报所需数据
    let posterConfig = {
      width: 604,
      height: 954,
      backgroundColor: '#fff',
      debug: false
    }
    // 分享文案
    let share_text = that.data.goodsObj.share_text?that.data.goodsObj.share_text.substring(0, 36):'';
    share_text = that.data.goodsObj.share_text.length>36?share_text+'...':share_text;
    let texts = [
      {
        x: 30,
        y: 660,
        text: share_text,
        fontSize: 24,
        lineHeight:36,
        color: '#141414',
        width: 520,
        lineNum: 2
      },
      {
        x: 32,
        y: 745,
        text: '￥'+that.data.goodsObj.saleswitch==1?that.data.goodsObj.sale_price:that.data.goodsObj.price,
        fontSize: 30,
        color: '#F59359',
        width: 570,
        lineNum: 1
      },
      {
        x: 414,
        y: 890,
        text: '保存海报即可分享',
        fontSize: 20,
        color: '#666666',
        width: 560,
        lineNum: 1
      }
    ];
    // 请求小程序当前页面码
    http.postData('/api/goods/qrcode', {
      id:that.data.goodsObj.id
    }, (res) => {
      // 
      if(res.code==1){
        wxQrcode = res.data;
        let images = [
          {
            width: 604,
            height: 601,
            x: 0,
            y: 0,
            url: '',//海报主图
          },
          {
            width: 122,
            height: 124,
            x: 33,
            y: 765,
            url: '', //海报副图
          }
        ];
        that.data.background.forEach((item,index)=>{
          if(index==0){
            images[index].url = that.data.domain+item;
            images[index+1].url = that.data.domain+item;
          }
          if(index==1){
            images.push({
              width: 122,
              height: 124,
              x: 175,
              y: 765,
              url: that.data.domain+item //海报副图
            });
          }
        });
        // 添加小程序码
        images.push({
          width: 170,
          height: 170,
          x: 404,
          y: 680,
          url: that.data.domain+wxQrcode,//二维码的图
        });
        posterConfig.texts = texts; //海报的文字
        posterConfig.images = images;//海报内的图片
        that.setData({ posterConfig: posterConfig }, () => {
          poster.create(true);    //生成海报图片
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (op) {
    let that = this;
    if(op.id){
      // 请求后台套餐详情接口
      http.postData('/api/goods/info', {
        id:op.id
      }, (res) => {
        let time = 360000;
        // 判断是否是特价商品
        if(res.data.saleswitch == 1){
          // 计算时间戳特价商品
          let start = res.data.sale_start_time;//开始
          let end = res.data.sale_end_time;//结束
          let utc = (end*1000)-Date.now();
          time = utc ;
        }
        if(res.data){
          let arr = res.data.images.split(',');
          let goodsObj = res.data;
          goodsObj.content = util.formatRichText(goodsObj.content);
          that.setData({
            goodsObj:goodsObj,
            background:arr,
            time
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
  onShareAppMessage() {
    let that =this;
    return {
      title: goodsObj.name, // 转发后 所显示的title
      path: 'pages/home/goodsDetail/index', // 相对的路径
      success: (res)=>{    // 成功后要做的事情
        console.log(res.shareTickets[0])
        // console.log
        
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res)=> { 
            that.setData({
              isShow:true
            }) 
            console.log(that.setData.isShow)
            },
          fail: function (res) { console.log(res) },
          complete: function (res) { console.log(res) }
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  }
})