/**
 * 启动面板
 * 
 * 用户登录和授权面板
 */
var WXTool = require("WXTool")
var GameManager = require("GameManager");
var httpReq=require('HttpReq');
var LoadingBar = require('LoadingBar');


cc.Class({
    extends: cc.Component,

    properties: {
        loginBtn:{
            type: cc.Button,
            default: null
        },

        editText:{
            type: cc.EditBox,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.on("WXLoginSuccess", this.onWXLoginSuccess, this);
        GameManager.getInstance().lauchOption= WXTool.getInstance().getLaunchOptionsSync();//启动参数
        console.log("lauchOption:", GameManager.getInstance().lauchOption) 

        this.loginBtn.node.on("click", this.onLoginBtnClick, this);
    },

    start () {
        var _this=this;
        var isLoaded=false;
        var isTimeOut=false;
        LoadingBar.show();
        //确保一秒后才移除loading避免闪屏
        _this.scheduleOnce(function() {
            isTimeOut=true;
            if(isLoaded)
            {
                LoadingBar.hide();
            }           
       }, 1);
        GameManager.getInstance().PreLoadScene("main",function(){
            isLoaded=true;
            if(isTimeOut)
            {
                LoadingBar.hide();
            }
        });
    },

    // update (dt) {},
    onWXLoginSuccess(){
        console.log("wx login success")
        var code=WXTool.getInstance().getCode()
        if(!WXTool.enable)
        {          
            // httpReq.openId=parseInt(Math.random()*999);
            httpReq.openId = Number(this.editText.string);
        }
        GameManager.getInstance().GetOpenId(code,
            function(resp)
            {
                var openId=resp['openId'];
                WXTool.getInstance().setOpenId(openId);
                httpReq.openId=openId;
                GameManager.getInstance().myInfo = {
                    wxName: WXTool.getInstance().getWxName(),
                    iconUrl: WXTool.getInstance().getAvatarUrl(),
                    openId: openId
                };

                if(resp['hasRole'])
                {
                    GameManager.getInstance().UpdateRole(GameManager.getInstance().myInfo['wxName'],GameManager.getInstance().myInfo['iconUrl'],function(resp){
                        if(resp.toString() == "ok")
                        {
                            GameManager.getInstance().LoadScene("main");
                        }
                    });
                }
                else
                {
                    GameManager.getInstance().CreateRole(GameManager.getInstance().myInfo['wxName'],GameManager.getInstance().myInfo['iconUrl'],function(resp){
                        if(resp.toString() == "ok")
                        {
                            GameManager.getInstance().LoadScene("main");
                        }
                    });
                }
            }
        );
       
    },
    onLoginBtnClick(){
        WXTool.getInstance().login();
    }
});
