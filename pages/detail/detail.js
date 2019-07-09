const util = require('../../utils/util.js')
const app = getApp()

Page({
    data:{
        listId:"",
        orderId:"",
        orderStatus:'',
        // 工单信息字段
        list:{},
         // 预约时间=>key
         hiddenTime:true,
         timeTitle:'添加预约时间',
         date: '2016-09-01',
         index:0,
         timeArray:["上午(08:00~12:00)","下午(12:00~18:00)","晚上(18:00~20:00)"],
          // 增加备注
         hideAddRemark : true,
         textareaVal :  '',
         textInput:false,
        //  标记异常
        hideSpecial:true,
        specialVal:'',
        // 取消异常
        cancelSpecialVal:"",
        hideCancelSpecial:true,
        // 修改异常
        modifySpecialVal:"",
        hideModifySpecial:true,
         //  修改信息弹框
        hiddenInfo:true,
        // sn弹框
        hdSn:true,
        //  完工确认
        hideComplete:true,
        // 文件上传
        files: [],
        url:""
    },
    onLoad(e){
        let date = util.formatTime(new Date());
        var listId = e.id;
        var orderId = e.orderId;
        var wxTitle = {
            "2": "待预约详情",
            "3": "待安装详情",
            "4": "已完工详情",
            "5": "已结算详情",
            "999": "异常详情"
        }

        this.setData({
            listId,
            orderId,
            date,
            url:app.globalData.url,
        })
        wx.setNavigationBarTitle({
            title: wxTitle[listId],
        })
        this.getData()
    },
    getData(){
        var orderType = {
            "2": "待预约",
            "3": "待安装",
            "4": "已完工",
            "5": "已结算",
        }
        let url = app.globalData.url
        let openid = app.globalData.openid
        let id = this.data.orderId
        let list = this.data.list
        wx.request({
            url: `${url}/site/show?openid=${openid}&id=${id}`,
            success:result=>{
              let res = result.data.data
              let finish_images = res.finish_images
              let files = this.data.files
              if(finish_images.length != 0 ){
                for(let i = 0 ;i < finish_images.length;i++){
                    let path = url+finish_images[i].path
                    files.push(path)
                }
              }        
              let status = res.status
              let index = Number(res.time.id)-1
              if(res.date){
                  this.setData({
                      date:res.date,
                      index
                  })
              }
              this.setData({
                  list:res,
                  files,
                  orderStatus:orderType[status]
              })
            }
        })
    },
    emojiReg(val){
        let emojiReg = /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/
        if(emojiReg.test(val)){
            wx.showToast({
                title:"请不要输入表情",
                icon:'none'
            })
            return  true
        }else{
            return false
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
        this.setData({
            hiddenTime:false,
        })
    },
    confirmTime(){
        wx.showLoading({
            title: '预约中'
        })
        let date = this.data.date;
        let list = this.data.list;
        let orderId = this.data.orderId
        let openid = app.globalData.openid
        let url = app.globalData.url
        let time = Number(this.data.index) + 1
        let data ={
            openid,
            date,
            time,
            id:orderId
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
                  list.date = date
                  list.time.text = this.data.timeArray[this.data.index]
                  this.setData({
                    hiddenTime:true,
                    list
                })
                if(this.data.listId==2){
                    wx.showToast({
                        title:"预约成功",
                        icon:'none'
                    })
                }else{
                    wx.showToast({
                        title:"修改成功",
                        icon:'none'
                    })
                }
                
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
    // 备注弹框
    showRemark(e){
        this.setData({
            hideAddRemark:false
        })
    },
    closeRemark(){
        this.setData({
            hideAddRemark:true
        })
    },
    textChange(e){
        let textareaVal  = e.detail.value
        var that = this
        if(textareaVal.length > 300){
            textareaVal = textareaVal.slice(0,300)
            wx.showToast({
                title:"备注不能超过300字",
                icon:'none'
            })
            let list = this.data.list
            list.emp_remark = textareaVal
            that.setData({
                list
            })
            return
        }
        that.setData({
            textareaVal,
            textInput:true,
        }) 
         
    },      
    confirmRemark(){
        let list = this.data.list
        let textareaVal = this.data.textareaVal
        let textInput = this.data.textInput
        if(!textInput){
            if(!textareaVal){
                if(list.emp_remark ){
                    textareaVal = list.emp_remark
                }else if(list.customer_remark){
                    textareaVal = list.customer_remark
                }
            }
        }
        let emjReg = this.emojiReg(textareaVal)
        if(emjReg){
            return
        }
        wx.showLoading({
            title: '提交中',
        }) 
        let openid = app.globalData.openid
        let url = app.globalData.url
        let orderId = this.data.orderId
        let data = {
            openid,
            id:orderId,
            remark:textareaVal
        }
        wx.request({
            url: `${url}/site/note`,
            method:'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data,
            success:result=>{
              wx.hideLoading()
              let res = result.data
              if(res.status == 200 ){
                list.emp_remark = textareaVal
                this.setData({
                    hideAddRemark:true,
                    list
                })
                wx.showToast({
                    title:"提交成功",
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
    // 异常弹框
    specialChange(e){
        let specialVal = e.detail.value
        var that = this
        if(specialVal.length > 140){
            specialVal = specialVal.slice(0,140)
            wx.showToast({
                title:"备注不能超过140字",
                icon:'none'
            })
        }
        that.setData({
            specialVal
        }) 
    },
    showSpecial(){
        this.setData({
            hideSpecial:false
        })
    },
    closeSpecial(){
        this.setData({
            hideSpecial:true
        })
    },
    confirmSpecial(){
        let specialVal = this.data.specialVal;
        let listId = this.data.listId;
        let openid = app.globalData.openid
        let url = app.globalData.url
        let orderId = this.data.orderId
        let data = {
            openid,
            id:orderId,
            remark:specialVal
        }
        if(!specialVal){
            wx.showToast({
                title:"请填写异常备注",
                icon:"none"
            })
            return
        }
        let emjReg = this.emojiReg(specialVal)
        if(emjReg){
            return
        }
        wx.showLoading({
            title: '提交中',
        }) 
        wx.request({
            url: `${url}/site/exception`,
            method:'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data,
            success:result=>{
              wx.hideLoading()
              let res = result.data
              if(res.status == 200 ){
                this.setData({
                    hideSpecial:true
                })
                wx.showToast({
                    title:"提交异常成功",
                    icon:'none',
                    success(){
                        setTimeout(()=>{
                            wx.navigateBack({
                                delta: 1, // 回退前 delta(默认为1) 页面
                            })
                        },800)
                    }
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
    // 取消异常
    showCancelSpecial(){
        this.setData({
            hideCancelSpecial:false
        })
    },
    closeCancelSpecial(){
        this.setData({
            hideCancelSpecial:true
        })
    },
    cancelSpecialChange(e){
        let cancelSpecialVal = e.detail.value
        var that = this
        if(cancelSpecialVal.length > 140){
            cancelSpecialVal = cancelSpecialVal.slice(0,140)
            wx.showToast({
                title:"备注不能超过140字",
                icon:'none'
            })
        }
        that.setData({
            cancelSpecialVal
        }) 
    },
    confirmCancelSpecial(){
        let cancelSpecialVal = this.data.cancelSpecialVal;
        if(!cancelSpecialVal){
            cancelSpecialVal=this.data.list.exception_remark
        }
        if(!cancelSpecialVal){
            wx.showToast({
                title:"请填写取消异常备注",
                icon:"none"
            })
            return
        }
        
        wx.showLoading({
            title: '取消中',
        })  
        let listId = this.data.listId
        let openid = app.globalData.openid
        let url = app.globalData.url
        let orderId = this.data.orderId
        let data = {
            openid,
            id:orderId,
            remark:cancelSpecialVal
        }
        wx.request({
            url: `${url}/site/unexception`,
            method:'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data,
            success:result=>{
              wx.hideLoading()
              let res = result.data
              if(res.status == 200 ){
                this.setData({
                    hideCancelSpecial:true,
                    cancelSpecialVal
                })
                wx.showToast({
                    title:"取消异常成功",
                    icon:'none',
                    success(){
                        setTimeout(()=>{
                            wx.navigateBack({
                                delta: 1, // 回退前 delta(默认为1) 页面
                            })
                        },800)
                    }
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
    // 修改异常
    showModifySpecial(){
        this.setData({
            hideModifySpecial:false
        })
    },
    closeModifySpecial(){
        this.setData({
            hideModifySpecial:true
        })
    },
    modifySpecialChange(e){
        let modifySpecialVal = e.detail.value
        var that = this
        if(modifySpecialVal.length > 140){
            modifySpecialVal = modifySpecialVal.slice(0,140)
            wx.showToast({
                title:"备注不能超过140字",
                icon:'none'
            })
            let list = this.data.list
            list.exception_remark = modifySpecialVal
            that.setData({
                list
            })
            return
        }
        that.setData({
            modifySpecialVal
        }) 
    },
    confirmModifySpecial(){
        let modifySpecialVal = this.data.modifySpecialVal;
        if(!modifySpecialVal){
            modifySpecialVal=this.data.list.exception_remark
        }
        if(!modifySpecialVal){
            wx.showToast({
                title:"请填写修改异常备注",
                icon:"none"
            })
            return
        }
        let emjReg = this.emojiReg(modifySpecialVal)
        if(emjReg){
            return
        }
        wx.showLoading({
            title: '提交中',
        })  
        let list = this.data.list
        let openid = app.globalData.openid
        let url = app.globalData.url
        let orderId = this.data.orderId
        let data = {
            openid,
            id:orderId,
            remark:modifySpecialVal
        }
        wx.request({
            url: `${url}/site/exception`,
            method:'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data,
            success:result=>{
              wx.hideLoading()
              let res = result.data
              if(res.status == 200 ){
                list.exception_remark = modifySpecialVal
                this.setData({
                    hideModifySpecial:true,
                    list
                })
                wx.showToast({
                    title:"修改成功",
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
    // 确认完工
    confirmComplete(e){
        this.setData({
            hideComplete:false,
        })
    },
    hdComplete(){
        this.setData({
            hideComplete:true,
        })
    },
    cmCompleteDialog(){
        let openid = app.globalData.openid
        let url = app.globalData.url
        let id = this.data.orderId
        let must_sn = this.data.list.must_sn
        let sn = this.data.list.sn
        if(must_sn == 1 && !sn ){
            wx.showToast({
                title:'SN号为必填字段,请添加SN号',
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
                this.setData({
                    hideComplete:true,
                })
                wx.showToast({
                    title:"确认成功",
                    icon:'none',
                    success(){
                        setTimeout(()=>{
                            wx.navigateBack({
                                delta: 1, // 回退前 delta(默认为1) 页面
                            })
                        },800)
                    }
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
    // 修改信息弹框
    validate(formData){
        if(!formData.name){
          return {code:'error',msg:"姓名不能为空"}
        }else if(!formData.phone){
          return {code:'error',msg:"联系电话不能为空"}
        }else if(!(/^1[3456789]\d{9}$/.test(formData.phone))){  
            return {code:'error',msg:"请输入正确的联系电话"}
        } 
        else if(!formData.address){
          return {code:'error',msg:"安装地址不能为空"}
        }else{
          return {code:'ok'}
        }
    },
    closeInfo(){
        this.setData({
            hiddenInfo:true
        })
    },
    showInfo(){
        this.setData({
            hiddenInfo:false
        })
    },
    formSubmit: function(e) {   
        let formData =  e.detail.value
        let list = this.data.list
        var res = this.validate(formData)
        let openid = app.globalData.openid
        let url = app.globalData.url
        let orderId = this.data.orderId
        let data = {
            openid,
            id:orderId,
            name:formData.name,
            phone:formData.phone,
            address:formData.address
        }
        if(res.code == 'error'){
          wx.showToast({
            title:res.msg,
            icon: 'none',
            duration: 2000
          })
          return
        }
        let emjRegName = this.emojiReg(formData.name)
        let emjRegAddress= this.emojiReg(formData.address)
        if(emjRegName||emjRegAddress){
            return
        }
        wx.showLoading({
            title: '提交中',
        })   
        wx.request({
            url: `${url}/site/modify`,
            method:'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data,
            success:result=>{
              wx.hideLoading()
              let res = result.data
              if(res.status == 200 ){
                list.customer_name =  formData.name
                list.phone =  formData.phone
                list.address =  formData.address
                this.setData({
                    list,
                    hiddenInfo:true
                })
                wx.showToast({
                    title:"修改成功",
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
    //sn弹框
    showSn(){
        this.setData({
            hdSn:false
        })
    },
    closeSn(){
        this.setData({
            hdSn:true
        })
    },
    snSubmit(e){ 
        let sn = e.detail.value.sn
        let list = this.data.list
        let openid = app.globalData.openid
        let url = app.globalData.url
        let orderId = this.data.orderId
        let data = {
            openid,
            id:orderId,
            sn
        }
        let emjReg = this.emojiReg(sn)
        if(emjReg){
            return
        }
        wx.showLoading({
            title: '提交中',
        }) 
        wx.request({
            url: `${url}/site/sn`,
            method:'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data,
            success:result=>{
              wx.hideLoading()
              let res = result.data
              if(res.status == 200 ){
                list.sn = sn
                this.setData({
                    list,
                    hdSn:true
                })
                wx.showToast({
                    title:"提交成功",
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
    // 图片上传
    chooseImage: function (e) {
        var that = this;
        let url = app.globalData.url
        let openid = app.globalData.openid
        let ticket_id = this.data.orderId
        wx.chooseImage({
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                let tempFilePaths = res.tempFilePaths
                let files = that.data.files.concat(tempFilePaths)
                if(files.length > 4){
                    wx.showToast({
                        title:"图片最多四张",
                        icon:"none"
                    })
                    return
                }
                for(let i = 0;i<tempFilePaths.length;i++){
                    wx.uploadFile({
                        url: `${url}/file/upload-ticket`, //仅为示例，非真实的接口地址
                        filePath: tempFilePaths[i],
                        name: 'img',
                        header:{
                            'Content-Type' :'multipart/form-data'
                        },
                        formData: {
                            openid,
                            type:1,
                            ticket_id,
                        },
                        success (result){
                          const res = result.data
                          console.log(res)
                          console.log("img suceess")
                          //do something
                        }
                      })
                }
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    files: files
                });
            }
        })
    },
    previewImage: function(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    }
})