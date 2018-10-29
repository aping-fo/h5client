var GameManager = require("GameManager");
var chessBoard=require("ChessBoard");
var excercisesBoard=require("ExcercisesBoard");
var gameEnum=require('GameEnum');
var playerHud=require('PlayerBoard');
var th=null;
var time_checkNextRound=0;
var time_checkChessState=0;
var answerSent=false;
var chessAni=require('chessAni');
var excerciseAni=require('excerciseAni');
var resultPanel=require('ResultPanel');
var winorwrongpanel=require('WinOrWrongPanel');
var winorwrongani=require('rightOrWrongAni');
var Robot = require("Robot");

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
        resultPanel: {
            default: null,                                  
            type: resultPanel, 
            serializable: true,   
        },
        winorwrongPanel: {
            default: null,                                  
            type: winorwrongpanel, 
            serializable: true,   
        },
        tips: {
            default: null,                                  
            type: cc.Sprite, 
            serializable: true,   
        },
    },


    onLoad () {
        this.resultPanel.node.active=false;
        this.tips.node.active=false;
        this.winorwrongPanel.node.active=false;
        GameManager.getInstance().callBack_matchCheck=this.OnMatchCheckBack;
        this.node.on('onChessClick',this.onChessClick,this);
        this.node.on('onAnswerClick',this.onAnswerClick,this);
        th=this;
    },

    start () {
       this.init();
       var chessBg=cc.find("Canvas/chessboard/board")
       var grid=new Array();
       for(var i=0;i<9;i++)
       {
           grid.push(th.chessBoard.chesses[i].node)
       }
       chessAni.init(chessBg,grid,function(){
        th.GetQuestBankCategory();
       });

       winorwrongani.init(cc.find("Canvas/rightOrWroghtPanel/bg"),cc.find("Canvas/rightOrWroghtPanel/content"),cc.find("Canvas/rightOrWroghtPanel"));

     var exBg=cc.find("Canvas/excercisesBoard/bg")
        var exTitleBg=cc.find("Canvas/excercisesBoard/bg_lbl")
        var exTitle=cc.find("Canvas/excercisesBoard/lbl_title");
        var answers=new Array();
        answers.push(cc.find("Canvas/excercisesBoard/answerGroup/answerA"))
        answers.push(cc.find("Canvas/excercisesBoard/answerGroup/answerB"))
        answers.push(cc.find("Canvas/excercisesBoard/answerGroup/answerC"))
        answers.push(cc.find("Canvas/excercisesBoard/answerGroup/answerD"))
        excerciseAni.init(exBg,exTitleBg,exTitle,answers)
       

       this.chessBoard.node.active=true;
       chessAni.action();
      
       
    },
    init()
    {
        GameManager.getInstance().curRound=0;
        this.playerHud.updateInfo();
        th.playerHud.timeCounter_me.node.active=false;
        th.playerHud.timeCounter_opp.node.active=false;
        th.playerHud.lbl_watching.node.active=false;
        this.chessBoard.node.active=false;
        this.excercisesBoard.node.active=false;
       
        GameManager.getInstance().questions=new Array();
        for(var i=0;i<9;i++)
        {
            var qst={id:'1',catergory:1,title:''};
            GameManager.getInstance().questions.push(qst);
        }
      
       
       
    },
    GetQuestBankCategory()
    {
        GameManager.getInstance().GetQuestBankCategory(function(resp)
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
        answerSent=false;
        this.tips.node.active=false;
        this.playerHud.timeCounter_me.node.active=false;
        this.playerHud.timeCounter_opp.node.active=false;
        this.resultPanel.node.active=false;
        this.chessBoard.node.active=true;
        GameManager.getInstance().curRound=GameManager.getInstance().curRound+1;
        GameManager.getInstance().gameState=gameEnum.GAME_STATE.CHESS;
        this.getChess();
    },
      //请求下一个棋子
    getChess()
    {
        if(th.winorwrongPanel.node.active)
        {
            winorwrongani.actionClose();
        }
       
        GameManager.getInstance().GetNext(function(resp)
        {
            GameManager.getInstance().curQuestionIdx=resp;
            th.chessBoard.OnNext();

            console.log(GameManager.getInstance().oppInfo.robot);
            if(GameManager.getInstance().oppInfo.robot){
                Robot.getInstance().grabChess();
            }
        });
        
    },
    onChessClick(event)
    {

        event.stopPropagation();
        var delay
        GameManager.getInstance().GrabChess(0,function(resp)
        { 
            var isGrab=th.chessBoard.isGrab;//加层判断，防止协议迟延
            //抢中
            if(resp['result'])
            {
                var qst=resp['question'];
                var idx=qst['index'];
                GameManager.getInstance().questions[idx]=qst;
                th.excercisesBoard.OnNext();
                th.playerHud.timeCounter_me.node.active=true;
                th.playerHud.timeCounter_opp.node.active=false;
                th.playerHud.lbl_watching.node.active=false;
                delay=gameEnum.GameConst.DELAY_SHOW_EXCERCISES;
                th.playerHud.startTimeCount(th.playerHud.timeCounter_me,gameEnum.GameConst.ANSWER_TIME,function(){
                            
                    var random=parseInt(Math.random()*4)
                    th.SendAnswer(random);
                });
                if(th.chessBoard.isOutTime)
                {
                     th.showTips("无人抢答");
                     th.scheduleOnce(function() {
                        th.showTips("随机分配给 "+GameManager.getInstance().myInfo.wxName);
                    }, 1.1);
                }
                else
                {
                    th.showTips("抢答成功");
                }
            }
            else
            {
                time_checkNextRound=0;
                // GameManager.getInstance().gameState=gameEnum.GAME_STATE.WATCHING;
                // th.playerHud.timeCounter_me.node.active=false;
                // th.playerHud.timeCounter_opp.node.active=true;
                // th.playerHud.lbl_watching.node.active=true;
                // th.playerHud.startTimeCount(th.playerHud.timeCounter_opp,gameEnum.GameConst.ANSWER_TIME);
                // delay=gameEnum.GameConst.DELAY_SHOW_EXCERCISES_WATCHER;

                if(!th.chessBoard.isOutTime)
                {
                    th.showTips("抢答失败");
                }
                else
                {
                    th.showTips("无人抢答");
                    th.scheduleOnce(function() {
                        th.showTips("随机分配给 "+GameManager.getInstance().oppInfo.wxName);
                   }, 1.1);
                }

                return;
            }
            th.scheduleOnce(function() {
                 th.showQustion();  
            }, delay);
           
        });
    },
    showQustion()
    {
       th.chessBoard.sendClickCallback();
       th.chessBoard.node.active=false;
       th.excercisesBoard.node.active=true;
       excerciseAni.action();

       if(GameManager.getInstance().gameState == gameEnum.GAME_STATE.WATCHING && GameManager.getInstance().oppInfo.robot){
           //如果是对方答题 而且对方是Robot
           Robot.getInstance().answerQuest();
       }
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
        if(answerSent)
        {
            return;
        }
        var selectedIdx=event.getUserData();
        th.playerHud.stopTimeCount();
        th.SendAnswer(selectedIdx)
      
    },
    SendAnswer(selectedIdx)
    {
        GameManager.getInstance().SendAnswer(selectedIdx,function(resp){
            answerSent=true;
            var result=resp['result'];
            if(result)
            {
                th.excercisesBoard.ShowAnswerSign(selectedIdx,true);
            }
            else
            {
                var cfgId=GameManager.getInstance().questions[GameManager.getInstance().curQuestionIdx]['id'];
                GameManager.getInstance().GetAnswer(cfgId,function(resp){
                    th.excercisesBoard.ShowAnswerSign(resp['answer'],true);
                });
                th.excercisesBoard.ShowAnswerSign(selectedIdx,result);
            }
            
                th.RefreshChessBorad();
                th.winorwrongPanel.node.active=true;
                th.winorwrongPanel.result(result);
                winorwrongani.action()
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
                    th.chessBoard.result(GameManager.getInstance().curQuestionIdx,data[i]['result'],data[i]['openid'] == GameManager.getInstance().myInfo['openId']);
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
            th.showResult(isWin);
          
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
                        var curQstId=GameManager.getInstance().questions[GameManager.getInstance().curQuestionIdx]['id'];
                        if(GameManager.getInstance().curQuestionIdx != resp)
                        {                      
                            GameManager.getInstance().GetAnswer(curQstId,function(resp){
                                th.excercisesBoard.ShowAnswerSign(resp['answer'],true);
                                if(resp['answer'] != resp['postAnswer'])
                                {
                                    th.excercisesBoard.ShowAnswerSign(resp['postAnswer'],false);
                                }
                                th.playerHud.stopTimeCount();
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
                        th.playerHud.timeCounter_me.node.active=false;
                        th.playerHud.timeCounter_opp.node.active=true;
                        th.playerHud.lbl_watching.node.active=true;
                        th.playerHud.startTimeCount(th.playerHud.timeCounter_opp,gameEnum.GameConst.ANSWER_TIME);
                        var qst=resp['question'];
                        var idx=qst['index'];
                        GameManager.getInstance().questions[idx]=qst;
                        th.excercisesBoard.OnNext();
                        th.chessBoard.SetGrabBtnOppState(true)
                        th.scheduleOnce(function() {
                            th.showQustion();  
                       }, gameEnum.GameConst.DELAY_SHOW_EXCERCISES_WATCHER);
                       th.chessBoard.countDownGrabing.node.active=false;
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
                th.GetQuestBankCategory();
            }, gameEnum.GameConst.DELAY_GAME_START);
          
        }
        
    },

    //本局结果
    showResult(result)
    {
        winorwrongani.actionClose();
        this.resultPanel.node.active=true;
        this.excercisesBoard.node.active=false;
        this.chessBoard.node.active=true;
        this.resultPanel.showResult(result);
    },
    showTips(content)
    {
        this.tips.node.active=true;
        cc.find("lbl",this.tips.node).getComponent(cc.Label).string=content;
        this.scheduleOnce(function() {
            this.tips.node.active=false;    
       }, 1);
    }
});
