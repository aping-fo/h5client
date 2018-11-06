var WXTool = require("WXTool");

function GetCaptureCamera() {
    var captureCameraNode = cc.find("CaptureCamera", cc.Canvas.instance.node);
    if (captureCameraNode == null) {
        var captureCameraNode = new cc.Node();
        captureCameraNode.setParent(cc.Canvas.instance.node);
        
        var captureCamera = captureCameraNode.addComponent(cc.Camera);
        captureCamera.cullingMask = 0x00000002;

        captureCameraNode.active = false;
        captureCameraNode.name = "CaptureCamera";
        captureCameraNode.position = cc.Vec2.ZERO;
    }
    return captureCameraNode.getComponent(cc.Camera);
}

function SetImageFromUrl(sprite, url, isRemote) {
    if (url == "") {
        sprite.spriteFrame = null;
        return;
    }

    if (isRemote == null) {
        isRemote = false;
    }

    if (isRemote) {
        url += "?aaa=aa.jpg";
        // console.log("load image" + url);
        cc.loader.load(url, function (err, tex) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            sprite.spriteFrame = new cc.SpriteFrame(tex);
        });
    } else {
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            sprite.spriteFrame = spriteFrame;
        });
    }
}

//保存节点的图片
function SaveNodeRender(node, pageHeigth, isStore, callback) {
    if(!WXTool.enable){
        if(callback){
            callback("");
        }
        return;
    }

    var oldPosition = node.position;
    var oldActive = node.active;
    node.active = true;

    var worldBoundingBox = node.getBoundingBoxToWorld();
    // pageHeigth = Math.min(pageHeigth, worldBoundingBox.height);
    
    var captureCamera = GetCaptureCamera();

    var width = cc.winSize.width;
    var height = cc.winSize.height;

    captureCamera.node.active = true;

    //截屏renderTexture
    var renderTexture = new cc.RenderTexture();
    renderTexture.initWithSize(width, height);

    captureCamera.targetTexture = renderTexture;

    var canvas = wx.createCanvas();
    var ctx = canvas.getContext("2d");
    var saveHeight = worldBoundingBox.height;
    canvas.width = worldBoundingBox.width;
    canvas.height = saveHeight;

    var rowBytes = 4 * worldBoundingBox.width;
    var page = Math.ceil(saveHeight / pageHeigth);  //如果比屏幕大，则多次截屏保存成1张
    
    for (var i = 0; i < page; i++) {
        //渲染
        captureCamera.render();

        //读取数据
        var data = renderTexture.readPixels(null, worldBoundingBox.x, 0, worldBoundingBox.width, pageHeigth);
        var beginRow = i * pageHeigth;
        var endRow = Math.min(beginRow + pageHeigth, saveHeight);

        for (var row = beginRow; row < endRow; row++) {
            var srow = endRow - 1 - row;
            var imageData = ctx.createImageData(width, 1);
            var start = srow * rowBytes;
            for (var _i = 0; _i < rowBytes; _i++){
                imageData.data[_i] = data[start + _i];
            }
            ctx.putImageData(imageData, 0, row);
        }
        node.position = new cc.Vec2(node.position.x, node.position.y + pageHeigth);
        
        renderTexture.destroy();
        renderTexture = new cc.RenderTexture();
        renderTexture.initWithSize(width, height);
        captureCamera.targetTexture = renderTexture;
    }
    node.position = oldPosition;
    node.active = oldActive;

    captureCamera.node.active = false;
    captureCamera.targetTexture = null;

    renderTexture.destroy();


    var path = canvas.toTempFilePathSync();
    if(isStore){
        WXTool.getInstance().saveFileToLocal(path, function(res, path){
            if(res == "success"){        
                if(callback){
                    callback(path);
                }
            }
        });
    }else{
        if(callback){
            callback(path);
        }
    }
}

module.exports = {
    SetImageFromUrl: SetImageFromUrl,
    SaveNodeRender: SaveNodeRender,
}