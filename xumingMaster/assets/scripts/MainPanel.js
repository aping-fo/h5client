var UIHelper = require("UIHelper");
var WXTool = require("WXTool");
var GameManager = require("GameManager");
var gameEnum=require('GameEnum');

var matchingBoard=require('MatchingBoard')

var _this = null;

cc.Class({
    extends: cc.Component,

    properties: {
        
        matchingBoard: {
            default: null,                                
            type: matchingBoard, 
            serializable: true,   
        },
        
        ///////////////////////////////////////////////////
        infoNode: {
            type: cc.Node,
            default: null
        },

        normalPanel: {
            type: cc.Node,
            default: null
        },

        rankPanel: {
            type: cc.Node,
            default: null
        },

        toggleContainer: {
            type: cc.ToggleContainer,
            default: null
        },

        enterBtn: {
            type: cc.Button,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        _this = this;
        GameManager.getInstance().oppInfo=null;
        WXTool.getInstance().wxOnShow(function(res){
            var lauchOption= res.query;
            _this.CheckJoin(lauchOption);
        });

        //toggle
        for(var i = 0; i < this.toggleContainer.toggleItems.length; i++){
            this.toggleContainer.toggleItems[i].node.on("toggle", this.onToggleBtnClick, this);
        }
        //enter btn
        this.enterBtn.node.on("click", this.onEnterBtnClick, this);
        
        //info btn
        this.infoNode.on("click", this.onInfoNodeClick, this);
    },

    start () {
        GameManager.getInstance().PreLoadScene("matching");
        this.matchingBoard.node.active=false;
        GameManager.getInstance().gameState=gameEnum.GAME_STATE.HOME;
        var lauchOption=GameManager.getInstance().lauchOption;//启动参数
        this.CheckJoin(lauchOption);
    
        this.updateMyInfo();
        this.toggleContainer.toggleItems[2].check();
    },
    CheckJoin(lauchOption)//检查是否被邀请进入战斗
    {
        if(lauchOption == null)
        {
            
        }
        else{//卡片启动流程
            var roomId=lauchOption.roomId;
            console.log("roomId:"+roomId)
            if(roomId != null)
            {
                //加入房间
                GameManager.getInstance().JoinRoom(roomId,function(resp){
                    GameManager.getInstance().LoadScene("matching");
                });
            }
        }
    },

    onSendMatchBack(resp)
    {
         //成功,进入匹配状态
         if(resp.toString() == "ok")
         {
            GameManager.getInstance().gameState=gameEnum.GAME_STATE.MATCHING;
            GameManager.getInstance().LoadScene("matching");
         }
    },

    onPlayWithRobot(event){
        cc.director.loadScene("game", function(){
        });
    },
    onChallenge(event){
        cc.director.loadScene("masterMatch", function(){
        });
    },

    update (dt) {

       
    },
    
    updateMyInfo(){
        this.infoNode.getChildByName("lb_name").getComponent(cc.Label).string = GameManager.getInstance().myInfo.wxName;      
        UIHelper.SetImageFromUrl(cc.find('mask/img_avatar',this.infoNode).getComponent(cc.Sprite), GameManager.getInstance().myInfo.iconUrl, true);
    },

    onToggleBtnClick(toggle){
        var titleStr = "";
        var iconImg = "";
        var btnStr = "";

        switch(toggle.node.name){
            case "arenaToggle":
                titleStr = "竞技场";
                iconImg = "texture/main/arena";
                btnStr = "进入房间";
                break;

            case "rankToggle":
                break;

            case "testToggle":
                titleStr = "体质自测";
                iconImg = "texture/main/test";
                btnStr = "进行自测";
                break;

            case "reviewToggle":
                titleStr = "知识回顾";
                iconImg = "texture/main/review";
                btnStr = "确定";
                break;

            case "inviteToggle":
                titleStr = "好友邀请";
                iconImg = "texture/main/invite";
                break;
        }

        
        if(toggle.node.name == "rankToggle"){
            this.normalPanel.active = false;
            this.rankPanel.active = true;
        }else{
            this.normalPanel.active = true;
            this.rankPanel.active = false;
        }

        this.normalPanel.getChildByName("title").getChildByName("lb_name").getComponent(cc.Label).string = titleStr;
        this.normalPanel.getChildByName("btn_enter").getChildByName("lb_content").getComponent(cc.Label).string = btnStr;
        UIHelper.SetImageFromUrl(this.normalPanel.getChildByName("icon").getChildByName("img_icon").getComponent(cc.Sprite), iconImg, false);



        for(var i = 0; i < this.toggleContainer.toggleItems.length; i++){
            if(this.toggleContainer.toggleItems[i].isChecked){
                this.toggleContainer.toggleItems[i].node.scale = new cc.Vec2(1.3, 1.3);
            }else{
                this.toggleContainer.toggleItems[i].node.scale = cc.Vec2.ONE;
            }
        }
    },

    onEnterBtnClick(btn){
        for(var i = 0; i < this.toggleContainer.toggleItems.length; i++){
            if(this.toggleContainer.toggleItems[i].isChecked){
                switch(this.toggleContainer.toggleItems[i].node.name){
                    case "arenaToggle":
                        GameManager.getInstance().SendMatch(function(resp)
                        {
                            _this.onSendMatchBack(resp);
                        }); 
                        break;

                    // case "rankToggle":
                    //     cc.director.loadScene("rank", function(){

                    //     });
                    //     break;

                    case "testToggle":
                        break;

                    case "reviewToggle":
                        cc.director.loadScene("review", function(){
                
                        });
                        break;

                    case "inviteToggle":
                        GameManager.getInstance().CreateRoom(function(resp){
                            var roomId = resp;
                            console.log("roomId  "+roomId)
                            GameManager.getInstance().gameState = gameEnum.GAME_STATE.WAITING_OPPONENT;
                            WXTool.getInstance().shareToPlayTogether(roomId,function(){
                                GameManager.getInstance().LoadScene("matching");
                            });
                        }); 
                        break;
                }
            }
        }
    },

    onInfoNodeClick(btn){
        var playerInfoPanelNode = cc.Canvas.instance.node.getChildByName("PlayerInfoPanel");
        if(playerInfoPanelNode == null){
            playerInfoPanelNode = cc.instantiate(GameManager.getInstance().playerInfoPrefab);
            playerInfoPanelNode.setParent(cc.Canvas.instance.node);
        }

        playerInfoPanelNode.active = true;
    }

});
