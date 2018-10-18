var GameManager = require("GameManager");
var chessBoard=require("ChessBoard");
var excercisesBoard=require("ExcercisesBoard");
var gameEnum=require('GameEnum');
var playerHud=require('PlayerBoard');
var th=null;
var time_checkNextRound=0;
var time_checkChessState=0;
var time_matching=0;
cc.Class({
    extends: cc.Component,

    properties: {
        chessBoard: {
            default: null,                                  
            type: chessBoard, 
            serializable: true,   
        },
        excercisesBoard: {
            default: null,                                  
            type: excercisesBoard, 
            serializable: true,   
        },
        playerHud: {
            default: null,                                  
            type: playerHud, 
            serializable: true,   
        },
    },


    onLoad () {
        GameManager.getInstance().callBack_matchCheck=this.OnMatchCheckBack;
        this.node.on('onChessClick',this.onChessClick,this);
        this.node.on('onAnswerClick',this.onAnswerClick,this);
        th=this;
        
    },
    start () {
       this.init();
       if(GameManager.getInstance().gameState ==  gameEnum.GAME_STATE.WAITING_OPPONENT)//创建房间者等待其他玩家加入
       {
            time_matching=0;
       }
       else
       {
        th.scheduleOnce(function() {
            th.GetQuestBank();
        }, gameEnum.GameConst.DELAY_GAME_START);
       }
    },
    init()
    {
        GameManager.getInstance().curRound=0;
        this.playerHud.updateInfo();
        this.chessBoard.node.active=false;
        this.excercisesBoard.node.active=false;
        GameManager.getInstance().questions=new Array();
        for(var i=0;i<9;i++)
        {
            var qst={id:'1',catergory:1,title:''};
            GameManager.getInstance().questions.push(qst);
        }
    },
    GetQuestBank()
    {
        GameManager.getInstance().GetQuestBank(function(resp)
        {
            var data=resp['questionCategorys'];
            var length=data.length;
            for(var i=0;i<length;i++)
            {
                GameManager.getInstance().questions[i]['category']=data[i];
            }
             th.chessBoard.setGrid();
             th.roundStart()
        });
    },
    roundStart()
    {
        this.chessBoard.node.active=true;
        GameManager.getInstance().curRound=GameManager.getInstance().curRound+1;
        GameManager.getInstance().gameState=gameEnum.GAME_STATE.CHESS;
        this.getChess();
    },
      //请求下一个棋子
    getChess()
    {
        GameManager.getInstance().GetNext(function(resp)
        {
            GameManager.getInstance().curQuestionIdx=resp;
            th.chessBoard.OnNext();
            
         
        });
        
    },
    onChessClick(event)
    {
        event.stopPropagation();
        GameManager.getInstance().GrabChess(0,function(resp)
        {
            //抢中
            if(resp['result'])
            {
                var qst=resp['question'];
                var idx=qst['index'];
                GameManager.getInstance().questions[idx]=qst;
                th.excercisesBoard.OnNext();
            }
            else
            {
                time_checkNextRound=0;
                GameManager.getInstance().gameState=gameEnum.GAME_STATE.WATCHING;
            }
            th.scheduleOnce(function() {
                 th.showQustion();  
            }, gameEnum.GameConst.DELAY_SHOW_EXCERCISES);
           
        });
    },
    showQustion()
    {
       th.chessBoard.node.active=false;
       th.excercisesBoard.node.active=true;
    },
    getQustionBack(resp)
    {
        th.chessBoard.node.active=false;
        th.excercisesBoard.node.active=true;
    },
    onAnswerClick(event)
    {
        event.stopPropagation();
        if(GameManager.getInstance().gameState == gameEnum.GAME_STATE.WATCHING)
        {
            return;
        }
        var selectedIdx=event.getUserData();
        GameManager.getInstance().SendAnswer(selectedIdx,function(resp){
        var result=resp['result'];
        if(result)
        {
        }
        else
        {
            var cfgId=GameManager.getInstance().questions[GameManager.getInstance().curQuestionIdx]['id'];
            GameManager.getInstance().GetAnswer(cfgId,function(resp){
                th.excercisesBoard.ShowAnswerSign(resp['answer'],true);
            });
        }
        th.excercisesBoard.ShowAnswerSign(selectedIdx,result);
            th.RefreshChessBorad();
        })
      
    },
    RefreshChessBorad(callback)
    {
        GameManager.getInstance().GetRoomResult(function(resp){
            var data=resp["answerVOS"];
            var length=data.length;
            var curQ=GameManager.getInstance().questions[GameManager.getInstance().curQuestionIdx];
            for(var i=0;i<length;i++)
            {
                if(data[i]['cfgid'] == curQ['id'])
                {
                    if(data[i]['result'])
                    {
                        if(data[i]['openid'] == GameManager.getInstance().myInfo['openId'])
                        {
                            th.chessBoard.result(GameManager.getInstance().curQuestionIdx,GameManager.getInstance().myInfo['side']);
                        }
                        else
                        {
                            th.chessBoard.result(GameManager.getInstance().curQuestionIdx,GameManager.getInstance().oppInfo['side']);
                        }
                    }
                    else
                    {
                        if(data[i]['openid'] == GameManager.getInstance().myInfo['openId'])
                        {
                            th.chessBoard.result(GameManager.getInstance().curQuestionIdx,GameManager.getInstance().oppInfo['side']);
                        }
                        else
                        {
                            
                            th.chessBoard.result(GameManager.getInstance().curQuestionIdx,GameManager.getInstance().myInfo['side']);
                            console.log('对方回答错误')
                        }
                    }
                    break;
                }
            }
            th.scheduleOnce(function() {
                th.nextRound();
            }, gameEnum.GameConst.INTERVAL_ROUND_BETWEEN_ROUND);
           if(callback != null)
           {
            callback();
           }
        });
    },
    nextRound()
    {  
        var isWin=this.chessBoard.CheckWin();
        if(isWin != null)
        {
            if(isWin)
            {
                GameManager.getInstance().SubmitVictory(function(resp){
                    console.log(resp);
                });
            }
            cc.director.loadScene("result", function(){
            });
            return;
        }
        this.chessBoard.node.active=true;
        this.excercisesBoard.node.active=false;
        this.roundStart();
    },
  
    update (dt) {
        if(GameManager.getInstance().gameState == gameEnum.GAME_STATE.WAITING_OPPONENT)
        {
            time_matching+=dt;
            if(time_matching>=gameEnum.GameConst.INTERVAL_MATCHING)
            {
                time_matching=0;
                GameManager.getInstance().CheckMatch();
            }
        }
        if(GameManager.getInstance().gameState == gameEnum.GAME_STATE.WATCHING)
        {
            time_checkNextRound+=dt;
            if(time_checkNextRound>=gameEnum.GameConst.INTERVAL_CHECKNEXTROUND)
            {
                time_checkNextRound=0;
                GameManager.getInstance().CheckNextRound(function(resp)
                {
                    if(GameManager.getInstance().curQuestionIdx != -1){
                        var curQstId=GameManager.getInstance().questions[GameManager.getInstance().curQuestionIdx]['id'];
                        if(GameManager.getInstance().curQuestionIdx != resp)
                        {                      
                            GameManager.getInstance().GetAnswer(curQstId,function(resp){
                                th.excercisesBoard.ShowAnswerSign(resp['answer'],true);
                            });
                            th.RefreshChessBorad(function(){
                                GameManager.getInstance().curQuestionIdx=resp;
                            });
                            
                        }
                    }
                });
            }
        }
        if(GameManager.getInstance().gameState == gameEnum.GAME_STATE.CHESS)
        {
            time_checkChessState+=dt;
            if(time_checkChessState>=gameEnum.GameConst.INTERVAL_CHECKCHESS_STATE)
            {
                time_checkChessState=0;
                GameManager.getInstance().GetRobState(function(resp)
                {
                    if(resp['result'])
                    {
                        time_checkNextRound=0;
                        GameManager.getInstance().gameState=gameEnum.GAME_STATE.WATCHING;
                        var qst=resp['question'];
                        var idx=qst['index'];
                        GameManager.getInstance().questions[idx]=qst;
                        th.excercisesBoard.OnNext();
                        th.scheduleOnce(function() {
                            th.showQustion();  
                       }, gameEnum.GameConst.DELAY_SHOW_EXCERCISES);
                    }
                });
            }
        }
    },

    OnMatchCheckBack(resp)
    {
        console.log("checkMatching:"+resp['matchSuccess']);
        if(resp['matchSuccess'] && resp['roles'] != null && resp['roles'].length>=2)
        {
            var roles=resp['roles'];
            var length=roles.length;
            for(var i=0;i<length;i++)
            {
                if(roles[i]['openId'] == GameManager.getInstance().myInfo.openId)
                {
                    GameManager.getInstance().myInfo['side']=i;
                }
                else{
                    GameManager.getInstance().oppInfo={wxName:roles[i]['nickName'],iconUrl:'http://tinslychong.club/cocos/icon1.jpg',openId:i,side:i};
                }
            }
            GameManager.getInstance().gameState=gameEnum.GAME_STATE.CHESS;
            th.scheduleOnce(function() {
                th.GetQuestBank();
            }, gameEnum.GameConst.DELAY_GAME_START);
          
        }
        
    },
});
