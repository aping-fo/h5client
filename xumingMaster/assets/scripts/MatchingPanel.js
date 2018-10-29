var playerBoard=require('PlayerBoard')
var GameManager = require("GameManager");
var gameEnum=require('GameEnum');
var time_matching=0;
var _this = null;
cc.Class({
    extends: cc.Component,

    properties: {
        playerBoard: {
            default: null,                                  
            type: playerBoard, 
            serializable: true,   
        },

        lbl_title: {
            default: null,                                  
            type: cc.Label, 
            serializable: true,   
        },
        btn_back: {
            default: null,                                  
            type: cc.Button, 
            serializable: true,   
        },
    },


    onLoad () {
        _this=this;
        GameManager.getInstance().callBack_matchSuc=this.OnMatchFinish;
        GameManager.getInstance().callBack_matchCheck=this.OnMatchCheckBack;
        this.btn_back.node.on("click", this.onCancelMatching, this);
    },

    start () {
        GameManager.getInstance().PreLoadScene("game");
       if( GameManager.getInstance().gameState==gameEnum.GAME_STATE.MATCHING)
       {
           this.lbl_title.string="正在匹配中..."
       }
       else
       {
        this.lbl_title.string="正在邀请中..."
       }
        this.playerBoard.updateInfo();
    },

    update (dt) {
        if(GameManager.getInstance().gameState==gameEnum.GAME_STATE.CHESS)
        {
            return;
        }
       
        time_matching+=dt;
        if(time_matching>=gameEnum.GameConst.INTERVAL_MATCHING)
        {
            time_matching=0;
            GameManager.getInstance().CheckMatch();
        }
    },

    OnMatchFinish(resp)
    {
        var length=resp.length;
        for(var i=0;i<length;i++)
        {
            if(resp[i]['openId'] == GameManager.getInstance().myInfo.openId)
            {
                GameManager.getInstance().myInfo['side']=i;
            }
            else{
                GameManager.getInstance().oppInfo={wxName:resp[i]['nickName'],iconUrl:resp[i]['iconUrl'],openId:i,side:i, robot:resp[i]['robot']};
            }
        }
        this.playerBoard.updateInfo();
        GameManager.getInstance().gameState=gameEnum.GAME_STATE.CHESS;
        _this.scheduleOnce(function() {
            GameManager.getInstance().LoadScene("game");
       }, 1);
       
    },
    OnMatchCheckBack(resp)
    {
        console.log("checkMatching:"+resp['matchSuccess']);
        if(resp['matchSuccess'])
        {
            _this.OnMatchFinish(resp['roles']);
        }
        
    },

    onCancelMatching(event)
    {

        GameManager.getInstance().CancelMatch(function(resp){
            if(resp.toString() == "ok")
            {
                GameManager.getInstance().gameState=gameEnum.GAME_STATE.HOME;
                cc.director.loadScene("main",function(){})
            }
        });
    },
});
