$(function () {
    var discuss = {
        start: 0,
        end: 0,
    //    productId:get("productId"),
        conId: localStorage.getItem('CON_ID'),
        status:'1'
        //productId: "{E9035484-F5EA-4F91-BE35-4A82921EB4B5}"
    }
    var judge = 0;
    $('#tab-change span').on('click',function(){
      $(this).addClass('tab-select');
      $(this).siblings('span').removeClass('tab-select');
      if($(this).text() == "回复"){
       var status = "0";
        search(status)

      }else{
       var status = "1";
        search()
      }
    })
    $('.wrap').height($(window).height() - 70);
    var jroll = new JRoll("#wrapper", {
        scrollBarY: false
    });
//var serverUrl = 'http://192.168.1.219:8888/api/';

  //下拉刷新
    jroll.pulldown({
        refresh: function (complete) {
         // console.log(productId);
            jroll.scrollTo(0, 44, 0, true); //滚回顶部
            discuss.start = 1 + '';
            discuss.end = 10 + '';



            var ReviewsJson = JSON.stringify(discuss, function (key, value) {
                return value;
            })
            jroll.scroller.innerHTML = "";
            $.ajax({
                url: serverUrl + 'product/reviews/myCommented',
                //url:'http://192.168.1.16:8888/api/product/reviews/getReviews',
                type: 'post',
                data: ReviewsJson,
                dataType: 'json',
                success: function (data) {
                    var dataList = getReviews(data);
                    jroll.infinite_callback(dataList);
                    complete();
                    $('a[data-emoji]').each(function (index, value) {
                        $(this).css('backgroundImage', 'url(../img/emoji/' + $(this).attr('data-emoji').slice(1, -1) +
                            ".png)");
                    });
                    $('.commet-picture img').each(function (index, value) {
                        if ($(this).attr('src') == "null") {
                            $(this).remove();
                            jroll.refresh();
                        }
                    })
                },
                error: function () {
                    myalert("服务器繁忙,请稍后重试", 5000);
                }
            });

        }
    });




    //无限加载

      jroll.infinite({

          getData: function (page, callback) { //获取数据的函数，必须传递一个数组给callback
              if ($('.jroll-infinite-tip').text() == '全部加载完毕') {
                  return false;
              }
              console.log($('.tab-select').text()  == '回复')
              if($('.tab-select').text()  == '回复'){
                discuss.status == "0";
              }else{
                discuss.status == "1";
              }
              var start = parseInt(discuss.start);
              var end = parseInt(discuss.end);
              discuss.end = 10 + end + '';
              discuss.start = discuss.end - 9 + '';
              var ReviewsJson = JSON.stringify(discuss, function (key, value) {
                  return value;
              })
              $.ajax({
                  url: serverUrl + 'product/reviews/myCommented',
                  //url:'http://192.168.1.16:8888/api/product/reviews/getReviews',
                  type: 'post',
                  data: ReviewsJson,
                  dataType: 'json',
                  success: function (data) {
                      if(data.data.length == 0){
                        discuss.end = 10 + end + ''-10;
                        discuss.start = discuss.end - 9 + ''-9;
                      }
                      var dataList = getReviews(data);
                      callback(dataList);
                      $('a[data-emoji]').each(function (index, value) {
                          $(this).css('backgroundImage', 'url(../img/emoji/' + $(this).attr('data-emoji').slice(1, -1) +
                              ".png)");
                      });
                      $('.commet-picture img').each(function (index, value) {
                          if ($(this).attr('src') == "null") {
                              $(this).remove();

                          }
                      })
                      jroll.refresh();
                  },
                  error: function () {
                      myalert("服务器繁忙,请稍后重试", 5000);
                  }
              });
          },
          //template: "<div class='item'>{{=_obj.index}}、{{=_obj.text}}</div>" //每条数据模板
          template: "<div class='item'>{{=_obj.text}}</div>" //每条数据模板
      });



    function search(status){
        console.log($('.tab-select').text()  == '回复')
      if($('.tab-select').text() == '回复'){
        discuss.status = "0";
      }else{
        discuss.status = "1";
      }
        discuss.end ='10';
        discuss.start ='1';
        console.log(discuss);
        var ReviewsJson = JSON.stringify(discuss, function (key, value) {
            return value;
        })
        //condition.filter = "b"; //修改搜索条件
      //  condition.page = jroll.options.page = 1; //重置第1页
        jroll.scroller.innerHTML = "";    //清空内容
      //  jroll.scrollTo(0, 0);  //滚回顶部
        //执行刷新数据方法
        $.ajax({
          url: serverUrl + 'product/reviews/myCommented',
          type: 'post',
          data: ReviewsJson,
          dataType: 'json',
          success: function (data) {
              //  jroll.options.total = data.total;
                var dataList = getReviews(data);
                jroll.infinite_callback(dataList);
                $('.commet-picture img').each(function (index, value) {
                    if ($(this).attr('src') == "null") {
                        $(this).remove();
                    }
                })
                  jroll.refresh();
            },
            error: function() {
                jroll.infinite_error_callback()
            }
        });
    }

    //点赞
    $(document).on('click', '.title-upvote', function () {
      if(judge == 0){
        setTimeout(function(){
         judge = 1;
       },2000);
       return false;
      }
          if($(this).find('em').attr('class')== 'praise_true'){
            return false;
        }
        var upvoteData = {
            conId: discuss.conId,
            reviewsListId: $(this).attr('data-id'),
            status:$(this).attr('status')
        }
        var that = $(this);
        var upvoteJson = JSON.stringify(upvoteData, function (key, value) {
            return value;
        })

        upvote(upvoteJson,that)
    })
    /*--swiper组件--*/
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        observer:true,
    	observeParents:true,//监听器开启
    	resistanceRatio : 0,//禁左右滑动

    	paginationType : 'fraction',
    	paginationFractionRender: function (swiper, currentClassName, totalClassName) {
    	    return '<span class="' + currentClassName + '"></span>' +
    	        ' / ' +
    	        '<span class="' + totalClassName + '"></span>';
    	}
    });
    /*--点击imgclick--*/
    $(document).on("click",".comment_img_img",function(){
    	$(this).attr("index","1");
    	var imgbox = $(this).parent();                     //获取点击父类
    	var comment_img_img = imgbox.find(".comment_img_img"); //当前点击父元素下所有图片
    	$(".swiper-wrapper").append("<div class='swiper-slide'><div class = 'imgboxss'><img class = 'slideimg' src=" + $(this).attr("src") + "  data-action = 'zoom'></div></div>");//点击添加
    	var slide =  $(".slideimg").parent().parent();     //获取点击slide对象
    	$(comment_img_img).each(function( index ,obj){     //
    		//console.log($(obj).attr('index'));
    		if($(obj).attr("index") == "1") {
    		var indexs =index; //获取当前点击图片的下标值
    		swiper.slideTo(indexs, 200, false);//跳转到该下标
    		//console.log(swiper.activeIndex);
    		console.log($(comment_img_img)[index]);
    		var nextAll = $(obj).nextAll();//之后所有同级元素
    		var prevAll = $(obj).prevAll();//之前所有同级元素
    		/*--依次遍历添加--*/
    		$(nextAll).each(function(index2 , obj2) {
    			var src = $(obj2).attr("src");
    			$('.swiper-wrapper').append("<div class='swiper-slide'><div class = 'imgboxss'><img class = 'slideimg' src=" + src + "  ></div></div>");
    		});
    		$(prevAll).each(function(index3 , obj3) {
    			var src = $(obj3).attr("src");
    			console.log(src);
    			$('.swiper-wrapper').prepend("<div class='swiper-slide'><div class = 'imgboxss'><img class = 'slideimg' src=" + src + "  ></div></div>");
    		});
    		}
    	});
    	/*--点击出现样式--*/
    	$(".vido").show();
    	$(".imgcls").show();
    	$(".swiper-wrapper").css("z-index","3");
    	$("#footer").hide();
    	var dheight = $(document.body).height();
    	$('.imgboxss').height(dheight);

        //获取屏幕宽度 并赋值给imgboxss
        var imgboxsswidth = $(window).width();
        console.log(imgboxsswidth);
        $(".imgboxss").width(imgboxsswidth);

    	if ($(".slideimg").height() > $(document.body).height()) {
    		$(".slideimg").height($(document.body).height());
    	}
    	$("#tab-change").hide();
    });

    /*--点击图片删除弹出层--*/
    $(document).on('click', '.imgboxss', function () {
    	swiper.removeSlide([0,1,2,3,4,5]);//删除对象
    	/*--点击样式--*/
    	$(".comment_img_img").removeAttr("index");
    	var swiperwrapper = $(".swiper-wrapper");
    	swiperwrapper.css("z-index","1");
    	$(".vido").hide();
    	$("#tab-change").show();
    });

    /*--点击关闭按钮删除弹出层--*/
    $(document).on("click",".swiper-close",function() {
    	swiper.removeSlide([0,1,2,3,4,5]);//删除对象
    	/*--点击样式--*/
    	$(".comment_img_img").removeAttr("index");
    	var swiperwrapper = $(".swiper-wrapper");
    	swiperwrapper.css("z-index","1");
    	$(".vido").hide();
    	$("#tab-change").show();
    });

    //点击回复TA
    $(document).on('click', '.footer-reply', function () {
        if($(this).attr('con-id') == discuss.conId){myalert('不能对自己回复');return false}
       $('.mask').show();
        $('#comment_content').focus();
        var commentUser = $(this).parents('.comment-footer').siblings('.comment-title').find('.title-left').find('span').eq(0)
            .text();
        $('#pubBtn').attr('data-id',$(this).attr('data-id'));
        $('#comment_content').attr('placeholder', "回复" + commentUser);

    })
       //清除回复
        $('.section').click(function () {
          $('#comment_content').val("");
          $('#pubBtn').removeAttr('data-id');
            $('#comment_content').attr('placeholder','写评论')
          $('.mask').hide();
        })
        //删除评论
        $(document).on('click','.delete',function(){
          var thas = $(this);
          var reviewsId = $(this).attr('data-id');
          deleteProductReviews(reviewsId,thas)
        })
        //删除回复
        $(document).on('click','.delete-item',function(){
          var thas = $(this);
          var deleteReview = $(this).attr('data-id');
          deleteReviewList(deleteReview,thas)
        })
    //提交按钮
    $('#pubBtn').click(function () {
        var nowValue = $('#comment_content').val();
        if($(this).attr('data-id') == undefined){myalert('请选择回复的人~');return false}
        if(nowValue.length == 0){myalert('回复不能为空~');return false};
        $('.slider-wrapper').addClass('hide');
        $('.slider-pagination').addClass('hide');
        var reg = /\[[^\]]+\]/g;
        var str = nowValue.replace(reg, function (match, pos, originalText) {
            return '<a data-emoji="[' + array[match.slice(1, -1)] + ']" alt="' + match + '"></a>';
        })
        var replyData = {
            conId: discuss.conId,
            productReviewsId: $(this).attr('data-id'),
            reviewText: str
        }
        var replyJson = JSON.stringify(replyData, function (key, value) {
            return value;
        })
        sensitiveWordFiltering(replyJson);

    })
    /*****************接口调用************************/
    //查询评论:api/product/reviews/getReviews
    //{"start":"","end":"","productId":""}
    function getReviews(data) {
        if (data.result === 0) {
            var dataList = data.data;
            var tpl = "";
            var a = [];
            for (var i = 0; i < dataList.length; i++) {
              var review = {
                  ID: dataList[i].ID, //reviewsListId
                  CON_ID: dataList[i].CON_ID,
                  CON_NO: dataList[i].CON_NO, //会员号
                  STATUS: dataList[i].STATUS, //是否 为回复0
                  CON_NAME: stringSlice(dataList[i].CON_NAME), //昵称
                  CREATE_BY: dataList[i].CREATE_BY, //
                  CREATE_DT: dataList[i].CREATE_DT, //创建时间
                  CUST_AVATAR: dataList[i].CUST_AVATAR, //头像
                  REVIEW_TEXT: dataList[i].REVIEW_TEXT, //评论
                  REVIEW_URL1: dataList[i].REVIEW_URL1, //评论图片  无 null
                  REVIEW_URL2: dataList[i].REVIEW_URL2,
                  REVIEW_URL3: dataList[i].REVIEW_URL3,
                  REVIEW_URL4: dataList[i].REVIEW_URL4,
                  UPVOTENUM: dataList[i].UPVOTENUM == null ? 0 : dataList[i].UPVOTENUM, //点赞
                  PNT_PR_RS_ID: dataList[i].PNT_PR_RS_ID,
                  IS_UPVOTE: dataList[i].IS_UPVOTE > 0 ? 'praise_true' : 'praise_false',
                  REVIEWLIST: dataList[i].REVIEWLIST,
                  HF_CON_NAME:dataList[i].HF_CON_NAME==null?"":dataList[i].HF_CON_NAME
              };
              //回复 可删除
              var template_3 = '<div class="comment-content comment-item">' + '<div class="comment-title">' +
                  '<div class="title-left">' + '<img src="' + review
                  .CUST_AVATAR + '" alt="">' + '<span>' + review.CON_NAME + '</span>回复' +
                  '<span class="comment-con">' + review.HF_CON_NAME + '</span>' + '</div>' +
                  '<div class="title-upvote title-right" status="1" data-id="' + review
                  .ID + '">' + '<span>' + review.UPVOTENUM + '</span><em class="' + review.IS_UPVOTE +
                  '" alt=""></em>' + '</div>' + '</div>' + ' <p class="comment-text">' + review
                  .REVIEW_TEXT + '</p>' + '<div class="comment-footer">' + '<span class="footer-date">' + review
                  .CREATE_DT + '</span>' + '<div><em class="delete-item"  data-id="' + review
                  .ID + '">删除</em><em class="footer-reply" data-id="' + review.PNT_PR_RS_ID + '"  con-id="' +
                  review.CON_ID + '"  hfConNo="'+review.CON_NO+'" hfConName="'+review.CON_NAME+'" hfConId="'+review.CON_ID+'" > </em></div>' +
                  '</div>' +
                  ' </div>' + '</div>';
              //回复 不可删除
              var template_4 = '<div class="comment-content comment-item">' + '<div class="comment-title">' +
                  '<div class="title-left">' + '<img src="' + review
                  .CUST_AVATAR + '" alt="">' + '<span>' + review.CON_NAME + '</span>回复' +
                  '<span class="comment-con">' + review.HF_CON_NAME + '</span>' + '</div>' +
                  '<div class="title-upvote  title-right" status="1"  data-id="' + review
                  .ID + '">' + '<span>' + review.UPVOTENUM + '</span><em class="' + review.IS_UPVOTE +
                  '" alt=""></em>' + '</div>' + '</div>' + ' <p class="comment-text">' + review
                  .REVIEW_TEXT + '</p>' + '<div class="comment-footer">' + '<span class="footer-date">' + review
                  .CREATE_DT + '</span>' + '<em class="footer-reply" data-id="' + review.PNT_PR_RS_ID +
                  '"  con-id="' + review.CON_ID + '" hfConNo="'+review.CON_NO+'" hfConName="'+review.CON_NAME+'" hfConId="'+review.CON_ID+'"> </em>' +
                  '</div>' +
                  ' </div>' + '</div>';


                    if(review.STATUS == 0){
                      if(discuss.conId == review.CON_ID){
                        a.push({
                            "index": i,
                            "text":template_3

                        });
                      }else{
                        a.push({
                            "index": i,
                            "text":template_4

                        });
                      };
                    }else{
                      var reviews = {
                          ID: dataList[i].ID, //reviewsListId
                          CON_ID: dataList[i].CON_ID,
                          CON_NO: dataList[i].CON_NO, //会员号
                          STATUS: dataList[i].STATUS,//是否 为回复0
                          CON_NAME: stringSlice(dataList[i].CON_NAME), //昵称
                          CREATE_BY: dataList[i].CREATE_BY, //
                          CREATE_DT: dataList[i].CREATE_DT, //创建时间
                          CUST_AVATAR: dataList[i].CUST_AVATAR, //头像
                          REVIEW_TEXT: dataList[i].REVIEW_TEXT, //评论
                          REVIEW_URL1: dataList[i].REVIEW_URL1, //评论图片  无 null
                          REVIEW_URL2: dataList[i].REVIEW_URL2,
                          REVIEW_URL3: dataList[i].REVIEW_URL3,
                          REVIEW_URL4: dataList[i].REVIEW_URL4,
                          UPVOTENUM: dataList[i].UPVOTENUM == null ? 0 : dataList[i].UPVOTENUM, //点赞
                          PNT_PR_RS_ID: dataList[i].PNT_PR_RS_ID,
                          IS_UPVOTE:dataList[i].IS_UPVOTE>0?'praise_true':'praise_false',
                          REVIEWLIST:dataList[i].REVIEWLIST,
                          REVIEW_ID: dataList[i].PNT_PR_RS_ID
                      };
                      //评论 可删除
                      var template_1 = '<div class="comment-content">' + '<div class="comment-title">' +
                          '<div class="title-left">' + '<img src="' + reviews
                          .CUST_AVATAR + '" alt="">' + '<span>' + reviews.CON_NAME + '</span>' +
                          '<span class="comment-con">会员号:' + reviews.CON_NO + '</span>' + '</div>' +
                          '<div class="title-upvote title-right" status="0"  data-id="' + reviews
                          .ID + '">' + '<span>' + reviews.UPVOTENUM + '</span><em class="' + reviews.IS_UPVOTE +
                          '" alt=""></em>' + '</div>' + '</div>' + ' <p class="comment-text">' + reviews
                          .REVIEW_TEXT + '</p>' + ' <div class="commet-picture">' + '<img class="comment_img_img" src="' +
                          reviews.REVIEW_URL1 + '" alt="">' + '<img  class="comment_img_img" src="' + reviews
                          .REVIEW_URL2 + '" alt="">' + '<img  class="comment_img_img" src="' + reviews.REVIEW_URL3 +
                          '" alt="">' + '<img  class="comment_img_img" src="' + reviews
                          .REVIEW_URL4 + '" alt="">' + '</div>' + '<div class="comment-footer">' +
                          '<span class="footer-date">' + reviews
                          .CREATE_DT + '</span>' + '<div><em class="delete"  data-id="' + reviews
                          .REVIEW_ID + '">删除</em><em class="footer-reply" hfConNo="'+reviews.CON_NO+'" hfConName="'+reviews.CON_NAME+'" hfConId="'+reviews.CON_ID+'" data-id="' + reviews.REVIEW_ID +
                          '"  con-id="' + reviews.CON_ID + '" > </em></div>' +
                          '</div>' +
                          ' </div>' + '</div>';
                      //评论 不可删除
                      var template_2 = '<div class="comment-content">' + '<div class="comment-title">' +
                          '<div class="title-left">' + '<img src="' + reviews
                          .CUST_AVATAR + '" alt="">' + '<span>' + reviews.CON_NAME + '</span>' +
                          '<span class="comment-con">会员号:' + reviews.CON_NO + '</span>' + '</div>' +
                          '<div class="title-upvote title-right" status="0"  data-id="' + reviews
                          .ID + '">' + '<span>' + reviews.UPVOTENUM + '</span><em class="' + reviews.IS_UPVOTE +
                          '" alt=""></em>' + '</div>' + '</div>' + ' <p class="comment-text">' + reviews
                          .REVIEW_TEXT + '</p>' + ' <div class="commet-picture">' + '<img class="comment_img_img" src="' +
                          reviews.REVIEW_URL1 + '" alt="">' + '<img  class="comment_img_img" src="' + reviews
                          .REVIEW_URL2 + '" alt="">' + '<img  class="comment_img_img" src="' + reviews.REVIEW_URL3 +
                          '" alt="">' + '<img  class="comment_img_img" src="' + reviews
                          .REVIEW_URL4 + '" alt="">' + '</div>' + '<div class="comment-footer">' +
                          '<span class="footer-date">' + reviews
                          .CREATE_DT + '</span>' + '<em class="footer-reply" hfConNo="'+reviews.CON_NO+'" hfConName="'+reviews.CON_NAME+'" hfConId="'+reviews.CON_ID+'"  data-id="' + reviews.REVIEW_ID + '" con-id="' +
                          reviews.CON_ID + '"> </em>' +
                          '</div>' +
                          ' </div>' + '</div>';
                      if(discuss.conId == reviews.CON_ID){
                        a.push({
                            "index": i,
                            "text":template_1

                        });
                      }else{
                        a.push({
                            "index": i,
                            "text":template_2

                        });
                      };
                    }



            };
            if (dataList.length < 10) {
                setTimeout(function () {
                    $('.jroll-infinite-tip').text('全部加载完毕');
                }, 300)

            }
            return a;
        } else {
            myalert('服务器繁忙，请刷新页面~')
        }
    }
    //回复评论:api/product/reviews/reply
    //{"conId":"","productReviewsId":"","reviewText":""}

    function reply(replyJson) {
        console.log(replyJson);
        $.ajax({
            url: serverUrl + 'product/reviews/reply',
            type: 'post',
            data: replyJson,
            dataType: 'json',
            success: function (data) {
                if (data.result == 0) {
                    if (data.data == true) {
                        myalert('回复成功');
                        $('#comment_content').val("");
                        $('#pubBtn').removeAttr('data-id').end()
                          $('#comment_content').attr('placeholder','写评论');
                           search();
                        //$('.mask').hide();
                    }
                }
            },
            error: function () {
                myalert("服务器繁忙,请稍后重试", 5000);
            }
        });
    }
    //点赞:api/product/reviews/reply
    //{"reviewsListId":"","conId":""}

    function upvote(upvoteJson,thas) {
        $.ajax({
             url : serverUrl+'product/reviews/upvote',
            //url: 'http://192.168.1.16:8888/api/product/reviews/upvote',
            type: 'post',
            data: upvoteJson,
            dataType: 'json',
            success: function (data) {
                if(data.result == 0){
                    var num = parseInt(thas.find('span').text());
                    thas.find('em').removeClass().addClass('praise_true');
                    thas.find('span').text(num+1);

                }else{
                  myalert(data.errorData);
                }
            },
            error: function () {
                myalert("服务器繁忙,请稍后重试", 5000);
            }
        });
    }
    //敏感字符屏蔽，有敏感标识阻止提交。

    function sensitiveWordFiltering(replyJson) {
        var textVerdict = $('#comment_content').val();
        $.ajax({
            url: serverUrl + 'product/reviews/sensitiveWordFiltering',
            type: 'post',
            cache: false,
            data: "{text:'" + textVerdict + "'}",
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.result == 0) {
                    var newText = "";
                    if (data.data.length != 0) {
                        closeLoading();
                        for (var i = 0; data.data.length > i; i++) {
                            var r = new RegExp(data.data[i], "ig");
                            newText = textVerdict.replace(r, "***");

                        }
                        $('#comment_content').val(newText);
                        myalert('请去除敏感字后再评论', 5000)
                    } else {
                        reply(replyJson);
                    }
                } else {

                }


            },
            error: function (data) {
                closeLoading();
                myalert("服务器拥挤，请稍候", 5000);
            }
        });
    }
    /**************emoji********************/
    $('.icon_emoji').click(function () {
        if ($(this).data('on') == true) {
            $('.slider-wrapper').addClass('hide');
            $('.slider-pagination').addClass('hide');
            $(this).data('on', false);
            return;
        }
        $('.slider-wrapper').removeClass('hide');
        $('.slider-pagination').removeClass('hide');
        $(this).data('on', true);
    })
    $('a[data-emoji]').each(function (index, value) {
        $(this).css('backgroundImage', 'url(./emoji/' + $(this).attr('data-emoji').slice(1, -1) + ".png)");
    })

    /**************emoji滑动********************/
    var wrap = document.querySelector('.slider-wrapper');
    var start;
    var nowPointX = 0;
    var prevX = 0,
        devX;
    wrap.addEventListener('touchstart', function (e) {
        start = e.touches[0].clientX;
        prevX = start;
    }, false)

    wrap.addEventListener('touchmove', function (e) {
        devX = prevX - e.touches[0].clientX;
        nowPointX -= devX;
        if (nowPointX > 0) {
            nowPointX += devX;
            return;
        }
        if (nowPointX < 0 - wrap.offsetWidth * 3 / 4) {
            nowPointX += devX;
            return;
        }
        $('.slider-wrapper').css('transform', 'translate3d(' + nowPointX + 'px,0,0)');
        $('.slider-wrapper').css('transitionDuration', '0');
        prevX = e.touches[0].clientX;
    }, false)

    wrap.addEventListener('touchend', function (e) {
        var fontSize = parseInt($('html').css('fontSize'));
        var dp = Math.ceil(Math.abs(nowPointX) / (wrap.offsetWidth / 4));;
        if (start - e.changedTouches[0].clientX < 0) {
            dp = dp - 1;
        }
        if (Math.abs(nowPointX % (wrap.offsetWidth / 4)) > fontSize * 1.5) {
            $('.slider-wrapper').css('transform', 'translate3d(-' + dp * (wrap.offsetWidth / 4) + 'px,0,0)');
            $('.slider-wrapper').css('transitionDuration', '300ms');
            nowPointX = 0 - dp * (wrap.offsetWidth / 4);
        } else {
            dp = Math.round(Math.abs(nowPointX) / (wrap.offsetWidth / 4));
            $('.slider-wrapper').css('transform', 'translate3d(-' + dp * (wrap.offsetWidth / 4) + 'px,0,0)');
            $('.slider-wrapper').css('transitionDuration', '0');
        }

        $('.bullet').removeClass('active');
        $('.bullet').eq(dp).addClass('active');

        // console.log(nowPointX);
    }, false)
    var array = [];
    $('.slider-wrapper').click(function (e) {
        $target = $(e.target);
        if (!$target.is('a')) return;
        var val = $target.attr('alt');
        var emoji = $target.attr('data-emoji');
        array[val.slice(1, -1)] = emoji.slice(1, -1);
        var txt = $('#comment_content').val();
        text = txt + val;
        $('#comment_content').val(text);
        // console.log(array);
    })
    // 删除商品评论
    function deleteProductReviews(reviewsId,thas){
      var reviewsListId = {
          reviewsListId:reviewsId
      }
      var jsonlist = JSON.stringify(reviewsListId,function(k,v){
        return v;
      })
      $.ajax({
       url : serverUrl+'product/reviews/deleteProductReviews',
      //  url: 'http://192.168.1.23:8888/api/product/reviews/deleteProductReviews',
        type : 'post',
        data : jsonlist,
        dataType : 'json',
        success : function(mydata) {

          if (mydata.result == 0) {
            jroll.refresh();
            thas.parents('.item').addClass('delete-animation');
            setTimeout(function(){thas.parents('.item').remove();myalert('删除成功');jroll.refresh();},600);
          }else{
        	  closeLoading();
        	  myalert('删除失败');
          }
        },
        error : function() {

        myalert("服务器繁忙,请稍后重试",5000);
        }
      });
    }
    //删除回复
    function deleteReviewList(deleteReview,thas){
      var deleteReviewList = {
          id:deleteReview
      }
      var jsonlist = JSON.stringify(deleteReviewList,function(k,v){
        return v;
      })
      $.ajax({
        url : serverUrl+'product/reviews/deleteReviewList',

        type : 'post',
        data : jsonlist,
        dataType : 'json',
        success : function(mydata) {

          if (mydata.result == 0) {

            jroll.refresh();
          //  thas.parents('.item').remove();
        thas.parents('.item').addClass('delete-animation');
        setTimeout(function(){thas.parents('.item').remove();myalert('删除成功');jroll.refresh();},600);

          }else{

        	  myalert('删除失败');
          }
        },
        error : function() {
        myalert("服务器繁忙,请稍后重试",5000);
        }
      });
    }
    function stringSlice(str){
    	if(str.length <= 5){return str}else{
    	return str.slice(0,2)+"**"+str.slice(str.length-2);
    };
  }
})
