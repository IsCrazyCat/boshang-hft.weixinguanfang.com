/*
*	ExMobi4.x+ JS
*	Version	: 1.0.0
*	Author	: admin@jmt
*	Email	:
*	Weibo	:
*	Copyright 2015 (c)
*/
var MOBILE="";//手机号码
var REAL_NAME="";//真实姓名
var Member_Data="";
var CON_NAME="";
var SYS_ACCOUNT="";
var getCodeLimit=true;//限制是否可以再点击
var verification_code_time= true;
var this_state = "获取短信验证码";
//会员个人信息资料

function Member_Message(CON_ID){
	 Member_Data="{\"CON_ID\":\""+CON_ID+"\"}";
	$.ajax({
		url : serverUrl+"customer/get",
		type:'post',
		data:Member_Data,
		dataType :'json',
		success : function(wsdata) {
			// console.log(JSON.stringify(wsdata));
			CHEKREFEREE = wsdata.data.UPDATE_REF;

			if(wsdata.result!=0){
				closeLoading();
				myalert("请求有误!!",5000);
				return;
			}
			$("#emailreply_section").show();
			if(wsdata.data.MOBILE==null){
				$("#section_container").hide();
				$(".Addaaa,#pop-contant").show();
				if(localStorage.getItem('cellphone') != null){
					//var tpl = '<p style="font-size:14px;line-height:33px;margin-bottom: 5px;text-align: right;padding-right: 10%;font-weight: normal">请确认是本人手机号</p>';
					//$('#pop-contant p').append(tpl);
					// $('#pop-contant').height(250);
					$('#Number_Mobile').val(localStorage.getItem('cellphone'));
					localStorage.removeItem('cellphone');
				}
			}
			personal_data(wsdata.data);
			DataPort(wsdata);
		},
		error : function(wsdata) {
			closeLoading();
			myalert("服务器繁忙,请稍后重试",5000);
		}
	});
}
function DataPort(wsdata){

    $('#GeneralizationPic').attr('CON_TYPE',wsdata.data.CON_TYPE);

   $("#emailreply_section").show();
   //判断用户是否是会员
   localStorage.removeItem("CON_TYPE");
   localStorage.setItem("CON_TYPE", wsdata.data.CON_TYPE);
   if(wsdata.data.CON_TYPE==1){
     $(".menu_hide").attr({style:"display:inline-block"});
     $(".use_per").attr({style:"width: 42%;"});
   /*  $("#myErWeiMa").attr({style:"width: 22%;"});*/
     $(".kehu_div").attr({style:"margin-bottom: 10px;"});
     $(".menu_show").attr({style:"display:inline-block !important;"});
   }else{
     $(".use_per").attr({style:"width: 45%;"});
     $(".menu_show").attr({style:"display:none !important;"});
   }
   //console.log(wsdata.data.SAVED_TREE);
   //SAVE_TREE 已拯救树
   $("#Tree").text(wsdata.data.SAVED_TREE == null ? "0":wsdata.data.SAVED_TREE);
   //EXCEED_MENBER 已超越全国会员比例
   $("#Ratio").text(wsdata.data.EXCEED_MENBER==null ? "0":wsdata.data.EXCEED_MENBER +"%");
   //TURN_OVER 总营业额
   $("#Turnover").text(wsdata.data.TOTAL_TURNOVER==null ? "0":wsdata.data.TOTAL_TURNOVER);
   //PROMOTION_FEE 总推广费用
   $(".Promotion_Expenses").text(wsdata.data.P_PROMOTION_FEE==null ? "0":wsdata.data.P_PROMOTION_FEE);
   //MESSAGE_NUM 全部未读消息数量
   $(".MESSAGE_NUM").text(wsdata.data.MESSAGE_NUM==null ? "0":wsdata.data.MESSAGE_NUM);
   //PURCHASED_MENBER 已购买会员数量
   $("#PURCHASED_MENBER").text(wsdata.data.PURCHASED_MEMBER==null ? "0":wsdata.data.PURCHASED_MEMBER);
   //UNPURCHASED_MENBER 未购买会员数量
   $("#UNPURCHASED_MENBER").text(wsdata.data.UNPURCHASED_MEMBER==null ? "0":wsdata.data.UNPURCHASED_MEMBER);
   //PROMOTION_ORDER 推广订单数量
   //$("#PROMOTION_ORDER").text(wsdata.data.PROMOTION_ORDER==null ? "0":wsdata.data.PROMOTION_ORDER);
   //MY_ORDER 我的订单
   $("#MY_ORDER").text(wsdata.data.MY_ORDER==null ? "0":wsdata.data.MY_ORDER);
   //ORDER_TO_BE_PAID 我的待付款订单
   $("#ORDER_TO_BE_PAID").text(wsdata.data.ORDER_TO_BE_PAID==null ? "0":wsdata.data.ORDER_TO_BE_PAID);
   //ORDER_TO_BE_CONFIRM 我的待收货订单
   $("#ORDER_TO_BE_CONFIRM").text(wsdata.data.ORDER_TO_BE_CONFIRM==null ? "0":wsdata.data.ORDER_TO_BE_CONFIRM );
   //MY_CONSUMPTION_AMOUNT 我的总消费额
   $("#MY_CONSUMPTION_AMOUNT").text(wsdata.data.TOTAL_BUY_ALL==null ? "0":wsdata.data.TOTAL_BUY_ALL);
}
function personal_data(Personal_Data){
	//会员头像Personal_Data.CUST_AVATAR
	var rgExp="http";
	var urlhead="";
	if(Personal_Data.CUST_AVATAR==null){
		urlhead="../img/671584969226518509.jpg";
	}else{
		 urlhead=Personal_Data.CUST_AVATAR.match(rgExp)==null? urlIMg+"static/"+Personal_Data.CUST_AVATAR:Personal_Data.CUST_AVATAR;
	}

	$("#CUST_AVATAR").attr("src",urlhead);
	localStorage.removeItem("CUST_AVATAR_all");
	localStorage.setItem("CUST_AVATAR_all",urlhead);
	localStorage.setItem("CUST_AVATAR",urlhead);
	//CON_NO":"会员代码【可自定义编码规则】"}}
	$("#CON_NO").text(Personal_Data.CON_NO);
	//SUBSCRIBE_DATE":关注【公众号】时间
	$("#Member_ID").text(Personal_Data.SUBSCRIBE_DATE);
	//CON_NAME":"会员名称或昵称","
	CON_NAME=Personal_Data.CON_NAME==null ? "":Personal_Data.CON_NAME;
	localStorage.setItem("CON_NAME",CON_NAME);
	$("#CON_NAME").text(Personal_Data.CON_NAME);
	//REFEREE_NAME":推荐人昵称,"
	$('.kehu_huiyuan_div').css('margin-top','10%');

	if(CHEKREFEREE==1){
		$('.kehu_huiyuan_div').css('margin-top','5%');
		$(".kehu_shu_div").show();
		$("#kehu_shu_div").show();
		$("#REFEREE_name").show();
		//$("#bamboo").hide();
		$("#change_alter").show();//隐藏更改推荐人的按钮
		$(".randomReferee").hide();//隐藏系统推荐
	}else{
		$("#bamboo").hide();
		if(Personal_Data.REFEREE_NAME!=null){
			$("#referrer_span").text(Personal_Data.REFEREE_NAME);
		}else{
			//$("#REFEREE_name").hide();
			$("#bamboo").show()
		}

		$(".randomReferee").hide();
		$("#referrer_span").show();//显示推荐人昵称
		$("#referrer_input").hide();//隐藏输入推荐人的文本框
		$("#change_alter").hide();//隐藏更改推荐人的按钮
		$(".kehu_shu_div").show();
		$('.kehu_huiyuan_div').css('margin-top','5%');
	}

	MOBILE=Personal_Data.MOBILE;
	localStorage.setItem("MOBILE",MOBILE);//保存客户的手机号码
	REAL_NAME=Personal_Data.REAL_NAME;
	localStorage.setItem("REAL_NAME",REAL_NAME);//保存客户的真实名称
	localStorage.setItem("QQ_ON",Personal_Data.QQ_NO);//保存qq信息
	localStorage.setItem("CON_NO",Personal_Data.CON_NO);//保存客户的CON_NO
	localStorage.setItem('REFEREE_name',Personal_Data.REFEREE_NAME);
	localStorage.setItem('SUBSCRIBE_DATE',Personal_Data.SUBSCRIBE_DATE);
	var historyDate = localStorage.getItem("historyDate");
	 //获取当前时间
	 var d = new Date();
	 var year = d.getFullYear();
	 var month = d.getMonth() + 1; // 记得当前月是要+1的
	 var dt = d.getDate();
	 var today = year + "-" + month + "-" + dt;
	 localStorage.setItem("historyDate", today);
	 if(CON_NAME == "" || Personal_Data.CUST_AVATAR == null ){
		 var oppenid = localStorage.getItem("openid");
		 if(historyDate == null){
			 history_New_Date(oppenid);
		 }else{
			 if(Number(year) > Number(historyDate.split("-")[0])){
				 history_New_Date(oppenid);
			 }else if(Number(month) > Number(historyDate.split("-")[1])){
				 history_New_Date(oppenid);
			 }else if(Number(dt) > Number(historyDate.split("-")[2])){
				 history_New_Date(oppenid);
			 }
		 }
	 }
}
/*
 * 选择验证码方式
 */
