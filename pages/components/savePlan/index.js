// 自定义规格组件
// 提交方案
const app = getApp();
Component({
  // 接受父组件传参
  properties: {
    // 父组件传过来的值
    // 编辑时传参
    pleasedObj:{
      type:Object,
      value: {},
      observer: function (newVal,oldVal){
        let that = this;
        let obj = {
          // 方案名称
          faname:newVal.pleaname,
          // 搭配理念
          lnVal:newVal.idea,
          // 封面图
          fmtLink:newVal.pleaimage
        };
        that.setData(obj);
      }
    }
  },
  data: {
    domain:app.globalData.http,
    wLink:app.globalData.httpImgUrl,
    // 方案名称
    faname:'',
    // 搭配理念
    lnVal:'',
    // 封面图
    fmtLink:''
  },
  
  methods: {
    // input输入触发
    inputChange(e){
      let that = this;
      let type = e.currentTarget.dataset.type;
      let value = e.detail.value;
      let obj = {};
      obj[type] = value;
      that.setData(obj);
    },
    // 返回方案
    closeHandle(){
      let that = this;
      that.triggerEvent('closeHandle',false);
    },
    //提交方案创建
    cfmClick(){
      let that = this;
      let d = that.data;
      if(d.faname =='' || d.lnVal=='' ){
        wx.showToast({
          icon:'none',
          title: '请先填写数据！',
        })
        return
      }
      if(d.fmtLink==''){
        wx.showToast({
          icon:'none',
          title: '请先上传封面图',
        })
        return
      }
      // 创建方案
      that.triggerEvent('addFangan',{
        faname:d.faname,
        fmtLink:d.fmtLink,
        lnVal:d.lnVal
      });
    },
    // 预览图片
    previewImg (e) {
      let that = this;
      wx.previewImage({
        //当前显示图片
        current: domain+that.data.fmtLink,
        urls:[domain+that.data.fmtLink]
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
                      that.setData({
                        fmtLink:data.data.url.replace(/\\/g,"")
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
  }
})