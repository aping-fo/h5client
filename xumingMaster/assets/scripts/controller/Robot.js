var GameManager = require("GameManager");
var GrabChessTime = [3,5];
var RobotState = {
    Wait: 1,
    GrabChess: 2,
    AnswerQuest: 3
};
var instance = null;
var Robot = cc.Class({
    statics: {
        getInstance(){
            return instance || (instance = new Robot()), instance;
        }
    },

    ctor: function(){
        cc.director.getScheduler().enableForTarget(this);
    },

    onAction(dt){
        var _this = this;

        if(this.m_state == RobotState.GrabChess){
            GameManager.getInstance().GrabChessByRobot(function(resp){
                console.log(resp);
                _this.m_state = RobotState.Wait;
            });
        }else if(this.m_state == RobotState.AnswerQuest){
            var data=GameManager.getInstance().questions[GameManager.getInstance().curQuestionIdx];

            if(data){
                var answer = Math.floor(Math.random() * data['options'].length);
                GameManager.getInstance().SendAnswerByRobot(answer, function(resp){
                    console.log(resp);
                    _this.m_state = RobotState.Wait;
                });
            }
        }
    },

    grabChess(){
        var scheduler = cc.director.getScheduler();

        if(scheduler.isScheduled(this.onAction, this)){
            scheduler.unschedule(this.onAction, this);
        }

        this.m_state = RobotState.GrabChess;

        var rand = Math.random() * (GrabChessTime[1] - GrabChessTime[0]) + GrabChessTime[0];
        scheduler.schedule(this.onAction, this, 0, 0, rand, false);
    },

    answerQuest(){
        var scheduler = cc.director.getScheduler();

        if(scheduler.isScheduled(this.onAction, this)){
            scheduler.unschedule(this.onAction, this);
        }

        this.m_state = RobotState.AnswerQuest;
        scheduler.schedule(this.onAction, this, 0, 0, 3, false);
    }
})

module.exports = Robot;