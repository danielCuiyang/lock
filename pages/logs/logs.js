//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
//index.js
//获取应用实例
// const app = getApp()

// Page({
//   data: {
//     userInfo: {},
//     hasUserInfo: false,
//     src:'',
//     list: [
//         {
//         name:"待预约",
//         url:"/pages/appointment/appointment",
//         num:0,
//         src:"../../images/icon01.png"
//         },
//         {
//             name:"待安装",
//             url:"/pages/install/install",
//             num:0,
//             src:"../../images/icon02.png"
//         },
//         {
//             name:"有异常",
//             url:"/pages/anomalous/anomalous",
//             num:0,
//             src:"../../images/icon03.png"
//         },
//         {
//             name:"已完工",
//             url:"/pages/complete/complete",
//             num:0,
//             src:"../../images/icon04.png"
//         },
//         {
//             name:"已结算",
//             url:"/pages/settlement/settlement",
//             num:0,
//             src:"../../images/icon05.png"
//         }
//     ],
//     canIUse: wx.canIUse('button.open-type.getUserInfo'),
//     longitude:'',
//     latitude:''

//   },
//   takePhoto() {
//     const ctx = wx.createCameraContext()
//     ctx.takePhoto({
//       quality: 'high',
//       success: (res) => {
//         this.setData({
//           src: res.tempImagePath
//         })
//       }
//     })
//   },
//   error(e) {
//     console.log(e.detail)
//   },
//   //事件处理函数
//   bindViewTap: function() {
//     // wx.getLocation({//获取当前经纬度
//     //   type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
//     //   success: function (res) {
//     //     wx.openLocation({//​使用微信内置地图查看位置。
//     //       latitude: 22.5542080000,//要去的纬度-地址
//     //       longitude: 113.8878770000,//要去的经度-地址
//     //       name: "宝安中心A地铁口",
//     //       address:'宝安中心A地铁口'
//     //     })
//     //   }
//     // })
//     var that = this;
//     wx.chooseImage({
//       count: 1,
//       sizeType: ['compressed'],
//       sourceType: ['album', 'camera'],
//       success (res) {
//         // tempFilePath可以作为img标签的src属性显示图片
//         const tempFilePaths = res.tempFilePaths
//         console.log(res.tempFiles)
//         that.setData({
//           src:tempFilePaths
//         })
//         console.log(tempFilePaths)
//       }
//     })
//   },
//   openConfirm: function () {
//     wx.showModal({
//       content: '检测到您没打开智能锁的定位权限，是否去设置打开？',
//       confirmText: "确认",
//       cancelText: "取消",
//       success: function (res) {
//         console.log(res);
//         //点击“确认”时打开设置页面
//         if (res.confirm) {
//           console.log('用户点击确认')
//           wx.openSetting({
//             success: (res) => { }
//           })
//         } else {
//           console.log('用户点击取消')
//         }
//       }
//     });
//   },
//   onLoad: function () {
//     var that = this


//     wx.getLocation({
//       type: 'wgs84',
//       success: function (res) {
//         that.setData({
//           location: {
//             longitude: res.longitude,
//             latitude: res.latitude
//           }
//         })
//       }
//     })


//     wx.getSetting({
//       success: (res) => {
//         if (!res.authSetting['scope.userLocation'])
//           that.openConfirm()
//       }
//     })





//     if (app.globalData.userInfo) {
//       this.setData({
//         userInfo: app.globalData.userInfo,
//         hasUserInfo: true
//       })
//     } else if (this.data.canIUse){
//       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//       // 所以此处加入 callback 以防止这种情况
//       app.userInfoReadyCallback = res => {
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     } else {
//       // 在没有 open-type=getUserInfo 版本的兼容处理
//       wx.getUserInfo({
//         success: res => {
//           app.globalData.userInfo = res.userInfo
//           this.setData({
//             userInfo: res.userInfo,
//             hasUserInfo: true
//           })
//         }
//       })
//     }
//     this.setData({
//        'list[0].num':19
//     })
//   },
//   getUserInfo: function(e) {
//     console.log(e)
//     app.globalData.userInfo = e.detail.userInfo
//     this.setData({
//       userInfo: e.detail.userInfo,
//       hasUserInfo: true
//     })
//   }
// })
