//index.js
//获取应用实例
const app = getApp()

Array.prototype.shuffle = function () {
  let m = this.length, i;
  while (m) {
    i = (Math.random() * m--) >>> 0;
    [this[m], this[i]] = [this[i], this[m]]
  }
  return this;
}

Page({
  data: {
    lvNo:1,
    isStart:false,
    useranser: [],
    datas: [], 
    questData:{},
    ranStr:["好","因","对","在","次","要","正","中","我","不",
            "能","用","永","京","破","朗","懒","台","个","人",
            "文","笔","图","车","音","屏","逛","光","嘛","聊",
            "烟","心","新","万","贷","数","书","霸","去","和",
            "了","看","傻","麻","说","还","吸","为","水","音",
    ]
    // questData:{
    //   level: "第一关",
    //   question: "鸡蛋锤石头，为什么锤不破？",
    //   anserItem: ["因", "为", "锤", "不", "破"],
    //   choseItem: [{ t: "因", v: false }, { t: "还", v: false}, { t: "为", v: false },
    //             { t: "锤", v: false }, { t: "对", v: false },{ t: "不", v: false },
    //             { t: "破", v: false }, { t: "吗", v: false }, { t: "好",v: false }]
    //  },
},
  onLoad:function(){
    this.setData({
      datas: [
        {"level": "第一关",
        "question": "鸡蛋锤石头，为什么锤不破？",
        "anserItem": ["因", "为", "锤", "不", "破"],
        "choseItem": [{
          "t": "因",
          "v": false
        }, {
          "t": "还",
          "v": false
        }, {
          "t": "为",
          "v": false
        },
        {
          "t": "锤",
          "v": false
        }, {
          "t": "对",
          "v": false
        }, {
          "t": "不",
          "v": false
        },
        {
          "t": "破",
          "v": false
        }, {
          "t": "吗",
          "v": false
        }, {
          "t": "好",
          "v": false
        }
        ]
      }, {
        "level": "第二关",
        "question": "冬瓜、黄瓜、西瓜、南瓜都能吃，什么瓜不能吃？ ",
        "anserItem": [
          "傻",
          "瓜"
        ],
        "choseItem": [
          {
            "t": "东",
            "v": false
          },
          {
            "t": "西",
            "v": false
          },
          {
            "t": "南",
            "v": false
          },
          {
            "t": "傻",
            "v": false
          },
          {
            "t": "瓜",
            "v": false
          },
          {
            "t": "笨",
            "v": false
          },
          {
            "t": "子",
            "v": false
          },
          {
            "t": "面",
            "v": false
          },
          {
            "t": "好",
            "v": false
          }
        ]
      }
      ]
    }, );
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  choseA :function(e){
    //点击增加到候选区
    var quersDataTmp = this.data.questData;
    var chosetmp = quersDataTmp.choseItem;
    var ansertmp = this.data.useranser;
    if (chosetmp[e.currentTarget.id].v == true) {
      return;
    }
  
        var index = ansertmp.length ?ansertmp.length:0;
        for(var i =0 ;i<= ansertmp.length-1 ;i++){
          if(ansertmp[i] == ""){
            index = i;
            break;
          }
        }
        if (index < quersDataTmp.anserItem.length) {  
          chosetmp[e.currentTarget.id].v = true;
          ansertmp.splice(index, 1, chosetmp[e.currentTarget.id].t);
          this.setData({
            questData:quersDataTmp,
            useranser: ansertmp
          })
    } 
       index = 0;
       for (var i = 0; i <= ansertmp.length - 1; i++) {
          if (ansertmp[i] == "") {
            index = i;
            break;
          }
        }

       if (this.data.useranser.length >= quersDataTmp.anserItem.length && index ==0) {
         if (this.data.useranser.toString() == quersDataTmp.anserItem.toString()) {
          wx.showToast({ title: "恭喜回答正确" })
          this.getDataApi();
        } else {
          wx.showToast({
            title: '答案错误',
            icon: "none",
            
          })
        }
      }
  },
  choseA2:function(e){
    var quersDataTmp = this.data.questData;
    var chosetmp = quersDataTmp.choseItem;
    var ansertmp = this.data.useranser;
    var index = -1;
    for(var i=0;i<= chosetmp.length -1;i++){
      if (chosetmp[i].t == ansertmp[e.target.id]){
        index = i;
        break;
      }
    }

    chosetmp[index].v = false;
    ansertmp.splice(e.target.id, 1,"");
    quersDataTmp.choseItem = chosetmp;
    this.setData({
      questData:quersDataTmp,
      useranser: ansertmp
    })
  },

  getDataApi:function(){
    var that = this
    wx.request({
      url: 'http://api.tianapi.com/txapi/naowan/?key=d12edc87ab5914208315acf57c4a40fc',
      success:function(res){
        console.log(res);
        that.AnaysisData(res);
      }
    })
  },
  StartGame: function () {
    this.getDataApi();
    this.setData({
      // questData: this.data.datas[this.data.lvNo],
      isStart: true
    })
  },

  AnaysisData:function(res){
    if (res.data.newslist[0].result.trim().length > 9){
      this.getDataApi();
      return;
    }
    var quest = {};
    quest.level = "第" + this.data.lvNo + "关";
    quest.question = res.data.newslist[0].quest;
    quest.anserItem = res.data.newslist[0].result.trim().split("");
    var choses = [];
    for (var i = 0; i < 9; i++) {
      var chose = {};
      if (i < res.data.newslist[0].result.trim().length) {
        chose.t = res.data.newslist[0].result.trim()[i];
        console.log("v:" +chose.t)
      } else {
        var tmp = this.data.ranStr[Math.floor(Math.random() * 49 + 1)] 
        for (var key in choses ){
          if (key.t == tmp){
            tmp = this.data.ranStr[Math.floor(Math.random() * 29 + 1)] 
          }
        }
        chose.t = tmp
        console.log(chose.t)
      }
      chose.v = false;
      choses.splice(i, 1, chose);
    }
    quest.choseItem = choses.shuffle();
    this.setData({
      questData: quest,
      lvNo: quest ? this.data.lvNo + 1 : 1,
      isStart: quest? true : false,
      useranser: [],
    })
  }
})
