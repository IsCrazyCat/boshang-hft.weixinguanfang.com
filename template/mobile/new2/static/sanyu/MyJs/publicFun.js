var MYAPP = window.MYAPP || {};

MYAPP.loadingToast = {
    loadingToastShow: function (toast__content) {
        var template = '<div id="loadingToast" >' +
            '  <div class="weui-mask_transparent"></div>' +
            '    <div class="weui-toast">' +
            '      <i class="weui-loading weui-icon_toast"></i>' +
            '        <p class="weui-toast__content">' + toast__content + '</p>' +
            '    </div>' +
            ' </div>';
        $('body').append(template);
    },
    loadingToastHide: function () {
        $('#loadingToast').remove();
    },
    toast: function (tiem) {
        if ($('#toast').length > 0) {
            return
        }
        var time = tiem || 1000;
        var template = '<div id="toast" >' +
            '<div class="weui-mask_transparent"></div>' +
            '<div class="weui-toast">' +
            '    <i class="weui-icon-success-no-circle weui-icon_toast"></i>' +
            '    <p class="weui-toast__content">已完成</p>' +
            '</div>' +
            '</div>';
        $('body').append(template);
        setTimeout(function () {
            $('#toast').remove();
        }, time);

    },
    toastAnomaly: function (tiem, text) {
        if ($('#toastAnomaly').length > 0) {
            return
        }
        var time = tiem || 1000;
        var text = text || "服务器繁忙，请稍后重试";
        var template = '<div id="toastAnomaly" >' +
            '<div class="weui-mask_transparent"></div>' +
            '<div class="weui-toast_anmaly">' +
            '    <p>' + text + '</p>' +
            '</div>' +
            '</div>';
        $('body').append(template);
        setTimeout(function () {
            $('#toastAnomaly').remove();
        }, time);
    }
};

//service
MYAPP.service = {
    el: document.getElementById('on-line'),
    startY: null,
    startX: null,
    moveY: null,
    moveX: null,

    init: function () {
        var that = this;

        this.el.addEventListener('touchstart', function (event) {
            that.touch(event, this);
        }, false);

        this.el.addEventListener('touchmove', function (event) {
            that.touch(event, this);
        }, false);

        this.el.addEventListener('touchend', function (event) {
            that.touch(event, this);
        }, false);
    },

    getElementViewLeft: function (el) {//获取元素相对浏览器的位置 left
        var EleLeft = el.offsetLeft;
        var currentEL = el.offsetParent;

        while (currentEL !== null) {
            EleLeft += currentEL.offsetLeft;
            currentEL = currentEL.offsetParent;
        }

        return EleLeft;
    },

    getElementViewTop: function (el) {//获取元素相对浏览器的位置 top
        var EleTop = el.offsetTop; //offsetTop 包括 margin
        var currentEL = el.offsetParent;

        while (currentEL !== null) {
            EleTop += currentEL.offsetTop;
            currentEL = currentEL.offsetParent;
        }

        return EleTop;
    },

    touch: function (event, el) {
        var that = this;

        switch (event.type) {
            case 'touchstart':
                that.startX = parseInt(event.touches[0].clientX);
                that.startY = parseInt(event.touches[0].clientY);

                break;
            case 'touchend':

                break;
            case 'touchmove':
                event.preventDefault();

                var elLeft = that.getElementViewLeft(that.el);
                var elTop = that.getElementViewTop(that.el) + 10; //10px  为设置的margin-top: -10px

                that.moveX = parseInt(event.touches[0].clientX);
                that.moveY = parseInt(event.touches[0].clientY);

                that.el.style.top = elTop + (that.moveY - that.startY) + 'px';
                that.el.style.left = elLeft + (that.moveX - that.startX) + 'px';

                that.startY = that.moveY;
                that.startX = that.moveX;

                break;
        }

    }
};

