cc.Class({
    extends: cc.Component,

    properties: {
        group: {
            default: null,                                  
            type: cc.Node, 
            serializable: true,   
        },
        btn: {
            default: null,                                  
            type: cc.Button, 
            serializable: true,   
        },
        faces:[cc.Button]
    },


    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
