cc.Class({
    extends: cc.Component,

    properties: {
        right: {
            default: null,                                  
            type: cc.Node, 
            serializable: true,   
        },
        wrong: {
            default: null,                                  
            type: cc.Node, 
            serializable: true,   
        },
    },


    // onLoad () {},

    start () {

    },
    result(isWin)
    {
        this.right.active=isWin;
        this.wrong.active=!isWin;
    },

    // update (dt) {},
});
