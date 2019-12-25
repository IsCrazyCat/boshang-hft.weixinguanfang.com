/*
*	ExMobi4.x+ JS
*	Version	: 1.0.0
*	Author	: admin@jmt
*	Email	:
*	Weibo	:
*	Copyright 2015 (c)
*/

//匹配手机号码格式;
var PHONE_REG = /^1[3|4|5|6|7|8|9]\d{9}$/;
var PHONE_NULL = "手机号码不能空";
var PHONE_ON_REG = "手机号码格式不对";
var index_number = "120";
//匹配密码的格式
var PASSWORD_REG = /^[a-zA-Z0-9]{6,16}/;

/*
 获取验证码的倒计时 time为设置倒计时的时间，add_class为获取验证码的按钮添加新的class
 change_str获取验证码的按钮改变文本，restore_str恢复文本的字体
 */
function CountDown(time, id, add_class, change_str, restore_str) {
    //每一秒执行一次，进行累加时间
    verification_code_time = false;
    var timeid = setInterval(function () {
        time--;
        $("#" + id).html(change_str + "：" + time + "s");
        $("." + id).html(change_str + "：" + time + "s");
        $("." + id).text(change_str + "：" + time + "s");
        //改变验证码按钮的颜色
        $("#" + id.trim()).addClass(add_class);
        //如果time等于0秒就停止倒计时
        if (time == 0) {
            //清零timeid的倒计时
            clearCountDown(timeid);
            //恢复验证码的按钮
            $("." + add_class).removeClass(add_class);
            $("#" + id).html(restore_str);
            $("." + id).html(restore_str);
            getCodeLimit = true;
            verification_code_time = true;
        }
    }, 1000);
}

//清除的倒计时，timeid代表要清除的对象
function clearCountDown(timeid) {
    clearInterval(timeid);
}

/*
 * 验证码手机号码的格式,id为输入号码的文本框的id
 *
 */
function CodePhone(id) {
    var inputPhone = $("#" + id).val();
    if (!inputPhone) {
        //手机格式不能为空
        myalert(PHONE_NULL, 5000);
        return false;
    }
    if (!PHONE_REG.test(inputPhone)) {
        //匹配手机格式不对
        myalert(PHONE_ON_REG, 5000);
        return false;
    } else {
        return inputPhone;
    }
}

/**
 获取验证码
 */
function store_phone(AuthCode, type) {
    $.ajax({
        url: serverUrl + "identifycode/sendCode",
        type: 'post',
        data: AuthCode,
        dataType: 'json',
        success: function (wsdata) {
            $('#Binding_Mobile').removeClass('disabled');

            if (wsdata.result != 0) {
                getCodeLimit = true;
                verification_code_time = true;
                promptBoxOneS(wsdata.errorData);
                return;
            }
            if (type == "1") {
                localStorage.setItem("store_mobile", $("#Number_Mobile").val());
                if (Code_Time == "短信验证码") {
                    localStorage.setItem("sta_date", wsdata.data.code ? wsdata.data.code : "");
                } else if (Code_Time == "语音验证码") {
                    localStorage.setItem("YY_sta_date", wsdata.data.code ? wsdata.data.code : "");
                }

                if (wsdata.data.mins != 0 || wsdata.data.mins != "") {
                    getCodeLimit = true;
                    myalert("最后一次发送的验证码仍然有效，请在" + wsdata.data.mins + "分钟后再获取", 5000);
                    CountDown(index_number, "verificationid", "countDown", "重获时间", "获取" + Code_Time);
                    return;
                }
                myalert(Code_Time + "已发送!", 5000);
                CountDown(index_number, "verificationid", "countDown", "重获时间", "获取" + Code_Time);
            } else if (type == "0") {
                localStorage.setItem("veriValPhone", $("#verify-phone").val());
                if (Code_Time == "短信验证码") {
                    localStorage.setItem("veriValInface", wsdata.data.code ? wsdata.data.code : "");
                } else if (Code_Time == "语音验证码") {
                    localStorage.setItem("YY_veriValInface", wsdata.data.code ? wsdata.data.code : "");
                }

                if (wsdata.data.mins != 0 || wsdata.data.mins != "") {
                    getCodeLimit = true;//最后一次发送的验证码仍然有效，请在x分钟后再获取！
                    myalert("最后一次发送的验证码仍然有效，请在" + wsdata.data.mins + "分钟后再获取", 5000);
                    CountDown(index_number, "verificationid", "countDown", "重获时间", "获取" + Code_Time);
                    return;
                }
                myalert(Code_Time + "已发送!", 5000);
                CountDown(index_number, "verificationid", "countDown", "重获时间", "获取" + Code_Time);
            }
        },
        error: function () {
            myalert("服务器繁忙，请等候", 5000);
            return;
        }
    });
}

