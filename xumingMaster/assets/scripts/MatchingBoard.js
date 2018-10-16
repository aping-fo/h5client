cc.Class({
    extends: cc.Component,

    properties: {
        btn_pass: {
            default: null,                                  
            type: cc.Button, 
            serializable: true,   
        },
    },


    onLoad () {
        this.btn_pass.node.on("click", this.onPass, this);
    },

    start () {

    },
    onPass()
    {
        this.node.dispatchEvent( new cc.Event.EventCustom('onPassMatching', true) );
    },
    // update (dt) {},
});
