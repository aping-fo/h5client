// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var HistoryQuestionModel = require("HistoryQuestionModel");
var _this = null;

cc.Class({
    extends: cc.Component,

    properties: {
        contentNode:{
            type: cc.Node,
            default: null
        },
        
        closeBtn:{
            type: cc.Button,
            default: null
        },

        scrollView: {
            type: cc.ScrollView,
            default: null
        },

        currentRequestIndex: 0,
        refreshCount: 6,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        _this = this;
        
        this.scrollView.node.on("scroll-to-bottom", this.onScrollToBottom, this)
        this.closeBtn.node.on("click", this.onCloseBtnClick, this);
    },

    start () {
        
    },

    onEnable(){
        this.currentRequestIndex = 0;

        HistoryQuestionModel.getInstance().getData(this.currentRequestIndex, this.currentRequestIndex + this.refreshCount - 1, this.onDataUpdateCallback);
    },

    onScrollToBottom(){
        console.log(this.currentRequestIndex);
        HistoryQuestionModel.getInstance().getData(this.currentRequestIndex, this.currentRequestIndex + this.refreshCount - 1, this.onDataUpdateCallback);
    },

    onCloseBtnClick(){
        cc.director.loadScene("main");
    },

    onDataUpdateCallback(datas, from, to){
        if(datas.length == 0){
            //无数据
            for(var i = 0; i < _this.contentNode.childrenCount; i++){
                if(i == 0){
                    _this.contentNode.children[i].getChildByName("content").getComponent(cc.Label).string = "空";
                    _this.contentNode.children[i].getChildByName("answer").active = false;
                    _this.contentNode.children[i].getChildByName("explain").active = false;
                }else{
                    _this.contentNode.children[i].active = false;
                }
            }
        }else{
            for(var i = from; i <= to; i++){
                var item = null;

                if(i < _this.contentNode.childrenCount){
                    item = _this.contentNode.children[i];
                }else{
                    item = cc.instantiate(_this.contentNode.children[0]);
                    item.setParent(_this.contentNode);
                }
                
                if(datas[i] == null){
                    item.active = false;
                }else{
                    item.active = true;
                    item.getChildByName("content").getComponent(cc.Label).string = datas[i].content;
                    item.getChildByName("answer").getComponent(cc.Label).string = datas[i].answer;
                    item.getChildByName("explain").getComponent(cc.Label).string = datas[i].explain;
                    item.getChildByName("answer").active = true;
                    item.getChildByName("explain").active = true;
            
                    _this.currentRequestIndex = i + 1;
                }
            }
        }
    }
});