$(".voice_verification_code").on("click",function(){
	   this_value = $(this).text().trim();
	 if(verification_code_time){
		 if(this_value == "切换到语音验证码"){
  		 $(".verification").text("获取语音验证码");
  		 $(".voice_verification_code").text("切换到短信验证码");
  	 }else if(this_value == "切换到短信验证码"){
  		 $(".verification").text("获取短信验证码");
  		 $(".voice_verification_code").text("切换到语音验证码");
  	 }
	 }
});

/*获取验证码*/
var sta_date ;
var Number_Mobile;
var Code_Time="";
var text = "";
var CODE_FLAG = null;//0 短信； 1 语音
$(".Get_Code").on("click",function(){
	if(verification_code_time == false){
		return ;
	}
	verification_code_time = false;

	if($(this).hasClass("countDown")){
		return;
	}

	if ($('#Number_Mobile').val() === '') {
        myalert('手机号码不能为空');
        return
	}
	// var fla = CodePhone("Number_Mobile");
	// if(!fla){
	// 	getCodeLimit=true;
	// 	return;
	// }
	var this_state = $(this).html().trim() ;

	var AuthCode="";
	AuthCode+='{"SYS_ACCOUNT": "'+localStorage.getItem("SYS_ACCOUNT");
	AuthCode+='","CON_ID": "'+CON_ID;
	AuthCode+='","PHONE_NUMBER": "'+$("#Number_Mobile").val();
	AuthCode+='",\"OPER_TYPE\":\"BAND\"';

	//判断是用是用什么方式的验证码去发送给用户
	if(this_state == "获取短信验证码"){
        CODE_FLAG = 0;

		AuthCode+=',\"FLAG\":\"0\"}';
		Code_Time = "短信验证码";
		text = "短信验证码正在发送";
	}else if(this_state == "获取语音验证码"){
        CODE_FLAG = 1;

		AuthCode+=',\"FLAG\":\"1\"}';
		Code_Time = "语音验证码";
		text = "请注意接听电话记住验证码";
	}
	//console.log(AuthCode);

	var htmls='<div   class="myalert" style="width:80%!important; margin-left:-40%!important"><span ></span></div>';
    $("body").append(htmls);
    $(".myalert").find("span").text(text);
    var s=setTimeout(function(){
    	$("body").find(".myalert").remove();
    	clearTimeout(s);
    	store_phone(AuthCode,1);
    	},5000);
});

