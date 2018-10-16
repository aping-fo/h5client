var GAME_STATE = cc.Enum({
    HOME:0,
    MATCHING:1,
    CHESS:2,
    EXCERCISES:3,
});
var GameConst ={
    INTERVAL_MATCHING:0.5,//匹配轮询间隔
};
module.exports = {
    GAME_STATE: GAME_STATE,
    GameConst:GameConst
};