var WXTool = require("WXTool");
var GameManager = require("GameManager");
var _this = null;

cc.Class({
    extends: cc.Component,

    properties: {

        toggleContainer: {
            type: cc.ToggleContainer,
            default: null
        },

        // preBtn: {
        //     type: cc.Button,
        //     default: null
        // },

        // nextBtn: {
        //     type: cc.Button,
        //     default: null
        // }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        _this = this;

        for(var i = 0; i < this.toggleContainer.toggleItems.length; i++){
            this.toggleContainer.toggleItems[i].node.on("toggle", this.onToggleClick, this);
        }

        // this.preBtn.node.on("click", this.onPreBtnClick, this);
        // this.nextBtn.node.on("click", this.onNextBtnClick, this);
    },

    start () {
        this.m_globalPageIndex = 0;
        this.m_globalCountPerPage = 50;

        WXTool.getInstance().openRankPanel();
        
        this.toggleContainer.toggleItems[0].check();
    },

    update (dt) {
    },
    
    onToggleClick(toggle){
        if(toggle.node.name == "friendToggle"){
            WXTool.getInstance().openFriendRankPanel();

            // this.preBtn.node.active = false;
            // this.nextBtn.node.active = false;
        }else if(toggle.node.name = "globalToggle"){
            this.m_globalPageIndex = 0;

            let fromIndex = this.m_globalPageIndex;
            let toIndex = fromIndex + this.m_globalCountPerPage - 1;
            GameManager.getInstance().OpenGlobalRank(fromIndex, toIndex, this.getGlobalRankCallback)
            
            // this.preBtn.node.active = true;
            // this.nextBtn.node.active = true;
            // this.preBtn.interactable = false;
        }
    },

    // onPreBtnClick(event){
    //     var fromIndex = this.m_globalPageIndex - 1 >= 0 ? (this.m_globalPageIndex - 1) * this.m_globalCountPerPage : 0;
    //     let toIndex = fromIndex + this.m_globalCountPerPage - 1;
    //     GameManager.getInstance().OpenGlobalRank(fromIndex, toIndex, this.getGlobalRankCallback);
    // },

    // onNextBtnClick(event){
    //     let fromIndex = (this.m_globalPageIndex + 1) * this.m_globalCountPerPage;
    //     let toIndex = fromIndex + this.m_globalCountPerPage - 1;
    //     GameManager.getInstance().OpenGlobalRank(fromIndex, toIndex, this.getGlobalRankCallback);
    // },

    getGlobalRankCallback(from, count){
        _this.m_globalPageIndex = from / _this.m_globalCountPerPage;
        
        // _this.preBtn.interactable = _this.m_globalPageIndex != 0;
        // _this.nextBtn.interactable = count == _this.m_globalCountPerPage;
    }
});
