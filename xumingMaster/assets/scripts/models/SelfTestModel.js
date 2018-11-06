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
        resultConfig: null,
        descConfig: null
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

        cc.loader.loadRes("config/SelfTestDescriptionCfg", cc.JsonAsset, function(err, jsonAsset){
            if(err){
                cc.error(err.message || err);
                return;
            }
            _this.descConfig = jsonAsset.json;
        });

        this.m_index = -1;
    },

    startTest(){
        this.m_index = -1;
    },

    getNextCfg(category){
      
        
        var cfg;
        do
        {
            this.m_index++;
            cfg=this.config.root.config[this.m_index]
        }
        while(cfg !=null && cfg.catergory != category)

        return cfg;
    },

    getResultByScore(score,category){
        var configs = this.resultConfig.root.config;
        for(var i = 0; i < configs.length; i++){
            var config = configs[i];
            if(config.category == category)
            {
                var scoreMin = StrToArray(config.score)[0];
                var scoreMax = StrToArray(config.score)[1];
    
                if(score >= scoreMin && score <= scoreMax){
                    return config;
                }
            }
          
        }
        return null;
    },
    getAllCategoryDesc()
    {
        return this.descConfig.root.config;
    },
    getDesc(category)
    {  
        var cfg=this.descConfig.root.config[category];
        var result="";
        result+="总体特征:"+ cfg.desc1+"\n";
        result+="形体特征:"+ cfg.desc2+"\n";
        result+="常见表现:"+ cfg.desc3+"\n";
        result+="心理特征:"+ cfg.desc4+"\n";
        result+="发病倾向:"+ cfg.desc5+"\n";
        result+="对外界环境适应能力:"+ cfg.desc6;
        return result;
    },
 });