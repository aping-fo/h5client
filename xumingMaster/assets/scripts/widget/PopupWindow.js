cc.Class({
    extends: cc.Component,

    properties: {

    },

    start () {

    },

    onEnable(){
        //在canvas的最后一层
        let canvasNode = cc.Canvas.instance.node;
        let lastIndex = 0;
        for(var i = 0; i < canvasNode.children.length; i++){
            lastIndex = Math.max(lastIndex, canvasNode.children[i].getSiblingIndex());
        }

        this.node.setSiblingIndex(lastIndex + 1);
    }
});
