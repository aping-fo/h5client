var GAME_STATE = cc.Enum({
    HOME:0,
    MATCHING:1,
    CHESS:2,
    EXCERCISES:3,
    WATCHING:4,
    WAITING_OPPONENT:5,//等待对手
});
var GameConst ={
    INTERVAL_MATCHING:0.5,//匹配轮询间隔
    INTERVAL_CHECKNEXTROUND:0.5,
    INTERVAL_CHECKCHESS_STATE:0.5,
    INTERVAL_ROUND_BETWEEN_ROUND:3,//每轮间隔
    DELAY_GAME_START:0.2,//请求棋盘信息延时秒数
    DELAY_SHOW_EXCERCISES:.2,//显示题目延时秒数
    DELAY_SHOW_EXCERCISES_WATCHER:1,//显示题目延时秒数
    DELAY_SHOW_GAME_RESULT:2,
    ANSWER_TIME:20,//答题时间
    GRAB_WAIT_time:3,//抢答等待时间
    GRAB_AUTO_time:3,//自动抢答时间
};
module.exports = {
    GAME_STATE: GAME_STATE,
    GameConst:GameConst
};