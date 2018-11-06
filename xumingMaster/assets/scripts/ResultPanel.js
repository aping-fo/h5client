var GameManager=require("GameManager");
var HistoryQuestionModel = require("HistoryQuestionModel");
var ReviewNode = require("ReviewNode");

cc.Class({
    extends: cc.Component,

    properties: {
        btn_continue: {
            default: null,                                  
            type: cc.Button, 
            serializable: true,   
        },
        node_win: {
            default: null,                                  
            type: cc.Node, 
            serializable: true,   
        },
        node_lose: {
            default: null,                                  
            type: cc.Node, 
            serializable: true,   
        },

        // node_review: {
        //     type: ReviewNode,
        //     default: null
        // }
    },


    onLoad () {
        this.btn_continue.node.on("click", this.onContinue, this);
    },

    start () {

    },
    onContinue(event){
        GameManager.getInstance().LoadScene("main")
    },

    showResult(result)
    {
        this.node_win.active=result;
        this.node_lose.active=!result;
        this.saveHistoryQuestions();
    },

    saveHistoryQuestions(){
        var _this = this;
        var reviewNode = cc.find("ReviewNode", cc.Canvas.instance.node);

        if(reviewNode == null){
            reviewNode = cc.instantiate(GameManager.getInstance().reviewNode);
            reviewNode.setParent(cc.Canvas.instance.node);
        }
        
        HistoryQuestionModel.getInstance().getDatas(function(resp){
            console.log("HistoryQuestionModel", resp);
            reviewNode.getComponent(ReviewNode).saveImageWithDatas(resp.questions);
        });
    }
    // update (dt) {},
});
