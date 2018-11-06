var WXTool = require("WXTool");
var GameManager = require("GameManager");
var _this = null;

cc.Class({
    extends: cc.Component,

    properties: {

        toggleContainer: {
            type: cc.ToggleContainer,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var _this = this;

        for(var i = 0; i < this.toggleContainer.toggleItems.length; i++){
            this.toggleContainer.toggleItems[i].node.on("toggle", this.onToggleClick, this);
        }
    },

    start () {
        this.m_globalPageIndex = 0;
        this.m_globalCount = 50;

        WXTool.getInstance().openRankPanel();
        
        this.toggleContainer.toggleItems[0].check();
    },

    update (dt) {
    },
    
    onToggleClick(toggle){
        if(toggle.node.name == "friendToggle"){
            WXTool.getInstance().openFriendRankPanel();
        }else if(toggle.node.name = "globalToggle"){
            GameManager.getInstance().OpenGlobalRank(0, this.m_globalCount, this.getGlobalRankCallback)
        }
    }
});
