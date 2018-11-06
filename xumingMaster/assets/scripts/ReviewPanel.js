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
var UIHelper = require("UIHelper");
var WXTool = require("WXTool");

cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn:{
            type: cc.Button,
            default: null
        },

        pageView: {
            type: cc.PageView,
            default: null
        },

        saveNode: {
            type: cc.Node,
            default: null
        },

        saveHeigth: 1100
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.closeBtn.node.on("click", this.onCloseBtnClick, this);
    },

    start () {
        this.saveNode.active = false;
    },

    onEnable(){
        var urls = HistoryQuestionModel.getInstance().getImageUrl();
        if(urls == ""){
            return;
        }
        
        var _this = this;
        // var urls = ["http://store/wxb00112803f6343cc.o6zAJs3THykzIJZt_MS93q3Pz9-Q.B1tmZtoZCjRaefb562478882cee062e29850b83ccb91.png", "http://store/wxb00112803f6343cc.o6zAJs3THykzIJZt_MS93q3Pz9-Q.uQ5javSjDzmtefb562478882cee062e29850b83ccb91.png", "http://store/wxb00112803f6343cc.o6zAJs3THykzIJZt_MS93q3Pz9-Q.uWQv2z4cfZenefb562478882cee062e29850b83ccb91.png"];
        // var urls = ["texture/main/arena", "texture/main/invite", "texture/main/rank"];
        var textures = [];
        for(var i = 0; i < urls.length; i++){
            if(urls[i] != ""){  
                console.log("load image : " + urls[i]);
                cc.loader.load(urls[i], function(err, texture) {
                    if (err) {
                        cc.error(err.Message || err);
                        return;
                    }
                    
                    textures.push(texture);
                    if(textures.length == urls.length){
                        for(var i = 0; i < textures.length; i++){
                            _this.updatePage(textures[i], i);
                        }
                    }
                });
            }
        }
    },

    updatePage(texture, index){
        var pages = this.pageView.getPages();
        var page = null;

        if(index >= pages.length){
            page = cc.instantiate(pages[0]);
            this.pageView.addPage(page);
        }else{
            page = pages[index];
        }

        cc.find("scrollView/view/content", page).getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
    },

    saveImageToAlbum(){
        var curPage = this.pageView.getPages()[this.pageView.getCurrentPageIndex()];
        var spriteFrame = cc.find("scrollView/view/content", curPage).getComponent(cc.Sprite).spriteFrame;

        this.saveNode.getChildByName("image").getComponent(cc.Sprite).spriteFrame = spriteFrame;
        this.saveNode.height = Math.max(this.saveHeigth, this.saveNode.getChildByName("image").height);
        
        
        UIHelper.SaveNodeRender(this.saveNode, this.saveHeigth, false, function(path){
            if(path != ""){
                WXTool.getInstance().saveImageToAlbum(path, function(result){
                    if(result == "success"){
                        console.log("成功");
                    }else{
                        console.log("失败");
                    }
                });
            }
        });
    },

    onSaveBtnClick(btn){
        this.saveImageToAlbum();
    },

    onCloseBtnClick(btn){
        this.node.active = false;
    }
});
