var GameManager = require("GameManager");
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     default: null,                                  
        //     type: cc.SpriteFrame, 
        //     serializable: true,   
        // },
        answers:[cc.Button],
        sign_right:cc.Sprite,
        sign_wrong:cc.Sprite,
        title: {
            default: null,                                  
            type: cc.Label, 
            serializable: true,   
        },
    },


    onLoad () {
        var length=this.answers.length;
        for(var i=0;i<length;i++)
        {
            this.answers[i].node.on("click", this.onAnswerClick, this);
        }
    },

    start () {

    },
    onAnswerClick(event){
        var newEvent=new cc.Event.EventCustom('onAnswerClick', true);
        newEvent.setUserData(this.answers.indexOf(event.target.getComponent(cc.Button)));
        this.node.dispatchEvent(newEvent);
    },
    OnNext(data)
    {
        this.title.string=data['content'];
        var length=this.answers.length;
        for(var i=0;i<length;i++)
        {
            if(i<data['options'].length)
            {
                this.answers[i].node.active=true;
                cc.find('Label',this.answers[i].node).getComponent(cc.Label).string=data['options'][i];
            }
            else{
                this.answers[i].node.active=false;
            }
           
        } 
        this.sign_right.node.active=false;
        this.sign_wrong.node.active=false;
    },
    ShowAnswerSign(idx,isRight)
    {
        if(idx != undefined)
        {
            var sign=isRight?this.sign_right.node:this.sign_wrong.node;
            sign.active=true;
            var pos=cc.p(196,86-139*idx)
            sign.position =pos;
        }     
    },

    // update (dt) {},
});
