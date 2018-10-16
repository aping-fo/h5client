var GameManager = require("GameManager");
var chessBoard=require("ChessBoard");
var excercisesBoard=require("ExcercisesBoard");
var gameEnum=require('GameEnum');
var playerHud=require('PlayerBoard');
var th=null;
var time_checkNextRound=0;
var time_checkChessState=0;
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
        this.chessBoard.node.active=true;
        this.excercisesBoard.node.active=false;
        this.node.on('onChessClick',this.onChessClick,this);
        this.node.on('onAnswerClick',this.onAnswerClick,this);
        th=this;
        
    },
    start () {
       this.playerHud.updateInfo();
       GameManager.getInstance().GetQuestBank(function(resp)
       {
           GameManager.getInstance().questions=resp['questions'];
            th.chessBoard.setGrid();
            th.roundStart()
       });
        
    },
    roundStart()
    {
        GameManager.getInstance().gameState=gameEnum.GAME_STATE.CHESS;
        this.getChess();
    },
      //请求下一个棋子
    getChess()
    {
        GameManager.getInstance().GetNext(function(resp)
        {
            var questions=GameManager.getInstance().questions;
            var length=questions.length;
            for(var i=0;i<length;i++)
            {
                if(questions[i]['id'] == resp)
                {
                    GameManager.getInstance().curQuestionIdx=i;
                    th.chessBoard.OnNext();
                    th.excercisesBoard.OnNext();
                    break;
                }
            }
         
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

            }
            else
            {
                time_checkNextRound=0;
                GameManager.getInstance().gameState=gameEnum.GAME_STATE.WATCHING;
            }
            th.showQustion();  
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
        GameManager.getInstance().SendAnswer(event.getUserData(),function(resp){
        var result=resp['result'];
        if(result)
        {

        }
        else
        {
            var cfgId=GameManager.getInstance().questions[GameManager.getInstance().curQuestionIdx]['id'];
            GameManager.getInstance().GetAnswer(cfgId,function(resp){
                
            });
        }
        th.RefreshChessBorad();
        })
      
    },
    RefreshChessBorad()
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
                        }
                    }
                    break;
                }
            }
            th.nextRound();
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
        if(GameManager.getInstance().gameState == gameEnum.GAME_STATE.WATCHING)
        {
            time_checkNextRound+=dt;
            if(time_checkNextRound>=gameEnum.GameConst.INTERVAL_CHECKNEXTROUND)
            {
                time_checkNextRound=0;
                GameManager.getInstance().CheckNextRound(function(resp)
                {
                    if(GameManager.getInstance().curQuestionIdx != -1){
                        if(GameManager.getInstance().questions[GameManager.getInstance().curQuestionIdx]['id'] != resp)
                        {
                            th.RefreshChessBorad();
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
                        th.showQustion();  
                    }
                });
            }
        }
    },
});