//testData
MYAPP.testData = {
    "result": 0, //返回码
    "data": { //返回数据
        "id": "1",//ID
        "productPreNo": "xxx01", //商品预售编号
        "beginDate": 1528875157001,//预售开始时间
        "endDate": 1576166400,//预售结束时间
        "sendGoodsDate": 1529372773477 + (86400000),//发货日
        "remarkPre": "2019年12月13日10点定点抢购",//预售说明
        "status": "1",//预售状态 1- 待售 2-在售 3-售完 4-结束
        "remarkBiz": "包邮",//运费说明
        "titleMain": "发现一款明星们都在用的纸巾！累计卖出3亿多包！",//主标题
        "titleVice": "竹妃纸巾好评率99%，复购率超过70%！",//副标题
        "cImageUrl": "http://www.xxx.cImageUrl.html",//缩略图
        "availableNumber":1,  //可用库存数量
        "totalNumber":199, // 总库存数量
        "interestNum":2000 // 感兴趣数
    }
};
MYAPP.preSellData ={
    "result": 0,
    "data": {
        "totalNumber": 10,
        "interestNum": 8528,
        "endDate": "2018-06-27 17:00:00",   //end
        "remarkBiz": "预售-1运费哦！！",
        "volumeDate": "2018-06-27 07:00:00",
        "availableNumber": 0,
        "systime": (new Date().getTime()),
        "cimageUrl": "http://photo.vellgo.com.cn/images/product/1529570743349.png",
        "sendGoodsDate": "2018-07-10",
        "productPreNo": "预售-待售1",
        "beginDate": "2018-06-26 14:00:00",  //start
        "remarkPre": null,
        "id": "721BBC5D2A9A4D6D959FA361A3583016",
        "titleMain": "预售-1，上新~~~~~~~~~~~~",
        "titleVice": "预售-1，预售-1，预售-1，预售-1，预售-1，预售-1——天然工坊",
        "status": 1
    }
};

function Drag(config) {
    this.startY = null;
    this.startX = null;
    this.moveY = null;
    this.moveX = null;
    this.opacity = null;
    this.init(config);
}
Drag.prototype = {
    constructor: Drag,
    init: function (config) {
        var that = this;

        that.el = document.getElementById(config.trigger);
        config.opacity ? that.opacity = config.opacity : 0.6;

        if (!that.el) {
            throw new Error('no element');
        }

        that.addListener(that.el);
    },
    getElementViewLeft: function (el) {//获取元素相对浏览器的位置 left
        var EleLeft = el.offsetLeft;
        var currentEL = el.offsetParent;

        while (currentEL !== null) {
            EleLeft += currentEL.offsetLeft;
            currentEL = currentEL.offsetParent;
        }

        return EleLeft;
    },
    getElementViewTop: function (el) {//获取元素相对浏览器的位置 top
        var EleTop = el.offsetTop; //offsetTop 包括 margin
        var currentEL = el.offsetParent;

        while (currentEL !== null) {
            EleTop += currentEL.offsetTop;
            currentEL = currentEL.offsetParent;
        }

        return EleTop;
    },
    addListener: function (el) {
        var that = this;

        el.addEventListener('touchstart', function (event) {
            that.touch(event, this);
        }, false);
        el.addEventListener('touchmove', function (event) {
            that.touch(event, this);
        }, false);
        el.addEventListener('touchend', function (event) {
            that.touch(event, this);
        }, false);
    },
    touch: function (event, el) {
        var that = this;

        switch (event.type) {
            case 'touchstart':
                that.el.style.opacity = that.opacity;

                that.startX = parseInt(event.touches[0].clientX);
                that.startY = parseInt(event.touches[0].clientY);

                break;
            case 'touchend':
                that.el.style.opacity = 1;

                var moveEndX = parseInt(event.changedTouches[0].clientX);
                var moveEndY = parseInt(event.changedTouches[0].clientY);
                var screenWidth = document.documentElement.clientWidth;
                var screenHeight = document.documentElement.clientHeight;

                //界限判断
                if (moveEndX <= 10) {
                    that.el.style.left = 0;
                } else if (moveEndX >= screenWidth) {
                    that.el.style.left = screenWidth - that.el.offsetWidth + 'px';
                }

                if (moveEndY <= 0) {
                    that.el.style.top = 10 + 'px';
                } else if (moveEndY >= screenHeight) {
                    that.el.style.top = screenHeight - that.el.offsetHeight - 40 + 'px';
                }
                break;
            case 'touchmove':
                event.preventDefault();

                var elLeft = that.getElementViewLeft(that.el);
                var elTop = that.getElementViewTop(that.el) + 10; //10px  为设置的margin-top: -10px

                that.moveX = parseInt(event.touches[0].clientX);
                that.moveY = parseInt(event.touches[0].clientY);

                that.el.style.top = elTop + (that.moveY - that.startY) + 'px';
                that.el.style.left = elLeft + (that.moveX - that.startX) + 'px';

                that.startY = that.moveY;
                that.startX = that.moveX;

                break;
        }

    }
};

