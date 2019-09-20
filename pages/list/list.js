const util = require('../../utils/util.js')
const app = getApp()
Page({
    data:{
        searchList:["用户名称","商户名称","用户手机号"],
        searchValIndex:0,
        listId:'2',
        init:false, //onload 不与 onshow 同时getData
        orderId:'',
        page:1,
        list:[],
        lidx:'', //选中的订单的 index, 用于前端更新页面
        // 加载=>key
        loadEnd:false, //false 不显示加载中
        empty:false,
        // 预约时间=>key
        hiddenTime:true,
        timeTitle:'预约安装时间',
        date: '2016-09-01',
        index:0,
        timeArray:["上午(08:00~12:00)","下午(12:00~18:00)","晚上(18:00~20:00)"],
        // 显示备注弹框
        showRemarkD:false,
        remarkContent:'',
        // 异常备注弹框
        showERemarkD:false,
        exceptionR:'',
         // 增加备注
        hideAddRemark : true,
        // 完工确认 
        hideComplete:true,
        // 商户列表
        merchantIndex:-1,
        merchantList:[],
        // 搜索参数
        name:'',
        phone:'',
        merchantId:''
    },
    searchPicker(e){
        let searchValIndex = e.detail.value
        this.setData({
            searchValIndex
        })
        this.setData({
            page:1
        })
    },
    searchNameFun(e){
        let name = e.detail.value
        this.setData({
            page:1,
            list:[],
            name,
            loadEnd:false,
            empty:false
        })
        this.getData()
    },
    searchMerchant(e){
        let merchantIndex = e.detail.value
        let merchantId = this.data.merchantList[merchantIndex].id
        this.setData({
            page:1,
            merchantIndex,
            list:[],
            loadEnd:false,
            empty:false,
            merchantId
        })
        this.getData()
    },
    searchPhoneFun(e){
        let phone = e.detail.value
        this.setData({
            page:1,
            list:[],
            phone,
            loadEnd:false,
            empty:false
        })
        this.getData()
    },
    getData(){
        let list = this.data.list
        let listId = this.data.listId
        let url = app.globalData.url
        let openid = app.globalData.openid
        let page = this.data.page
        let searchValIndex = this.data.searchValIndex
        let name = this.data.name
        let phone = this.data.phone
        let merchantId = this.data.merchantId
        let reqUrl
        if(searchValIndex == 0 ){
            reqUrl = `${url}/site/tickets?openid=${openid}
            &status=${listId}&page=${page}&name=${name}`
        }else if(searchValIndex == 1){
            reqUrl = `${url}/site/tickets?openid=${openid}
            &status=${listId}&page=${page}&merchant=${merchantId}`
        }else if(searchValIndex == 2){
            reqUrl = `${url}/site/tickets?openid=${openid}
            &status=${listId}&page=${page}&phone=${phone}`
        }
        wx.showLoading({
            title:'加载中',
            mask:true
        })
        wx.request({
            url:reqUrl ,
            success:result=>{
              let res = result.data.data
              this.setData({
                  merchantList : res.merchants
              })
              wx.hideLoading()
              if(res.data.length == 0 && page == 1){
                list = res.data
                this.setData({
                    loadEnd:false,
                    empty:true,
                    init:true,
                    list
                })
                return
              }
              if(res.data.length == 0 ){
                this.setData({
                    loadEnd:false,
                    empty:true,
                    init:true
                })
                return
              }
              if(res.data.length < 20 && page ==1){
                list = [...list,...res.data]
                this.setData({
                    loadEnd:false,
                    empty:true,
                    list,
                    init:true
                })
              }else{
                list = [...list,...res.data]
                this.setData({
                  list,
                  loadEnd:false,
                  init:true
                })
              }
            }
        })
    },
    onReachBottom: function() {
        // Do something when page reach bottom.
        if(!this.data.loadEnd&&!this.data.empty){
            let page = this.data.page
            page++
            this.setData({
                page,
                loadEnd:true,
            })
            this.getData()
        } 
    },
    goDetail(e){
        let listId = this.data.listId
        let orderId = e.target.dataset.id
        wx.navigateTo({
            url: `/pages/detail/detail?id=${listId}&orderId=${orderId}`
        })
    },
    onLoad(e){
        let date = util.formatTime(new Date());
        let init = this.data.init
        var wxTitle = {
            "2": "待预约",
            "3": "待安装",
            "4": "已完工",
            "5": "已结算",
            "999": "有异常"
        }
        var listId = e.id;

        this.setData({
            listId,
            date
        })
        if(!init){
            this.getData()
        }
        wx.setNavigationBarTitle({
            title: wxTitle[listId],
        })
    },
    onShow(){
        if(this.data.listId&&this.data.init){
            let page = this.data.page
            page = 1
            this.setData({
                list:[],
                page,
                loadEnd:true,
                empty:false
            })
            this.getData()
        }
    },
    // 预约弹框
    bindDateChange: function (e) {
            this.setData({
                date: e.detail.value
             })
    },
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value
        })
    },
    cancelDialog(){
        this.setData({
            hiddenTime:true
        })
    },
    openDialog(e){
        let type = e.target.dataset.type
        let orderId = e.target.dataset.id
        let lidx = e.target.dataset.lidx
        let timeTitle
        if(type == 1){
            timeTitle = '预约安装时间'
        }else{
            timeTitle = '预约维修时间'
        }
        this.setData({
            hiddenTime:false,
            timeTitle,
            orderId,
            lidx
        })
    },
    confirmTime(){
        wx.showLoading({
            title: '预约中'
        })
        let date = this.data.date;
        let list = this.data.list;
        let lidx = this.data.lidx;
        let id = this.data.orderId;
        let time = Number(this.data.index) + 1
        let openid = app.globalData.openid
        let url = app.globalData.url
        let data ={
            openid,
            date,
            time,
            id
        }
        wx.request({
            url: `${url}/site/subscribe`,
            method:'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data,
            success:result=>{
              wx.hideLoading()
              let res = result.data
              if(res.status == 200 ){
                list.splice(lidx,1)
                this.setData({
                    hiddenTime:true,
                    list
                })
                wx.showToast({
                    title:"预约成功",
                    icon:'none'
                })
              }else{
                  wx.showToast({
                      title:res.info,
                      icon:'none'
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
    // 备注显示弹框
    showRemark(e){
        let index = e.target.dataset.idx
        let remarkContent = this.data.list[index].emp_remark
        this.setData({
            showRemarkD:true,
            remarkContent
        })
    },
    closeRemarkD(){
        this.setData({
            showRemarkD:false
        })
    },
    // 异常备注显示弹框
    showERemark(e){
        let index = e.target.dataset.idx
        let exceptionR = this.data.list[index].exception_remark
        this.setData({
            showERemarkD:true,
            exceptionR
        })
    },
    closeERemark(){
        this.setData({
            showERemarkD:false
        })
    },
    // 确认完工
    confirmComplete(e){
        let orderId = e.target.dataset.id
        let lidx = e.target.dataset.lidx
        let list = this.data.list
        this.setData({
            hideComplete:false,
            orderId,
            lidx
        })
    },
    cmCompleteDialog(){
        let openid = app.globalData.openid
        let url = app.globalData.url
        let id = this.data.orderId
        let lidx = this.data.lidx
        let list = this.data.list;
        let sn = list[lidx].sn
        let must_sn = list[lidx].must_sn
        let finish_images = list[lidx].finish_images
        if(must_sn == 1 && !sn ){
            wx.showToast({
                title:'SN号为必填字段,请前去详情页面添加SN号',
                icon:'none'
            })
            return
        }
        if(finish_images.length == 0 ){
            wx.showToast({
                title:'请前往详情添加完工图片',
                icon:'none'
            })
            return
        }
        let data = {
            openid,
            id,
            sn
        }
        wx.showLoading({
            title: '提交中',
        }) 
        wx.request({
            url: `${url}/site/finish`,
            method:'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data,
            success:result=>{
              wx.hideLoading()
              let res = result.data
              if(res.status == 200 ){
                list.splice(lidx,1)
                this.setData({
                    hideComplete:true,
                    list
                })
                wx.showToast({
                    title:"确认完工成功",
                    icon:'none'
                })
              }else{
                  wx.showToast({
                      title:res.info,
                      icon:'none'
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
    hdComplete(){
        this.setData({
            hideComplete:true,
        })
    }
})