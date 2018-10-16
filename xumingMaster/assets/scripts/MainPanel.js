var WXTool = require("WXTool");
var GameManager = require("GameManager");
var gameEnum=require('GameEnum');

var matchingBoard=require('MatchingBoard')
var time_matching=0;
var th=null;
cc.Class({
    extends: cc.Component,

    properties: {
        btn_invite: {
            default: null,                                
            type: cc.Button, 
            serializable: true,   
        },

        btn_match: {
            default: null,                                
            type: cc.Button, 
            serializable: true,   
        },

        btn_rank: {
            default: null,                                
            type: cc.Button, 
            serializable: true,   
        },

        btn_robot: {
            default: null,                                
            type: cc.Button, 
            serializable: true,   
        },

        btn_challenge: {
            default: null,                                
            type: cc.Button, 
            serializable: true,   
        },
        matchingBoard: {
            default: null,                                
            type: matchingBoard, 
            serializable: true,   
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.btn_invite.node.on("click", this.onInvite, this);
        this.btn_match.node.on("click", this.onMatch, this);
        this.btn_rank.node.on("click", this.onViewRank, this);
        this.btn_robot.node.on("click", this.onPlayWithRobot, this);
        this.btn_challenge.node.on("click", this.onChallenge, this);
        this.node.on('onPassMatching',this.onPassMatching,this);

        GameManager.getInstance().callBack_matchSuc=this.OnMatchFinish;
        GameManager.getInstance().callBack_matchCheck=this.OnMatchCheckBack;
        th=this;
    },

    start () {
        this.matchingBoard.node.active=false;
        GameManager.getInstance().gameState=gameEnum.GAME_STATE.HOME;
    },
    onInvite(event){
        WXTool.getInstance().share();
    },
    onMatch(event){
        var th=this;
        GameManager.getInstance().SendMatch(function(resp)
        {
            th.onSendMatchBack(resp);
        }); 
    },
    onSendMatchBack(resp)
    {
         //成功,进入匹配状态
         if(resp.toString() == "ok")
         {
            this.matchingBoard.node.active=true;
            GameManager.getInstance().gameState=gameEnum.GAME_STATE.MATCHING;
            time_matching=0;
         }
       
    },
    onViewRank(event){
    },
    onPlayWithRobot(event){
        cc.director.loadScene("game", function(){
        });
    },
    onChallenge(event){
    },
    //测试用
    onPassMatching(event)
    {
        this.OnMatchFinish();
    },
    OnMatchFinish(resp)
    {
        this.matchingBoard.node.active=false;
        GameManager.getInstance().gameState=gameEnum.GAME_STATE.CHESS;
        cc.director.loadScene("game", function(){
        });
    },
    OnMatchCheckBack(resp)
    {
        console.log("checkMatching:"+resp['matchSuccess']);
        if(resp['matchSuccess'])
        {
            th.OnMatchFinish('');
        }
        
    },
    update (dt) {
        if(GameManager.getInstance().gameState == gameEnum.GAME_STATE.MATCHING)
        {
            time_matching+=dt;
            if(time_matching>=gameEnum.GameConst.INTERVAL_MATCHING)
            {
                time_matching=0;
                GameManager.getInstance().CheckMatch();
            }
        }
       
    },
});
