/**
 *
 */
//订单状态
var ORDER_NEW = 1;//新增订单、待支付
var ORDER_PAID = 2;//已付款、待发货
var ORDER_REQUEST_CANCEL = 3;//申请取消
var ORDER_CANCELED = 4;//已取消（付款后，未发货，客户要求取消）
var ORDER_PRINTED = 5;//已打印（打印快递单）
var ORDER_SENDING = 6;//配送中、待收货
var ORDER_RECEIVED = 7;//已收货（确认收货）
var ORDER_APPLY_RAM = 8;//申请退货
var ORDER_HAVE_TO_RETURN = 9;//已退货
var ORDER_REFUNDED = 10;//已退款
var ORDER_CLOSED = 11;//已关闭
var ORDER_DELETE = 12;//已删除


$(".tab-a").on("click", function () {
    showLoading()
    var orderState = $(this).attr("state");
    $(".tab-a").removeClass("cur-tab-a");
    $(".MyOrder-main").find("li").remove();
    indexOrderState(orderState, 1);
    $(this).addClass("cur-tab-a");
});

function indexOrderState(O_data, PAGE_NUMBER) {
    var state = "";
    if (O_data == "allCommondity") {//全部
        state = "";
    } else if (O_data == "waitPay") {//待付款
        state = ORDER_NEW;
    } else if (O_data == "waitSend") {//待发货
        state = ORDER_PAID;
    } else if (O_data == "waitReceive") {//待收货
        state = ORDER_SENDING;
    } else if (O_data == "drawBack") {//退款
        state = ORDER_APPLY_RAM;
    } else if (O_data == "review") {//待评价
        state = ORDER_RECEIVED;
    }

    var statusObject = new Object();
    statusObject.SYS_ACCOUNT = localStorage.getItem("SYS_ACCOUNT");
    statusObject.CON_ID = localStorage.getItem("CON_ID");
    statusObject.ORDER_STATUS_ID = state;
    statusObject.PAGE_NUM = PAGE_NUMBER;
    statusObject.PAGE_SIZE = 4;

    var uploadData = JSON.stringify(statusObject, function (key, value) {
        return value;
    });
    showLoading();
    $.ajax({
        url: serverUrl + "order/searchByStatus?" + Date.parse(new Date()),
        type: "post",
        data: uploadData,
        dataType: "json",
        success: function (data) {
            closeLoading();
            //$(".MyOrder-main ul").find("li").remove();
            if (data.result == "0") {
                if (data.data.length == 0 && PAGE_NUMBER == 1) {
                    closeLoading();
                    var list = '<li style="font-size:30px;text-align:center;color: #666">暂无数据</li>';
                    $("ul").html(list);
                } else {
                    if (data.data.length == 0) {
                        myalert("已无更多订单~");
                        closeLoading();
                    } else {
                        stampListData(data.data);
                    }
                }
            } else {
                closeLoading();
                myalert("订单获取失败", 5000);
            }
            /*this_tab.addClass("cur-tab-a");*/
        },
        error: function () {
            closeLoading();
            myalert("订单获取异常", 5000)
            /*this_tab.addClass("cur-tab-a");*/
        }
    });
}