//sku 功能
MYAPP.sku = {
    proStatus: 0,               //是否预售 3是预售
    hasScroll: true,           //是否可以滚动页面
    hasShoppingCart: false,   //是购物车页还是详情页
    initSelectedSkuList: null,//可以判断属性列表num
    conType: localStorage.getItem('CON_TYPE'),
    cacheProductColor: null,
    skuList: null,
    attrList: null,
    skuIDList: [],
    skuItem: null, //属性组合
    timer: null,
    testData: {
        "result": 0,
        "data": {
            "skuList": [
                {
                    "productId": "CCB5E52325AB48A194D288E4D6940867",
                    "skuValueIds": "6E7E7A8EC8E79057E050190ACCAB3BD3,6F239BB48D27D9ECE050190ACCAB49CD",
                    "preBuyPrice": 0.8,
                    "salesPrice": 1,
                    "updateTime": "2018-06-28 13:49:28",
                    "remark": null,
                    "createBy": "trgf",
                    "skuValueNames": "M,红",
                    "wid": "199361E1D7FD4DF0866DC0E393915D22",
                    "createTime": "2018-06-28 10:09:09",
                    "updateBy": "trgf",
                    "stockNum": 0,
                    "id": "199361E1D7FD4DF0866DC0E393915D22",
                    "skuImage": "http://photo.vellgo.com.cn/images/product/1530151742170.jpg",
                    "status": 1
                },
                {
                    "productId": "CCB5E52325AB48A194D288E4D6940867",
                    "skuValueIds": "6E7E7A8EC8E79057E050190ACCAB3BD3,6F239BB48D28D9ECE050190ACCAB49CD",
                    "preBuyPrice": 0.8,
                    "salesPrice": 1,
                    "updateTime": "2018-06-28 13:49:28",
                    "remark": null,
                    "createBy": "trgf",
                    "skuValueNames": "M,黄",
                    "wid": "CFD80F5525DB47558789B920A51A4515",
                    "createTime": "2018-06-28 10:09:09",
                    "updateBy": "trgf",
                    "stockNum": 0,
                    "id": "CFD80F5525DB47558789B920A51A4515",
                    "skuImage": "http://photo.vellgo.com.cn/images/product/1530151744138.jpg",
                    "status": 1
                },
                {
                    "productId": "CCB5E52325AB48A194D288E4D6940867",
                    "skuValueIds": "6E7E7A8EC8E99057E050190ACCAB3BD3,6F239BB48D28D9ECE050190ACCAB49CD",
                    "preBuyPrice": 0.8,
                    "salesPrice": 1,
                    "updateTime": "2018-06-28 13:49:28",
                    "remark": null,
                    "createBy": "trgf",
                    "skuValueNames": "XL,黄",
                    "wid": "8FCE98E563C54860B4F48FC4935822B3",
                    "createTime": "2018-06-28 13:49:28",
                    "updateBy": "trgf",
                    "stockNum": 100,
                    "id": "8FCE98E563C54860B4F48FC4935822B3",
                    "skuImage": "http://photo.vellgo.com.cn/images/product/1530164966953.jpg",
                    "status": 1
                },
                {
                    "productId": "CCB5E52325AB48A194D288E4D6940867",
                    "skuValueIds": "6E7E7A8EC8E99057E050190ACCAB3BD3,6F239BB48D27D9ECE050190ACCAB49CD",
                    "preBuyPrice": 0.8,
                    "salesPrice": 1,
                    "updateTime": "2018-06-28 13:49:28",
                    "remark": null,
                    "createBy": "trgf",
                    "skuValueNames": "XL,红",
                    "wid": "E869560BC79348329E7034D394439B55",
                    "createTime": "2018-06-28 13:49:28",
                    "updateBy": "trgf",
                    "stockNum": 100,
                    "id": "E869560BC79348329E7034D394439B55",
                    "skuImage": "http://photo.vellgo.com.cn/images/product/1530164964724.jpg",
                    "status": 1
                }
            ],
            "attrList": [
                {
                    "attrId": "6ABB0D7874FDA887E050190ACCAB7C76",
                    "attrValueList": [
                        {
                            "isCheck": 2,
                            "attrValueId": "6E7E7A8EC8E79057E050190ACCAB3BD3",
                            "type": 1,
                            "attrValueName": "M"
                        },
                        {
                            "isCheck": 2,
                            "attrValueId": "6E7E7A8EC8E99057E050190ACCAB3BD3",
                            "type": 1,
                            "attrValueName": "XL"
                        }
                    ],
                    "attrName": "尺寸"
                },
                {
                    "attrId": "6F239BB48D25D9ECE050190ACCAB49CD",
                    "attrValueList": [
                        {
                            "isCheck": 2,
                            "attrValueId": "6F239BB48D27D9ECE050190ACCAB49CD",
                            "type": 1,
                            "attrValueName": "红"
                        },
                        {
                            "isCheck": 2,
                            "attrValueId": "6F239BB48D28D9ECE050190ACCAB49CD",
                            "type": 1,
                            "attrValueName": "黄"
                        }
                    ],
                    "attrName": "测试属性"
                }
            ]
        }
    },
    init: function () {
        window.location.href.indexOf('shopping_cart') > -1 ? this.hasShoppingCart = true : '';

        //this.getSKUItems();//测试
        this.eventBinding();
    },

    getSKUItems: function (id) {
        var that = this, postData;

        id = id || localStorage.getItem('PRODUCT_ID');
        postData = {
            productId: id
        };

        MYAPP.loadingToast.loadingToastShow('数据加载中');
        $.ajax({
            url: serverUrl + "sku/productSkuList",
            dataType: "json",
            data: JSON.stringify(postData),
            type: "post",
            async: false,
            success: function (repData) {
                MYAPP.loadingToast.loadingToastHide();

                //repData = that.testData;
                if (repData.result === 0) {
                    var data = repData.data;
                    if (data !== null && data.skuList.length !== 0 && data.attrList.length !== 0) {
                        that.skuList = data.skuList;
                        that.attrList = data.attrList;

                        that.initSKUView(data.skuList);
                        that.renderSKUAttrList(data.attrList);
                    }
                }
            },
            error: function (error) {
                MYAPP.loadingToast.loadingToastHide();
                myalert("服务器繁忙，请稍后");
            }
        })
    },

    initSKUView: function (repData) {
            this.initSelectedSkuList = repData[0].skuValueIds.split(',');
            this.skuItem = repData[0];
            this.SKUDialogTopInfo(repData[0]);

            repData[0].stockNum > 0 ? $("#pay_to").removeClass("No-pay_to") : '';//立即购买按钮是否置灰

           /* var el = $("#pay_to");
            repData[0].stockNum > 0 ? el.attr('nostock', false) : el.attr('nostock', true);//立即购买按钮是否置灰*/
    },

    renderSKUAttrList: function (repData) {//sku 属性列表
        var that = this;
        var str = '';

        for (var o = 0; o < repData.length; o++) {
            (function () {
                str += '<div class="content_body_item" data-id="'+ repData[o].attrId +'">';
                str += ' <h3>'+ repData[o].attrName +'</h3>';
                str += ' <ul>';

                for (var i = 0; i < repData[o].attrValueList.length; i++) {
                    if (that.compareAttr(repData[o].attrValueList[i].attrValueId)) {
                        str += '<li data-id="' + repData[o].attrValueList[i].attrValueId + '" class="sku_active_product">';
                    } else {
                        str += '<li data-id="' + repData[o].attrValueList[i].attrValueId + '">';
                    }

                    str += repData[o].attrValueList[i].attrValueName;
                    str += '</li>';
                }

                str += ' </ul>';
                str += '</div>';

            })(o);

            $('.sku_content_body').html(str);
        }

        this.allProductNoStock();
    },

    allProductNoStock: function () {
        if (this.skuItem.stockNum <= 0) {//第一个商品无库存 所有商品无库存
            for (var i = 0; i < this.initSelectedSkuList.length; i++ ) {
                var attrIdList = this.skuItem.skuValueIds.split(',');

                if (i > 0) {
                    $('.content_body_item ul li[data-id='+ attrIdList[i] +']').addClass('sku_no_stock').removeClass('sku_active_product ');
                }
            }

            this.proStatus !== 3 ? $("#pay_to").text('暂无库存') : ''; //按钮显示文案 和预售文案冲突;
            $('.content_header_bottom span').text('无库存');
        }
    },

    compareAttr: function (attr) {
        var flag = false;

        for (var i = 0; i < this.initSelectedSkuList.length; i++) {
            if (this.initSelectedSkuList[i] === attr) {
                flag = true;

                break;
            }
        }

        return flag;
    },

    SKUDialogTopInfo: function (item) {
        $('.content_header_top img').attr('src', item.skuImage);
        //$('.attr_selected h2, .content_header_bottom i').text((item.skuValueNames.split(',')).join('; '));  页面加载判断库存
        $('.content_header_bottom i').text((item.skuValueNames.split(',')).join('; '));

        var docList = localStorage.getItem("officalDocList");
        if (docList) {
            docList = JSON.parse(docList);

            if (this.conType === '0') {
                $('.content_header_top div p:first').text('￥' + (Number(item.purchasePrice).toFixed(2)));
                $('.content_header_top div p:nth-child(2)').text(docList.data.tips_first ? docList.data.tips_first.docContent : '');
            } else if (this.conType === '1') {
                $('.content_header_top div p:first').text('￥' + (Number(item.repurchasePrice).toFixed(2)));
                $('.content_header_top div p:nth-child(2)').text(docList.data.tips_repeat ? docList.data.tips_repeat.docContent : '');
            }
        }
    },

    compareStock: function (item, skuId, productId) {//和本地库存对比
        skuId = skuId || this.itemSearchStock();

        /*if (this.hasShoppingCart && this.skuList === null) {
            this.getSKUItems(productId);

            if (this.skuList !== null) {
                for (var i = 0;  i < this.skuList.length; i++ ) {
                    if (skuId === this.skuList[i].id) {
                        this.skuItem = this.skuList[i];
                    }
                }
            }
        }*/

        this.handlerStock(this.skuItem.stockNum, item);
    },

    itemSearchStock: function () {
        var el = $('.content_body_item');
        for (var i = 0; i < this.initSelectedSkuList.length; i++) {
            this.skuIDList.push((el.eq(i).find('ul li[class=sku_active_product]').attr('data-id')) ||
                (el.eq(i).find('ul li[class=sku_no_stock]').attr('data-id'))
            );
        }

        if (this.skuIDList.length !== 0) {
            for (var s = 0; s < this.skuList.length; s++) {
                if (this.skuList[s].skuValueIds === this.skuIDList.join(',')) {
                    this.skuItem = this.skuList[s];
                    this.SKUDialogTopInfo(this.skuList[s]);

                    return this.skuList[s].id;
                }
            }
        }
    },

    handlerStock: function (num, item) {
        var that = this;
        var type = item[0].nodeName;

        if (type === 'LI') {// btnClick 点击li

            that.changeBtnState(num);
        } else if (type === 'I'){// calculator 加减数量

            that.calculator(num, item);
        } else if (type === 'SPAN') {//购物车加减数量

            that.cartHandlerStock(num, item);
        }

        this.skuIDList = [];
    },

    changeBtnState: function (number) {
        var count = Number($('.sku_content_footer div span').text());
        for (var i = 0; i < this.skuIDList.length; i++) {
            if (i > 0) {//除最上面的属性 最上按钮不可置灰
                var el = $('#pay_to, .sku_btn');
                var btnText = el.text().trim();

                if (number < count) {
                    console.log('no stock');

                    $('.content_body_item li[data-id=' + this.skuIDList[i] + ']').addClass('sku_no_stock').removeClass('sku_active_product');
                    $('.content_header_bottom span').text('无库存');

                    if (btnText === '立即购买' || btnText === '暂无库存') { //预售按钮文案不改变
                        el.addClass('No-pay_to').text('暂无库存');
                    }
                } else if (number >= count) {
                    console.log('have stock');

                    $('.content_body_item li[data-id=' + this.skuIDList[i] + ']').addClass('sku_active_product').removeClass('sku_no_stock');
                    $('.content_header_bottom span').text('库存充足');

                    if (btnText === '立即购买' || btnText === '暂无库存') {
                        el.removeClass('No-pay_to').text('立即购买');
                    }
                }
            }
        }
    },

    calculator: function (number, item) {
        var cls = item.attr('class');
        var el = $('.sku_content_footer div span');
        var count = Number(el.text());
        var diff = number - count;

        if (diff > 0) {//有库存 大于0
            cls.indexOf('add') > -1 ? count += 1 : count -= 1;

            el.text(count);
        } else if (diff === 0 && cls.indexOf('reduce') > -1 || (diff < 0 && cls.indexOf('reduce') > -1)) {
            count -= 1;

            el.text(count);
        } else if (diff === 0) {

            myalert('只有'+(el.text())+'件可买啦')
        }
    },

    cartHandlerStock: function (number, item) {
        var cls = item.attr('class');
        var el = item.parents('.handler_shopping_car').find('input');
        var count = Number(el.val());
        var diff = number - count;

        if (diff > 0) {
            cls.indexOf('add_span') > -1 ? count += 1 : count -= 1;
            el.val(count);

            this.changeLocalStock(item, count)
        }  else if ((diff === 0 && cls.indexOf('jian') > -1) || (diff < 0 && cls.indexOf('jian') > -1)) {
            count -= 1;
            el.val(count);

            this.changeLocalStock(item, count)
        }  else if (diff === 0) {

            myalert('只有'+(el.val())+'件可买啦')
        }
    },

    cartHandlerStock2: function (item) {
        var cls = item.attr('class');
        var el = item.parents('.handler_shopping_car').find('input');
        var count = Number(el.val());

        cls.indexOf('add_span') > -1 ? count += 1 : count -= 1;
        el.val(count);

        this.changeLocalStock(item, count);
    },

    changeLocalStock: function (item, count) {
        var skuId = item.parents('.li_shanpin').find('.sku_selected_product').attr('data-id');
        var productList = JSON.parse(localStorage.getItem('PRODUCT'));

        for (var i = 0; i < productList.length; i++) {
            if (productList[i].IS_SKU) {
                if (productList[i].SKU_list.id === skuId) {
                    productList[i].PRODUCT_NUM = count;
                    this.countPrice();

                    break;
                }
            }
        }

        localStorage.setItem('PRODUCT', JSON.stringify(productList));
    },

    countPrice: function () {
        var num = 0; //原价
        var discount = 0; //折扣价

        $('#ul_shanpin li').each(function (index, el) {
            discount += Number($(el).find("em").text()) * Number($(el).find("input:eq(1)").val());
            num += Number($(el).find(".small").text()) * Number($(el).find("input:eq(1)").val());
        });

        $("#zongjia").html(discount.toFixed(2));
        this.conType === '1' ? $('#anniao .search  i').text(num.toFixed(2)) : '';
    },

    productPrice: function () {
        var item = this.skuItem;

        if (this.conType === '1') {
            //$('.product_discount_info').text('(原价' + (Number(item.salesPrice).toFixed(2)) + '元，复购享8折)');
            $("#index_con").text((Number(item.repurchasePrice).toFixed(2)));
        } else if (this.conType === '0') {
            //$('.product_discount_info').text('(首单支付后，重复消费永久8折)');
            $("#index_con").text(Number(item.purchasePrice).toFixed(2));
        }
    },

    skuAttrRemark: function () {
        if (this.attrList.length !== 0) {
            var arr = [];
            var attrId = $('.content_body_item').eq(0).find('ul li.sku_active_product').attr('data-id');

            for (var i = 0; i < this.skuList.length; i++) {
                if (this.skuList[i].skuValueIds.split(',')[0] === attrId && this.skuList[i].remark !== null) {
                    arr.push(this.skuList[i]);
                }
            }

            arr.length > 0 ? this.addBtnRemarkText(arr) : this.resetSkuAttrText(attrId);
        }
    },

    getSKUid: function () {
        var that = this;
        var arr = [];

        $('.content_body_item li').each(function (index, el) {
            if ($(el).attr('class') === 'sku_active_product') {
                arr.push($(el).attr('data-id'));
            }
        });

        if (arr.length !== 0) {
            for (var i = 0; i < this.skuList.length; i++) {
                if (this.skuList[i].skuValueIds === arr.join(',')) {
                    that.skuID = this.skuList[i].id
                }
            }
        }
    },

    getSKUStock: function (item, id) {
        var that = this;
        var skuID;
        id === undefined ? skuID = this.itemSearchStock() : skuID = id;
        var postData = {
            productList: [{
                type: 1, //类型 1-现货 2-预售
                skuId: skuID,
                relId: localStorage.getItem('PRODUCT_ID')
            }]
        };

        MYAPP.loadingToast.loadingToastShow('数据加载中');
        $.ajax({
            url: serverUrl + "sku/getStock",
            dataType: "json",
            data: JSON.stringify(postData),
            type: "post",
            success: function (repData) {
                MYAPP.loadingToast.loadingToastHide();

                //repData = that.stockTestData;
                if (repData.result === 0) {
                    that.handlerStock(repData.data[0].num, item);
                }
            },
            error: function (error) {
                MYAPP.loadingToast.loadingToastHide();
                myalert("服务器繁忙，请稍后");
            }
        })
    },

    addBtnRemarkText: function (arr) {
        var list = [];
        var texts = [];

        for (var i = 0; i < arr.length; i++) {
            list.push(arr[i].skuValueIds.split(','));
            texts.push(arr[i].remark);
        }

        for (var t = 0; t < list.length; t++) {
            var el = $('.content_body_item ul li[data-id =' + list[t][list[t].length - 1] + ']');
            var str = el.text();
            el.text(str + (' (' + texts[t] + ')'))
        }
    },

    resetSkuAttrText: function (id) {
        var arr = [];

        for (var i = 0; i < this.skuList.length; i++) {
            if (this.skuList[i].skuValueIds.split(',')[0] === id) {
                arr.push(this.skuList[i]);
            }
        }
    },

    resetData: function () {
        $('.content_header_bottom span').text('库存充足');
    },

    eventBinding: function () {
        var that = this;

        /* $('body')[0].addEventListener('touchmove', function (event) {//body禁止滚动
            if (!that.hasScroll) {
                event.preventDefault();
            }
        }, true);*/


        $('.sku_alert, .close_sku_toast').on('click', function () {
            $('#video').show();
            $('.sku_alert').hide();
            $('.sku_modal_dialog').slideUp();

            if (that.hasShoppingCart) {
                $('.sku_btn').hide();
                $('.footer_tou').show();

                that.resetData();
            } else {
                $('.attr_selected h2').text(that.skuItem.skuValueNames.split(','));
                that.productPrice();
            }
        });

        $('.sku_modal_dialog').on('click', '.content_body_item ul li', function () {//btn点击
            var $this = $(this);

            if (!($this.hasClass('sku_no_stock')) && !($this.hasClass('sku_active_product'))) {
                $this.addClass('sku_active_product').siblings('li').removeClass();

                $('.sku_content_footer div span').text(1);
                that.compareStock($this);
            }
        });
    }
};


