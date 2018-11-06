var appScript = {
    init:function(root)
    {
        this.black=cc.find("black",root);
        this.bg=cc.find("di",root);
        this.btn=cc.find("btn",root);
        this.root=root;
        this.winGoup=cc.find("win",root);
        this.loseGrroup=cc.find("lose",root);
    },
    action:function(isWin)
    {
        var self=this;
        var group=isWin?this.winGoup:this.loseGrroup;

        var icon=cc.find("4",group);
        var icon2=cc.find("win_2",group);
        var line=cc.find("mask",group);
        var lbl=cc.find("win_1",group);
        lbl.setPosition(6,-182)
        icon2.setPosition(-32,-146)
        self.black.opacity=0;
        self.bg.opacity=0;
        icon.opacity=0;
        icon2.opacity=0;
        line.scaleY=0;
        lbl.opacity=0;
        self.btn.opacity=0;
        
        var actionFadeInBlack=cc.sequence(cc.fadeTo(0.3, 66), null);
        var actionFadeInBg=cc.sequence(cc.delayTime(0.3),cc.fadeTo(0.3, 255), null);
        var actionFadeInIcon=cc.sequence(cc.delayTime(.6),cc.fadeTo(0.5, 255), null);
        var actionFadeInLine=cc.sequence(cc.delayTime(1.1),cc.scaleTo(0.5,1,1), null);
        var actionFadeInLabel=cc.sequence(cc.delayTime(1.6),cc.spawn(cc.moveTo(0.5,cc.p(6,-152)),cc.fadeTo(0.5, 255)), null);
        var actionFadeInIcon2=cc.sequence(cc.delayTime(2.1),cc.spawn(cc.moveTo(0.5,cc.p(-32,-116)),cc.fadeTo(0.5, 255)), null);
        var actionFadeInBtn=cc.sequence(cc.delayTime(2.6),cc.fadeTo(0.5, 255), null);
        self.fadeInBlack=function()
        {
            cc.eventManager.pauseTarget(self.black, true);
            self.black.runAction(actionFadeInBlack);
        };
        self.actionFadeInBg=function()
        {
            cc.eventManager.pauseTarget(self.bg, true);
            this.bg.runAction(actionFadeInBg);
        };
        self.actionFadeInIcon=function()
        {
            cc.eventManager.pauseTarget(icon, true);
            icon.runAction(actionFadeInIcon);
        };
        self.actionFadeInIcon2=function()
        {
            cc.eventManager.pauseTarget(icon2, true);
            icon2.runAction(actionFadeInIcon2);
        };
        self.actionFadeInLine=function()
        {
            cc.eventManager.pauseTarget(line, true);
            line.runAction(actionFadeInLine);
        };
        self.actionFadeInLabel=function()
        {
            cc.eventManager.pauseTarget(lbl, true);
            lbl.runAction(actionFadeInLabel);
        };
        self.actionFadeInBtn=function()
        {
            self.btn.runAction(actionFadeInBtn);
        };

        self.fadeInBlack();
        self.actionFadeInBg();
        self.actionFadeInIcon();
        self.actionFadeInIcon2();
        self.actionFadeInLine();
        self.actionFadeInLabel();
        self.actionFadeInBtn();
    },
    actionClose:function()
    {
        return;
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

