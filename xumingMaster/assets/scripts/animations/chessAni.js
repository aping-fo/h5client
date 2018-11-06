var appScript = {
    init:function(bg,grid,finishCallback)
    {
        this.bg=bg;
        this.grid=grid;
        this.finishCallback=finishCallback;
    },
    action:function()
    {
        var self=this;
        // for(var i=0;i<self.grid.length;i++)
        // {
        //     self.grid[i].setScale(0);
        // }
        // self.bg.setScale(0.3);
        var delayTime=0;
        self.cbAction2=function(){
            if(self.finishCallback != null)
            {
                self.finishCallback();
            }
        };
        var actionCb2=cc.callFunc(self.cbAction2,self)
        self.cbAction1=function(){
            var idx=0;
            for(var i=0;i<self.grid.length;i++)
            {
                var row=Math.floor(i/3);
                var col=i%3;
                self.grid[i].position = cc.p(-196+196*col,-21.5-275*row-300);
                delayTime+=0.1;
                var cb=(i == self.grid.length-1)?actionCb2:null;
                var action=cc.sequence(cc.delayTime(delayTime), cc.scaleTo(.2, 1.0),cc.callFunc(function(){
                    self.grid[idx].getComponent(cc.Animation).play();
                    idx++;
                },self),cb);
                self.fadeInGrid(self.grid[i],action);
            }
        };
        var actionCb1=cc.callFunc(self.cbAction1,self)
        
     
      
        
       
        var actionFadeIn=cc.sequence(cc.scaleTo(0.3, 1.1).easing(cc.easeIn(2.0)), cc.scaleTo(.1, 1.0), actionCb1);
       
        self.fadeIn=function()
        {
            cc.eventManager.pauseTarget(self.bg, true);
            self.bg.runAction(actionFadeIn);
        };

        var actionFadeGrid=[];
        for(var i=0;i<self.grid.length;i++)
        {
            var row=Math.floor(i/3);
            var col=i%3;
            var px=-196+196*col;
            var py=-21.5-275*row-500;
            var cb=(i == self.grid.length-1)?cc.callFunc(function(){
                if(self.finishCallback != null)
                {
                    self.finishCallback();
                }
            },self):null;
            actionFadeGrid.push(cc.sequence(cc.delayTime(0.1*i),cc.spawn(cc.fadeTo(0.6, 255),cc.moveTo(0.6,cc.p(px,py+500)).easing(cc.easeOut(2.0)),null), cb))
        }
        self.fadeInGrid=function()
        {
            for(var i=0;i<self.grid.length;i++)
            {
                var row=Math.floor(i/3);
                var col=i%3;
                var px=-196+196*col;
                var py=-21.5-275*row-500;
                self.grid[i].position = cc.p(px,py);
                self.grid[i].opacity=0;
                // cc.eventManager.pauseTarget(self.grid[i], true);      
                self.grid[i].runAction(actionFadeGrid[i]);
            }
           
        };
     
        self.fadeInGrid();
    },

    actionHightLight(black,target,grabBtn)
    {
        var self=this;
        black.opacity=0;
        grabBtn.node.active=false;
        var cb=cc.callFunc(function(){
            grabBtn.node.active=true;
        },self)
        var actionFadeInBlack=cc.sequence(cc.fadeTo(0.2, 175), cb);
        var actionFadeInTarget=cc.sequence(cc.scaleTo(0.2, 1.2), null);
        self.fadeInBlack=function()
        {
            cc.eventManager.pauseTarget(black, true);
            black.runAction(actionFadeInBlack);
        };
        self.fadeInTarget=function()
        {
            target.runAction(actionFadeInTarget);
        };
        self.fadeInBlack();
        self.fadeInTarget();
    }

};
module.exports = appScript;