/*绑定手机号码*/
$("#Binding_Mobile").on("click",function(){
	var MOBILE=$("#Number_Mobile").val();
	if(MOBILE.length==""){myalert("手机号码不空");return;}
	if($(".Code").val()==""){myalert("验证码不空");return;}
	//if(localStorage.getItem("store_mobile") != MOBILE){promptBoxOneS("当前手机号码与获取验证码的手机号码不一致");return;}
	var sta_date = localStorage.getItem("sta_date");
	sta_date = sta_date?sta_date:"";
	var YY_sta_date = localStorage.getItem("YY_sta_date");
	YY_sta_date = YY_sta_date?YY_sta_date:"";

    var code = $(".Code").val().trim();
	customerUpdate(code);
//	if(sta_date.trim() != "" || YY_sta_date.trim() != ""){
//		if(sta_date.trim() == $(".Code").val().trim()){
//			customerUpdate();
//			console.log("短信 @  "+sta_date);return;
//		}
////		if(YY_sta_date.trim() == $(".Code").val().trim()){
////			
////			console.log("语音 @  "+YY_sta_date);return;
////		}
////		if(sta_date.trim() != $(".Code").val().trim() )
////		{
////			myalert("验证码不对",3000);return;
////		}
////		if(YY_sta_date.trim() != $(".Code").val().trim()){
////			myalert("验证码不对",3000);return;
////		}
//	}else{
//		myalert("请获取验证码不对",3000);return;
//	}

});

