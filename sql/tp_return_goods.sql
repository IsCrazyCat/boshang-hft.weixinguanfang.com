/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50724
Source Host           : 127.0.0.1:3306
Source Database       : sanyu_weixinguanfang_com

Target Server Type    : MYSQL
Target Server Version : 50724
File Encoding         : 65001

Date: 2019-03-27 19:33:03
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tp_return_goods
-- ----------------------------
DROP TABLE IF EXISTS `tp_return_goods`;
CREATE TABLE `tp_return_goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '退货申请表id自增',
  `rec_id` int(11) NOT NULL DEFAULT '0' COMMENT '订单商品id add by lishibo 20190327',
  `refund_money` decimal(10,0) DEFAULT '0' COMMENT '退还金额 add by libo 20190327',
  `refund_deposit` decimal(10,0) DEFAULT '0' COMMENT '退还余额部分  add by libo 20190327',
  `refund_integral` int(11) DEFAULT '0' COMMENT '应退还积分  add by libo 20190327',
  `describe` text COMMENT '退货问题描述 add by libo 20190327',
  `order_id` int(11) DEFAULT '0' COMMENT '订单id',
  `order_sn` varchar(1024) DEFAULT '' COMMENT '订单编号',
  `goods_id` int(11) DEFAULT '0' COMMENT '商品id',
  `type` tinyint(1) DEFAULT '0' COMMENT '0退货1换货',
  `reason` varchar(1024) DEFAULT '' COMMENT '退换货原因',
  `imgs` varchar(512) DEFAULT '' COMMENT '拍照图片路径',
  `addtime` int(11) DEFAULT '0' COMMENT '申请时间',
  `status` tinyint(1) DEFAULT '0' COMMENT '-2用户取消-1审核不通过0待审核1通过2已发货3已完成',
  `remark` varchar(1024) DEFAULT '' COMMENT '客服备注',
  `user_id` int(11) DEFAULT '0' COMMENT '用户id',
  `spec_key` varchar(64) DEFAULT '' COMMENT '商品规格key 对应tp_spec_goods_price 表',
  `seller_delivery` text COMMENT '换货服务，卖家重新发货信息',
  PRIMARY KEY (`id`,`rec_id`)
) ENGINE=MyISAM AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tp_return_goods
-- ----------------------------
INSERT INTO `tp_return_goods` VALUES ('30', '736', null, null, null, null, '729', '201903270931071954', '26', '1', '', '/public/upload/return_goods/20190327/9a7bb1c1d8d5fd373b4159bc0cd27317.jpg,/public/upload/return_goods/20190327/966b6ed8ce6f9acc870a04caaa98050a.jpg', '1553668104', '3', '后台处理备注，审核通过', '498', '1', null);
INSERT INTO `tp_return_goods` VALUES ('31', '739', null, null, null, '我觉的不好用，请换一把试试！！！', '732', '201903271056113736', '26', '1', '', '/public/upload/return_goods/20190327/4c0d0e24c127439700d829fb7298035c.jpg,/public/upload/return_goods/20190327/252f877bf3234774560b5655cb5070eb.jpg', '1553670809', '3', '处理备注', '498', '1', null);
INSERT INTO `tp_return_goods` VALUES ('32', '738', '0', '79', '0', '哈哈哈哈哈哈哈哈', '731', '201903271037495873', '26', '1', '', '/public/upload/return_goods/20190327/971b7cf557f3dcb1960f22396712f863.jpg', '1553671960', '3', '退货审核通过', '498', '1', null);
