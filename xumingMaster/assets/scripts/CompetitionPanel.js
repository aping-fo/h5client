var GameManager = require("GameManager");
var chessBoard=require("ChessBoard");
var excercisesBoard=require("ExcercisesBoard");
var gameEnum=require('GameEnum');
var playerHud=require('PlayerBoard');
var th=null;
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
       GameManager.getInstance().GetChessBoardInfo(function(resp)
       {
            th.roundStart()
       } 
       );  
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
            th.getChessBack();
        });
        
    },
    getChessBack()
    {
        //this.chessBoard.OnNext();
        this.chessBoard.OnNextBySimulation();
    },
    onChessClick(event)
    {
        event.stopPropagation();
        GameManager.getInstance().GrabChess(0,function(resp)
        {
            th.SendChesssClickBack();
        });
    },
    SendChesssClickBack()
    {
        this.getQustion();    
    },
    getQustion()
    {
        GameManager.getInstance().GetQuestBank(this.getQustionBack);
        
    },
    getQustionBack(resp)
    {
        th.chessBoard.node.active=false;
        th.excercisesBoard.node.active=true;
    },
    onAnswerClick(event)
    {
        event.stopPropagation();
        GameManager.getInstance().SendAnswer(0,function(resp){
            th.SendAnswerBack();
        })
      
    },
    SendAnswerBack()
    {
       this.chessBoard.resultBySimulation(1);
       this.nextRound();
    },
    nextRound()
    {  
        this.chessBoard.node.active=true;
        this.excercisesBoard.node.active=false;
        this.roundStart();
    },
  
    // update (dt) {},
});