function stampListData(list_data) {

    var PARAMTYPE = {PARAMTYPE: "OrderType", SYS_ACCOUNT: "CD100"};
    var jsonStr = JSON.stringify(PARAMTYPE, function (key, value) {
        return value;
    });

    for (var i = 0; i < list_data.length; i++) {
        var index_list = '';
        var ORDER_ID = list_data[i].ORDER_ID == null ? '' : list_data[i].ORDER_ID;//订单ID
        var ORDER_NO = list_data[i].ORDER_NO == null ? '' : list_data[i].ORDER_NO;//订单编号
        var ORDER_STATUS_NAME = list_data[i].ORDER_STATUS_NAME == null ? '' : list_data[i].ORDER_STATUS_NAME;//状态昵称
        var ORDER_TOTAL = list_data[i].ORDER_TOTAL == null ? '' : list_data[i].ORDER_TOTAL;//实际支付金额
        //var IMAGE_URL1 = list_data[i].IMAGE_URL1 == null?'':list_data[i].IMAGE_URL1;//购买商品图片
        var CREATE_DT = list_data[i].CREATE_DT == null ? '' : list_data[i].CREATE_DT;//更新时间
        var ORDER_STATUS_ID = list_data[i].ORDER_STATUS_ID == null ? '' : list_data[i].ORDER_STATUS_ID;//订单状态id
        var PRODUCT_NAME = list_data[i].PRODUCT_NAME == null ? '' : list_data[i].PRODUCT_NAME;//产品昵称
        var IS_REORDER = list_data[i].IS_REORDER == null ? '' : list_data[i].IS_REORDER;
        var order_type = list_data[i].ITEMS[0].ORDER_TYPE == null ? '' : list_data[i].ITEMS[0].ORDER_TYPE;

        index_list += '<li data-shopName ="' + PRODUCT_NAME + '" data-Money="' + ORDER_TOTAL + '" data-ordertime="' + CREATE_DT + '" ORDER_STATUS_ID="' + ORDER_STATUS_ID + '" IS_REORDER="' + IS_REORDER + '">';
        index_list += '	<div class="Order-head">';
        index_list += '		<span class="orderID">' + ORDER_NO + '</span>';
        index_list += '     <div>';
                                order_type === '2' ? index_list += '		<small class="order_head_pre">预售</small>' : '';
        index_list += '		    <i class="Money">￥' + ORDER_TOTAL + '</i>';
        index_list += '     </div>';
        index_list += '		<span class="Ordertime" style="display: none">' + CREATE_DT + '</span>';
        index_list += '	</div>';

			/*for(var b=i+1;b<list_data.length;b++){
				var INDEXORDER_NO = list_data[b].ORDER_NO == null?'':list_data[b].ORDER_NO;//订单编号
				var INDEXIMAGE_URL1 = list_data[b].IMAGE_URL1 == null?'':list_data[b].IMAGE_URL1;//购买商品图片
				/!*if(INDEXORDER_NO == ORDER_NO){
					i++;
					index_list+='	<div class="Order-Details">';
					index_list+='		<div style="width:100%;height:auto;">';
					index_list+='			<div class="order-img" order_id="'+ORDER_ID+'" style="cursor: pointer;">';
					index_list+='				<img src="'+INDEXIMAGE_URL1+'">';
					index_list+='			</div>';
					index_list+='		</div>';
					index_list+='	</div>';
				}*!/
			}*/

        for (var b = 0; b < list_data[i].ITEMS.length; b++) {
            var IS_COMMENTED = list_data[i].ITEMS[b].IS_COMMENTED == null ? '' : list_data[i].ITEMS[b].IS_COMMENTED;
            var PRODUCT_ID = list_data[i].ITEMS[b].PRODUCT_ID == null ? '' : list_data[i].ITEMS[b].PRODUCT_ID;
            var IMAGE_URL1 = list_data[i].ITEMS[b].SKU_IMAGE_URL !== null ? list_data[i].ITEMS[b].SKU_IMAGE_URL : list_data[i].ITEMS[b].IMAGE_URL1;//购买商品图片
            var skuId = list_data[i].ITEMS[b].SKU_ID !== null ? list_data[i].ITEMS[b].SKU_ID : '';

            index_list += '	<div class="Order-Details">';
            index_list += '		<div style="width:100%;height:auto;">';
            index_list += '			<div class="order-img" order_id="' + ORDER_ID + '" IS_COMMENTED = "' + IS_COMMENTED + '"style="cursor: pointer;">';
            index_list += '				<img src="' + IMAGE_URL1 + '">';
            index_list += '			</div>';
            index_list += '		</div>';
            index_list += '	</div>';
        }
        index_list += '	<div class="Order-Details">';
        /*	index_list+='		<div style="width:100%">';
			index_list+='			<div class="order-img" order_id="'+ORDER_ID+'" style="cursor: pointer;">';
			index_list+='				<img src="'+IMAGE_URL1+'">';
			index_list+='			</div>';
			index_list+='		</div>';*/
        index_list += '		<div class="order-content" order_id="' + ORDER_ID + '" style="position:relative">';
        if (ORDER_STATUS_ID == 1) {//新增订单
            index_list += ' 		<div class="Click-State bt-border-r" data-type="chooseWXPay">立即支付</div>';
            index_list += '		<div class="Click-State bt-border-r" data-type="delOrder">立即删除</div>';
        } else if (ORDER_STATUS_ID == 2) {//已付款
            index_list += '		<div class="Click-State bt-border-r" data-type="close">申请退款</div>';
        } else if (ORDER_STATUS_ID == 3) {//申请取消

        } else if (ORDER_STATUS_ID == 4) {//已取消（付款后，未发货，客户要求取消）

        } else if (ORDER_STATUS_ID == 5) {//已打印（打印快递单）
            index_list += '		<div class="Click-State bt-border-r" data-type="ExpressageInfo">查看物流</div>';
        } else if (ORDER_STATUS_ID == 6) {//配送中
            index_list += '       <div class="Click-State bt-border-r" data-type="affirm">确认收货</div>';
            index_list += '		<div class="Click-State bt-border-r" data-type="ExpressageInfo">查看物流</div>';
            index_list += '		<div class="Click-State bt-border-r" data-type="Refund">申请退货</div>';
        } else if (ORDER_STATUS_ID == 7) {//已收货（确认收货）

            if ($('.cur-tab-a').html() == "待评价" && IS_COMMENTED == 0) {
                index_list += '	<div class="Click-State bt-border-r"  data-type="submitReview" PRODUCT_ID="' + PRODUCT_ID + '" skuId="'+ skuId +'">评论</div>';
            } else if ($('.cur-tab-a').html() == "全部" && IS_COMMENTED == 0) {
                index_list += '	<div class="Click-State bt-border-r"  data-type="submitReview" PRODUCT_ID="' + PRODUCT_ID + '" skuId="'+ skuId +'">评论</div>';
                index_list += '	<div class="Click-State bt-border-r"  data-type="ExpressageInfo">查看物流</div>';
            } else if ($('.cur-tab-a').html() == "全部") {
                index_list += '	<div class="Click-State bt-border-r"  data-type="ExpressageInfo">查看物流</div>';
            }
        } else if (ORDER_STATUS_ID == 8) {//申请退货
            if (list_data[i].SERVICE_APPROVE == "1") {
                index_list += '		<div class="Click-State bt-border-r" data-type="Refund1">录入物流</div>';
                index_list += '		<div class="Click-State bt-border-r"  data-type="ExpressageInfo">查看物流</div>';
            } else {
                index_list += '		<div class="Click-State bt-border-r" data-type="ExpressageInfo">查看物流</div>';
            }
        } else if (ORDER_STATUS_ID == 9) {// 9已退货

        } else if (ORDER_STATUS_ID == 10) {// 10已退款

        } else if (ORDER_STATUS_ID == 11) {//11已关闭

        } else if (ORDER_STATUS_ID == 12) {//12已删除】

        }

        index_list += '		</div>';
        index_list += '		<p data_number=' + ORDER_STATUS_ID + ' class="order_footer">';
        index_list += '         <span></span>';
        index_list += '         <i>'+ CREATE_DT +'</i>';
        index_list += '     </p>';
        index_list += '	</div>';
        index_list += '</li>';
        if ($('.cur-tab-a').html() == "待评价" && IS_COMMENTED == 1) {
            continue
        }
        $(".MyOrder-main").append(index_list);
    }
    iscrollObj.refresh();
    $.ajax({
        url: serverUrl + "base/dict/searchOrderType",
        type: "post",
        data: jsonStr,
        dataType: "json",
        success: function (data) {
            if (data.result == "0") {
                if (data.data.length == 0 || $(".MyOrder-main").find('li').length == 0) {
                    closeLoading();
                    var list = '<li style="font-size:30px;text-align:center;color: #666">暂无数据</li>';
                    $(".MyOrder-main").html(list);
                } else {

                    var datas = data.data;
                    var MyOrder = $('.MyOrder-main li').length;
                    for (var i = 0; MyOrder > i; i++) {
                        var scroller = ($('.MyOrder-main li').eq(i).find('p').attr('data_number'));
                        for (var z = 0; datas.length > z; z++) {
                            if (scroller == datas[z].PARAMCODE) {
                                $('.MyOrder-main li').eq(i).find('p span').html(datas[z].CAPTIONCHN );
                            }
                        }
                    }


                }
            } else {

                myalert("订单获取失败", 5000);
            }

        },
        error: function () {

        }
    });
    closeLoading();
}


