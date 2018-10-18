var CMD = cc.Enum({    
    //请求openid
    GET_OPENID: 1001,
    //请求创建角色
    CREATE_ROLE:1002,
    //请求角色数据
    GET_ROLE:1003,
    //请求匹配
    START_MATCH: 2001,
    //退出匹配
    END_MATCH: 2002,
    //请求匹配结果
    GET_MATCH_RESULT: 2003,
    //请求题库
    GET_QUEST_BANK: 2004,
    //请求亮题
    GET_QUEST:2005,
    //请求回答
    ANSWER_QUEST:2006,
    //请求答案
    GET_ANSWER:2007,
    //请求抢答
    ROB_ANSWER:2008,
    //请求答题信息
    GET_ROOM_RESULT:2009,
    //请求历史题库
    GET_HISTORY_QUESTION: 3000,
    //提交胜利
    SUBMIT_VICTORY:2010,
    //检查抢答状态
    CHECK_ROB:2011,
    //开房
    CREATE_ROOM:2012,
    //进房
    JOIN_ROOM:2013,
});

module.exports = CMD;