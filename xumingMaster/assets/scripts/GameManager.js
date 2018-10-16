var httpReq=require('HttpReq');
var gameEnum=require('GameEnum')
var CMD = require("CMD");
var GameManager=cc.Class({
    extends: cc.Component,
    ctor: function(){
    },
    properties: {
       

        gameState:{
            default:gameEnum.GAME_STATE.HOME,
            type:cc.Enum(gameEnum.GAME_STATE),
        },
        myInfo:
        {
            default:null,
            type:Object,
        },
        oppInfo:
        {
            default:null,
            type:Object,
        },
        callBack_matchSuc:null,
        callBack_matchCheck:null,
      
    },


    // onLoad () {},

    start () {

    },
    GetInfoByOpenId(callback)
    {
        var data={};
        httpReq.Post(CMD.GET_OPENID,data,function(resp){
            callback(resp);
        });
    },
    CreateRole(nick,callback)
    {
        var data={nickName:nick};
        httpReq.Post(CMD.CREATE_ROLE,data,function(resp){
            callback(resp);
        });
    },
    //请求匹配
    SendMatch(callback)
    {
        var data={};
        httpReq.Post(CMD.START_MATCH,data,function(resp){
            callback(resp);
        });
    },
    //检查是否匹配到人
    CheckMatch()
    {
        var data={};
        var th=this;
        httpReq.Post(CMD.GET_MATCH_RESULT,data,function(resp){
            if(th.callBack_matchCheck != null)
            {
                th.callBack_matchCheck(resp);
            }
        });
        //返回对方玩家信息，游戏开始
    },
     //请求题库
     GetQuestBank(callback)
     {
        var data={};
        httpReq.Post(CMD.GET_QUEST_BANK,data,function(resp){
            callback();
        });
     },
      //请求棋盘
      GetChessBoardInfo(callback)
      {
         var data={};
         httpReq.Post(CMD.GET_QUEST_BANK,data,function(resp){
             callback();
         });
      },
       //请求下一个棋子
       GetNext(callback)
       {
          var data={};
          httpReq.Post(CMD.GET_QUEST_BANK,data,function(resp){
              callback();
          });
       },
         //抢棋子
         GrabChess(idx,callback)
         {
            var data={};
            httpReq.Post(CMD.GET_QUEST_BANK,data,function(resp){
                callback();
            });
         },
          //选择答案
          SendAnswer(idx,callback)
          {
             var data={};
             httpReq.Post(CMD.GET_QUEST_BANK,data,function(resp){
                 callback();
             });
          }
   
});
GameManager._instance = null;
GameManager.getInstance = function () {
    if(!GameManager._instance){
        GameManager._instance = new GameManager();
    }
    return GameManager._instance;
}

module.exports = GameManager;

