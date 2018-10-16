var Base64 = require("Base64");
var md5=require("md5");
var appScript = {
    url: "http://127.0.0.1:8129/medicine",
    version: "1.0.0",   
    secret:'cJpSzEU0KcWybxhkKp47DSvUZTpgfEAuht72XHiL',
    openId:0,
    Get: function(url,reqData,callback){
        var self = this;

        url += "?";
        
        for(var item in reqData){
            url += item +"=" +reqData[item] +"&";
        }
        // console.log(self.ip + url)
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4){
                if(xhr.status >= 200 && xhr.status < 400){
                    var response = xhr.responseText;
                    // console.log(response)
                    if(response){
                        var responseJson = JSON.parse(response);
                        callback(responseJson);
                    }else{
                        console.log("返回数据不存在")
                        callback(false);
                    }
                }else{
                    console.log("请求失败")
                    callback(false);
                }
            }
        };
        url=self.ip + url;
        xhr.open("GET", url, true);
        xhr.send();
    },

    Post: function (cmd, reqData, callback) {
        var self = this;
        // console.log(url)
        // console.log(reqData)
        //1.拼接请求参数
        var param = "cmd="+cmd+"&"+"openId="+this.openId;
        var data='';
        if(reqData != null)
        {
            data=JSON.stringify(reqData);
        }
        var utfdata=Base64.utf16to8(data);
        var base64data=Base64.base64encode(utfdata);
        base64data=encodeURI(base64data).replace(/\+/g,'%2B')
        var s=md5.hex_md5(self.secret+"&"+utfdata);
        
        param=param+"&data="+base64data+"&s="+s;
        //2.发起请求
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4){
                if(xhr.status >= 200 && xhr.status < 400){
                    var response = xhr.responseText;
                    // console.log(response)
                    if(response){
                        var responseJson = JSON.parse(response);
                        if(responseJson['code'] == '200')
                        {
                            var data=JSON.parse(responseJson['data']);
                            callback(data);
                        }
                        
                    }else{
                        console.log("返回数据不存在")
                        callback(false);
                    }
                }else{
                    console.log("请求失败")
                    callback(false);
                }
            }
        };
        xhr.open("POST", self.url, true);
        xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");  
        xhr.send(param);//reqData为字符串形式： "key=value"
    },


};

module.exports = appScript;