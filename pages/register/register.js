//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
      region:'',
      address:''
  },
  //事件处理函数
  onLoad: function () {
  },
  bindRegionChange: function (e) {
        this.setData({
            region: e.detail.value
        })
    },
    bindAddressChange(e){
        this.setData({
            address: e.detail.value
        })
    },
  validate(formData){
    if(!formData.user_name){
      return {code:'error',msg:"姓名不能为空"}
    }else if(!formData.phone){
        return {code:'error',msg:"手机号不能为空"}
    }
    else if(!(/^1[3456789]\d{9}$/.test(formData.phone))){
      return {code:'error',msg:"请输入正确的手机号"}
    }else if(!formData.price){
      return {code:'error',msg:"期望接单价不能为空"}
    }else if(!formData.region){
      return {code:'error',msg:"接单区域不能为空"}
    }else if(!formData.address){
      return {code:'error',msg:"当前住址不能为空"}
    }else if(!formData.address_detail){
        return {code:'error',msg:"详细住址不能为空"}
    }else if(!formData.skill){
        return {code:'error',msg:"安装能力不能为空"}
    }else{
      return {code:'ok'}
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
      phone:formData.phone,
      accept_area:formData.region,
      current_address:formData.address,
      detail_address:formData.address_detail,
      name:formData.user_name,
      accept_fee:formData.price,
      remark:formData.skill
    }
    wx.showLoading({
      title: '提交资料中'
    })
    wx.request({
      url: `${url}/site/apply`,
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data,
      success:result=>{
        wx.hideLoading()
        let res = result.data
        if(res.status == '200'){
          wx.showToast({
            title:"提交成功,客服将在1-3个工作日内与您联系",
            icon:"none"
          })
          setTimeout(()=>{
            wx.redirectTo({
              url: '/pages/login/login'
            })
          },1500)
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
