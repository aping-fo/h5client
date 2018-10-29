import { ENFILE } from "constants";
var isHide=false;
var LoadingBar = {
    _prefab: null,           // prefab
};

cc.Class({
    extends: cc.Component,

    properties: {


    },


    statics:{

        /**
         * detailString :   内容 string 类型.
         * enterCallBack:   确定点击事件回调  function 类型.
         * neeCancel:       是否展示取消按钮 bool 类型 default YES.
         * spritePath:      动态加载弹框中精灵图片的resources路径
         * duration:        动画速度 default = 0.3.
        */
        show() {
            isHide=false;
            var self = this;
        
            // 判断
            if (LoadingBar._loadingbar != undefined) return;
        
            cc.loader.loadRes("prefabs/loadingAni", cc.Prefab, function (error, prefab) {
                if(isHide)
                {
                    return;
                }
                if (error) {
                    cc.error(error);
                    return;
                }
        
                var loadingbar = cc.instantiate(prefab);
                LoadingBar._loadingbar = loadingbar;
        

                // 父视图
                LoadingBar._loadingbar.parent = cc.find("Canvas");
    
                
            });

        },
        hide()
        {
            if (LoadingBar._loadingbar != undefined && LoadingBar._loadingbar != null)
            {
                LoadingBar._loadingbar.destroy();
            }
            else
            {
                isHide=true;
            }
        }


    },

   
});