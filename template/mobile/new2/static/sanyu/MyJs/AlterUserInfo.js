/*
 *	ExMobi4.x+ JS
 *	Version	: 1.0.0
 *	Author	: admin@jmt
 *	Email	:A.showToast('请输入完整信息');
 *	Weibo	:
 *	Copyright 2015 (c)
 */
//手机号码
var phone = "";
// 获取验证码的值
var veriVal = "";
var veriValInface = "";// 接口中获取的验证码

var veriValPhone = "";// 验证码手机是不是之前的手机号码
var Number_Mobile = "";
// 获取用户输入的用户名
var username = "";
// 用户id
var CON_ID = "";
// 网点帐套
var SYS_ACCOUNT = "";
// 头像的路径
var headUrl = "";
//var getCodeLimit = true;限制是否可以再点击
var verification_code_time= true;
var this_state = "获取短信验证码";
$(document).ready(function() {
	CON_ID = localStorage.getItem("CON_ID");
	SYS_ACCOUNT = localStorage.getItem("SYS_ACCOUNT")
	$("#username").val(localStorage.getItem("CON_NAME"));
	$("#verify-phone").val(localStorage.getItem("MOBILE"));
	var CUST_AVATAR = localStorage.getItem("CUST_AVATAR_all");// 缓存图片
	$("#addImgURL").attr("src", CUST_AVATAR);
	$("#Old_ON").val(localStorage.getItem("CON_NO"));
});
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


// 获取验证码，以及电话号码的格式的校验
var text = "";
$(".verification").on("click", function() {
		// 验证码手机号码的格式
	  this_state = $(this).text().trim();
		 Number_Mobile = CodePhone("verify-phone");
		var cachePhone = localStorage.getItem("MOBILE");
		if(verification_code_time == false){
			return ;
		}
		verification_code_time = false;
		
		if (Number_Mobile) {
				if (cachePhone != Number_Mobile) {
						if ($(this).hasClass("countDown")) {
							return;
						}
						var AuthCode="";
						AuthCode+='{"SYS_ACCOUNT": "'+SYS_ACCOUNT;
						AuthCode+='","CON_ID": "'+CON_ID;
						AuthCode+='","PHONE_NUMBER": "'+$("#verify-phone").val();
						AuthCode+='",\"OPER_TYPE\":\"MODIFY\"';
						
						//判断是用是用什么方式的验证码去发送给用户
						if(this_state == "获取短信验证码"){
							AuthCode+=',\"FLAG\":\"0\"}';
							Code_Time = "短信验证码";
							text = "短信验证正在发送";
						}else if(this_state == "获取语音验证码"){
							AuthCode+=',\"FLAG\":\"1\"}';
							Code_Time = "语音验证码";
							text = "请注意接听电话记住验证码";
						}
						
						var htmls='<div   class="myalert" style="width:80%!important; margin-left:-40%!important"><span ></span></div>';	
					    $("body").append(htmls); 
					    $(".myalert").find("span").text(text);
					    localStorage.setItem('CODE_FLAG_T',0);
					    var s=setTimeout(function(){  
					    	$("body").find(".myalert").remove();        
					    	clearTimeout(s);
					    	store_phone(AuthCode,"0");
					    	},5000);
						
						
				} else {
					myalert("不需要获取验证码", 3000);
				}
		}
	});




/*
 * 调出手机图片
 */
$("#GetImg").on("click", function() {
	$("#head-portrait").click();
	
});
$(".imgClick").on("click", function() {
	//$("#head-portrait").click();
	$("body").addClass("bodyClass");
	$("#section_container").hide();
	$(".show-hide").show();
	$("#file").click();
});