function Ajax (options) {
    this.options = options;
    this.init(this.options);
}
Ajax.prototype.init = function (options) {
    MYAPP.loadingToast.loadingToastShow('数据加载中');
    $.ajax({
        url: serverUrl + options.url,
        type: 'post',
        data: JSON.stringify(options.postData),
        dataType: 'json',
        success: function (resData) {
            MYAPP.loadingToast.loadingToastHide();

            options.success(resData);
        },
        error: function (error) {
            MYAPP.loadingToast.loadingToastHide();

            options.error();
        }
    });
};

/*var request = new Ajax({
    url: 'sysacct/getProtocol',
    postData: {
        protocolType: 'FEE_DESC_PROTOCOL'
    },
    success: function (resData) {
        console.log(resData)
    },
    error: function (error) {
        myalert("服务器繁忙，请稍后重试", 5000);
    }
});*/

//会员绑定手机号
MYAPP.codeVerify = {
    phoneNumber: null,   //手机号authCode
    verifyCode: null,    //验证码
    verifyWay: null,     //验证方式 0 短信验证 1语音验证
    time: 120,            //倒计时
    clickStatus: true,  //是否可以点击 true 可以点击

    init: function () {
        this.eventBinding();
    },

    verifyRule: function () {
        this.phoneNumber = $('.member_phone_number').val().trim();
        this.verifyCode = $('.member_verify_code').val().trim();

        if (this.phoneNumber === '') {
            MYAPP.loadingToast.toastAnomaly(2000, '手机号码不能为空');
        } else if (this.phoneNumber.length !== 11) {
            MYAPP.loadingToast.toastAnomaly(2000, '手机号码为11位');
        } else if (this.verifyCode === '') {
            MYAPP.loadingToast.toastAnomaly(2000, '验证码不能为空');
        } else {
            this.bindPhoneNumber();
        }
    },

    bindPhoneNumber: function () {
        var that = this;
        var postData = {
            CODE: this.verifyCode,
            CODE_FLAG: this.verifyWay,
            CON_ID: localStorage.getItem('CON_ID'),
            MOBILE: this.phoneNumber
        };

        MYAPP.loadingToast.loadingToastShow('数据加载中');
        $.ajax({
            url: serverUrl + 'customer/update',
            type: 'post',
            data: JSON.stringify(postData),
            dataType: 'json',
            success: function (repData) {
                MYAPP.loadingToast.loadingToastHide();

                if (repData.result === -1) {
                    MYAPP.loadingToast.toastAnomaly(4000, repData.errorData);
                } else if (repData.result === 0) {
                    MYAPP.loadingToast.toastAnomaly(4000, '验证成功');

                    $('.dialog_container, .dialog_content').hide();
                    localStorage.setItem('MOBILE', that.phoneNumber);
                    var time = setTimeout(function () {
                        clearTimeout(time);
                        time = null;

                        window.location.href = chainedPath;
                    }, 1000);
                }
            },
            error: function () {
                MYAPP.loadingToast.loadingToastHide();
                myalert("服务器繁忙，请稍后");
            }
        })
    },

    countDown: function () {
        var that = this;
        var el = $('.dialog_content_form_middle span');

        that.clickStatus = false;
        var timer = setInterval(function () {
            that.time -= 1;
            el.text('等待 (' + that.time + ')');

            if (that.time === 0) {
                clearInterval(timer);

                timer = null;
                that.verifyWay === '0' ?  el.text('获取短信验证码') : el.text('获取语音验证码');
                that.time = 120;
                that.clickStatus = true;
            }
        }, 1000)
    },

    getVerifyCode: function () {
        var that = this;
        var postData = {
            SYS_ACCOUNT: localStorage.getItem("SYS_ACCOUNT"),
            CON_ID: localStorage.getItem('CON_ID'),
            PHONE_NUMBER: this.phoneNumber,
            OPER_TYPE: 'BAND',
            FLAG: this.verifyWay
        };

        MYAPP.loadingToast.loadingToastShow('数据加载中');
        $.ajax({
            url: serverUrl + 'identifycode/sendCode',
            type: 'post',
            data: JSON.stringify(postData),
            dataType: 'json',
            success: function (repData) {
                MYAPP.loadingToast.loadingToastHide();

                if (repData.result === -1) {
                    MYAPP.loadingToast.toastAnomaly(4000, repData.errorData);
                } else if (repData.result === 0) {
                    that.countDown();
                    
                    that.handlerData(repData);
                }
            },
            error: function () {
                MYAPP.loadingToast.loadingToastHide();
                myalert("服务器繁忙，请稍后");
            }
        })
    },

    handlerData: function (repData) {
        if (repData.data.mins !== '') {
            MYAPP.loadingToast.toastAnomaly(5000, '最后一次发送的验证码仍然有效，请在'+ repData.data.mins + '分钟后再获取');
        } else {
            MYAPP.loadingToast.toastAnomaly(4000, '发送成功，请注意查收');
        }
    },

    eventBinding: function () {
        var that = this;

        $('.dialog_container').on('click', function () {
            $('.dialog_container, .dialog_content').hide();
            $('.dialog_content input').val('');
        });

        $('.change_verify_way').on('click', function () {
            var el = $('.dialog_content_form_middle span');
            var status = el.attr('verifyway');

            if (that.clickStatus) {
                if (status === '0') {
                    $('.change_verify_way').text('切换短信验证码');
                    el.text('获取语音验证码');
                    el.attr('verifyway', '1');
                } else if (status === '1'){
                    $('.change_verify_way').text('切换语音验证码');
                    el.text('获取短信验证码');
                    el.attr('verifyway', '0');
                }
            }
        });

        $('.dialog_content_form_middle span').on('click', function () {//点击获取验证码
            var $this = $(this);

            if (that.clickStatus) {
                that.verifyWay = $('.dialog_content_form_middle span').attr('verifyway');
                that.phoneNumber = $('.member_phone_number').val().trim();

                if (that.phoneNumber === '') {
                    MYAPP.loadingToast.toastAnomaly(2000, '手机号码不能为空');
                } else if (that.phoneNumber.length !== 11) {
                    MYAPP.loadingToast.toastAnomaly(2000, '手机号码为11位');
                } else {
                    that.getVerifyCode();
                }
            }
        });

        $('.dialog_content_btn').on('click', function () {//校验验证码
            var $this = $(this);
            var status = $this.attr('hasBindPhoneNumber');

            if (status === 'false') {
                that.verifyRule();
            } else  if (status === 'true'){
                $('.dialog_container, .dialog_content').hide();

                window.location.href = chainedPath;
            }
        });
    }
};





