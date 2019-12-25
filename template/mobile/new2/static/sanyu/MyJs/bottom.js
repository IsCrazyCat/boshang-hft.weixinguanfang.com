//接口地址
//var baseUrl = "http://test2.vellgo.com.cn";
var baseUrl = "http://trgf.vellgo.com.cn";
var serverUrl = baseUrl + '/api/';
var baseUrlvellgo = baseUrl + "/weChatpay/";
var baseServerUrl = baseUrl + "/weChatpay/";
var myServerUrl = baseServerUrl + "topayServlet";
var urlIMg = baseUrl + "/";
var chainedPath = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.fiberhome.exmobi.client.gaeaclientandroidedn7262';

//运费基数配置
var expressFeeAry = [
    {"disctChn": "新疆", "expFee": "15"},
    {"disctChn": "西藏", "expFee": "15"},
    {"disctChn": "内蒙古", "expFee": "10"},
    {"disctChn": "海南", "expFee": "10"}
];

$(".footer_tou div[id^='i_']").each(function (index, el) {
    $("#" + el.id).on("click", function () {
        add_remove(el.id);
    });
});

function add_remove(id) {
    $("#shouye_s").addClass("shouye").removeClass("shouye_s");
    $("#che_s").addClass("che").removeClass("che_s");
    $("#geren_s").addClass("gerenzhongxin").removeClass("gerenzhongxin_s");
    $("#erweima_s").addClass("erweima").removeClass("erweima_s");
    $(".div").addClass("footer_div").removeClass("footer_div_s");
    $("#" + id).addClass("footer_div_s").removeClass("footer_div");
    if (id == "i_shouye") {
        $("#shouye_s").addClass("shouye_s").removeClass("shouye");
        window.location.href = baseUrlvellgo + 'home';
        //window.location.href='home.jsp';
    }
    if (id == "i_che") {
        $("#che_s").addClass("che_s").removeClass("che");
        var currUrl = window.location.href;
        if (currUrl.indexOf("GetOppId") > -1) {
            window.location.href = '/weChatpay/assets/html/shopping_cart.html';
        } else {
            window.location.href = 'shopping_cart.html';
        }
    }
    if (id == "i_geren") {
        $("#geren_s").addClass("gerenzhongxin_s").removeClass("gerenzhongxin");
        //window.location.href='Personage_Centre.jsp';
        window.location.href = baseUrlvellgo + 'Conten';
    }
    if (id == "i_erweima") {
        $("#erweima_s").addClass("erweima_s").removeClass("erweima");
        var CON_TYPE = localStorage.getItem("CON_TYPE");
        if (CON_TYPE == 1) {
            //window.location.href='Code.jsp';
            window.location.href = baseUrlvellgo + 'GetCode';

        } else {
            promptBoxOne("您还没有消费体验产品，不能使用二维码");
            $(".Addaaa").remove();
            $("#erweima_s").addClass("erweima").removeClass("erweima_s");
            $(".div").addClass("footer_div").removeClass("footer_div_s");
        }
    }
}

//弹框
function myalert(text, id) {
    if ($('.myalert').length > 0) {
        return
    }

    $('body').append('<div class="myalert"><span >' + text + '</span></div>');

    id = id || 1000;
    var s = setTimeout(function () {
        $("body").find(".myalert").remove();
        clearTimeout(s);
    }, id);
}

//获取路径的带的参数的值
function get(p) {
    var url = document.URL.toString();
    var tmpStr = p + "=";
    var tmp_reg = eval("/[\?&]" + tmpStr + "/i");

    if (url.search(tmp_reg) == -1) return null;
    else {
        var a = url.split(/[\?&]/);
        for (var i = 0; i < a.length; i++)
            if (a[i].search(eval("/^" + tmpStr + "/i")) != -1)
                return a[i].substring(tmpStr.length);
    }
}

//loading
function showLoading() {
    var html = '<div class="reminder" style="width:100%;height:100%;background: #000000;top: 0;left: 0;right: 0;bottom: 0;opacity: 0.5;position: fixed;z-index: 99999999999;"></div>';
    html += '<div class="reminderDown" style="position: fixed;left: 50%;top: 50%;width: 200px;height: 50px;z-index: 999999999999999;margin-left: -100px;margin-top: -60px;box-shadow: 0 0 25px rgba(0, 0, 0, .3);background-color: #fff;text-align:center;padding-top:10px;border-radius:10px;">';
    var currUrl = window.location.href;
    if (currUrl.indexOf("GetOppId") > -1) {
        html += '<img src="/weChatpay/assets/MyImg/Allloading.gif" style="width:98%"/></div>';
    } else {
        html += '<img src="../MyImg/Allloading.gif" style="width:98%"/></div>';
    }
    $("body").append(html);
}
function closeLoading() {
    $(".reminder").remove();
    $(".reminderDown").remove();

}

