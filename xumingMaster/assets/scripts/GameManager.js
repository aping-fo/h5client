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
        questions:
        {
            default:null,
            type:{Object}
        },
        curQuestionIdx:-1,
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
    //取消匹配
    CancelMatch(callback)
    {
        var data={};
        httpReq.Post(CMD.END_MATCH,data,function(resp){
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
            callback(resp);
        });
     },
       //请求亮题
       GetNext(callback)
       {
          var data={};
          httpReq.Post(CMD.GET_QUEST,data,function(resp){
              callback(resp);
          });
       },
       //检查下一轮是否开始
       CheckNextRound(callback)
       {
        var data={};
        httpReq.Post(CMD.GET_QUEST,data,function(resp){
            callback(resp);
        });
       },
         //抢棋子
         GrabChess(idx,callback)
         {
            var data={};
            httpReq.Post(CMD.ROB_ANSWER,data,function(resp){
                callback(resp);
            });
         },
          //选择答案
          SendAnswer(idx,callback)
          {
             var data={answer:idx};
             httpReq.Post(CMD.ANSWER_QUEST,data,function(resp){
                 callback(resp);
             });
          },
           //获得正确答案
           GetAnswer(cfgid,callback)
           {
              var data={cfgId:cfgid};
              httpReq.Post(CMD.GET_ANSWER,data,function(resp){
                  callback(resp);
              });
           },
            //提交胜利
            SubmitVictory(callback)
            {
               var data={};
               httpReq.Post(CMD.SUBMIT_VICTORY,data,function(resp){
                   callback(resp);
               });
            },
             //获取当前棋盘状态
             GetRoomResult(callback)
             {
                var data={};
                httpReq.Post(CMD.GET_ROOM_RESULT,data,function(resp){
                    callback(resp);
                });
             },
            //请求题库
     GetQuestBank(callback)
     {
        var data={};
        httpReq.Post(CMD.GET_QUEST_BANK,data,function(resp){
            callback(resp);
        });
     },

      //检查是否被抢
      GetRobState(callback)
      {
         var data={};
         httpReq.Post(CMD.CHECK_ROB,data,function(resp){
             callback(resp);
         });
      },
   
});
GameManager._instance = null;
GameManager.getInstance = function () {
    if(!GameManager._instance){
        GameManager._instance = new GameManager();
    }
    return GameManager._instance;
}

module.exports = GameManager;

