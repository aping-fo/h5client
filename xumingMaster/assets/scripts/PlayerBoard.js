var imageLoader=require('ImageLoader');
var GameManager = require("GameManager");
cc.Class({
    extends: cc.Component,

    properties: {
        lbl_me: {
            default: null,                                  
            type: cc.Label, 
            serializable: true,   
        },
        lbl_opp: {
            default: null,                                  
            type: cc.Label, 
            serializable: true,   
        },
        icon_me: {
            default: null,                                  
            type: cc.Sprite, 
            serializable: true,   
        },
        icon_opp: {
            default: null,                                  
            type: cc.Sprite, 
            serializable: true,   
        },
    },


    // onLoad () {},

    start () {

    },
    updateInfo()
    {
        if(GameManager.getInstance().myInfo != null)
        {
            this.lbl_me.string=GameManager.getInstance().myInfo.wxName;
            imageLoader.loadImg(this.icon_me,GameManager.getInstance().myInfo.iconUrl);
        }
        if(GameManager.getInstance().oppInfo != null)
        {
            this.lbl_opp.string=GameManager.getInstance().oppInfo.wxName;
            // imageLoader.loadImg(this.icon_me,GameManager.getInstance().myInfo.iconUrl);
        }
    },
    // update (dt) {},
});
