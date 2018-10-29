/**
 * 历史题目数据类
 */

var GameManager = require("GameManager");
var _this = null;

var HistoryQuestionModel = cc.Class({

    statics: {
        instance: null,
        getInstance: function () {
            return this.instance || (this.instance = new HistoryQuestionModel()), this.instance;
        }
    },

    ctor: function () {
        _this = this;
    },

    properties: {
        cacheCount: 72, //缓存数量
        datas: []
    },

    getData(from, to, callback) {
        if (from >= this.cacheCount) {
            return;
        }

        //请求数据
        GameManager.getInstance().GetHistoryQuestions(from, to, function(res){
            console.log(res);

            for (var i = from, j = 0; i <= to; i++ , j++) {
                _this.datas[i] = res.questions[j];
            }

            callback(_this.datas, from, to);
        });
    }
});