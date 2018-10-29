cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,                                  
            type: cc.Label, 
            serializable: true,   
        },
        intervalTime: {
            default: 1,            
            visible: false    
        },
        reduiseTime: {
            default: 0,            
            visible: false    
        },
        isStart:false,
        callback:null,
        pre:""
    },


    // onLoad () {},

    start () {
        
    },
    
    update (dt) {
        if(! this.isStart)
        {
            return;
        }
         //每秒更新显示信息
    if (this.intervalTime >= 0 ) {

        this.intervalTime -= dt;
        
        }else {
        
        this.intervalTime = 1;
        
        this.countDownShow();
        
    }  
    },
    countDownShow()
    {
        var baseSecond = this.reduiseTime;
        baseSecond = baseSecond - 1;
        this.reduiseTime = baseSecond;
        if(this.reduiseTime<=0)
        {
            this.isStart=false;
            if(this.callback != null)
            {
                this.callback();
            }
            return;
        }
        var hour = Math.floor(baseSecond / 3600);
        var residue = baseSecond - hour * 3600;
        var minute = Math.floor(residue / 60);
        residue = residue - minute * 60;
        if (hour < 10) {
            hour = "0" + hour;
        }
        if (minute < 10) {
            minute = "0" + minute;
        }
        // if (residue < 10) {
        //     residue = "0" + residue;
        // }
        // this.label.string = hour + " : " + minute + " : " + residue;
        // this.label.string =  minute + " : " + residue;
        this.label.string =  this.pre+residue;
    },
    startCountDown(totalTime,cb,preContext)
    {
        this.pre=preContext;
        this.isStart=true;
        this.reduiseTime=totalTime;
        this.callback=cb;
        this.countDownShow();
    },
    reset()
    {
        this.pre="";
        this.isStart=false;
        this.reduiseTime=0;
        this.callback=null;
    }
});