//所有状态跳转
$(document).on("click", ".Click-State", function () {
    var data_type = $(this).attr("data-type");
    var ORDER_ID = $(this).parent(".order-content").attr("order_id");//订单id
    var priceStr = $(this).parents("li").attr("data-Money"); //支付的总价钱  data-Money
    var CREATE_DT = $(this).parents("li").attr("CREATE_DT"); //更新时间
    var ORDER_STATUS_ID = $(this).parents("li").attr("ORDER_STATUS_ID");
    var IS_REORDER = $(this).parents("li").attr("IS_REORDER");
    var ORDER_NO = $(this).parents("li").find(".orderID").html();//订单号

    if (data_type == "chooseWXPay") {
        $(this).addClass("loseSubmit");
        var out_trade_no = ORDER_ID;
        var product_id = ORDER_ID;
        var attachID = ORDER_ID;//附加数据订单号；
        var oppid = localStorage.getItem("openid");
        //简易说明商品描述
        var body = $(this).parents("li").attr("data-shopName");
        var bodyContext = "您本次购买的" + body + "一共花了" + priceStr + "元";
        var data = oppid + "=" + bodyContext + "=" + product_id + "=" + priceStr + "=" + attachID;
        verify_order(data, out_trade_no, "1", ORDER_NO);
        $(this).removeClass("loseSubmit");
    } else if (data_type == "delOrder") {//立即删除订单
        var object = $(this);
        promptBox("确定删除？");
        $("#buttomt").on("click", function () {
            $(".Addaaa,.pop-contant").remove();
            delOrder(ORDER_ID, CREATE_DT, object);
        });
    } else if (data_type == "affirm") {//确认订单
        window.location.href = 'ConfirmGoods.html?ORDER_ID=' + ORDER_ID + '&CREATE_DT=' + CREATE_DT + '&IS_REORDER=' + IS_REORDER + '&ORDER_STATUS_ID=' + ORDER_STATUS_ID;
    } else if (data_type == "Refund") {//申请退货
        window.location.href = "ApplyFor_Refund.html?ORDER_ID=" + ORDER_ID + "&ORDER_NO=" + ORDER_NO + "&i=0&IS_REORDER=" + IS_REORDER + '&ORDER_STATUS_ID=' + ORDER_STATUS_ID;
    } else if (data_type == "Refund1") {
        window.location.href = "ApplyFor_Refund.html?ORDER_ID=" + ORDER_ID + "&ORDER_NO=" + ORDER_NO + '&i=agree&IS_REORDER=' + IS_REORDER + '&ORDER_STATUS_ID=' + ORDER_STATUS_ID;
    } else if (data_type == "close") { //ORDER_STATUS_ID 2
        showLoading();
        $.ajax({
            url: serverUrl + "order/preCancel",
            data: '{"ORDER_ID":"' + ORDER_ID + '","CREATE_DT":"' + CREATE_DT + '"}',
            dataType: "json",
            type: "post",
            success: function (wsdata) {
                closeLoading();
                if (wsdata.result == "0") {
                    if (wsdata.data.ORDER_STATUS_ID !== 2) { //判断订单状态是否等于已付款
                        myalert('订单状态已更改，无法退款');
                        var time = setTimeout(function () {
                            location.reload();
                            clearTimeout(time)
                        }, 2000);
                    } else {
                        window.location.href = 'CancelOrder.html?ORDER_ID=' + ORDER_ID + '&CREATE_DT=' + CREATE_DT + '&IS_REORDER=' + IS_REORDER + '&ORDER_STATUS_ID=' + ORDER_STATUS_ID;
                        return;
                    }
                } else {
                    var str = wsdata.errorData;
                    var html = '<div class="Addaaa"></div>';
                    html += '<div class="pop-contant">';
                    html += '<textarea class="textareaType">' + str + '</textarea>';
                    html += '<buttom id="Qbutt" class="pb p2"  >';
                    html += '确定</buttom>';
                    html += '</div>';
                    $("body").append(html);
                    $("#Qbutt").on("click", function () {
                        $(".Addaaa").remove();
                        $(".pop-contant").remove();
                    });
                    return;
                }
            }, error: function () {
                closeLoading();
                myalert("服务器繁忙,请稍后重试", 5000);
            }
        });
    } else if (data_type == "ExpressageInfo") { //查看物流
        var time = $(this).parent().parent().siblings('.Order-head').find('.Ordertime').html();
        time = time.replace(' ', '-');
        window.location.href = "ExpressageInfo.html?ORDER_ID=" + ORDER_ID + '&time=' + time + "&ORDER_NO=" + ORDER_NO + "&i=1";
    } else if (data_type == "submitReview") {
        var ORDER_ID = $(this).parent('.order-content').attr('order_id');
        var PRODUCT_ID = $(this).attr('PRODUCT_ID');
        var skuId = $(this).attr('skuid');

        window.location.href = "submitReview.html?ORDER_ID=" + ORDER_ID + "&PRODUCT_ID=" + encodeURIComponent(PRODUCT_ID) + '&skuId=' + encodeURIComponent(skuId);
    }
});

