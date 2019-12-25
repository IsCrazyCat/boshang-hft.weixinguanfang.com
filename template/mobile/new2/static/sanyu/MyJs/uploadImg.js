
//涓婁紶鐓х墖,classname鏄痠nput鏍囩鐨刢lass鐨刵ame
function uploadImg(SERIAL_ID,classname,type){
	showLoading();

    var formData = new FormData();
    formData.append('type', 'credential');

    $("." + classname).each(function (index) {
        var val = $(this).val();
        if (val) {
            var id = $(this).attr("id");
            formData.append('file' + index, $('#' + id)[0].files[0]);
        }
    });

$.ajax({
    url: serverUrl+'file/upload',
    type: 'post',
    cache: false,
    data: formData,
    processData: false,
    contentType: false,
    success : function(responseStr) {  
    	if(responseStr.result=="0"){
    		if(type==1){
    			refundUpdae(responseStr.data);
    		}else{
    			ajxaRefundGoods(responseStr.data,SERIAL_ID);
    		}
    	}else{
    		closeLoading();
    		myalert("操作失败",5000);
    		bool=true;
    		return false; 
    	}
    	
    },
    error : function(responseStr) {  
    	bool=true;
    	closeLoading();
        myalert("服务器繁忙，请稍后",5000);
    }  
});


}

//鎶婂浘鐗囪浆鎴恇ase64鐨勬暟鎹紝鏄剧ず鍦ㄩ〉闈腑
function gotoed(file){
	var id=$(file).attr("id");
	 var reader = new FileReader();
	   reader.onload = function(evt){
	   	if(id=="head-portrait"){ 
	   	  $(".head-portrait").html('<img src="'+this.result+'"data-id="'+id+'" class="addImg" style="width:40px;height:40px;"/>');
	   	}else if(id=="logistics_pric"){
	   		$(".logi-src").html('<img src="'+this.result+'"data-id="'+id+'" class="addImg" style="width:40px;height:40px;"/>');
	   	}
	   	else{ 
	   	 $(".shangchuang_xuanze_piv_div").append('<img src="'+this.result+'"data-id="'+id+'" class="addImg" style="width:40px;height:40px;z-index:99999"/>');
	    }
	    $(document).on("click",".addImg",function(){
	    	$(this).addClass("activateImg");
	    });
	     $(document).on("click",".activateImg",function(){
	    	$(this).removeClass("activateImg");
	    });
	};
	reader.readAsDataURL(file.files[0]);
}