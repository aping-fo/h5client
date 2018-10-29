var GameManager=require("GameManager");
cc.Class({
    extends: cc.Component,

    properties: {
        btn_signup: {
            default: null,                                  
            type: cc.Button, 
            serializable: true,   
        },
    },


    onLoad () {
        this.btn_signup.node.on("click", this.onSignUpBtnClick, this);
    },

    start () {

    },
    onSignUpBtnClick(){
        GameManager.getInstance().SignUpMasterMatch(function(resp){
            console.log(resp);
        });
    }
    // update (dt) {},
});
