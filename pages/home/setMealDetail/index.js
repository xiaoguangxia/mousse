// pages/home/setMealDetail/index.js
import poster from '../../../miniprogram_npm/wxa-plugin-canvas/poster/poster';
let http = require('../../../utils/request.js');
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
    setMealObj:{},
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
    // 风格
    styleBool:false,
    styleList:[],
    // 选择规格值
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
    // 方案属性  名称、理念、封面图
    fanganObj:{}
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
      // 判断是否是套餐商品
      if(item.skuswitch && item.skuswitch==1){
        let skuobj = JSON.parse(item.sku_list)?JSON.parse(item.sku_list):[];
        arr[index]['sku'] = skuobj[0].value.join(',');
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
  closePosterPop(){
    let that = this;
    that.setData({
      posterBool:false
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
  // 接受子组件规格确认参数
  saveShopping(e){
    let that = this;
    that.setData({
      styleBool:e.detail
    });
  },
  // 接受风格子组件传值
  closeStyle(e){
    let that = this;
    that.setData({
      styleBool:e.detail
    });
  },
  // 一键九宫格
  tojiuHandle(){
    let that = this;
    wx.navigateTo({
      url: '../goodsSquared/index?id='+that.data.setMealObj.id+'&type=meal',
    })
  },
  // 保存图片到相册
  saveImage() {
    var that = this;
    wx.showLoading({
      title: '保存中..',
    })
    if( that.data.posterLink){
    // wx.downloadFile({
    //     url: that.data.posterLink,
    //     success: function (res) {
            wx.saveImageToPhotosAlbum({
                filePath: that.data.posterLink, // 此为图片路径
                success: (res) => {
                    
                    wx.hideLoading('保存成功，请到相册中查看');                    
                },
                fail: (err) => {
                    wx.hideLoading('保存失败，请稍后重试');
                }
            })
    //     }
    // })
    }
  },
  // 生成海报
  onCreatePoster: function () {
    let that = this;
    that.creatArticlePoster();

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
  // 加入方案
  saveFa(e){
    let that = this;
    // 获取列表数组数据
    let goods = that.data.setMealObj.goods;
    let arr = [];
    goods.forEach((item,index)=>{
      if(item.list && item.list.length>0){
        item.list.forEach(w=>{
          // 判断规格参数是否为空
          if(w.bool){
            w['fname'] = item.name;
            // 判断是否是多规格
            if(w.skuswitch == 1 && w.sku_list && w.sku_list!=''){
              let list = JSON.parse(w.sku_list)?JSON.parse(w.sku_list):[];
              w['sku'] = w['sku']?w['sku']+list[0].value.join(','):list[0].value.join(',');
            }
            arr.push(w);
          }
          
        })
      }
    })
    // 判断是否选择商品
    if(arr.length==0){
      wx.showToast({
        icon:'none',
        title: '请选择套餐商品！',
      })
      return
    }
    // 获取风格数据
    http.postData('/api/category/list', {
      pid:0,
      type:'style'
    }, (res) => {
      // 
      if(res.code && res.code==1){
        that.setData({
          styleList:res.data,
          styleBool:true,
          standardsList:arr
        });
      }
    })
  },
  // 加入购物车
  saveGwc(e){
    let that = this;
    // 加入购物车接口
    http.postData('/api/package/add_cart', {
      id:that.data.setMealObj.id
    }, (res) => {
      // 
      if(res.code==1){
        wx.showToast({
          title: '加入购物车成功！',
          icon:'none',
          duration: 2000
        })
      }
    })
  },
  // 生成海报失败
  onPosterFail(e){
    wx.showToast({
      title: '生成海报失败！',
      icon:'none',
      duration: 2000
    })
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
    let share_text = that.data.setMealObj.share_text?that.data.setMealObj.share_text.substring(0, 36):'';
    share_text = that.data.setMealObj.share_text.length>36?share_text+'...':that.data.setMealObj.share_text;
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
        text: '￥'+that.data.setMealObj.total_price,
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
      id:that.data.setMealObj.id
    }, (res) => {
      // 
      if(res.data){
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
  //  收藏/取消收藏
  collectHandle(e){
    let that = this;
    http.postData('/api/favorites/add', {
      id:that.data.setMealObj.id,
      type:'package'
    },(res) => {
      // 
      if(res.code==1){
        let setObj = that.data.setMealObj;
        if(that.data.setMealObj.is_favorites==0){
          setObj.is_favorites = 1;
          that.setData({
            setMealObj:setObj
          });
          wx.showToast({
            icon:'none',
            title: '收藏成功！',
          })
        }else{
          setObj.is_favorites = 0;
          that.setData({
            setMealObj:setObj
          });
          wx.showToast({
            icon:'none',
            title: '取消收藏！',
          })
        }
        
      }
    })

  },
  // 套餐复选改变触发
  checkboxChange(e){
    let that = this;
    // 获取下标
    let idx = e.currentTarget.dataset.idx;
    // 获取选中商品/套餐价格
    let money = e.currentTarget.dataset.money;
    // 获取总价
    let totalPrice = that.data.total;
    // 获取改变之后的值
    let val = e.detail;
    // 获取列表数组数据
    let goods = that.data.setMealObj.goods;
    // 获取空间下的商品，判断是否是单个商品
    let cd = e.currentTarget.dataset.cd;
    // 获取父级下标
    let fidx = e.currentTarget.dataset.fidx;
    if(cd){
      if(val){
        goods[fidx].list[idx]['bool'] = true;
        // 存储价格
        totalPrice+=parseFloat(money);
     }else{
      goods[fidx].list[idx]['bool'] = false;
      // 删除指定下标元素
      totalPrice-=parseFloat(money);
      //判断是否取消选择当前套餐所有商品
      let bool = false;
      if(goods[fidx].list && goods[fidx].list.length>0){
        
        goods[fidx].list.forEach((fitem,fidx)=>{
          if(fitem.bool){
            bool = true;
          }
        })
      }
      goods[fidx]['bool'] = bool;
     }
    }else{
      if(val){
        goods[idx]['bool'] = true;
        // 存储价格
        totalPrice+=parseFloat(money);
     }else{
      goods[idx]['bool'] = false;
       // 删除指定下标元素
       totalPrice-=parseFloat(money);
     }
    }
    
    let total = 0;
    let selectkj = 0;
    let num = 0;
    goods.map(v=>{
      
      if(cd){
        if(v.list.length>0){
          
          v.list.map(li=>{
            if(li.bool){
              num+=1;
            }
          });
          if(v.list.length==num){
            goods[fidx]['bool'] = true;
          }
        }
      }else{
        if(v.bool){
          if(v.list.length>0){
            v.list.map(li=>{
              li.bool = true;
            });
          }
        }else{
          if(v.list.length>0){
            v.list.map(li=>{
              li.bool = false;
            });
          }
        }
        
      }
      // 判断选中几个空间
      if(v.bool){
        selectkj+=1;
      }
      
    });
    that.setData({
      ['setMealObj.goods']: goods,
      selectkj,
      total:totalPrice<0?0:totalPrice
    });
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.id){
      // 请求后台套餐详情接口
      http.postData('/api/package/info', {
        id:options.id
      }, (res) => {
        // 
        if(res.data){
          let arr = res.data.images.split(',');
          that.setData({
            setMealObj:res.data,
            background:arr
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
  onShareAppMessage: function () {

  }
})