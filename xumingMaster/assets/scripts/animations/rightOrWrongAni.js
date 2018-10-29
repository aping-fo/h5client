var appScript = {
    init:function(black,content,root)
    {
        this.black=black;
        this.content=content;
        this.root=root;
    },
    action:function()
    {
        var self=this;
        self.black.opacity=0;
        self.content.opacity=0;
        
        var actionFadeInBlack=cc.sequence(cc.fadeTo(0.2, 66), null);
        var actionFadeInTarget=cc.sequence(cc.fadeTo(0.2, 255), null);
        self.fadeInBlack=function()
        {
            cc.eventManager.pauseTarget(self.black, true);
            self.black.runAction(actionFadeInBlack);
        };
        self.fadeInTarget=function()
        {
            this.content.runAction(actionFadeInTarget);
        };
        self.fadeInBlack();
        self.fadeInTarget();
    },
    actionClose:function()
    {
        var self=this;
        var actionCb=cc.callFunc(function(){
            self.root.active=false;
        },self)
        var actionFadeInBlack2=cc.sequence(cc.fadeTo(0.2, 0), actionCb);
        var actionFadeInTarget2=cc.sequence(cc.fadeTo(0.2, 0), null);
        self.fadeInBlack2=function()
        {
            cc.eventManager.pauseTarget(self.black, true);
            self.black.runAction(actionFadeInBlack2);
        };
        self.fadeInTarget2=function()
        {
            this.content.runAction(actionFadeInTarget2);
        };
        self.fadeInBlack2();
        self.fadeInTarget2();
    }
};

module.exports = appScript;