function customerUpdate(code){
	var Binding = "";
    if (CON_NAME == "") {
        Binding = '{"CODE": "'+code+'", CODE_FLAG: "'+ CODE_FLAG +'", "CON_ID":"' + CON_ID + '","CON_NAME":"无","MOBILE":"' + $("#Number_Mobile").val() + '","QQ_NO":"","CUST_AVATAR":"' + localStorage.getItem("CUST_AVATAR_all") + '"}';
    } else {
        var Binding = '{"CODE": "'+code+'", CODE_FLAG: "'+CODE_FLAG +'", "CON_ID":"' + CON_ID + '","CON_NAME":"' + CON_NAME + '","MOBILE":"' + $("#Number_Mobile").val() + '","QQ_NO":"","CUST_AVATAR":"' + localStorage.getItem("CUST_AVATAR_all") + '"}';
    }

    $.ajax({
		url:serverUrl+'customer/update',
		type:'post',
		data:Binding,
		dataType :'json',
		success : function(wsdata) {
			if(wsdata.result!=0){
				myalert(wsdata.errorData,5000);
				return;
			}
			myalert("验证成功",5000);
			//更新会员信息 天猫、京东流量 进入即是推客
            OppenidUser(localStorage.getItem('openid'));
			localArray();
			localStorage.removeItem("store_mobile");
			localStorage.removeItem("sta_date");//缓存验证码
			localStorage.removeItem("Storage_mobil");//缓存手机
			if(localStorage.getItem('SHOPPING_CART') == 'true'){
				localStorage.removeItem('SHOPPING_CART');
				var timestamp = new Date().getTime();
				window.location.replace('assets/html/orderEdit.html?'+timestamp);
			}else if(localStorage.getItem("home")== 'true'){
				localStorage.removeItem('home');
				window.history.back(-1);
			}else{
				window.location.reload();
			}

		},
		error:function(){
			myalert("服务器繁忙,请稍后重试",5000);
		}
	});
}

