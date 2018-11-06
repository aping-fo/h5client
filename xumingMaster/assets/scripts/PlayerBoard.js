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
        timeCounter_me: {
            default: null,                                  
            type: cc.ProgressBar, 
            serializable: true,   
        },
        timeCounter_opp: {
            default: null,                                  
            type: cc.ProgressBar, 
            serializable: true,   
        },
        side_me: {
            default: null,                                  
            type: cc.Sprite, 
            serializable: true,   
        },
        side_opp: {
            default: null,                                  
            type: cc.Sprite, 
            serializable: true,   
        },
        side_opp: {
            default: null,                                  
            type: cc.Sprite, 
            serializable: true,   
        },
        side_xFrame: {
            default: null,                                  
            type: cc.SpriteFrame, 
            serializable: true,   
        },
        side_oFrame: {
            default: null,                                  
            type: cc.SpriteFrame, 
            serializable: true,   
        },
        lbl_watching: {
            default: null,                                  
            type: cc.Label, 
            serializable: true,   
        },
        isTimeCountStart:false,
        timeTotal:0,
        timeCount:0,
        timeCountTarget:null,
        timeCountLbl:null
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
            if(this.side_me != null)
            {
                this.side_me.spriteFrame=GameManager.getInstance().myInfo.side == 0?this.side_oFrame:this.side_xFrame;
            }
        }
        if(GameManager.getInstance().oppInfo != null)
        {
            this.icon_opp.active=true;
            this.lbl_opp.string=GameManager.getInstance().oppInfo.wxName;
            if(GameManager.getInstance().oppInfo.iconUrl != null)
            {
                imageLoader.loadImg(this.icon_opp,GameManager.getInstance().oppInfo.iconUrl);
            }
            if(this.side_opp != null)
            {
                this.side_opp.spriteFrame=GameManager.getInstance().oppInfo.side == 0?this.side_oFrame:this.side_xFrame;
            }
           
        }
        else
        {
            this.icon_opp.active=false;
            this.lbl_opp.string="";
        }
    },
    startTimeCount(target,total,callback)
    {
        this.timeCountTarget=target;
        this.timeCountLbl=cc.find("lbl",this.timeCountTarget.node).getComponent(cc.Label);
        this.timeTotal=total;
        this.isTimeCountStart=true;
        this.timeCount=0;
        this.timeCountCallBack=callback;
    },
    stopTimeCount()
    {
        this.isTimeCountStart=false;
        this.timeCountTarget=null;
        this.timeTotal=0;  
        this.timeCount=0;
        this.timeCountCallBack=null;
    },
    update (dt) {
        if(this.isTimeCountStart)
        {
            this.timeCount+=dt;
            this.timeCountTarget.progress=this.timeCount/this.timeTotal;
            this.timeCountLbl.string=parseInt(this.timeTotal-this.timeCount+1);
            if(this.timeCount>= this.timeTotal)
            {
                this.isTimeCountStart=false;
                if(this.timeCountCallBack != null)
                {
                    this.timeCountCallBack();
                }
            }
        }
    },
   
});
