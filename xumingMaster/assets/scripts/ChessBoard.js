
cc.Class({
    extends: cc.Component,

    properties: {
        chessPrefab: {
            default: null,                                  
            type: cc.Prefab, 
            serializable: true,   
        },
        chessGroup: {
            default: null,                                  
            type: cc.Layout, 
            serializable: true,   
        },
        atlas:
        {
            default: null, 
            type: cc.SpriteAtlas, // optional, default is typeof default
            serializable: true,   // optional, default is true
        },
        chesses:[cc.Sprite],
        chesses_marked:[],
        testIndex:0,//当前选择格子index
    },


    onLoad () {
        this.chesses=new Array();
        this.chesses_marked=new Array();
        for(var i=0;i<9;i++)
        {
            var chess=cc.instantiate(this.chessPrefab);
            chess.on("click", this.onChessClick, this);
            chess.parent=this.chessGroup.node;
            this.chesses.push(chess);
        }
    },

    start () {

    },
    //棋盘下一个出现的棋子（模拟）
    OnNextBySimulation(){
        if(this.chesses_marked.length>=9)
        {
            return;
        }
        var ran=0;
        do{
            ran=Math.random()* this.chesses.length
            ran=parseInt(ran);
        }while(this.chesses_marked.indexOf(ran) != -1);
        this.chesses_marked.push(ran);
        this.chesses[ran].getComponent(cc.Sprite).spriteFrame=this.atlas.getSpriteFrame("what");
    },
    OnNext(idx)
    {
        this.chesses[idx].getComponent(cc.Sprite).spriteFrame=this.atlas.getSpriteFrame("what");
    },
    onChessClick(event){
        this.testIndex=this.chesses.indexOf(event.target);
        this.node.dispatchEvent( new cc.Event.EventCustom('onChessClick', true) );
    },
    result(index,result)
    {
        this.chesses[index].getComponent(cc.Sprite).spriteFrame=this.atlas.getSpriteFrame(result == 1?"o":"x");;
    },
    resultBySimulation(result)
    {
        this.chesses[this.testIndex].getComponent(cc.Sprite).spriteFrame=this.atlas.getSpriteFrame(result == 1?"o":"x");
        if( this.chesses_marked.length>=9)
        {
            cc.director.loadScene("result", function(){
            });
        }
    }
    // update (dt) {},
});
