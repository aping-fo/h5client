var appScript = {
    loadImg: function(container,url){
        url=url+"?aa=aa.jpg";
        cc.loader.load(url, function (err, texture) {
            var sprite  = new cc.SpriteFrame(texture);
            container.spriteFrame = sprite;
        });
    } 
}
module.exports = appScript;

