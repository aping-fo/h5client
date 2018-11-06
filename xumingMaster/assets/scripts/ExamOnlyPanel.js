var Alert=require("Alert")
var excercisesBoard=require("ExcercisesBoard");
var SelfTestModel=require("SelfTestModel")
var excerciseAni=require('excerciseAni');
var playerHud=require('PlayerBoard');
var _this;
var lock=false;
var gameConst=require('GameEnum')
var GameManager=require('GameManager')
cc.Class({
    extends: cc.Component,

    properties: {
        excercisesBoard: {
            default: null,                                  
            type: excercisesBoard, 
            serializable: true,   
        },
        lbl_score: {
            default: null,                                  
            type: cc.Label, 
            serializable: true,   
        },
        playerHud: {
            default: null,                                  
            type: playerHud, 
            serializable: true,   
        },
        btn_return: {
            default: null,                                  
            type: cc.Button, 
            serializable: true,   
        },
        categoryBoard: {
            default: null,                                  
            type: cc.Node, 
            serializable: true,   
        },
        descBoard: {
            default: null,                                  
            type: cc.Node, 
            serializable: true,   
        },
        lbl_desc: {
            default: null,                                  
            type: cc.Label, 
            serializable: true,   
        },
        btn_goTest: {
            default: null,                                  
            type: cc.Button, 
            serializable: true,   
        },
        btnGroup_category:[cc.Node],
        score:0,
        curCfg:null,
        curRound:0,
        category:0
    },


    onLoad () {
        _this=this;
        this.node.on('onAnswerClick',this.onAnswerClick,this);
        var exBg=cc.find("Canvas/excercisesBoard/bg")
        var exTitleBg=cc.find("Canvas/excercisesBoard/bg_lbl")
        var exTitle=cc.find("Canvas/excercisesBoard/lbl_title");
        var answers=new Array();
        answers.push(cc.find("Canvas/excercisesBoard/answerGroup/answerA"))
        answers.push(cc.find("Canvas/excercisesBoard/answerGroup/answerB"))
        answers.push(cc.find("Canvas/excercisesBoard/answerGroup/answerC"))
        answers.push(cc.find("Canvas/excercisesBoard/answerGroup/answerD"))
        excerciseAni.init(exBg,exTitleBg,exTitle,answers)
        this.btn_return.node.on("click", this.onReturn, this);
        for(var i=0;i<this.btnGroup_category.length;i++)
        {
            this.btnGroup_category[i].on("click",this.categoryClick,this)
        }
        this.btn_goTest.node.on("click",this.onGoTestClick,this)
    },

    start () {
        this.playerHud.updateInfo();
        _this.excercisesBoard.node.active=false;
        _this.categoryBoard.active=false;
        _this.descBoard.active=true;
        // _this.categoryBoard.active=true;
        _this.category=GameManager.getInstance().testCategory;
        var desc=SelfTestModel.getInstance().getDesc(_this.category)
        this.lbl_desc.string=desc;
     
    },
    next(){
        _this.curRound++;
       
        this.curCfg=SelfTestModel.getInstance().getNextCfg(_this.category);
        if(this.curCfg == null)
        {
            var result=SelfTestModel.getInstance().getResultByScore(_this.score,_this.category);
            
            return;
        }
        lock=false;
        this.excercisesBoard.OnNext(this.curCfg);
        this.updateScore();
        excerciseAni.action();
    },
    onReturn(event)
    {
        Alert.show("是否退出体质自测",function(){
            cc.director.loadScene("main", function(){
            });
        },function(){},"",0.3)
    },
    onAnswerClick(event)
    {
        event.stopPropagation();
        if(lock)
        {
            return;
        }
        var selectedIdx=event.getUserData();
        var score=this.curCfg.score[selectedIdx];
        this.score=this.score+score;
        this.updateScore();
        lock=true;
        this.scheduleOnce(function() {
            _this.next();  
       }, 1);
    },
    categoryClick(event)
    {
        _this.category=_this.btnGroup_category.indexOf(event.target);
        _this.descBoard.active=true;
        _this.categoryBoard.active=false;
        var desc=SelfTestModel.getInstance().getDesc(_this.category)
        this.lbl_desc.string=desc;
    },
    onGoTestClick(event)
    {
        _this.excercisesBoard.node.active=true;
        _this.descBoard.active=false;
        SelfTestModel.getInstance().startTest();
        _this.next();
    },
    updateScore()
    {
        this.lbl_score.string="得分:"+this.score;
    },
    // update (dt) {},
});
