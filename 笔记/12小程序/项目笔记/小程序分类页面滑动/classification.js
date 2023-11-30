//classification.js
//获取应用实例
var util = require('../../utils/util.js');
var request = require('../../api/request.js');
const app = getApp();

Page({
  data: {
    listNumber: '',
    
    classList:[
      {}
    ],
    items: [
      {}
    ],
    lists:[
      {}
    ],
    existClass: '1',
    existList : '',
    existImage : "",
    car: 'top-hoverd-btn',
    financial: '',
    property: '',
    tourism: '',
    luxury: '',
    retailstore: '',
    entertainment: '',
    internetservice: '',
    businessservice: '',
    digitalelectronics: '',
    // appliancestore: '',
    alcoholindustry: '',
    foodindustry: '',
    educationtraining: '',
    length : 0,
    loadNumber : 20,
    titlecount : 0,   //能获取到的信息总数目
    event : '', //html传来的点击事件
    hidden: false
  },

  onLoad: function () {
    // this.judgLogin();
    this.getClass();
  },

  onShow: function(){
  },

  onReachBottom() { 
    var number1;
    if (this.data.loadNumber >= this.data.titlecount) {
      wx.showLoading({
        title: '已经到底啦',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
    } else {
      wx.showLoading({
        title: '加载中...',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
      number1 = this.data.loadNumber + 20;
      this.setData({
        loadNumber: number1
      })
      this.secondList(this.data.event);
    }
  },

  judgLogin: function(){
    var that = this;
    if (app.globalData.sign == 1) {
      console.log(app.globalData.sign);
    } else {
      request.sendRrquest('users/check_user_exists/' + "?weixin_id=" + app.globalData.openid, 'GET', {}, {})
        .then(function (response) {
          if (response.statusCode == "404") {
            console.log("没有注册" + app.globalData.sign);//没有注册过sign = 0,跳转到主页面
            wx.navigateTo({
              url: '/pages/register/register'
            })
          } else if (response.statusCode == "200") {
            app.globalData.sign = 1;
            app.globalData.token = response.data.token //将用户的token保存起来              
            that.getClass();
            // console.log("注册用户" + response.data.token);
          }
        }, function (error) {
          console.log(error);
        });
    }
  },

  getClass: function() {
    var that = this;
    // console.log(app.globalData.token);
    // app.globalData.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNzdkODZhOTktOTFkZS00MDUwLWE0OTYtNTZhZGRiNWIzMzM2IiwidXNlcm5hbWUiOiIxNTA1MTI1MTM3OCIsImV4cCI6MTUzNzM0MjIxMSwiZW1haWwiOiIifQ.QODJZowsGTnChI0Cc_7oPQo_JNTbbHhn5PFyJxDljPM";
    request.sendRrquest('categories/', 'GET', {}, { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + app.globalData.token })
      .then(function (response) {
        console.log(response);
        that.setData({
          classList: response.data.results
        })
        that.toCar();  //初始加载
      }, function (error) {
        console.log(error);
      });
  },

  controlShowHide :function(e,length){
    if(length == "0"){
      this.setData({
        existClass: "",
        existImage: "1",
        existList: ""
      })
    } else {
      this.setData({
        existClass: e,
        existImage: "",
        existList: ""
      })
    }
  },

  controlSecondShowHide :function(count){
    if(count == "0"){
      this.setData({
        existList: "",
        existImage: "1",
        existClass: ""
      })
    } else if ((count > "0") && (this.data.loadNumber == 20)) {
      this.setData({
        existList: "1",
        existImage: "",
        existClass: ""
      })
    } else {
    }

  },

  listClick: function(e){
    var clickId = e.currentTarget.dataset.id; // 点击了哪个图片
    // console.log(this.data.lists[clickId].category_secondary_name);
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + this.data.lists[clickId].id  //页面跳转
    })
  },

  secondList: function(e){
    var that = this;
    var clickId = e.currentTarget.dataset.id; // 点击了哪个分类
    var num = this.data.listNumber;
    var id;
    this.setData({
      event : e
    })
    id = this.data.classList[num].category_secondary[clickId].id;
    request.sendRrquest('companies/?category_secondary_id=' + id + '&page=1&page_size=' + that.data.loadNumber, 'GET', {}, { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + app.globalData.token })
      .then(function (response) {
        // that.controlShowHide(""); 
        that.controlSecondShowHide(response.data.count);  //点击二级分类  隐藏分类列表
        that.setData({
          lists: response.data.results,
          titlecount: response.data.count
        })
        // console.log(response);
      }, function (error) {
        console.log(error);
      });
    // console.log(id);

  },

  toCar: function () {
    console.log('car');
    this.data.length = this.data.classList[0].category_secondary.length;
    // for(var i = 0;i <= 2;i++){
      this.setData({
        items: this.data.classList[0].category_secondary,
        listNumber : "0"
      })
    this.controlShowHide("1", this.data.length);  
    // }
    // console.log(this.data.items);
    this.updateBtnStatus('car');
  },
  toFinancial: function () {
    console.log('financial');
    this.data.length = this.data.classList[1].category_secondary.length;
    this.setData({
      items: this.data.classList[1].category_secondary,
      listNumber: "1"
    })
    this.controlShowHide("1", this.data.length);
    this.updateBtnStatus('financial');
  },
  toProperty: function () {
    console.log('property');
    this.data.length = this.data.classList[2].category_secondary.length;
    this.setData({
      items: this.data.classList[2].category_secondary,
      listNumber: "2"
    })
    this.controlShowHide("1", this.data.length);
    this.updateBtnStatus('property');
  },
  toRetailstore: function () {
    console.log('retailstore');
    this.data.length = this.data.classList[3].category_secondary.length;
    this.setData({
      items: this.data.classList[3].category_secondary,
      listNumber: "3"
    })
    this.controlShowHide("1", this.data.length);
    this.updateBtnStatus('retailstore');
  },
  toEntertainment: function () {
    console.log('entertainment');
    this.data.length = this.data.classList[4].category_secondary.length;
    this.setData({
      items: this.data.classList[4].category_secondary,
      listNumber: "4"
    })
    this.controlShowHide("1", this.data.length);
    this.updateBtnStatus('entertainment');
  },
  toTourism: function () {
    console.log('tourism');
    this.data.length = this.data.classList[5].category_secondary.length;
    this.setData({
      items: this.data.classList[5].category_secondary,
      listNumber: "5"
    })
    this.controlShowHide("1", this.data.length);
    this.updateBtnStatus('tourism');
  },
  toLuxury: function () {
    console.log('luxury');
    this.data.length = this.data.classList[6].category_secondary.length;
    this.setData({
      items: this.data.classList[6].category_secondary,
      listNumber: "6"
    })
    this.controlShowHide("1", this.data.length);
    this.updateBtnStatus('luxury');
  },
  toInternetservice: function () {
    console.log('internetservice');
    this.data.length = this.data.classList[7].category_secondary.length;
    this.setData({
      items: this.data.classList[7].category_secondary,
      listNumber: "7"
    })
    this.controlShowHide("1", this.data.length);
    this.updateBtnStatus('internetservice');
  },
  toBusinessservice: function () {
    console.log('businessservice');
    this.data.length = this.data.classList[8].category_secondary.length;
    this.setData({
      items: this.data.classList[8].category_secondary,
      listNumber: "8"
    })
    this.controlShowHide("1", this.data.length);
    this.updateBtnStatus('businessservice');
  },
  toDigitalElectronics: function () {
    console.log('digitalelectronics');
    this.data.length = this.data.classList[9].category_secondary.length;
    this.setData({
      items: this.data.classList[9].category_secondary,
      listNumber: "9"
    })
    this.controlShowHide("1", this.data.length);
    this.updateBtnStatus('digitalelectronics');
  },
  // toAppliancestore: function () {
  //   console.log('appliancestore');
  //   this.setData({
  //     items: this.data.classList[11].category_secondary
  //   })
  //   this.updateBtnStatus('appliancestore');
  // },
  // toAlcoholindustry: function () {
  //   console.log(this.data.classList[10].category_secondary.length);
  //   this.data.length = this.data.classList[10].category_secondary.length;
  //   this.setData({
  //     items: this.data.classList[10].category_secondary,
  //     listNumber: "10"
  //   })
  //   this.controlShowHide("1", this.data.length);
  //   this.updateBtnStatus('alcoholindustry');
  // },
  toFoodindustry: function () {
    console.log('foodindustry');
    this.data.length = this.data.classList[11].category_secondary.length;
    this.setData({
      items: this.data.classList[11].category_secondary,
      listNumber: "11"
    })
    this.controlShowHide("1", this.data.length);
    this.updateBtnStatus('foodindustry');
  },
  toEducationtraining: function () {
    console.log('educationtraining');
    this.data.length = this.data.classList[12].category_secondary.length;
    this.setData({
      items: this.data.classList[12].category_secondary,
      listNumber: "12"
    })
    this.controlShowHide("1", this.data.length);
    this.updateBtnStatus('educationtraining');
  },
  toDecorativematerials: function () {
    console.log('decorativematerials');
    this.data.length = this.data.classList[13].category_secondary.length;
    this.setData({
      items: this.data.classList[13].category_secondary,
      listNumber: "13"
    })
    this.controlShowHide("1", this.data.length);
    this.updateBtnStatus('decorativematerials');
  },
  toHealthcare: function () {
    console.log('healthcare');
    this.data.length = this.data.classList[14].category_secondary.length;
    this.setData({
      items: this.data.classList[14].category_secondary,
      listNumber: "14"
    })
    this.controlShowHide("1", this.data.length);
    this.updateBtnStatus('healthcare');
  },
  updateBtnStatus: function (k) {   //更新选中状态
    this.setData({
      car: this.getHoverd('car', k),
      financial: this.getHoverd('financial', k),
      property: this.getHoverd('property', k),
      tourism: this.getHoverd('tourism', k),
      luxury: this.getHoverd('luxury', k),
      retailstore: this.getHoverd('retailstore', k),
      entertainment: this.getHoverd('entertainment', k),
      internetservice: this.getHoverd('internetservice', k),
      businessservice: this.getHoverd('businessservice', k),
      digitalelectronics: this.getHoverd('digitalelectronics', k),
      // appliancestore: this.getHoverd('appliancestore', k),
      alcoholindustry: this.getHoverd('alcoholindustry', k),
      foodindustry: this.getHoverd('foodindustry', k),
      educationtraining: this.getHoverd('educationtraining', k),
      decorativematerials: this.getHoverd('decorativematerials', k),
      healthcare: this.getHoverd('healthcare', k)
    });
  },
  getHoverd: function (src, dest) {   //根据点击修改CSS 
    return (src === dest ? 'top-hoverd-btn' : '');
  },

  onShareAppMessage: function () {
    return {
      title: "联纵广告猎手",
      desc: "品牌竞品广告大数据抓捕中心",
      path: "/pages/HomePage/HomePage",
      imageUrl: "https://lianzongai.com/weixin/material/share.jpg"
    }
  }
})
