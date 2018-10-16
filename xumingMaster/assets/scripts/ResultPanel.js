cc.Class({
    extends: cc.Component,

    properties: {
        btn_continue: {
            default: null,                                  
            type: cc.Button, 
            serializable: true,   
        },
    },


    onLoad () {
        this.btn_continue.node.on("click", this.onContinue, this);
    },

    start () {

    },
    onContinue(event){
        cc.director.loadScene("main", function(){
    })},
    // update (dt) {},
});
