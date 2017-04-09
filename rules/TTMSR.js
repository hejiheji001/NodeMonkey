// ==UserScript==
// @name         TTMSR
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        http://promotion.creditcard.cmbc.com.cn/promotion/*
// @grant        none
// ==/UserScript==
(function() {
    //'use strict';

    $("#con").show().css({
        "top":"0px;",
        "left": "0px",
        "margin-top": "0px;"
    });
    var index = $("#HidIndex");
    index.attr("type", "text").attr("style", "display: block; position: absolute; top: 130px; left: 0; border: 2px red solid; ");
    $(".inputc").hide();
    $(".zh_authcode_backspace.J_captcha_backspace").hide();
    $("#BtnComfir").hide();
    $("#j_captcha").attr("type", "text").unbind("click").val("").css({
        "border": "2px solid red"
    });
    $(".foter").attr("style", "top: -340px;position: relative;");

    var img = $("#imgValadate").attr("src");
    if(img){
        $("#imgValadate").attr("src", img);
        $("#imgValadate").on("click", function(){
            $(this).attr("src", img);
        });
    }

    setTimeout(function(){
        $(".J_pick").unbind("click").on("click", function(){
            str += $(this).text().substr(0,1);
            $("#j_captcha").val(str);
        }).each(function(){
            var id = $(this).attr("id");
            var text = $(this).text() + id;
            $(this).text(text);
        });
    }, 2000);

    index.on("keypress", function(e){
        if(e.keyCode === 13){
            alert("Will Submit Automatically " + $("#HidIndex").val());
            var target1 = (new Date((new Date).getFullYear(), (new Date).getMonth(), (new Date).getDate(), (new Date).getHours() + 1, 0, 0)).getTime();
            //var target2 = (new Date((new Date).getFullYear(), (new Date).getMonth(), (new Date).getDate(), 15, 0, 0)).getTime();
            var now = (new Date).getTime();

            var timer = function(){
                var sleep = setInterval(function () {
                    console.log(now);
                    if(now < target1){
                        now = (new Date).getTime();
                        timer();
                    }else{
                        window.clearInterval(sleep);
                        $("#dh_ing").removeClass('none');
                        var prod = location.search.split("week=")[1] || 1;
                        var postData = {"prodId": prod,
                            "j_captcha":$("#HidIndex").val(),
                            "imageKey":$("#imageKey").val(),
                        };

                        if(prod == 4){
                            postData = {"prodId": "01",
                                "j_captcha":$("#HidIndex").val(),
                                "imageKey":$("#imageKey").val(),
                                "merchantType": "01",
                                "carType": "01",
                                "timestamp":new Date().getTime()
                            };

                            $.ajax({
                                url:"http://promotion.creditcard.cmbc.com.cn/promotion/activityday/goOrder.jhtml",
                                type: "POST",
                                async	:false,
                                data:postData,
                                dataType:"json",
                                success:function(d){console.log(d); if(d.result == 4){console.log("OK");queryOrderResult();}else{alert("Error" + d);}}
                            });
                        }else{
                            $.ajax({
                                url:"http://promotion.creditcard.cmbc.com.cn/promotion/activityday/goOrder.jhtml?temp=" + (new Date()).getTime(),
                                type: "GET",
                                data:postData,
                                success:function(d){console.log(d); if(d.result == 4){console.log("OK");queryOrderResult();}else{alert("Error" + d);}}
                            });
                        }
                    }
                }, 500);
            };
            timer();
        }
    });
})();