$(".save_").on("click",	function() {
		var Newphone = $("#verify-phone").val();
		var cachePhone = localStorage.getItem("MOBILE");
		var veriValInface = localStorage.getItem("veriValInface");
		var YY_veriValInface = localStorage.getItem("YY_veriValInface");
		username = $("#username").val();
		if (Newphone != cachePhone) {
			// 验证码手机号码的格式
			phone = CodePhone("verify-phone");
			if (!phone) {
				return;
			}
				
				if (localStorage.getItem("veriValPhone") != Newphone) {
					myalert("请获取验证码并输入", 2000);
					return;
				}else if(!username) {
					myalert("名称不能为空", 2000);
					return;
				}
				
				// 获取验证码的值
				veriVal = $("#veri-val").val().trim();
				if (!veriVal) {
					myalert("验证码不能为空", 2000);
					return;
				} 
//				if (veriValInface.trim() != "" || YY_veriValInface != ""){
					filtration();
//					if(veriValInface == veriVal){
//						
//						console.log("短信 @  "+veriValInface);
//						return;
//					}
//					if(YY_veriValInface.trim() == veriVal){
//						filtration();
//						console.log("语音 @  "+YY_veriValInface);
//						return;
//					}
//					if(veriValInface.trim() != veriVal)
//					{
//						myalert("短信验证码不对",3000);return;
//					}
//					if(YY_veriValInface.trim() != veriVal){
//						myalert("短信验证码不对",3000);return;
//					}
//				} else{
//					myalert("请获取验证码", 5000);
//					return;
//				}
		} else {
			phone = localStorage.getItem("MOBILE");
			filtration();
		}
		
	});

function filtration() {

		ajxaRefundGoods("", "");
}
// 更新个人资料的接口的对接
function ajxaRefundGoods(array, SERIAL_ID) {
	if (array.length != 0)
		headUrl = array;
	else {
		headUrl = localStorage.getItem("CUST_AVATAR");
	}
	var obj ={
			  MOBILE: phone,
			  CON_NAME: username,
			  CON_ID: CON_ID,
			  CUST_AVATAR: headUrl
			}
	if ($('#veri-val').val() != ""){
	   obj.CODE = $('#veri-val').val() ;
	  if ($('.voice_verification_code').text() == "切换到短信验证码") {
	    obj.CODE_FLAG = 1;
	  } else {
	    obj.CODE_FLAG = 0;
	  }
	}
//	var strJSON = "{\"MOBILE\":\"" + phone + "\",\"CON_NAME\":\"" + username
//			+ "\",\"CON_ID\":\"" + CON_ID + "\",\"CUST_AVATAR\":\"" + headUrl
//			+ "\"}";
	var strJSON = JSON.stringify(obj,function(k,v){
		  return v;
		})

	$.ajax( {
		url : serverUrl + "customer/update",
		type : 'post',
		data : strJSON,
		dataType : 'json',
		success : function(wsdata) {
			if (wsdata.result == "0") {
				promptBoxOne("更改成功，请按确定");
				localArray()
				localStorage.removeItem("veriValInface");
				localStorage.removeItem("veriValPhone");
				localStorage.removeItem("YY_veriValInface");

			} else {
				myalert(wsdata.errorData, 5000);
			}
		},
		error : function() {
			myalert("服务器拥挤，请稍候", 5000);
		}
	});
}
function Qbuttomt() {
	$(".Addaaa,.pop-contant").remove();
	localStorage.removeItem("Verify");
	window.location.replace('Personage_Centre.jsp?'+Math.random())
}

//调转修改头像
$(".amend_Img").on("click",function(){
	window.location.href="shear.html";
});
$('.REFEREE_name').val(localStorage.getItem("REFEREE_name"));
$('.SUBSCRIBE_DATE').val(localStorage.getItem('reg_dt'));

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
			var  deposit  = $('#verify-phone').val();
			localStorage.setItem('number_cal',deposit);
		    return
		}else{
		var availableTags = localStorage.getItem('number_cal');
		var local = availableTags.split(',');
		var  deposit = $('#verify-phone').val();
		if(!local.Contains(deposit)){
			var locArray =local+','+deposit;
			localStorage.setItem('number_cal',locArray);	
			}
		}
	 };
