/*
*	ExMobi4.x+ JS
*	Version	: 1.0.0
*	Author	: admin@jmt
*	Email	: 
*	Weibo	: 
*	Copyright 2015 (c) 
*/

var CON_ID="";//会员的编号
var SYS_ACCOUNT="";//会员的账套号
var IS_SHOW_ORDER="";//是否开启全国排行
$(document).ready(function(e) {
	sParameter();
	CON_ID=localStorage.getItem("CON_ID");
	SYS_ACCOUNT=localStorage.getItem("SYS_ACCOUNT");
	var tabsLi = $(".tabsLi");
	var tabContent = $(".tabContent");
	var tabInit = function(){
		tabsLi.eq(0).addClass('tabCurrently');
		tabContent.eq(0).show('fast');
		showLoading();
		personaAR("personaAR");
	};
	tabInit();
	tabsLi.each(function(index, element) {
		$(this).on("click", function() {
			showLoading();
			$(".tabsLi.tabCurrently").removeClass('tabCurrently');
			$(this).addClass('tabCurrently');
			var id=$(this).attr("id");
			if(id=="personaAR"){
				try{
				$("#Individual_ranking_article .ul-li").remove();
				personaAR("personaAR");
				 $(".ranking-li").find("span").removeClass("span_li");
				 $(".li-TT-span").show();
				}catch(e){alert(e)}
			}else{
			   $("#Individual_ranking_article .ul-li").remove();
			   if(IS_SHOW_ORDER!="1"){
				   myalert("暂时不开启全国排行",5000);
				   closeLoading();
                  return false;
                 }
			   $(".ranking-li").find("span").addClass("span_li");
			 
				personaAR("globalAR");
			}
		});
	});
});
//区分请求个人还是全国排行，很据id的值来区分
 function personaAR(id){
	 var jsonStr="";
	 var jsonurl="";
	 if(id=="globalAR"){
		 jsonurl=serverUrl+"customer/globalAchievementRank",
		 jsonStr="{\"SYS_ACCOUNT\":\""+SYS_ACCOUNT+"\"}"; 
	 }else{
		 jsonurl=serverUrl+"customer/personalAchievementRank",
		 jsonStr="{\"SYS_ACCOUNT\":\""+SYS_ACCOUNT+"\",\"CON_ID\":\""+CON_ID+"\"}";
	 }
 	 $.ajax({
 	    url :jsonurl,
		type : 'post',
		data : jsonStr,
		dataType : 'json',
		success : function(wsdata) {
			if (wsdata.result=="0") {
				var list="";
				for(var i=0;i<(wsdata.data||[]).length;i++){
					list+='<li style="height: auto;margin-bottom:3px" class="ul-li" ><span style="width: 17%">'+(i+1)+'</span>';
					list+='<span style="width: 22%">'+(wsdata.data[i].CON_NAME==undefined ? 0:wsdata.data[i].CON_NAME)+'</span><span style="width: 17%" class="li-TT-span"> '+(wsdata.data[i].TOTAL_TURNOVER.length<=0 ? 0:wsdata.data[i].TOTAL_TURNOVER)+'</span>';
					if(id=="personaAR"){
						list+='<span style="width: 20%" >'+(wsdata.data[i].BALANCE_AVAILABLE==null ? 0:wsdata.data[i].BALANCE_AVAILABLE)+'</span>';
					}else{
						list+='<span style="width: 20%" class=" li-TT-span">'+(wsdata.data[i].TOTAL_INCOME==null ? "0.0":wsdata.data[i].TOTAL_INCOME)+'</span>';
					}
					list+='<span style="width: 19%">'+(wsdata.data[i].SAVED_TREE==undefined ? 0:wsdata.data[i].SAVED_TREE)+'</span></li>';
				}
				$("#IRAUL1").html(list);
				if(id=="globalAR"){
					 $(".li-TT-span").hide();
					 $(".ul-li").find("span").addClass("span_li");
				}
			} else {
				myalert("操作失败",5000);
			}
			closeLoading();
		},
		error : function() {
			closeLoading();
			myalert("服务器繁忙,请稍后重试",5000);
		}
 	 });
}

function sParameter(){
	 var SYS_ACCOUNT=localStorage.getItem("SYS_ACCOUNT");
	 $.ajax({
		 url:serverUrl+'sysacct/search',
		 data:'{"SYS_ACCOUNT":"'+SYS_ACCOUNT+'"}',
		 dataType:'json',
		 type:'post',
		 success:function(mydata){
			 if(mydata.result==0){
				 IS_SHOW_ORDER=mydata.data.IS_SHOW_ORDER;
				 if(IS_SHOW_ORDER!=1){
					 $("#globalAR").remove();
					 $("#personaAR").addClass("personaARSHow");
				 }else{
					 $("#personaAR").removeClass("personaARSHow");
				 }
				/* BANK_WITHDRAW_LOWER=mydata.data.BANK_WITHDRAW_LOWER//银行卡提现金额下限【大于等于设定金额即可使用银行卡提现】
				 ALIPAY_WITHDRAW_LOWER=mydata.data.ALIPAY_WITHDRAW_LOWER//支付宝提现金额下限【大于等于设定金额即可使用银行卡提现】
				 WECHAT_WITHDRAW_UPPER=mydata.data.WECHAT_WITHDRAW_UPPER//信自动提现金额上限【小于等于设定金额即可自动审核通过】
*/			 }else{
	             myalert("服务器繁忙,请稍后重试");
				 history.back(-1);
			 }
		 },error:function(){
				myalert("服务器繁忙,请稍后重试",5000);
		 }
		 
	 });
	 
	 
 }
