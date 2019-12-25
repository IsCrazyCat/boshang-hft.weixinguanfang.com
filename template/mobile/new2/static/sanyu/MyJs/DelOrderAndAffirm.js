/*
*	ExMobi4.x+ JS
*	Version	: 1.0.0
*	Author	: admin@jmt
*	Email	: 
*	Weibo	: 
*	Copyright 2015 (c) 
*/
//删除订单，ORDER_ID订单号，CREATE_DT订单创建时间,object表示要删除的对象
function delOrder(ORDER_ID,CREATE_DT,object){
	showLoading();
   var str="{\"ORDER_ID\":\""+ORDER_ID+"\",\"CREATE_DT\":\""+CREATE_DT+"\"}";	
	$.ajax({
		url:serverUrl+'order/delete',
		data:str,
		dataType:'json',
		type : 'post',
		success:function(wsdata){
			closeLoading();
			if(wsdata.result=="0"){
				myalert("删除成功",5000);
				object.parents("li").remove();
				var html=$("ul").html();
				if(html.length==0){
					 var list='<li style="margin-top: 100px;font-size: 40px;text-align: center;">暂无数据</li>';
			    	  $("ul").html(list);
				}
			}else{
				alert("删除失败");
			}
			
		},
		error:function(){
			closeLoading();
			 myalert("服务器繁忙，请稍后重试",5000);
		}
	});
}


//确认订单的操作

