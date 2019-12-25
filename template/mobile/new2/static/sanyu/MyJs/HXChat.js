
var easemobIM = { config: {} };

////必填////
easemobIM.config.tenantId = '12703';//企业id
easemobIM.config.to = 'trgf';//必填, 指定关联对应的im号
easemobIM.config.appKey = 'trgf#trgf';//必填, appKey


////非必填////
easemobIM.config.buttonText = '联系客服';//设置小按钮的文案
easemobIM.config.hide = true;//是否隐藏小的悬浮按钮
easemobIM.config.mobile = /mobile/i.test(navigator.userAgent);//是否做移动端适配
/*easemobIaM.config.dragEnable = true;//是否允许拖拽 
*/
easemobIM.config.dialogWidth = '400px';//聊天窗口宽度,建议宽度不小于400px
easemobIM.config.dialogHeight = '500px';//聊天窗口高度,建议宽度不小于500px
easemobIM.config.defaultAvatar = '/weChatpay/assets/static/img/avatar.png';//默认头像
easemobIM.config.minimum = true;//是否允许窗口最小化，如不允许则默认展开
easemobIM.config.visitorSatisfactionEvaluate = false;//是否允许访客主动发起满意度评价
easemobIM.config.soundReminder = true;//是否启用声音提醒
easemobIM.config.imgView = true;//是否启动图片点击放大功能
easemobIM.config.fixedButtonPosition = {x: '10px', y: '10px'};//悬浮初始位置，坐标以视口右边距和下边距为基准
easemobIM.config.dialogPosition = {x: '10px', y: '10px'};//窗口初始位置，坐标以视口右边距和下边距为基准
easemobIM.config.titleSlide = true;//是否允许收到消息的时候网页title滚动
easemobIM.config.error = function ( error ) { };//错误回调
easemobIM.config.onReceive = function ( from, to, message ) { };//收消息回调
easemobIM.config.authMode = 'token' || 'password';//验证方式
easemobIM.config.user = {
    //可集成自己的用户，如不集成，则使用当前的appkey创建随机访客a
    name: '',//集成时必填
    password: '',//authMode设置为password时必填,与token二选一
    token: ''//authMode设置为token时必填,与password二选一
};