$(document).on("click", ".order-img", function () {
    var ORDER_ID = $(this).attr('order_id');
    checkOrder(ORDER_ID);
});

//查看订单详情
function checkOrder(orderID) {
    localStorage.removeItem("ORDER_ID");
    localStorage.setItem("ORDER_ID", orderID);
    window.location.href = "checkOrder.html";
}

//查看新增订单的状态
function verify_order(data, out_trade_no, id, ORDER_NO) {
    var posData = {
        ORDER_ID: out_trade_no,
        orderNo: ORDER_NO
    };

    $.ajax({
        url: serverUrl + 'order/get',
        type: 'post',
        data: JSON.stringify(posData),
        dataType: 'json',
        success: function (mydata) {
            console.log(JSON.stringify(mydata));
            if (mydata.result === 0) {
                if (mydata.data.ORDER_STATUS_ID == "1" || mydata.data.ORDER_STATUS_ID == 1) {
                    showUpOrder();

                    if (mydata.data.ORDER_TOTAL) {
                        var newData = data.split('=');
                        newData.splice(3, 1, mydata.data.ORDER_TOTAL);
                        newData.splice(4, 1, mydata.data.ORDER_ID);

                        payOrder(newData.join('='), out_trade_no, id);
                    } else {
                        payOrder(data, out_trade_no, id);
                    }
                } else {
                    myalert("该订单因超时已关闭", 5000);
                    zhifu_dd = true;
                    location.reload();
                }
            } else if (mydata.result === -1) {
                myalert(mydata.errorData, 3000);
            }
        },
        error: function () {
            zhifu_dd = true;
            closeLoading();
            myalert("服务器繁忙，请稍后重试", 5000);
        }
    });
}

