function OppenidUser(oppenid, type, page) {
    var postData = {
        OPENID_WECHAT: oppenid,
        page: page + ''
    };

    $.ajax({
        url: serverUrl + "customer/getByOpenID?" + Date.parse(new Date()),
        dataType: "json",
        data: JSON.stringify(postData),
        type: "post",
        async: false,
        success: function (res) {
            console.log(res)
            if (res.result == "0" && res.data) {
                $('#GeneralizationPic').attr('CON_TYPE', res.data.CON_TYPE);

                CON_ID = res.data.CON_ID;
                localStorage.removeItem("CON_ID");
                localStorage.removeItem("CON_NO");
                localStorage.removeItem("SYS_ACCOUNT");
                localStorage.removeItem("CON_NAME");
                localStorage.removeItem("CON_TYPE");
                localStorage.removeItem("IS_LOCKOUT");
                localStorage.removeItem("MOBILE");

                localStorage.removeItem("sex");
                localStorage.removeItem("reg_dt");
                localStorage.removeItem("last_login_dt");

                localStorage.setItem("sex", res.data.SEX);
                localStorage.setItem("reg_dt", res.data.REG_DT);
                localStorage.setItem("last_login_dt", res.data.LAST_LOGIN_DT);

                localStorage.setItem("CON_TYPE", res.data.CON_TYPE);
                localStorage.setItem("MOBILE", res.data.MOBILE);
                localStorage.setItem("CON_ID", res.data.CON_ID);
                localStorage.setItem("CON_NO", res.data.CON_NO);
                localStorage.setItem("CON_NAME", res.data.CON_NAME);//浼氬憳鐨勫悕绉�
                localStorage.setItem("SYS_ACCOUNT", res.data.SYS_ACCOUNT);
                localStorage.setItem("IS_LOCKOUT", res.data.IS_LOCKOUT);
                sa.setProfile({conNo: res.data.CON_NO, mobile: res.data.MOBILE});
                showImg();
                if ($('body').attr('data_type') == 1) {
                    Member_Message(res.data.CON_ID);
                } else {
                    if (type == "1") {
                        checkUpdateReferee("1");
                        //Member_Message(res.data.CON_ID);
                    } else if (type == "3") {
                        getCode();
                    }
                }


                var qimoClientId = {};// 自定义用户的唯一id
                var userMobile = "";
                if (localStorage.getItem("CON_ID") && localStorage.getItem("CON_ID") != "") {
                    currConId = localStorage.getItem("CON_ID");
                    qimoClientId.userId = currConId;
                }
                if (localStorage.getItem("MOBILE") && localStorage.getItem("MOBILE") != "") {
                    userMobile = localStorage.getItem("MOBILE");
                    qimoClientId.userMobile = userMobile;
                }
                if (localStorage.getItem("CON_NAME") && localStorage.getItem("CON_NAME") != "") {
                    currConName = localStorage.getItem("CON_NAME");
                    qimoClientId.nickName = localStorage.getItem("CON_NO") + localStorage.getItem("CON_NO") + "-" + localStorage.getItem("CON_NAME") + "-" + localStorage.getItem("MOBILE");
                }
            } else if (res.result === 2 && res.data) {
                window.location.href = res.data.url;
            } else {
                closeLoading();
                promptBox("没有检测到会员信息，请关闭页面重试");
                // newCustomer(oppenid);
            }
        },
        error: function () {
            closeLoading();
            myalert("服务器繁忙，请稍后");
            return false;
        }
    });
}


/*
 * 会员信息同步
 */
function history_New_Date(oppenid) {
    $.ajax({
        url: serverUrl + "customer/updateBasCustomer",
        dataType: "json",
        data: "{\"OPEN_ID\":\"" + oppenid + "\"}",
        type: "post",
        async: false,
        success: function (res) {
            if (res.result != 0) {
                return;
            }
            window.location.href = baseServerUrl + 'Conten';
        },
        error: function () {
            closeLoading();
            myalert("服务器繁忙，请稍后");
            return false;
        }
    });
}


/*
 * 会员补增
 */
function newCustomer(oppenid) {
    $.ajax({
        url: serverUrl + "customer/newCustomer",
        //url:"http://192.168.1.118/api/customer/newCustomer",
        dataType: "json",
        data: "{\"OPEN_ID\":\"" + oppenid + "\"}",
        type: "post",
        async: false,
        success: function (res) {
            if (res.result != 0) {
                promptBox("没有检测到会员信息，请关注公众号");
                return;
            }
            window.location.href = baseServerUrl + 'Conten';
        },
        error: function () {
            closeLoading();
            myalert("服务器繁忙，请稍后");
            return false;
        }
    });
}

function showImg() {
    if (localStorage.getItem('MOBILE') == 'null') {
        var IMGH = $('.topMobile').height();

        $('.scroll_content').css('margin-top', IMGH);
        $('.topMobile').show();
        $('.topMobile').on('click', function () {
            localStorage.setItem("home", 'true');
            window.location.href = baseUrlvellgo + 'Conten';
        });

    }
}