//自定义的提示，确定和取消
function promptBox(str) {
    $(".Addaaa,.pop-contant").remove();
    var html = '<div class="Addaaa"></div>';
    html += '<div class="pop-contant">';
    html += '<p>';
    html += str;
    html += '</p>';
    html += '<buttom id="buttoms" class="pb p1" >';
    html += '取消</buttom>';
    html += '<buttom id="buttomt" class="pb p2" onclick="buttomtConf()">';
    html += '确定</buttom>';
    html += '</div>';
    $("body").append(html);
    $("#buttoms").on("click", function () {
        $(".Addaaa,.pop-contant").remove();
    });
}

function promptBox1(str) {
    $(".Addaaa,.pop-contant").remove();
    var html = '<div class="Addaaa"></div>';
    html += '<div class="pop-contant">';
    html += '<p>';
    html += str;
    html += '</p>';
    html += '<buttom id="buttoms" class="pb p1" >';
    html += '取消</buttom>';
    html += '<buttom id="buttomt" class="pb p2" onclick="buttomtConf1()">';
    html += '确定</buttom>';
    html += '</div>';
    $("body").append(html);
    $("#buttoms").on("click", function () {
        $(".Addaaa,.pop-contant").remove();
    });
}

function promptBox2(str) {
    $(".Addaaa,.pop-contant").remove();
    var html = '<div class="Addaaa"></div>';
    html += '<div class="pop-contant">';
    html += '<p>';
    html += str;
    html += '</p>';
    html += '<buttom id="buttoms" class="pb p1" >';
    html += '取消</buttom>';
    html += '<buttom id="buttomt" class="pb p2" onclick="buttomtConf2()">';
    html += '确定</buttom>';
    html += '</div>';
    $("body").append(html);
    $("#buttoms").on("click", function () {
        $(".Addaaa,.pop-contant").remove();
    });
}

//确定之后做一些事情的
function promptBoxOne(str) {
    $(".Addaaa,.pop-contant").remove();
    var html = '<div class="Addaaa"></div>';
    html += '<div class="pop-contant">';
    html += '<p>';
    html += str;
    html += '</p>';
    html += '<buttom id="Qbuttomt" class="pb p2" onclick="Qbuttomt()" >';
    html += '确定</buttom>';
    html += '</div>';
    $("body").append(html);
}

//支付之后下载APP的
function DownAddress(str) {
    $(".Addaaa,.pop-contant").remove();
    var html = '<div class="Addaaa"></div>';
    html += '<div class="pop-contant">';
    html += '<p>';
    html += str;
    html += '</p>';
    html += '<buttom  class="pb p1" onclick="Qbuttomt()">';
    html += '取消</buttom>';
    html += '<buttom id="DownRefer" class="pb p2" >';
    html += '确定</buttom>';
    html += '</div>';
    $("body").append(html);

    //确认之后下载APP
    $("#DownRefer").on("click", function () {
        $(".Addaaa,.pop-contant").remove();
        trgfandroid();
    });
}

//确定之后什么都没有做的
function promptBoxOneS(str) {
    $(".Addaaa,.pop-contant").remove();
    var html = '<div class="Addaaa"></div>';
    html += '<div class="pop-contant">';
    html += '<p>';
    html += str;
    html += '</p>';
    html += '<buttom id="QbuttomtS" class="pb p2" onclick="QbuttomtS()" >';
    html += '确定</buttom>';
    html += '</div>';
    $("body").append(html);
    $("#QbuttomtS").on("click", function () {
        $(".Addaaa,.pop-contant").remove();
    })
}

//是否可以更改推荐人
function checkUpdateReferee(type) {
    var CON_ID = localStorage.getItem("CON_ID");
    var jsonStr = "{\"CON_ID\":\"" + CON_ID + "\"}";
    $.ajax({
        url: serverUrl + 'customer/checkUpdateReferee',
        data: jsonStr,
        dataType: 'json',
        type: 'post',
        async: false,
        success: function (mydata) {
            if (mydata.result == 0) {
                CHEKREFEREE = mydata.data.RESULT;
            }
            if (type == "1") {
                DataPort(CON_ID);
                Member_Message(CON_ID);
            }
        }, error: function (mydata) {
            myalert("服务器繁忙，请稍后重试", 5000);
        }
    });
}

//APP下载链接
$(".chainedAddress").on("click", function () {
    window.location.href = chainedPath;
});

//下载路径
function trgfandroid() {
    window.location.href = chainedPath;
}

function overspread() {
    var cover = '<div class="cover"></div>';
    $('body').append(cover);
    $('.cover').css({
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'width': '100%',
        'height': '100%',
        'background-color': 'rgba(77, 77, 77, 0.41)',
        'z-index': '10'
    })
}
function mvOverspread() {
    $('.cover').remove();
}

