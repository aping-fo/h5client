var GameManager = require("GameManager");
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
        winArr:null
    },


    onLoad () {
        this.winArr=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
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
    OnNext()
    {
        this.chesses[GameManager.getInstance().curQuestionIdx].getComponent(cc.Sprite).spriteFrame=this.atlas.getSpriteFrame("what");
        
    },
    onChessClick(event){
        var idx=this.chesses.indexOf(event.target);
        if(idx == GameManager.getInstance().curQuestionIdx)
        {
            this.node.dispatchEvent( new cc.Event.EventCustom('onChessClick', true) );
        }
       
    },
    result(index,result)
    {
        console.log(result)
        this.chess es[index].getComponent(cc.Sprite).spriteFrame=this.atlas.getSpriteFrame(result == 1 ?"o":"x");;
    },
    setGrid()
    {
        var questions=GameManager.getInstance().questions;
        var length=questions.length;
        for(var i=0;i<length;i++)
        {
            // this.chesses.
        }
    },
    CheckWin()
    {
        var length=this.winArr.length;
        for(var i=0;i<length;i++)
        {
            var name=this.chesses[this.winArr[i][0]].getComponent(cc.Sprite).spriteFrame._name;
            if(this.CheckIsSame(this.chesses[this.winArr[i][1]],name) && this.CheckIsSame(this.chesses[this.winArr[i][2]],name))
            {
                if(name == 'o')
                {
                    return GameManager.getInstance().myInfo['side'] == 0;
                } 
                if(name == 'x')
                {
                    return  GameManager.getInstance().myInfo['side'] == 1;
                } 
            }

        }
        return null;
    },
    CheckIsSame(gridA,name)
    {
        if(gridA.getComponent(cc.Sprite).spriteFrame == null)
        {
            return false;
        }
        return gridA.getComponent(cc.Sprite).spriteFrame._name == name;
    }
    // update (dt) {},
});
