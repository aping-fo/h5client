cc.Class({
    extends: cc.Component,

    properties: {
        btn_pass: {
            default: null,                                  
            type: cc.Button, 
            serializable: true,   
        },
        btn_cancel: {
            default: null,                                  
            type: cc.Button, 
            serializable: true,   
        },
    },


    onLoad () {
        this.btn_pass.node.on("click", this.onPass, this);
        this.btn_cancel.node.on("click", this.onCancel, this);
    },

    start () {

    },
    onPass()
    {
        this.node.dispatchEvent( new cc.Event.EventCustom('onPassMatching', true) );
    },
    onCancel()
    {
        this.node.dispatchEvent( new cc.Event.EventCustom('onCancelMatching', true) );
    },
    // update (dt) {},
});
