/**
 * 微信工具
 */
const enable = false;   //微信是否开启。方便本地调试
const APP_ID = "wxb00112803f6343cc";
const APP_SECRET = "cef5c8335e35c10e503528a850087377";
const DomainName = "https://mary101.luckygz.com:8443"
const Login_URL = DomainName + "/marry101/get_open_id?" //更新积分信息
const RankReport_URL = DomainName + "/marry101/update?" //更新积分信息
const Rank_URL = DomainName + "/marry101/rank?" //排行榜请求

var Const = {
    OpenDataKey_Score: "score",

    StorageKey_Score: "score",
    StorageKey_Energe: "energe",
    StorageKey_EnergeRecoverTime: "energeRecoverTime",
    StorageKey_NewPlayer: "newPlayer",

    Query_RecoverEnerge: "RecoverEnerge",
    Query_Reborn: "Reborn",
};

var WXTool = cc.Class({
    statics:{
        instance: null,
        getInstance: function(){
            return this.instance || (this.instance = new WXTool()), this.instance;
        }
    },

    ctor: function(){
        this.m_isLogin = false;
        this.m_loginBtn = null;
    },
    reset()
    {
        this.m_isLogin = false;
        this.m_loginBtn = null;
    },
    //登陆
    login(){
        if(this.m_isLogin){
            return;
        }

        if(!enable){
            this.setOpenId();
            this.getUserInfo();
            return;
        }
        var _this = this;
        
        wx.login({
            success: res=>{
                console.log("login success");
                console.log(res);

                //请求游戏服务器返回openId
                wx.request({
                    url: Login_URL + "code=" + res.code,
                    success: res=> {
                        console.log("get open id success");
                        console.log(res);
                        _this.setOpenId(res);
                    }
                });

                //获取用户授权
                wx.getSetting({
                    success: function(res){
                        var authSetting = res.authSetting;
                        var userInfoSetting = authSetting['scope.userInfo'];
                        if(userInfoSetting === true){
                            //用户成功授权
                            console.log("Request WX UserInfo Success");
                            _this.getUserInfo();
                        }else{
                            if(userInfoSetting === false){
                                // 处理用户拒绝授权的情况
                                console.log("Request WX UserInfo False");
                            }else{
                                console.log("Request WX UserInfo Ask");
                            }
                            
                            //弹出询问框
                            let { screenWidth, screenHeight } = wx.getSystemInfoSync();
                            console.log(screenWidth);
                            console.log(screenHeight);
                            var button = wx.createUserInfoButton({
                                type: 'image',
                                image: cc.loader.md5Pipe.transformURL(cc.url.raw("resources/startBtn.png")),
                                style: {
                                    left: (screenWidth - 125) / 2,
                                    top: (screenHeight - 150),
                                    width: 125,
                                    height: 54.5
                                }
                            });
        
                            button.onTap((res) => {
                                _this.getUserInfo();
                            });
        
                            _this.m_loginBtn = button;
                        }
                    }
                });
            },
            fail: ()=>{
                console.log("login fail");
            }
        });
    },

    //获取Openid
    setOpenId(res){
        this.m_openId = res ? res.data.openid : "";
    },

    //获取用户头像和名字信息
    getUserInfo(){
        if(!enable){
            this.getUserInfoSuccess();
            return;
        }
        var _this = this;
        wx.getUserInfo({
            success: function(res){
                console.log("getUserInfo success");
                console.log(res);
                _this.getUserInfoSuccess(res);

                if(_this.m_loginBtn != null){
                    _this.m_loginBtn.hide();
                    _this.m_loginBtn = null;
                }
            },

            fail: function (res) {
                // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                if (res.errMsg.indexOf('auth deny') > -1 || 	res.errMsg.indexOf('auth denied') > -1 ) {
                    // 处理用户拒绝授权的情况
                    console.log("Request WX UserInfo False");
                }
            }
        });
    },

    getUserInfoSuccess(res){
        if(res){
            this.m_avatarUrl = res.userInfo.avatarUrl;
            this.m_nickName = res.userInfo.nickName;
        }
        
        this.loginSuccess();
    },

    //登陆成功
    loginSuccess(){
        this.m_isLogin = true;
        this.initRankInfo();
        cc.director.emit("WXLoginSuccess");
    },

    /**
     * 分享
     */
    initShare(){
        if(!enable){
            return;
        }

        wx.udateShareMenu({
            withShareTicket: true
        });
    },

    //分享指定图片
    share(){
        if(!enable){
            cc.director.emit("RecoverEnerge");
            return;
        }

        var shareImages = ["resources/shareImg/share1.jpg", "resources/shareImg/share2.jpg"];
        var rand = Math.floor(Math.random() * shareImages.length);
        
        wx.shareAppMessage({
            title: '求婚101',
            imageUrl: cc.loader.md5Pipe.transformURL(cc.url.raw(shareImages[rand])),
            success: function(res){
                cc.director.emit("RecoverEnerge");
            },

            fail: function(res){
            }
        });
    },
    //邀请好友
shareToPlayTogether(roomId,callback){
    if(!enable){
        callback();
        return;
    }

    
    wx.shareAppMessage({
        title: '养生大师',
        imageUrl: cc.loader.md5Pipe.transformURL(cc.url.raw(shareImages[rand])),
        query: "roomId="+roomId, 
        success: function(res){
            callback();
        },

        fail: function(res){
        }
    });
},

    //分享屏幕截图
    shareWithImage(){
        if(!enable){
            return;
        }

        wx.shareAppMessage({
            title: '求婚101',
            imageUrl: canvas.toTempFilePathSync({
                destWidth: 500,
                destHeight: 400
            }),
            success: function(res){
                cc.director.emit("Reborn");
            },

            fail: function(res){
            }
        });
    },

    /**
     * 广告
     */

    /**
     * 排行榜
     */
    //初始化排行榜信息
    initRankInfo(){
        if(!enable){
            return;
        }

        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({eventType:3, openId: this.m_openId});
    },

    getOpenDataContextCanvas(){
        if(!enable){
            return;
        }

        var openDataContext = wx.getOpenDataContext();
        return openDataContext.canvas;
    },

    //打开排行榜
    openRankPanel(){
        if(!enable){
            return;
        }

        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({eventType: 1});
    },

    //切换好友排行
    openFriendRankPanel(){
        if(!enable){
            return;
        }
        
        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({eventType: 10});
    },

    //切换全球排行
    openGlobalRankPanel(){
        if(!enable){
            return;
        }
        
        wx.request({
            url: Rank_URL + "beginIndex=0&endIndex=6",
            success: res=>{
                console.log(res);
                var openDataContext = wx.getOpenDataContext();
                openDataContext.postMessage({eventType: 11, datas: res.data});
            }
        })
    },

    //打开超越好友分享面板
    openSharePanel(){
        if(!enable){
            return;
        }

        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({eventType: 2});
    },

    //上报分数
    reportScore(score){
        if(!enable){
            return;
        }
        wx.setUserCloudStorage({
            KVDataList: [{ key: Const.OpenDataKey_Score, value: score + ''}],
            success: res => {
                console.log(res);
            },
            fail: res => {
                console.log(res);
            }
        });
        wx.setStorage({ key: Const.StorageKey_Score, data: score + ''});

        //post到后端服务器
        var _this = this;
        console.log("origin " + this.m_nickName);
        console.log("encode " + encodeURIComponent(this.m_nickName));
        wx.request({
            url: RankReport_URL + "openId=" + this.m_openId + "&nickName=" + 
            encodeURIComponent(this.m_nickName) + "&avatarUrl=" + this.m_avatarUrl + "&score=" + score,
            success: res=> {
                console.log(res);
            }
        });
    },

    //获取当前用户分数
    getScore(){
        if(!enable){
            return 4;
        }

        var score = Number(wx.getStorageSync(Const.StorageKey_Score));

        score = score == 0 ? 4:score;

        return score;
    },

    //上报体力
    reportEnerge(energe, lastRecoverTime){
        if(!enable){
            return;
        }

        wx.setStorage({ key: Const.StorageKey_Energe, data: energe + ''});
        
        wx.setStorage({key: Const.StorageKey_EnergeRecoverTime, data: lastRecoverTime + ''});
    },

    //获取当前用户体力
    getEnerge(callback){
        if(!enable){
            callback(5,0,0);
            return;
        }

        var energe = Number(wx.getStorageSync(Const.StorageKey_Energe));
        
        var recoverTime = Number(wx.getStorageSync(Const.StorageKey_EnergeRecoverTime));

        if(recoverTime == 0){
            energe = 5;
        }
        
        callback(energe, recoverTime)
    },
    //获取卡片传入参数
    getLaunchOptionsSync()
    {
        if(!enable){
            return null;
        }
        return wx.getLaunchOptionsSync().query;
    }
});