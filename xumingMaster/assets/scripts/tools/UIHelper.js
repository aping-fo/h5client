function SetImageFromUrl(sprite, url, isRemote){
    if(url == ""){
        sprite.spriteFrame = null;
        return;
    }

    if(isRemote == null){
        isRemote = false;
    }

    if(isRemote){
        url += "?aaa=aa.jpg";
        // console.log("load image" + url);
        cc.loader.load(url, function (err, tex) {
            if(err){
                cc.error(err.message || err);
                return;
            }
            sprite.spriteFrame = new cc.SpriteFrame(tex);
        });
    }else{
        cc.loader.loadRes(url, cc.SpriteFrame, function(err, spriteFrame){
            if(err){
                cc.error(err.message || err);
                return;
            }
            sprite.spriteFrame = spriteFrame;
        });
    }
    
}

module.exports = {
    SetImageFromUrl: SetImageFromUrl
}