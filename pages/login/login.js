//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    src:'http://wws.zhaoxiaoqiang.com/site/code',
    icon:"../../images/icon11.png",
    type:'password',
  },
  //事件处理函数
  onLoad: function () {
  },
  goto(){
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },
  validate(formData){
    if(!formData.account){
      return {code:'error',msg:"账号不能为空"}
    }else if(!(/^1[3456789]\d{9}$/.test(formData.account))){
      return {code:'error',msg:"请输入正确的手机号"}
    }else if(!formData.password){
      return {code:'error',msg:"密码不能为空"}
    }else if(!formData.code){
      return {code:'error',msg:"验证码不能为空"}
    }else{
      return {code:'ok'}
    }
  },
  refreshCode(){
    var arg = Math.random();
    let src = `http://wws.zhaoxiaoqiang.com/site/code?id=${arg}`
    this.setData({
      src
    })
  },
  watchPwd(){
    let type = this.data.type
    if(type== "password"){
      this.setData({
        type:"text",
        icon:"../../images/icon12.png"
      })
    }else{
      this.setData({
        type:"password",
        icon:"../../images/icon11.png"
      })
    }
  },
  formSubmit: function(e) {
    let formData =  e.detail.value
    let res = this.validate(formData)
    let url = app.globalData.url
    let openid = app.globalData.openid
    if(res.code == 'error'){
      wx.showToast({
        title:res.msg,
        icon: 'none',
      })
      return
    }
    let data = {
      phone:formData.account,
      password:formData.password,
      code:formData.code,
      openid
    }
    wx.showLoading({
      title: '登录中'
    })
    wx.request({
      url: `${url}/wechat/bind`,
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data,
      success:result=>{
        wx.hideLoading()
        let res = result.data
        if(res.status == '200'){
          wx.redirectTo({
            url: '/pages/index/index'
          })
        }else{
          wx.showToast({
            title:res.info,
            icon:"none"
          })
        }
      },
      fail(error){
        wx.hideLoading()
        wx.showToast({
          title:"服务器繁忙",
          icon:"none"
        })
      }
    })  
  },
})
