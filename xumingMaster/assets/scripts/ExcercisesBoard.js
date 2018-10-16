cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     default: null,                                  
        //     type: cc.SpriteFrame, 
        //     serializable: true,   
        // },
        answers:[cc.Button]
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
        this.node.dispatchEvent( new cc.Event.EventCustom('onAnswerClick', true) );
    }
    // update (dt) {},
});
