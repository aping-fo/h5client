/**
 * 微信工具
 */
const enable = false;   //微信是否开启。方便本地调试

var Const = {
    OpenDataKey_Level: "level",

    StorageKey_NewPlayer: "newPlayer",
};

var WXTool = cc.Class({
    statics: {
        instance: null,
        getInstance: function () {
            return this.instance || (this.instance = new WXTool()), this.instance;
        },
        enable: enable,
    },

    ctor: function () {
        this.m_isLogin = false;
        this.m_loginBtn = null;

        this.initShare();
    }, 
    reset() {
        this.m_isLogin = false;
        this.m_loginBtn = null;
    },

    //登陆
    login() {
        if (this.m_isLogin) {
            return;
        }

        if (!enable) {
            this.setOpenId();
            this.getUserInfo();
            return;
        }
        var _this = this;

        wx.login({
            success: res => {
                console.log("login success");
                console.log(res['code']);
                _this.setCode(res['code']);

                //获取用户授权
                wx.getSetting({
                    success: function (res) {
                        var authSetting = res.authSetting;
                        var userInfoSetting = authSetting['scope.userInfo'];
                        if (userInfoSetting === true) {
                            //用户成功授权
                            console.log("Request WX UserInfo Success");
                            _this.getUserInfo();
                        } else {
                            if (userInfoSetting === false) {
                                // 处理用户拒绝授权的情况
                                console.log("Request WX UserInfo False");
                            } else {
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
            fail: () => {
                console.log("login fail");
            }
        });
    },

    //获取Openid
    setOpenId(openId) {
        this.m_openId = openId ? openId : "";

        this.initRankInfo(this.m_openId);
    },
    //获取Openid
    getOpenId() {
        return enable ? this.m_openId : parseInt(Math.random() * 99);
    },
    //登录code
    setCode(code) {
        this.m_code = code;
    },

    getCode() {
        return enable ? this.m_code : ""
    },
    //获取用户头像和名字信息
    getUserInfo() {
        if (!enable) {
            this.getUserInfoSuccess();
            return;
        }
        var _this = this;
        wx.getUserInfo({
            success: function (res) {
                console.log("getUserInfo success");
                console.log(res);
                _this.getUserInfoSuccess(res);

                if (_this.m_loginBtn != null) {
                    _this.m_loginBtn.hide();
                    _this.m_loginBtn = null;
                }
            },

            fail: function (res) {
                // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                    // 处理用户拒绝授权的情况
                    console.log("Request WX UserInfo False");
                }
            }
        });
    },

    getUserInfoSuccess(res) {
        if (res) {
            this.m_avatarUrl = res.userInfo.avatarUrl;
            this.m_nickName = res.userInfo.nickName;
        }

        this.loginSuccess();
    },
    getWxName() {
        return enable ? this.m_nickName : "测试";
    },
    getAvatarUrl() {
        return enable ? this.m_avatarUrl : "";
    },
    //登陆成功
    loginSuccess() {
        this.m_isLogin = true;
        cc.director.emit("WXLoginSuccess");
    },

    /**
     * 分享
     */
    initShare() {
        if (!enable) {
            return;
        }

        wx.updateShareMenu({
            withShareTicket: true
        });

        wx.showShareMenu();
    },
    //分享指定图片
    share() {
        if (!enable) {
            cc.director.emit("RecoverEnerge");
            return;
        }

        var shareImages = ["resources/shareImg/share1.jpg", "resources/shareImg/share2.jpg"];
        var rand = Math.floor(Math.random() * shareImages.length);

        wx.shareAppMessage({
            title: '求婚101',
            imageUrl: cc.loader.md5Pipe.transformURL(cc.url.raw(shareImages[rand])),
            success: function (res) {
                cc.director.emit("RecoverEnerge");
            },

            fail: function (res) {
            }
        });
    },
    //邀请好友
    shareToPlayTogether(roomId, callback) {
        if (!enable) {
            callback();
            return;
        }

        var shareImages = ["resources/shareImg/share1.jpg", "resources/shareImg/share2.jpg"];
        var rand = Math.floor(Math.random() * shareImages.length);
        wx.shareAppMessage({
            title: '养生大师',
            imageUrl: cc.loader.md5Pipe.transformURL(cc.url.raw(shareImages[rand])),
            query: "roomId=" + roomId,
            success: function (res) {
                callback();
            },

            fail: function (res) {
            }
        });
    },

    //分享屏幕截图
    shareWithImage() {
        if (!enable) {
            return;
        }

        wx.shareAppMessage({
            title: '求婚101',
            imageUrl: canvas.toTempFilePathSync({
                destWidth: 500,
                destHeight: 400
            }),
            success: function (res) {
                cc.director.emit("Reborn");
            },

            fail: function (res) {
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
    initRankInfo(openId) {
        if (!enable) {
            return;
        }

        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({ eventType: 3, openId: openId});
    },

    getOpenDataContextCanvas() {
        if (!enable) {
            return;
        }

        var openDataContext = wx.getOpenDataContext();
        return openDataContext.canvas;
    },

    //打开排行榜
    openRankPanel() {
        if (!enable) {
            return;
        }

        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({ eventType: 1 });
    },

    //切换好友排行
    openFriendRankPanel() {
        if (!enable) {
            return;
        }

        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({ eventType: 10 });
    },

    //切换全球排行
    openGlobalRankPanel(data, from) {
        if (!enable) {
            return;
        }

        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({ eventType: 11, datas: { data: data, from: from } });
    },

    //打开超越好友分享面板
    // openSharePanel(){
    //     if(!enable){
    //         return;
    //     }

    //     var openDataContext = wx.getOpenDataContext();
    //     openDataContext.postMessage({eventType: 2});
    // },

    //上报等级
    reportLevel(level) {
        if (enable) {
            wx.setUserCloudStorage({
                KVDataList: [{ key: Const.OpenDataKey_Level, value: level + '' }],
                success: res => {
                    console.log(res);
                },
                fail: res => {
                    console.log(res);
                }
            });
        }
    },

    //获取卡片传入参数
    getLaunchOptionsSync() {
        if (!enable) {
            return null;
        }
        return wx.getLaunchOptionsSync();
    },

    wxOnShow(callback) {
        if (enable) {
            wx.onShow(function (res) {
                callback(res)
            });
        }
    },

    ensureDirFor(path, callback){
        // cc.log('mkdir:' + path);
        if(!enable){
            return;
        }

        var _this = this;
        var fs = wx.getFileSystemManager();
        var ensureDir = cc.path.dirname(path);
        if (ensureDir === "wxfile://usr" || ensureDir === "http://usr") {
            callback();
            return;
        }
        fs.access({
            path: ensureDir,
            success: callback,
            fail: function (res) {
                _this.ensureDirFor(ensureDir, function () {
                    fs.mkdir({
                        dirPath: ensureDir,
                        complete: callback,
                    });
                });
            },
        });
    },

    saveFileToLocal(fromPath, callback){
        if(!enable){
            return;
        }

        // var localPath = wx.env.USER_DATA_PATH + '/' + toPath;
        var fs = wx.getFileSystemManager();
        fs.saveFile({
            tempFilePath: fromPath,
            success: function(res){
                if(callback){
                    callback("success", res.savedFilePath);
                }
            },

            fail: function(res){
                console.log(res.errMsg);
                if(callback){
                    callback("fail");
                }
            }
        });
        // this.ensureDirFor(localPath, function () {
        //     fs.saveFile({
        //         tempFilePath: fromPath, 
        //         filePath: toPath,
        //         success: function(res){
        //             if(callback){
        //                 callback("success", res.savedFilePath);
        //             }
        //         },

        //         fail: function(res){
        //             console.log(res.errMsg);
        //             if(callback){
        //                 callback("fail");
        //             }
        //         }
        //     });
        // });
    },

    //保存图片到相册
    saveImageToAlbum(path, callback){
        if(!enable){
            return;
        }

        new Promise(function(resolve, reject){
            wx.authorize({
                scope: "scope.writePhotosAlbum",
                success: function(){
                    resolve();
                },

                fail: function(){
                    reject();
                }
            })
        }).then(function(){
            wx.saveImageToPhotosAlbum({
                filePath: path,
                success: function(){
                    if(callback){
                        callback("success");
                    }
                },

                fail: function(){
                    if(callback){
                        callback("fail");
                    }
                }
            });
        }).catch(function(){
            if(callback){
                callback("fail");
            }
        });
    }
});