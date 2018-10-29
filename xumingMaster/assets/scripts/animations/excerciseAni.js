var appScript = {
    init:function(bg,titlebg,title,options)
    {
        this.bg=bg;
        this.titlebg=titlebg;
        this.title=title;
        this.options=options;
    },
    action:function()
    {
        var self=this;
        for(var i=0;i<self.options.length;i++)
        {
            self.options[i].opacity = 0;
            self.options[i].getComponent(cc.Button).interactable =false;
        }
        var aniAnswerIdx=0;
        self.titlebg.opacity = 0;
        self.title.opacity = 0;
        self.bg.setScale(0.6);
        
        self.cbAction1=function(){
            self.fadeInTitleBg();
        };
        var actionCb1=cc.callFunc(self.cbAction1,self)
        self.cbAction2=function(){
            self.fadeInTitle()
        };
        var actionCb2=cc.callFunc(self.cbAction2,self)

        self.cbAction3=function(){
            self.fadeInAnswer();
        };
        var actionCb3=cc.callFunc(self.cbAction3,self)

        
        self.cbAction4=function(){
            if(aniAnswerIdx<self.options.length-1)
            {
                aniAnswerIdx++;
                self.fadeInAnswer();
            }
            else
            {
                for(var i=0;i<self.options.length;i++)
                {
                    self.options[i].getComponent(cc.Button).interactable =true;
                }
            }
        };
        var actionCb4=cc.callFunc(self.cbAction4,self)
        
        var actionFadeIn=cc.sequence(cc.scaleTo(0.3, 1.1).easing(cc.easeIn(2.0)), cc.scaleTo(.1, 1.0), actionCb1);
        var actionFadeIn2=cc.sequence(cc.fadeTo(0.3, 255), actionCb2);
        var actionFadeIn3=cc.sequence(cc.fadeTo(0.3, 255), actionCb3);
        var actionFadeIn4=cc.sequence(cc.fadeTo(0.2, 255), actionCb4);
        self.fadeIn=function()
        {
            cc.eventManager.pauseTarget(self.bg, true);
            self.bg.runAction(actionFadeIn);
        };

        self.fadeInTitleBg=function()
        {
            cc.eventManager.pauseTarget(self.titlebg, true);      
            self.titlebg.runAction(actionFadeIn2);
        };

        self.fadeInTitle=function()
        {
            cc.eventManager.pauseTarget(self.title, true);     
            self.title.runAction(actionFadeIn3);
        };
        self.fadeInAnswer=function()
        {
            if(self.options[aniAnswerIdx].active)
            {
                self.options[aniAnswerIdx].runAction(actionFadeIn4);
            }
            else
            {
                for(var i=0;i<self.options.length;i++)
                {
                    self.options[i].getComponent(cc.Button).interactable =true;
                }
            }    
            
        };

        self.fadeIn();
    },

};
module.exports = appScript;
