// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var UIHelper = require("UIHelper");
var HistoryQuestionModel = require("HistoryQuestionModel");

cc.Class({
    extends: cc.Component,

    properties: {
        pageHeight: 0
    },

    onLoad () {

    },

    start () {

    },

    saveImageWithDatas(datas){
        for(var i = 0; i < this.node.children.length; i++){
            this.node.children[i].active = false;
        }

        for(var i = 0; i < datas.length; i++){
            var item = null;
            var data = datas[i];

            if(i >= this.node.children.length){
                item = cc.instantiate(this.node.children[0]);
                item.setParent(this.node);
            }else{
                item = this.node.children[i];
            }
            item.active = true;

            cc.find("img_num/lb_num", item).getComponent(cc.Label).string = String(i + 1);

            var content = item.getChildByName("content");
            content.getChildByName("lb_content").getComponent(cc.Label).string = data.content;
            content.getChildByName("lb_answer").getComponent(cc.Label).string = "正确答案：" + data.answer;
            content.getChildByName("lb_explain").getComponent(cc.Label).string = data.explain;

            content.getComponent(cc.Layout).updateLayout();
        }
        this.node.getComponent(cc.Layout).updateLayout();
        
        UIHelper.SaveNodeRender(this.node, this.pageHeight, true, function(path){
            if(path != ""){
                console.log("capture image: " + path);
                HistoryQuestionModel.getInstance().addImageUrl(path);
            }
        });
        
        this.node.active = false;
    }
    // update (dt) {},
});
