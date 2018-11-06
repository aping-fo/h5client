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

        arenaPanel: {
            type: cc.Node,
            default: null
        },

        rankPanel: {
            type: cc.Node,
            default: null
        },

        reviewPanel: {
            type: cc.Node,
            default: null
        },

        testPanel: {
            type: cc.Node,
            default: null
        },

        toggleContainer: {
            type: cc.ToggleContainer,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        _this = this;
        GameManager.getInstance().oppInfo=null;
        WXTool.getInstance().wxOnShow(function(res){
            var lauchOption= res;
            _this.CheckJoin(lauchOption);
        });

        //toggle
        for(var i = 0; i < this.toggleContainer.toggleItems.length; i++){
            this.toggleContainer.toggleItems[i].node.on("toggle", this.onToggleBtnClick, this);
        }
        
        //info btn
        this.infoNode.on("click", this.onInfoNodeClick, this);
    },

    start () {
        GameManager.getInstance().PreLoadScene("matching");
        this.matchingBoard.node.active=false;
        GameManager.getInstance().gameState=gameEnum.GAME_STATE.HOME;
        var lauchOption=GameManager.getInstance().lauchOption;//启动参数
        this.CheckJoin(lauchOption);
    
        this.toggleContainer.toggleItems[2].check();

        this.node.getComponent(cc.Animation).play();
        
        this.updateMyInfo();

        var _this = this;
        GameManager.getInstance().GetRoleInfo(function(resp){
            _this.updateMyInfo(resp);
        });
    },
    CheckJoin(lauchOption)//检查是否被邀请进入战斗
    {
        if(lauchOption == null || lauchOption.query == null)
        {
            
        }
        else{//卡片启动流程
            var roomId=lauchOption.query.roomId;
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
    
    updateMyInfo(resp){
        this.infoNode.getChildByName("lb_name").getComponent(cc.Label).string = GameManager.getInstance().myInfo.wxName;      
        UIHelper.SetImageFromUrl(this.infoNode.getChildByName("img_avatar").getComponent(cc.Sprite), GameManager.getInstance().myInfo.iconUrl, true);

        if(resp != null){
            this.infoNode.getChildByName("lb_level").getComponent(cc.Label).string = "LV." + resp["level"];

            var _this = this;
            cc.loader.loadRes("texture/level/" + resp["level"], cc.SpriteFrame, function(err, spriteFrame){
                if(err){
                    cc.error(err.message || err);
                    return;
                }
                _this.infoNode.getChildByName("img_title").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });

            if(resp["levelUpExp"] == 0){
                this.infoNode.getChildByName("expProgress").getComponent(cc.ProgressBar).progress = 1;
            }else{
                this.infoNode.getChildByName("expProgress").getComponent(cc.ProgressBar).progress = resp["exp"] / resp["levelUpExp"];
            }
        }
    },

    onToggleBtnClick(toggle){

        // var titleStr = "";
        // var iconImg = "";
        // var btnStr = "";
        this.arenaPanel.active = false;
        this.rankPanel.active = false;
        this.reviewPanel.active = false;
        this.testPanel.active = false;
        this.infoNode.active = true;

        switch(toggle.node.name){
            case "arenaToggle":
                // titleStr = "竞技场";
                // iconImg = "texture/main/arena";
                // btnStr = "进入房间";
                this.arenaPanel.active = true;
                this.arenaPanel.getComponent(cc.Animation).playAdditive("main_arena_show");
                break;

            case "rankToggle":
                this.infoNode.active = false;
                this.rankPanel.active = true;
                break;

            case "testToggle":
                // titleStr = "体质自测";
                // iconImg = "texture/main/test";
                // btnStr = "进行自测";
                this.testPanel.active = true;
                this.testPanel.getComponent(cc.Animation).playAdditive("main_test_show");
                break;

            case "reviewToggle":
                this.reviewPanel.active = true;
                this.reviewPanel.getComponent(cc.Animation).playAdditive("main_review_show");

                // titleStr = "知识回顾";
                // iconImg = "texture/main/review";
                // btnStr = "确定";
                break;

            case "inviteToggle":
                // titleStr = "好友邀请";
                // iconImg = "texture/main/invite";
                break;
        }

        
        // if(toggle.node.name == "rankToggle"){
        //     this.normalPanel.active = false;
        //     this.rankPanel.active = true;
        // }else{
        //     this.normalPanel.active = true;
        //     this.rankPanel.active = false;
        // }

        // this.normalPanel.getChildByName("title").getChildByName("lb_name").getComponent(cc.Label).string = titleStr;
        // this.normalPanel.getChildByName("btn_enter").getChildByName("lb_content").getComponent(cc.Label).string = btnStr;
        // UIHelper.SetImageFromUrl(this.normalPanel.getChildByName("icon").getChildByName("img_icon").getComponent(cc.Sprite), iconImg, false);
    },

    onArenaBtnClick(btn){
        console.log("arena click");
        var _this = this;
        GameManager.getInstance().SendMatch(function(resp)
        {
            _this.onSendMatchBack(resp);
        }); 
    },

    onFightFriendBtnClick(btn){
        console.log("fight friend click");

    },

    onMasterBtnClick(btn){
        console.log("master click");

    },

    onSingleBtnClick(btn){
        console.log("Single click");
        var _this = this;
        GameManager.getInstance().SendRobotMatch(function(resp)
        {
            _this.onSendMatchBack(resp);
        }); 
    },

    onReviewTestBtnClick(btn){
        console.log("review test click");
    },

    onReviewQuestionBtnClick(btn){
        console.log("review questions click");

        var reviewPanel = cc.Canvas.instance.node.getChildByName("ReviewPanel");
        if(reviewPanel == null){
            reviewPanel = cc.instantiate(GameManager.getInstance().reviewPanel);
            reviewPanel.setParent(cc.Canvas.instance.node);
        }

        reviewPanel.active = true;
    },

    onReviewArenaBtnClick(btn){
        console.log("review arena click");

    },

    onReviewMasterBtnClick(btn){
        console.log("review master click");

    },

    onInfoNodeClick(btn){
        var playerInfoPanelNode = cc.Canvas.instance.node.getChildByName("PlayerInfoPanel");
        if(playerInfoPanelNode == null){
            playerInfoPanelNode = cc.instantiate(GameManager.getInstance().playerInfoPanel);
            playerInfoPanelNode.setParent(cc.Canvas.instance.node);
        }

        playerInfoPanelNode.active = true;
    },

    // onEnterBtnClick(btn){
    //     for(var i = 0; i < this.toggleContainer.toggleItems.length; i++){
    //         if(this.toggleContainer.toggleItems[i].isChecked){
    //             switch(this.toggleContainer.toggleItems[i].node.name){
    //                 case "arenaToggle":
    //                     GameManager.getInstance().SendMatch(function(resp)
    //                     {
    //                         _this.onSendMatchBack(resp);
    //                     }); 
    //                     break;

    //                 // case "rankToggle":
    //                 //     cc.director.loadScene("rank", function(){

    //                 //     });
    //                 //     break;

    //                 case "testToggle":
    //                 cc.director.loadScene("examOnly", function(){
                
    //                 });
    //                     break;

    //                 case "reviewToggle":
    //                     cc.director.loadScene("review", function(){
                
    //                     });
    //                     break;

    //                 case "inviteToggle":
    //                     GameManager.getInstance().CreateRoom(function(resp){
    //                         var roomId = resp;
    //                         console.log("roomId  "+roomId)
    //                         GameManager.getInstance().gameState = gameEnum.GAME_STATE.WAITING_OPPONENT;
    //                         WXTool.getInstance().shareToPlayTogether(roomId,function(){
    //                             GameManager.getInstance().LoadScene("matching");
    //                         });
    //                     }); 
    //                     break;
    //             }
    //         }
    //     }
    // },
    //自测分类按钮点击
    onTestBtnClick(event)
    {
        var category=parseInt(event.target.name.split("_")[1])-1;
        GameManager.getInstance().testCategory=category;
        cc.director.loadScene("examOnly", function(){
                
        });
    }

});