function confirmOrder(ORDER_ID,CREATE_DT){
	showLoading();
	var str="{\"ORDER_ID\":\""+ORDER_ID+"\",\"CREATE_DT\":\""+CREATE_DT+"\"}";
	$.ajax({
		url:serverUrl+'order/confirm',
		data:str,
		dataType:'json',
		type : 'post',
		success:function(wsdata){
			closeLoading();
			if(wsdata.result=="0"){
				promptBoxOne("操作成功，请按确定");
			}else{
				boolean=true;
				myalert("操作失败,请重试",5000);
			}
		},
		error:function(){
			boolean=true;
			closeLoading();
		   myalert("服务器繁忙，请稍后重试",5000);
		}
	});
}
//查询待支付和待确认收货订单
function initOrder(CON_ID,SYS_ACCOUNT,ORDER_STATUS_ID){
	var strJSON="{\"CON_ID\":\""+CON_ID+"\",\"SYS_ACCOUNT\":\""+SYS_ACCOUNT+"\",\"ORDER_STATUS_ID\":\""+ORDER_STATUS_ID+"\"}";
	$.ajax({ 
			url:serverUrl+'order/searchByStatus',
			data:strJSON,
			dataType:"json",
			type:"post",
			success:function(wsdata){
				closeLoading();
				if(wsdata.result=="0"){
					 $("ul").html("");
			      for(var i=0;i<(wsdata.data||[]).length;i++){
			      	var list="";
			      	    list+='<li data-shopName="'+wsdata.data[i].PRODUCT_NAME+'">';
			      	    list+='<div class="Order-head">';
			      	    list+='<span class="ORDER_NO" data-ORDER_NO="'+wsdata.data[i].ORDER_NO+'">'+wsdata.data[i].ORDER_NO+'</span>';
			      	    list+='<span class="Money" data-price="'+wsdata.data[i].ORDER_TOTAL+'">￥'+(wsdata.data[i].ORDER_TOTAL==null? 0 : wsdata.data[i].ORDER_TOTAL)+'</span>';
			      	    list+='<span class="timeVal">'+wsdata.data[i].CREATE_DT+'</span>';
			      	    list+='</div>';
			      	    list+='<div class="Order-Details">';
			      	    list+='<div style="width:100%">';
			      	    list+='<div class="order-img" style="width:20%;height:60px"><img src="'+wsdata.data[i].IMAGE_URL1+'" onclick="checkOrder(this)" data-orderID="'+wsdata.data[i].ORDER_ID+'" /></div>';
			      	    for(var y=i+1;y<(wsdata.data||[]).length;y++){
			      	    	 if(wsdata.data[i].ORDER_NO==wsdata.data[y].ORDER_NO){
			      	    		list+='</div></div><div class="Order-Details">';
					      	    list+='<div style="width:100%">';
					      	    list+='<div class="order-img" style="width:20%;height:60px"><img src="'+wsdata.data[y].IMAGE_URL1+'" onclick="checkOrder(this)" data-orderID="'+wsdata.data[i].ORDER_ID+'"  /></div>';
					      	    if(y==(wsdata.data||[]).length-1){
			      	    			i=y; 
			      	    			break;
			      	    		 }
			      	    	 }else{
			      	    		  i=y-1;
			      	    		  break;
			      	    	 }
			      	    }
			            list+='<div class="order-content" style="position:relative" >';
		            if(ORDER_STATUS_ID=="1"){
		             	list+='<div class="Entry_Refund Click-State" style="display:none"></div>';
		            	list+='<div class="chek_logistics " data-type="del" data-order="'+wsdata.data[i].ORDER_ID+'" onclick="del()" >立即删除</div></div>';
		            	list+='<div class="go-pay Click-StateTT" data-type="affirm" data-orderid="'+wsdata.data[i].ORDER_ID+'"  data-ordertime="'+wsdata.data[i].CREATE_DT+'">立即支付</div></div>';
		                list+='<p style="margin-top:17px;font-size:13px;text-indent:10px">'+wsdata.data[i].ORDER_STATUS_NAME+'</p>';
		            }else{
		            	list+='<div class="Entry_Refund Click-State Sales-Return" data-ORDER_ID="'+wsdata.data[i].ORDER_ID+'">申请退货</div>';
		                list+='<div class="chek_logistics" data-ORDER_ID="'+wsdata.data[i].ORDER_ID+'" data-ORDER_NO="'+wsdata.data[i].ORDER_NO+'">查看物流</div></div>';
		                list+='<div class="go-pay confirm" data-order="'+wsdata.data[i].ORDER_ID+'"  >确认收货</div>';
		                list+='</div>';
		                list+='<p style="margin-top:17px;font-size:13px;text-indent:10px">'+wsdata.data[i].ORDER_STATUS_NAME+'</p>';
		            }
		                list+='</div></li>';
		            $("ul").append(list);
		            
			      }
			      if(wsdata.data.length==0){
			    	  var list='<li style="margin-top: 100px;font-size: 40px;text-align: center;">暂无数据</li>';
			    	  $("ul").append(list);
			      }
			      //操作删除订单的页面的删除订单
			      $("#MyOrder_WaitPayId .chek_logistics").on("click",function(){
					var ORDER_ID =$(this).attr("data-order");
					var CREATE_DT = $(this).parents("li").find(".timeVal").html();
					var object = $(this);
				/*------------------------------------------------------*/
					promptBox("确定要删除？？？");
					$("#buttomt").on("click",function(){
					  $(".Addaaa,.pop-contant").remove();
//					  alert(ORDER_ID+"#"+CREATE_DT+"#"+JSON.stringify(object));
					  delOrder(ORDER_ID,CREATE_DT,object);
					});
					return false;
				 });
			      //查看物流
			      $("#WaitGoodsReceipt_section .chek_logistics").click("click",function(){
			    	    var ORDER_ID=$(this).attr("data-ORDER_ID");
						var ORDER_NO=$(this).attr("data-ORDER_NO");
						window.location.href="ExpressageInfo.html?ORDER_ID="+ORDER_ID+"&ORDER_NO="+ORDER_NO+"&i=1";
			      });
			      
				//确认收货按钮
				 $(".confirm").on("click",function(){
					var ORDER_ID=$(this).attr("data-order");
					var CREATE_DT=$(this).parents("li").find(".timeVal").html();
					window.location.href='ConfirmGoods.html?ORDER_ID='+ORDER_ID+'&CREATE_DT='+CREATE_DT;
					});
			     $("#MyOrder_WaitPayId .Click-StateTT").on("click",function(){	
			    	//生产微信下单的订单号
			    	
					var guid = new GUID();
					//alert($(this).attr("data-orderid"));
				    var out_trade_no = $(this).attr("data-orderid"); //guid.newGUID();
				    /*
				    /////////判断订单时间，是否已关闭
					var product_time=$(this).attr("data-ordertime");
					var index_time=Number(localStorage.getItem("MAX_BUY_LIMIT"));
					var times = Date.parse(new Date(product_time));
                       times = times / 1000;
                       var index=new Date().getTime()/ 1000;
                       if((index-times)>index_time){
                         myalert("订单已关闭，请重新进入",5000);
                        return;
                       }
				    */
			    	 $(this).addClass("loseSubmit");
			    	 var product_id=$(this).parents("li").find(".ORDER_NO").html();
					 //支付的总价钱
					var priceStr=$(this).parents("li").find(".Money").attr("data-price");
					//附加数据订单号；
					var attachID=$(this).attr("data-orderid");
					var oppid=localStorage.getItem("openid");
					//简易说明商品描述
					var body=$(this).parents("li").attr("data-shopName");
					var bodyContext=body;
					var data=oppid+"="+bodyContext+"="+product_id+"="+priceStr+"="+attachID;
					
					//showUpOrder();
					//payOrder(data,out_trade_no,"1");
					verify_order(data,out_trade_no,"1");
				});
			     $(".Sales-Return").on("click",function(){
			    	 var R_ORDER_ID=$(this).attr("data-ORDER_ID");
			    	 var R_ORDER_NO=$(this).parents("li").find(".ORDER_NO").attr("data-ORDER_NO");
			    	 window.location.href="ApplyFor_Refund.html?ORDER_ID="+R_ORDER_ID+"&ORDER_NO="+R_ORDER_NO+"&i=0";
			    	 });	
				}else{
				}
			},
			error:function(){
				closeLoading();
				 myalert("服务器繁忙，请稍后重试",5000);
			}
		});
	}

function verify_order(data,out_trade_no,id){
    $.ajax({
		url : serverUrl+'order/get',
		type : 'post',
		data : '{"ORDER_ID":"'+out_trade_no+'"}',
		dataType : 'json',
		success : function(mydata) {
			if(mydata.data.ORDER_STATUS_ID=="1"||mydata.data.ORDER_STATUS_ID==1){
			    showUpOrder();
				payOrder(data,out_trade_no,id);
			}else{
			   myalert("该订单因超时已关闭",5000);
			   zhifu_dd = true;
			}
			
		},
		error : function() {
		   closeLoading();
			myalert("服务器繁忙，请稍后重试",5000);
			zhifu_dd = true;
		}
	});
}
//查看订单详情
function checkOrder(el){
	var orderID=$(el).attr("data-orderID");
	 localStorage.removeItem("ORDER_ID");
    localStorage.setItem("ORDER_ID",orderID);
	window.location.href="checkOrder.html";
}