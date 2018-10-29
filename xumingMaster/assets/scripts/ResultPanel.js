var GameManager=require("GameManager");
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
    }
    // update (dt) {},
});
