cc.Class({
    extends: cc.Component,

    properties: {
        sp_state: {
            default: null,                                  
            type: cc.Sprite, 
            serializable: true,   
        },
        sp_catergory: {
            default: null,                                  
            type: cc.Sprite, 
            serializable: true,   
        },
        lbl_catergory: {
            default: null,                                  
            type: cc.Label, 
            serializable: true,   
        },
    },


    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
