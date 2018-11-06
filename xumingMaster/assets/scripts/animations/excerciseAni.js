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
            aniAnswerIdx++;
            if(aniAnswerIdx>=self.options.length || self.options[aniAnswerIdx].active == false)
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
        var actionFadeIn3=cc.sequence(cc.fadeTo(0.5, 255), actionCb3);
        var actionFadeAnswer=[];
        for(var i=0;i<4;i++)
        {
            actionFadeAnswer.push(cc.sequence(cc.delayTime(0.1*i),cc.spawn(cc.fadeTo(0.4, 255),cc.moveTo(0.4,cc.p(0,25-140*i)).easing(cc.easeOut(2.0)),null), actionCb4))
        }
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
            // if(self.options[aniAnswerIdx].active)
            // {
            //     self.options[aniAnswerIdx].setPosition(0,25-140*aniAnswerIdx-375);
            //     self.options[aniAnswerIdx].runAction(actionFadeAnswer[aniAnswerIdx]);
            // }
            // else
            // {
            //     for(var i=0;i<self.options.length;i++)
            //     {
            //         self.options[i].getComponent(cc.Button).interactable =true;
            //     }
            // }    

                for(var i=0;i<self.options.length;i++)
                {
                    if(self.options[i].active)
                    {
                        self.options[i].setPosition(0,25-140*i-375);
                        self.options[i].runAction(actionFadeAnswer[i]);
                    }
                }
            
        };

        self.fadeInTitle();
    },

};
module.exports = appScript;
