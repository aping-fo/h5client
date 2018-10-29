var httpReq = require('HttpReq');
var gameEnum = require('GameEnum')
var CMD = require("CMD");
var WXTool = require("WXTool");
var LoadingBar = require('LoadingBar');

var SelfTestModel = require("SelfTestModel");

const LOCALSTORAGEKEY_BgmOn = "BgmOn";
const LOCALSTORAGEKEY_ClipOn = "ClipOn";

var GameManager = cc.Class({
    extends: cc.Component,
    properties: {


        gameState: {
            default: gameEnum.GAME_STATE.HOME,
            type: cc.Enum(gameEnum.GAME_STATE),
        },
        myInfo:
        {
            default: null,
            type: Object,
        },
        oppInfo:
        {
            default: null,
            type: Object,
        },
        questions: null,
        curQuestionIdx: -1,
        curRound: 0,
        callBack_matchSuc: null,
        callBack_matchCheck: null,
        lauchOption: null,
        sceneGoingTo: null,
        sceneLoaded: [],
        sceneLoading: []

    },

    
    ctor: function () {
        SelfTestModel.getInstance().init();

        //背景音乐
        var bgmOn = cc.sys.localStorage.getItem(LOCALSTORAGEKEY_BgmOn) == null || cc.sys.localStorage.getItem(LOCALSTORAGEKEY_BgmOn) == "" ? true : cc.sys.localStorage.getItem(LOCALSTORAGEKEY_BgmOn) == "true" ? true : false;
        this.setBgmOn(bgmOn);

        //音效
        var clipOn = cc.sys.localStorage.getItem(LOCALSTORAGEKEY_ClipOn) == null || cc.sys.localStorage.getItem(LOCALSTORAGEKEY_ClipOn) == "" ? true : cc.sys.localStorage.getItem(LOCALSTORAGEKEY_ClipOn) == "true" ? true : false;
        this.setClipOn(clipOn);

        var _this = this;
        this.playerInfoPrefab = null;

        cc.loader.loadRes("prefabs/PlayerInfoPanel", cc.Prefab, function(err, prefab){
            if(err){
                cc.error(err.message || err);
                return;
            }

            _this.playerInfoPrefab = prefab;
        });
    },
    // onLoad () {},

    start() {

    },

    GetOpenId(code, callback) {
        var data = { code: code };
        httpReq.Post(CMD.GET_OPENID, data, function (resp) {
            callback(resp);
        });
    },
    CreateRole(nick, icon, callback) {
        var data = { nickName: nick, iconUrl: icon };
        httpReq.Post(CMD.CREATE_ROLE, data, function (resp) {
            callback(resp);
        });
    },
    UpdateRole(nick, icon, callback) {
        var data = { nickName: nick, iconUrl: icon };
        httpReq.Post(CMD.UPDATE_ROLE, data, function (resp) {
            callback(resp);
        });
    },
    GetRoleInfo(callback) {
        var data = {};
        httpReq.Post(CMD.GET_ROLE, data, function (resp) {
            callback(resp);
        });
    },
    //请求匹配
    SendMatch(callback) {
        var data = { nickName: GameManager.getInstance().myInfo['wxName'] };
        httpReq.Post(CMD.START_MATCH, data, function (resp) {
            callback(resp);
        });
    },
    //取消匹配
    CancelMatch(callback) {
        var data = {};
        httpReq.Post(CMD.END_MATCH, data, function (resp) {
            callback(resp);
        });
    },
    //检查是否匹配到人
    CheckMatch() {
        var data = {};
        var th = this;
        httpReq.Post(CMD.GET_MATCH_RESULT, data, function (resp) {
            if (th.callBack_matchCheck != null) {
                th.callBack_matchCheck(resp);
            }
        });
        //返回对方玩家信息，游戏开始
    },
    //请求亮题
    GetNext(callback) {
        var data = {};
        httpReq.Post(CMD.GET_QUEST, data, function (resp) {
            callback(resp);
        });
    },
    //检查下一轮是否开始
    CheckNextRound(callback) {
        var data = {};
        httpReq.Post(CMD.GET_QUEST, data, function (resp) {
            callback(resp);
        });
    },
    //抢棋子
    GrabChess(idx, callback) {
        var data = {};
        httpReq.Post(CMD.ROB_ANSWER, data, function (resp) {
            callback(resp);
        });
    },

    //机器人抢棋子
    GrabChessByRobot(callback) {
        console.log("GrabChessByRobot");
        var data = {};
        httpReq.Post(CMD.ROBOT_ROB_ANSWER, data, function (resp) {
            callback(resp);
        });
    },

    //选择答案
    SendAnswer(idx, callback) {
        var data = { answer: idx };
        httpReq.Post(CMD.ANSWER_QUEST, data, function (resp) {
            callback(resp);
        });
    },
    
    //机器人选择答案
    SendAnswerByRobot(idx, callback) {
        console.log("SendAnswerByRobot");
        var data = { answer: idx };
        httpReq.Post(CMD.ROBOT_ANSWER_QUEST, data, function (resp) {
            callback(resp);
        });
    },

    //获得正确答案
    GetAnswer(cfgid, callback) {
        var data = { cfgId: cfgid };
        httpReq.Post(CMD.GET_ANSWER, data, function (resp) {
            callback(resp);
        });
    },
    //提交胜利
    SubmitVictory(callback) {
        var data = {};
        httpReq.Post(CMD.SUBMIT_VICTORY, data, function (resp) {
            callback(resp);
        });
    },
    //获取当前棋盘状态
    GetRoomResult(callback) {
        var data = {};
        httpReq.Post(CMD.GET_ROOM_RESULT, data, function (resp) {
            callback(resp);
        });
    },
    //请求题库类型
    GetQuestBankCategory(callback) {
        var data = {};
        httpReq.Post(CMD.GET_QUEST_BANK_CATEGORY, data, function (resp) {
            callback(resp);
        });
    },

    //检查是否被抢
    GetRobState(callback) {
        var data = {};
        httpReq.Post(CMD.CHECK_ROB, data, function (resp) {
            callback(resp);
        });
    },
    //创建房间
    CreateRoom(callback) {
        var data = {};
        httpReq.Post(CMD.CREATE_ROOM, data, function (resp) {
            callback(resp);
        });
    },
    //加入房间
    JoinRoom(roomId, callback) {
        var data = { roomID: roomId };
        httpReq.Post(CMD.JOIN_ROOM, data, function (resp) {
            callback(resp);
        });
    },

    //请求历史题库
    GetHistoryQuestions(from, to, callback) {
        var data = { from: from, to: to };

        httpReq.Post(CMD.GET_HISTORY_QUESTION, data, function (resp) {
            callback(resp);
        });
    },

    ///////////////////////// 排行榜 ///////////////////////////
    OpenGlobalRank(from, to, callback) {
        var data = { fromIndex: from, toIndex: to };
        httpReq.Post(CMD.GET_RANK_INFO, data, function (resp) {
            console.log("GET_RANK_INFO ", resp);

            WXTool.getInstance().openGlobalRankPanel(resp, from);

            if (callback) {
                callback(from, resp.rankVOList.length)
            }
        });
    },


    ////////////////////////大师赛//////////////////////////////
    SignUpMasterMatch(callback) {
        var data = {};
        httpReq.Post(CMD.SIGN_UP_MASTERMATCH, data, callback);
    },
    PreLoadScene(sceneName) {
        var self = GameManager.getInstance();
        if (self.sceneLoading == null) {
            self.sceneLoading = new Array();
        }
        self.sceneLoading.push(sceneName);
        cc.director.preloadScene(sceneName, function () {
            if (self.sceneLoaded == null) {
                self.sceneLoaded = new Array();
            }
            self.sceneLoaded.push(sceneName);
            for (var i = 0; i < self.sceneLoading.length; i++) {
                if (self.sceneLoading[i] == sceneName) {
                    self.sceneLoading[i] = "";
                    break;
                }
            }
            if (sceneName == self.sceneGoingTo) {
                LoadingBar.hide();
                cc.director.loadScene(sceneName, function () { self.sceneGoingTo = null });
            }
        });
    },
    LoadScene(sceneName) {
        var self = GameManager.getInstance();
        if (self.sceneLoaded == null || self.sceneLoaded.indexOf(sceneName) == -1) {
            if (self.sceneLoading == null || self.sceneLoading.indexOf(sceneName) == -1) {
                cc.director.loadScene(sceneName, function () { self.sceneGoingTo = null });
            }
            else {
                self.sceneGoingTo = sceneName;
                LoadingBar.show();
            }

        }
        else {
            cc.director.loadScene(sceneName, function () { self.sceneGoingTo = null });
        }
    },

    
    ///////////////////////设置////////////////////////////////
    setBgmOn(isOn){
        this.m_bgmOn = isOn;
        cc.sys.localStorage.setItem(LOCALSTORAGEKEY_BgmOn, isOn ? "true":"false");

        cc.audioEngine.setMusicVolume(isOn?1:0);
    },

    isBgmOn(){
        return this.m_bgmOn;
    },

    setClipOn(isOn){
        this.m_clipOn = isOn;
        cc.sys.localStorage.setItem(LOCALSTORAGEKEY_ClipOn, isOn ? "true":"false");
        
        cc.audioEngine.setEffectsVolume(isOn?1:0);
    },

    isClipOn(){
        return this.m_clipOn;
    }

});
GameManager._instance = null;
GameManager.getInstance = function () {
    if (!GameManager._instance) {
        GameManager._instance = new GameManager();
    }
    return GameManager._instance;
}

module.exports = GameManager;