//初始化七鱼插件
function initServicePlugin() {
    ysf.config({
        "uid": localStorage.getItem("CON_ID"),
        "data":
            JSON.stringify([
                {
                    "key": "real_name",
                    "label": "姓名",
                    "value": localStorage.getItem("CON_NAME") + '-' + localStorage.getItem("CON_NO")
                },
                {"key": "mobile_phone", "label": "手机", "value": localStorage.getItem("MOBILE")},
                {"index": 1, "key": "conNo", "label": "会员号", "value": localStorage.getItem("CON_NO")},
                {"index": 2, "key": "nickname", "label": "昵称", "value": localStorage.getItem("CON_NAME")},
                {"index": 3, "key": "sex", "label": "性别", "value": localStorage.getItem("sex")},
                {"index": 4, "key": "reg_dt", "label": "注册日期", "value": localStorage.getItem("reg_dt")},
                {
                    "index": 5,
                    "key": "latest_login_dt",
                    "label": "上次登录时间",
                    "value": localStorage.getItem("last_login_dt")
                }
            ]),
        "qtype": '23014'
    });

    setTimeout(function () {
        location.href = ysf.url();
    }, 1000);
}

/*
获取文案列表内的指定文案
@params key
*/
function getAssignOfficial(key) {
    var docList = localStorage.getItem("officalDocList");

    if (docList) {
        docList = JSON.parse(docList);

        return docList.data[key] ? docList.data[key].docContent : '';
    }
}

var globalConfig = {
    /**
     文案列表
     @params channel 1公众号
     */
    getDocListVersion: function () {
        var _this = this;
        var data = {
            channel: '1'
        };

        MYAPP.loadingToast.loadingToastShow('数据加载中');
        $.ajax({
            url: serverUrl + 'config/getConfigInfomation',
            type: 'post',
            dataType: 'json',
            async: false,
            data: JSON.stringify(data),
            success: function (res) {
                MYAPP.loadingToast.loadingToastHide();

                if (res.result === 0) {
                    var version;
                    var currentData;
                    var docList = localStorage.getItem('officalDocList');

                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].apiKey === 'official_doc') {
                            version = res.data[i].version;
                            currentData = res.data[i];
                        }
                    }

                    if (docList !== null) {
                        docList = JSON.parse(docList);

                        if (currentData.version > docList.version || '0') {
                            _this.getOfficalDocList(version);
                        }
                    } else {
                        _this.getOfficalDocList(version);
                    }
                }
            },
            error: function (error) {
                MYAPP.loadingToast.loadingToastHide();
                myalert("服务器繁忙,请稍后重试", 5000);
            }
        });
    },
    getOfficalDocList: function (version) {
        MYAPP.loadingToast.loadingToastShow('数据加载中');
        $.ajax({
            url: serverUrl + 'config/getOfficalDocList',
            type: 'post',
            async: false,
            dataType: 'json',
            success: function (res) {
                MYAPP.loadingToast.loadingToastHide();

                if (res.result === 0 && res.data) {
                    localStorage.setItem('officalDocList', JSON.stringify({version: version, data: res.data}));
                }
            },
            error: function () {
                MYAPP.loadingToast.loadingToastHide();
                myalert("服务器繁忙,请稍后重试", 5000);
            }
        });
    },
    hideShareBtn: function () {
        wx.config({});
        wx.ready(function () {
            wx.hideOptionMenu();
        });
    }
};

//初始化微信字体大小
(function () {
    if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
        handleFontSize();
    } else {
        if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
        } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", handleFontSize);
            document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
        }
    }

    function handleFontSize() {
        // 设置网页字体为默认大小
        WeixinJSBridge.invoke('setFontSizeCallback', {'fontSize': 0});
        // 重写设置网页字体大小的事件
        WeixinJSBridge.on('menu:setfont', function () {
            WeixinJSBridge.invoke('setFontSizeCallback', {'fontSize': 0});
        });
    }
})();
//初始化神策插件
(function (para) {
    var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script', x = null, y = null;
    w['sensorsDataAnalytic201505'] = n;
    w[n] = w[n] || function (a) {
        return function () {
            (w[n]._q = w[n]._q || []).push([a, arguments]);
        }
    };
    var ifs = ['track', 'quick', 'register', 'registerPage', 'registerOnce', 'clearAllRegister', 'trackSignup', 'trackAbtest', 'setProfile', 'setOnceProfile', 'appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify', 'login', 'logout', 'trackLink', 'clearAllRegister'];
    for (var i = 0; i < ifs.length; i++) {
        w[n][ifs[i]] = w[n].call(null, ifs[i]);
    }
    if (!w[n]._t) {
        x = d.createElement(s), y = d.getElementsByTagName(s)[0];
        x.async = 1;
        x.src = p;
        y.parentNode.insertBefore(x, y);
        w[n].para = para;
    }
})({
    sdk_url: location.protocol + "//" + location.hostname + (location.port.length > 0 ? (":" + location.port) : "") + "/weChatpay/assets/third/sensorsdata.min.js",
    name: 'sa',
    server_url: 'https://tianrangongfang.cloud.sensorsdata.cn:4006/sa?token=c6283ca1e14be0a2',
    heatmap_url:  location.protocol + "//" + location.hostname + (location.port.length > 0 ? (":" + location.port) : "") + "/weChatpay/assets/third/heatmap.min.js",
    heatmap: {
        //是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
        clickmap: 'default',
        //是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
        scroll_notice_map: 'default'
    }
});
sa.quick('autoTrack'); //神策系统必须是1.4最新版及以上