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
    //请求历史题库
    GET_HISTORY_QUESTION: 3000
});

module.exports = CMD;