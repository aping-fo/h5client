var GameManager = require("GameManager");
cc.Class({
    extends: cc.Component,

    properties: {
        icon: {
            default: null,                                  
            type: cc.Sprite, 
            serializable: true,   
        },
        lbl_nick: {
            default: null,                                  
            type: cc.Label, 
            serializable: true,   
        },
        lbl_winRate: {
            default: null,                                  
            type: cc.Label, 
            serializable: true,   
        },
        lbl_winTotal: {
            default: null,                                  
            type: cc.Label, 
            serializable: true,   
        },
        lbl_questionTotal: {
            default: null,                                  
            type: cc.Label, 
            serializable: true,   
        },
        lbl_level: {
            default: null,                                  
            type: cc.Label, 
            serializable: true,   
        },
    },


    // onLoad () {},

    start () {
        var th=this;
        GameManager.getInstance().GetRoleInfo(function(resp){
            var answerSuccess=resp['answerSuccess'];
            var totalQuestions=resp['totalQuestions'];
            th.lbl_winTotal.string='胜场:'+answerSuccess;
            th.lbl_level.string='段位:'+resp['level'];
            th.lbl_nick.string=resp['nickName'];
            th.lbl_questionTotal.string='总场次:'+totalQuestions;       
            th.lbl_winRate.string='胜率:'+(totalQuestions == 0?'0%':Math.floor(answerSuccess/totalQuestions*100)+'%');
        });
    },

    // update (dt) {},
});
