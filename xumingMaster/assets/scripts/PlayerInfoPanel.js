var GameManager = require("GameManager");
var PopupWindow = require("PopupWindow");

cc.Class({
    extends: PopupWindow,

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

        closeBtn: {
            type: cc.Button,
            default: null
        },

        checkTestBtn: {
            type: cc.Button,
            default: null
        },

        soundEffectToggle: {
            type: cc.Toggle,
            default: null
        },

        musicToggle: {
            type: cc.Toggle,
            default: null
        }
    },


    onLoad() {
        this.closeBtn.node.on("click", this.onCloseBtnClick, this);
        this.checkTestBtn.node.on("click", this.onCheckTestBtnClick, this);
        this.soundEffectToggle.node.on("toggle", this.onSoundEffectToggleClick, this);
        this.musicToggle.node.on("toggle", this.onMusicToggleClick, this);
    },

    start() {

        if (GameManager.getInstance().isBgmOn()) {
            this.musicToggle.check();
        } else {
            this.musicToggle.uncheck();
        }

        if (GameManager.getInstance().isClipOn()) {
            this.soundEffectToggle.check();
        } else {
            this.soundEffectToggle.uncheck();
        }
    },

    onEnable() {
        var _this = this;
        GameManager.getInstance().GetRoleInfo(function (resp) {
            var answerSuccess = resp['answerSuccess'];
            var totalQuestions = resp['totalQuestions'];

            _this.lbl_winTotal.string = '胜场:' + answerSuccess;
            _this.lbl_level.string = '段位:' + resp['level'];
            _this.lbl_nick.string = resp['nickName'];
            _this.lbl_questionTotal.string = '总场次:' + totalQuestions;
            _this.lbl_winRate.string = '胜率:' + (totalQuestions == 0 ? '0%' : Math.floor(answerSuccess / totalQuestions * 100) + '%');
        });
    },

    update(dt) {

    },

    onCloseBtnClick(btn) {
        this.node.active = false;
    },

    onCheckTestBtnClick(btn) {

    },

    onSoundEffectToggleClick(toggle) {
        GameManager.getInstance().setClipOn(toggle.isChecked);
    },

    onMusicToggleClick(toggle) {
        GameManager.getInstance().setBgmOn(toggle.isChecked);
    }
});
