/**
 * 历史题目数据类
 */

var HttpReq = require('HttpReq');
var CMD = require("CMD");
var _this = null;

var HistoryQuestionModel = cc.Class({

    statics:{
        instance: null,
        getInstance: function(){
            return this.instance || (this.instance = new HistoryQuestionModel()), this.instance;
        }
    },

    ctor: function(){
        _this = this;
    },

    properties: {
        cacheCount: 72, //缓存数量
        datas: []
    },

    getData(from, to, callback){
        if(from >= this.cacheCount){
            return;
        }
        
        //请求数据
        HttpReq.Post(CMD.GET_HISTORY_QUESTION, {from: from, to: to}, function(result){
            if(result !== false){
                for(var i = from, j = 0; i <= to; i++, j++){
                    _this.datas[i] = result[j];
                }
            }
            callback(_this.datas, from, to);
        });
    }
});