//页面跳转功能
			$("#shouhuo_dizhi").click(function(){
				//window.location.href='editAddress.html';
				window.location.href='/weChatpay/assets/html/addressList.html';
					return false;
			});
			$("#myCommented").click(function(){
				//window.location.href='my_comment.html';
				window.location.href='/weChatpay/assets/html/my_comment.html';
					return false;
			});
			$("#myOrder").click(function(){
					window.location.href='/weChatpay/assets/html/MyOrder.html';
					//window.location.href='MyOrder.html';
					//window.location.replace('MyOrder.html');
					return false;
			});

			$("#waitOrder").click(function(){
					window.location.href='/weChatpay/assets/html/WaitPayOrder.html';
					return false;
			});

			$("#daishou").click(function(){
					window.location.href='/weChatpay/assets/html/WaitGoodsReceipt.html';
					return false;
			});

			$("#GeneralizationPic").click(function(){
//				var CON_TYPE =$(this).attr('CON_TYPE');
//				if(CON_TYPE == 1){
//					window.location.href='assets/html/GeneralizationPic.html';
//					return false;
//				}else{
//					myalert("您还不是已购买会员~",3000);
//				}
				$('#dialog1').show();
			});

			$("#GeneralizOrderSum").click(function(){
				localStorage.removeItem("Ranked_ID");
				localStorage.setItem("Ranked_ID","1");
				window.location.href="/weChatpay/assets/html/Ranked_Page2.html";
					return false;
				
			});
			$('.weui-dialog__btn_primary').on('click',function(){
				$('#dialog1').hide();
				window.location.href = chainedPath;
			});
			
			$('.weui-dialog__btn_default').on('click',function(){
				$('#dialog1').hide();
			});
			$("#SubMember").click(function(){
				localStorage.removeItem("Ranked_ID");
				localStorage.setItem("Ranked_ID","1");
				window.location.href='/weChatpay/assets/html/Ranked_Page.html';
				return false;
			});

			$(".SubMember").click(function(){
				localStorage.removeItem("Ranked_ID");
				localStorage.setItem("Ranked_ID","1");
				window.location.href='/weChatpay/assets/html/Ranked_Page.html';
				return false;
			});

			//系统推荐
			var REF_NO_REF_NAME = "";
			var index_REF_NO = '';
			$(".randomReferee").on("click",function(){
				showLoading();
				$.ajax({
					url : serverUrl+"customer/randomReferee?SYS_ACCOUNT=CD100",
					data:'',
					type:'post',
					dataType : 'json',
					success : function(wsdata) {
						closeLoading();
						console.log(JSON.stringify(wsdata));
						if(wsdata.result!=0){
							myalert("获取系统推荐人失败",3000);
							return;
						}
						REF_NO_REF_NAME = wsdata.data.REF_NO+"  "+wsdata.data.REF_NAME;
						index_REF_NO = wsdata.data.REF_NO;
						var RefereeList = '<div id="Referee-contant"  style="display: block;"></div>';
						RefereeList+='<div class="Refere_span">';
						RefereeList+='<span class="system_Refere">系统指定推荐人</span>';
						RefereeList+='<span class="system_input_text">系统为您推荐的会员信息为:【 '+REF_NO_REF_NAME+' 】是否使用该会员作为您的推荐人</span>';
						RefereeList+='<span class="system_subimt">使用</span>';
						RefereeList+='<span class="system_quxiao">不使用</span>';
						RefereeList+='</div>';
						$('#section_container').append(RefereeList);
					},
					error : function(){
						closeLoading();
						myalert("服务器繁忙,请稍后重试",5000);
					}
				});

			});
			$(document).on("click",".system_subimt",function(){
				$("#referrer_input").val(index_REF_NO);
				$('#section_container').find("#Referee-contant").remove();
				$('#section_container').find(".Refere_span").remove();
			});
			$(document).on("click",".system_quxiao",function(){
				$('#section_container').find("#Referee-contant").remove();
				$('#section_container').find(".Refere_span").remove();
			});


			//更改推荐人
			$("#change_alter").click(function(){
			  	 var referrer=$("#referrer_input").val();
			  	 var REG=/^[0-9]*$/;
			  	  if(referrer.length>0){
			  	  	if(!REG.test(referrer)){
			  	  		myalert("请输入正确会员号",5000);
			  	  		return;
			  	  	}
			  	    showLoading();
			  	  	var Char_referrer= $("#referrer_input").val();
			  	  	refereeUpdate(Char_referrer);
			  	  }else{
			  	  		if($("#referrer_input").is(":visible")==false)
						{
							$("#referrer_input").show();
							$(".randomReferee").show();
						}else{
							if(referrer.length == 0){
							$("#referrer_input").hide();
							$(".randomReferee").hide();
							return;
						}
					}
			  	  //	$("#referrer_input").hide();
			  	  }
			});


			//提交修改推荐人
			function refereeUpdate(REFEREE_NO){
				var REFEREE_NO='{"CON_ID":"'+CON_ID+'","REFEREE_NO":"'+REFEREE_NO+'"}';
				$.ajax({
					url : serverUrl+"customer/refereeUpdate",
					data:REFEREE_NO,
					type:'post',
					dataType : 'json',
					success : function(wsdata) {
						closeLoading();
						if(wsdata.result!=0){
							myalert("修改失败",3000);
							return;
						}
						if(wsdata.data.RESULT=="1"){
							   myalert("修改成功",5000);
							}else if(wsdata.data.RESULT=="2"){
							    closeLoading();
							    promptBoxOneS("会员号不存在");
								return;
							}else if(wsdata.data.RESULT=="3"){
							    closeLoading();
							    promptBoxOneS("您不符合更改条件");
								return;
							}else if(wsdata.data.RESULT=="4"){
							    closeLoading();
							    promptBoxOneS("不能绑定自己，请选择其他的会员号");
								return;
							}else if(wsdata.data.RESULT=="5"){
							    closeLoading();
							    promptBoxOneS("请指定已购买会员的会员号");
								return;
							}else if(wsdata.data.RESULT=="0"){
							    closeLoading();
								promptBoxOneS("修改失败，请重来");
								return;
							}
						  $("#referrer_input").hide();
					  	  $("#referrer_span").show();
					  	  $("#referrer_span").html(wsdata.data.CON_NAME);
					  	  $("#change_alter").hide();
					  	  $("#bamboo").hide();
					},
					error : function(wsdata) {
						closeLoading();
						myalert("服务器繁忙,请稍后重试",5000);
					}
				});
			}

			$(".use_per_click").click(function(){
				$(this).addClass("use_per_type");
				setInterval(function(){
					$(".use_per").removeClass("use_per_type");
				},500);
			});

			$(".kehu_code_div").on("click",function(){
				var CON_TYPE=localStorage.getItem("CON_TYPE");
				if(CON_TYPE==0){
					promptBoxOne("您还没有消费体验产品，不能使用二维码");
				}else{
					window.location.href=baseServerUrl + 'GetCode';
				}
			})
     //点击确定按钮
	    function Qbuttomt(){
	       $(".Addaaa,.pop-contant").remove();
	       window.location.href=baseUrlvellgo + 'home';
	    }
		//缓存号码
			function localArray(){
				Array.prototype.Contains = function(element) {
				            for (var i = 0; i < this.length; i++) {
				                if (this[i] == element) {
				                    return true;
				                }
				            }
				            return false;
				        };
				 if(localStorage.getItem('number_cal')== null){
						var  deposit  = $('#Number_Mobile').val();
						localStorage.setItem('number_cal',deposit);
					    return
					}else{
					var availableTags = localStorage.getItem('number_cal');
					var local = availableTags.split(',');
					var  deposit = $('#Number_Mobile').val();
					if(!local.Contains(deposit)){
						var locArray =local+','+deposit;
						localStorage.setItem('number_cal',locArray);
						}
					}
				 };
