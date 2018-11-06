var excerciseAni=require("excerciseAni")
var chessAni=require("chessAni")
var UIHelper = require("UIHelper");
cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,                                  
            type: cc.Node, 
            serializable: true,   
        },
        btns:[cc.Node],
        btn_selected:null,

        sprite: {
            type: cc.Sprite,
            default: null
        },
        
        captureNode: {
            type:cc.Node,
            default: null
        }
    },



    start () {
        var self = this;
        // var exBg=cc.find("Canvas/excercisesBoard/bg")
        // var exTitleBg=cc.find("Canvas/excercisesBoard/title_bg")
        // var exTitle=cc.find("Canvas/excercisesBoard/lbl_title");
        // var answers=new Array();
        // answers.push(cc.find("Canvas/excercisesBoard/answerGroup/answerA"))
        // answers.push(cc.find("Canvas/excercisesBoard/answerGroup/answerB"))
        // answers.push(cc.find("Canvas/excercisesBoard/answerGroup/answerC"))
        // answers.push(cc.find("Canvas/excercisesBoard/answerGroup/answerD"))
        // excerciseAni.init(exBg,exTitleBg,exTitle,answers)
        // excerciseAni.action();

        // var chessBg=cc.find("Canvas/chessboard/board")
        // var grid=new Array();
        // for(var i=1;i<=9;i++)
        // {
        //     var itemPath="Canvas/chessboard/group/"+i;
        //     grid.push(cc.find(itemPath))
        // }
        // chessAni.init(chessBg,grid)
        // chessAni.action();


        // var actionFadeIn=cc.sequence(cc.scaleTo(0.3, 1.1).easing(cc.easeIn(2.0)), cc.scaleTo(.1, 1.0), null);
        // self.fadeIn=function()
        // {
        //     cc.eventManager.pauseTarget(self.target.node, true);
        //     self.target.position = cc.p(0, 0);
        //     self.target.setScale(0.3);
        //     self.target.runAction(actionFadeIn);
        // };
       
        // // self.fadeIn();

        // var btnScaleIn=cc.sequence(cc.scaleTo(0.2, 2), null);
        // var btnScaleOut=cc.sequence(cc.scaleTo(0.2, 1), null);
        // self.btn_scaleIn=function(target)
        // {
        //     target.runAction(btnScaleIn);
        // };
        // self.btn_scaleOut=function(target)
        // {
        //     target.runAction(btnScaleOut);
        // };
        // for(var i=0;i<self.btns.length;i++)
        // {
        //     var btn=self.btns[i];
        //     btn.on("click", function(event){
               
        //         if(self.btn_selected != null)
        //         {
        //             self.btn_scaleOut(self.btn_selected);
        //         }
        //         self.btn_selected= event.target;
        //         self.btn_scaleIn(self.btn_selected);
                
        //     }, self);
        // }
        
        for(var i = 0; i < this.btns.length; i++){
            this.btns[i].on("click", this.onBtnClick, this);
        }
    },

    onBtnClick(btn){
        var path = UIHelper.SaveNodeRender(this.captureNode, 750, true);
        var _this = this;
        cc.loader.load(path, function(err, texture) {
          if (err) {
            cc.error(err.Message || err);
            return;
          }
          _this.sprite.spriteFrame = new cc.SpriteFrame(texture);
        });
    }
});
