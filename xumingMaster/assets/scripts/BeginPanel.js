/**
 * 启动面板
 * 
 * 用户登录和授权面板
 */
var WXTool = require("WXTool")
var GameManager = require("GameManager");
var httpReq=require('HttpReq');
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.on("WXLoginSuccess", this.onWXLoginSuccess, this);
    },

    start () {
        WXTool.getInstance().login();
    },

    // update (dt) {},
    onWXLoginSuccess(){
        console.log("wx login success");
        //test
        var testId=parseInt(Math.random()*99);
        httpReq.openId=testId;
        GameManager.getInstance().myInfo={wxName:'冰粒粒',iconUrl:'http://tinslychong.club/cocos/icon1.jpg',openId:testId};
        GameManager.getInstance().GetInfoByOpenId(
            function(resp)
            {
                if(resp['hasRole'])
                {
                    cc.director.loadScene("main", function(){
                    });
                }
                else
                {
                    GameManager.getInstance().CreateRole("测试"+testId,function(resp){
                        if(resp.toString() == "ok")
                        {
                            cc.director.loadScene("main", function(){
                            });
                        }
                    });
                }
            }
        );
       
    }
});
