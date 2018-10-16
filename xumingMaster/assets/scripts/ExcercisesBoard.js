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
        signs:[cc.Sprite],
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
        var data=GameManager.getInstance().questions[GameManager.getInstance().curQuestionIdx];
        this.title.string=data['content'];
        var length=this.answers.length;
        for(var i=0;i<length;i++)
        {
            cc.find('Label',this.answers[i].node).getComponent(cc.Label).string=data['options'][i];
        }      
    }
    // update (dt) {},
});
