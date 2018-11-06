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
        cacheCount: 5, //缓存数量
    },

    getDatas(callback){
        GameManager.getInstance().GetHistoryQuestions(function(resp){
            if(callback){
                callback(resp);
            }
        });
    },

    getImageUrl() {
        var str = GameManager.getInstance().getHistoryQuestionsUrl();
        var urls = str.split(",");

        return urls;
    },

    addImageUrl(url){
        var str = GameManager.getInstance().getHistoryQuestionsUrl();
        var urls = str.split(",");

        if(urls.length >= this.cacheCount){
            urls.shift();
        }
        urls.push(url);

        GameManager.getInstance().setHistoryQuestionsUrl(urls.join(','));
    }
});