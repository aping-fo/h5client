var GameManager = require("GameManager");
var Chess = require("Chess");
var chessAni=require("chessAni")
var aniSpeed_boardFadeIn=0.3;
var th=null;
var hightLightChess=null;
var gameEnum=require('GameEnum');
var countDown=require("CountDown");
cc.Class({
    extends: cc.Component,

    properties: {
        board: {
            default: null,                                  
            type: cc.Sprite, 
            serializable: true,   
        },
        chessPrefab: {
            default: null,                                  
            type: cc.Prefab, 
            serializable: true,   
        },
        chessGroup: {
            default: null,                                  
            type: cc.Layout, 
            serializable: true,   
        },
        atlas:
        {
            default: null, 
            type: cc.SpriteAtlas, // optional, default is typeof default
            serializable: true,   // optional, default is true
        },
        atlas_category:
        {
            default: null, 
            type: cc.SpriteAtlas, // optional, default is typeof default
            serializable: true,   // optional, default is true
        },
        black: {
            default: null,                                  
            type: cc.Sprite, 
            serializable: true,   
        },
        line: {
            default: null,                                  
            type: cc.Graphics, 
            serializable: true,   
        },
        grabBtn: {
            default: null,                                  
            type: cc.Button, 
            serializable: true,   
        },
        grabBtnOpp: {
            default: null,                                  
            type: cc.Button, 
            serializable: true,   
        },
        countDown: {
            default: null,                                  
            type: countDown, 
            serializable: true,   
        },
        countDownGrabing: {
            default: null,                                  
            type: countDown, 
            serializable: true,   
        },
        winAni: {
            default: null,                                  
            type: cc.Animation, 
            serializable: true,   
        },
        winAni2: {
            default: null,                                  
            type: cc.Animation, 
            serializable: true,   
        },
        chesses:[Chess],
        chesses_marked:[],
        winArr:null,
        winAniPosArr:null,
        categoryArr:null,
        isGrab:false,//是否已经被抢
        isOutTime:false,//是否超时
        isReqGrab:false//是否申请抢旗
    },


    onLoad () {
        this.isGrab=false;
        this.winAni.node.active=false;
        this.winAni2.node.active=false;
        this.winArr=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        this.winAniPosArr=[[0,199,0,0],[0,0,0,0],[0,-199,0,0],[-204,10,90,0],[0,10,90,0],[204,10,90,0],[0,0,0,1,1],[0,0,0,1,-1]];
        this.categoryArr=['养生误区','女性调养','运动起居','药膳食疗','睡眠养心','大师箴言']
        this.chesses=new Array();
        this.chesses_marked=new Array();
        th=this;
        for(var i=0;i<9;i++)
        {
            var chess=cc.instantiate(this.chessPrefab).getComponent(Chess);
            chess.lbl_catergory.string="";
            chess.node.parent=this.chessGroup.node;
            this.chesses.push(chess);
        }
        this.grabBtn.node.on("click", this.onChessClick, this);
        this.grabBtn.node.active=false;
        this.SetGrabBtnOppState(false);
        this.countDownGrabing.node.active=false;
        this.countDown.node.active=false;
    },

    start () {

       

    },
    //棋盘下一个出现的棋子（模拟）
    OnNextBySimulation(){
        if(this.chesses_marked.length>=9)
        {
            return;
        }
        var ran=0;
        do{
            ran=Math.random()* this.chesses.length
            ran=parseInt(ran);
        }while(this.chesses_marked.indexOf(ran) != -1);
        this.chesses_marked.push(ran);
        this.chesses[ran].sp_state.spriteFrame=this.atlas.getSpriteFrame("what");
    },
    OnNext()
    {
        this.isGrab=false;
        this.isOutTime=false;
        this.isReqGrab=false;
        th.countDownGrabing.reset();
        th.countDown.reset();
        this.SetGrabBtnOppState(false);
        // this.chesses[GameManager.getInstance().curQuestionIdx].sp_state.spriteFrame=this.atlas.getSpriteFrame("what");
        this.black.node.active=true;
        hightLightChess=cc.instantiate(this.chesses[GameManager.getInstance().curQuestionIdx].node);
        hightLightChess.getComponent(cc.Animation).stop();
        var sprite= hightLightChess.getComponent(cc.Sprite);
        sprite.spriteFrame=this.chesses[0].getComponent(cc.Sprite).spriteFrame;
        hightLightChess.on("click", this.onChessClick, this);
        hightLightChess.parent=this.node;
        chessAni.actionHightLight(this.black.node,hightLightChess,this.grabBtn);
        th.countDown.node.active=true; 
        th.countDown.startCountDown(gameEnum.GameConst.GRAB_WAIT_time+1,function(){
            th.countDown.node.active=false;
            if(!th.isReqGrab)
            {
                th.StartAutoGrab();
            }     
        },'抢答开始:')

        if(this.autoGrabCallBack != null)
        {
            th.unschedule(this.autoGrabCallBack);
        }
    },
    StartAutoGrab()
    {     
        if(this.isGrab)
        {
            return;
        }
        var delayTime=gameEnum.GameConst.GRAB_AUTO_time+Math.random();
        this.autoGrabCallBack=function() {
            var canGrab=this.grabBtn.node.active;
            if(canGrab)
            {
                th.isOutTime=!th.isReqGrab;
                th.onChessClick(null);
            }
           
       }
       th.scheduleOnce(this.autoGrabCallBack, delayTime);
       th.countDownGrabing.reset();
       th.countDownGrabing.node.active=true;
       th.countDownGrabing.startCountDown(gameEnum.GameConst.GRAB_AUTO_time+1,function(){
           th.countDownGrabing.node.active=false;
       },'抢答结束:');
    },
    SetGrabBtnOppState(isGrab)
    {
        this.isGrab=isGrab;
        this.grabBtnOpp.node.color=isGrab?new cc.Color(255,0,0):new cc.Color(135,135,135,100);
    },
    onChessClick(event){
        if(th.countDown.node.active)
        {
            return;
        }
        if(hightLightChess != null)
        {
            hightLightChess.getComponent(cc.Button).interactable = false;
        }
        if(event != null)
        {
            th.isOutTime=false;
            th.isReqGrab=true;//主动抢
        }
        th.countDownGrabing.node.active=false;
        this.grabBtn.node.active=false;
        // this.scheduleOnce(function() {
            th.node.dispatchEvent( new cc.Event.EventCustom('onChessClick', true) );      
            // th.black.node.active=false;
    //    }, 0.3);         
    },
    sendClickCallback()
    {
        if(hightLightChess != null)
        {
            hightLightChess.destroy()
            hightLightChess=null;
        }
    },
    result(index,isRight,isMe)
    {
        var spName;
        var side=isMe?GameManager.getInstance().myInfo['side']:GameManager.getInstance().oppInfo['side'];
        if(isRight)
        {
            spName=side == 0?'co':'cx';
        }
        else
        {
            spName=side == 0?'cx':'co';
        }
        this.chesses[index].sp_state.spriteFrame=this.atlas.getSpriteFrame(spName);
    },
    setGrid()
    {
        var questions=GameManager.getInstance().questions;
        var length=this.chesses.length;
        for(var i=0;i<length;i++)
        {
            // this.chesses[i].sp_state.spriteFrame=this.atlas_category.getSpriteFrame('p'+questions[i]['category']);
            var idx=parseInt(questions[i]['category'])-1;
            console.log(idx);
            this.chesses[i].lbl_catergory.string=this.categoryArr[idx];
        }
    },
    CheckWin()
    {
        var length=this.winArr.length;
        for(var i=0;i<length;i++)
        {
            if(this.chesses[this.winArr[i][0]].sp_state.spriteFrame == null)
            {
                continue;
            }
            var name=this.chesses[this.winArr[i][0]].sp_state.spriteFrame._name;
            if(this.CheckIsSame(this.chesses[this.winArr[i][1]],name) && this.CheckIsSame(this.chesses[this.winArr[i][2]],name))
            {
                
                // this.line.clear();
                // this.line.lineWidth = 5;
                // this.line.strokeColor = name == 'co'?cc.Color.GREEN:cc.Color.RED;
                // var startPos=this.chesses[this.winArr[i][0]].node.getPosition();
                // var endPos=this.chesses[this.winArr[i][2]].node.getPosition();
                // this.line.moveTo(startPos.x, startPos.y);
                // this.line.lineTo(endPos.x, endPos.y);
                // this.line.stroke();
                var winAniPosArr=this.winAniPosArr;
                var aniX=winAniPosArr[i][0];
                var aniY=winAniPosArr[i][1];
                var rot=winAniPosArr[i][2];
                var type=winAniPosArr[i][3];
                var ani=(type == 0)?this.winAni:this.winAni2;
                ani.node.setPosition(aniX,aniY);
                ani.node.rotation=rot;
                if(type == 1)
                {
                    var scale=winAniPosArr[i][4];
                    ani.node.setScale(scale);
                }
                ani.node.active=true;
                ani.playAdditive("WinAnim");
                th.grabBtn.node.active=false;
                if(name == 'co')
                {
                    return GameManager.getInstance().myInfo['side'] == 0;
                } 
                if(name == 'cx')
                {
                    return  GameManager.getInstance().myInfo['side'] == 1;
                } 
            }

        }
       
        if(GameManager.getInstance().cuRound>=9)
        {
            var countA;
            var countB;
            length=this.chesses.length;
            for(i=0;i<length;i++)
            {
                var name=this.chesses[i].sp_state.spriteFrame._name;
                if(name == 'co')
                {
                    countA=countA+1;
                }
                else
                {
                    countB=countB+1;
                }
            }
            var mySide=GameManager.getInstance().myInfo['side'];
            if(countA>countB && mySide == 0 || countA<countB && mySide == 1 )
            {
                return true;
            }
            else
            {
                return false;
            }
        }
       
        return null;
    },
    CheckIsSame(gridA,name)
    {
        if(gridA.sp_state.spriteFrame == null)
        {
            return false;
        }
        return gridA.sp_state.spriteFrame._name == name;
    },
    
   
    // update (dt) {},
});
