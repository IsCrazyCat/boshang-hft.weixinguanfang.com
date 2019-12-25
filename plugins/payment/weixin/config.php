<?php

return array(
    'code'=> 'weixin',
    'name' => '微信支付',
    'version' => '1.0',
    'author' => '博商网络',
    'desc' => 'PC端+微信公众号支付',
    'icon' => 'logo.jpg',
    'scene' => 0,  // 使用场景 0 PC+手机 1 手机 2 PC
    'config' => array(
        array('name' => 'appid','label'=>'绑定支付的APPID','type' => 'text',   'value' => 'wx72a72a773e8ff4c5'), // * APPID：绑定支付的APPID（必须配置，开户邮件中可查看）
        array('name' => 'mchid',   'label'=>'商户号', 'type' => 'text',   'value' => '1524282771'), // * MCHID：商户号（必须配置，开户邮件中可查看）
        array('name' => 'key',  'label'=>'商户支付密钥', 'type' => 'text',   'value' => '6504f6f3bfb46c83703838a68da10a7b'), // KEY：商户支付密钥，参考开户邮件设置（必须配置，登录商户平台自行设置）
        array('name' => 'appsecret',  'label'=>'公众帐号secert（仅JSAPI支付的时候需要配置)', 'type' => 'text',   'value' => '379613fa0761c8fb57752aa0d6e2e870'), // 公众帐号secert（仅JSAPI支付的时候需要配置)，
    ),
);