/**
 * 自我检测数据类
 */

var StrToArray = function(str){
    var expression = /\[.*\]/i;
    var strs = [];
    if(expression.test(str)){
        str = str.subString(1, str.length - 2);
        strs = str.split(",");
    }

    return strs;
};

var SelfTestModel = cc.Class({
    
    statics:{
        instance: null,
        getInstance: function(){
            return this.instance || (this.instance = new SelfTestModel()), this.instance;
        }
    },

    properties: {
        config: null,
        resultConfig: null
    },


    init(){
        var _this = this;

        cc.loader.loadRes("config/SelfTestCfg", cc.JsonAsset, function(err, jsonAsset){
            if(err){
                cc.error(err.message || err);
                return;
            }
            _this.config = jsonAsset.json;    
        });
        
        cc.loader.loadRes("config/SelfTestResultCfg", cc.JsonAsset, function(err, jsonAsset){
            if(err){
                cc.error(err.message || err);
                return;
            }
            _this.resultConfig = jsonAsset.json;
        });

        this.m_index = -1;
    },

    startTest(){
        this.m_index = -1;
    },

    getNextCfg(){
        this.m_index++;
        
        var cfg = this.config.root.config[this.m_index];

        return cfg;
    },

    getResultByScore(score){
        var configs = this.resultConfig.root.config;
        for(var i = 0; i < configs.length; i++){
            var config = configs[i];
            var scoreMin = StrToArray(config.score)[0];
            var scoreMax = StrToArray(config.score)[1];

            if(score >= scoreMin && score <= scoreMax){
                return config;
            }
        }
        return null;
    }
 });