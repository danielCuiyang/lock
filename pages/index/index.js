//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    list: [
        {
        name:"待预约",
        url:"/pages/list/list?id=2",
        num:0,
        src:"../../images/icon01.png",
        id:1
        },
        {
            name:"待安装",
            url:"/pages/list/list?id=3",
            num:0,
            src:"../../images/icon02.png",
            id:2
        },
        {
            name:"有异常",
            url:"/pages/list/list?id=999",
            num:0,
            src:"../../images/icon03.png",
            id:3
        },
        {
            name:"已完工",
            url:"/pages/list/list?id=4",
            num:0,
            src:"../../images/icon04.png",
            id:4
        },
        {
            name:"已结算",
            url:"/pages/list/list?id=5",
            num:0,
            src:"../../images/icon05.png",
            id:5
        }
    ],
    total:{
      totalFee:"0",
      monthFee:"0",
      ticketCount:'0',
    },
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数
  loginOut: function() {
    wx.showActionSheet({
      itemList: ["退出登录"],
      success(res){
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    })
  },
  getData(){
    wx.showLoading({
      title:"加载中",
      mask:true
    })
    let url = app.globalData.url
    let openid = app.globalData.openid
    let list = this.data.list
    let total = this.data.total
    wx.request({
      url: `${url}/site/total?openid=${openid}`,
      success:result=>{
        wx.hideLoading()
        let res = result.data.data
        if(result.data.status == 200){
          let statusTotal = res.statusTotal
          total.totalFee = res.totalFee
          total.monthFee = res.monthFee
          total.ticketCount = res.ticketCount
          this.setData({
            'list[0].num':statusTotal[2].total,
            'list[1].num':statusTotal[3].total,
            'list[2].num':statusTotal[999].total,
            'list[3].num':statusTotal[4].total,
            'list[4].num':statusTotal[5].total,
            total
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
  onLoad: function () {
    var that = this
    if(app.globalData.openid){
      if(app.globalData.islogin){
        this.getData()
      }
   }else{
    app.login().then((res)=>{
      if(app.globalData.islogin){
        this.getData()
      }
    })
   }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow(){
    if(app.globalData.openid){
      this.getData()
    }
  },
  navigatorListFun(e){
    let url = e.currentTarget.dataset.url
    if(app.globalData.islogin){
      wx.navigateTo({
        url: url
      })
    }else{
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
