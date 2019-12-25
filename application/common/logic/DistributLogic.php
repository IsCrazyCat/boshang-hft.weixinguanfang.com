<?php
/**
 * tpshop
 * ============================================================================
 * 版权所有 2015-2027 聊城博商网络科技有限公司，并保留所有权利。
 * 网站地址: http://www.boshang3710.com
 * ----------------------------------------------------------------------------
 * 这不是一个自由软件！您只能在不用于商业目的的前提下对程序代码进行修改和使用 .
 * 不允许对程序代码以任何形式任何目的的再发布。
 * ============================================================================
 * Author: 博商网络
 * Date: 2015-09-09
 * 
 * TPshop 公共逻辑类  将放到Application\Common\Logic\   由于很多模块公用 将不在放到某个单独模下面
 */

namespace app\common\logic;

use think\Model;
//use think\Page;

/**
 * 分销逻辑层
 * Class CatsLogic
 * @package Home\Logic
 */
class DistributLogic //extends Model
{
     public function hello(){
        echo 'function hello(){'; 
     }
     
     /**
      * 生成分销记录
      */
     public function rebate_log($order)
     {       
	    
		if ( $order['pay_status'] == 0 ) {
		   exit;
		}
		$mymap = array('order_id' => $order['order_id']);
		$abccount = 0;
		$abccount =  M('rebate_log')->where($mymap)->count(); // 查询满足要求的总记录数
		if ((int)$abccount >= 1) {
			exit;
		}
	     
         $user = M('users')->where("user_id", $order['user_id'])->find();
                           
         $pattern = tpCache('distribut.pattern'); // 分销模式  
         $first_rate = tpCache('distribut.first_rate'); // 一级比例
         $second_rate = tpCache('distribut.second_rate'); // 二级比例  
         $third_rate = tpCache('distribut.third_rate'); // 三级比例  
		 
		 
		 
		 /*读出此会员的等级分销比例 博商网络*/
		 //$user_level= M('user_level')->where(" level_id = '".$user['level']."' ")->find();
		 $user_level = M('user_level')->where("level_id", (int)$user['level'])->find();
		 if($user_level){
			 
				$first_rate = $user_level['tjrfy']; // 一级比例
				$second_rate = $user_level['ssjfy']; // 二级比例
				$third_rate = $user_level['sssjfy']; // 三级比例
				
				$shichangweihufei_rate = $user_level['shichangweihufei']; // 市场维护费比例
				$lingdaojiang_rate = $user_level['lingdaojiang']; // 领导奖比例
				
		 }
		 
		 /*读出此会员的等级 博商网络*/
		 
         
         //按照商品分成 每件商品的佣金拿出来
         if($pattern  == 0) 
         {
            // 获取所有商品分类 
             $cat_list =  M('goods_category')->getField('id,parent_id,commission_rate');             
             $order_goods = M('order_goods')->master()->where("order_id", $order['order_id'])->select(); // 订单所有商品
             $commission = 0;
             foreach($order_goods as $k => $v)
             {
                    $tmp_commission = 0;
                    $goods = M('goods')->where("goods_id", $v['goods_id'])->find(); // 单个商品的佣金
                    $tmp_commission = $goods['commission'];
                    // 如果商品没有设置分佣,则找他所属分类看是否设置分佣
                    if($tmp_commission == 0)
                    {
                       $commission_rate = $cat_list[$goods['cat_id']]['commission_rate']; // 查看分类分佣比例
                       
                       if($commission_rate == 0) // 如果它没有设置分类则找他老爸分类看看是否设置分佣
                       {
                           // 找出他老爸
                           $parent_id = $cat_list[$goods['cat_id']]['parent_id'];
                           $commission_rate = $cat_list[$parent_id]['commission_rate']; // 查看 老爸分类分佣比例
                       } 
                       if($commission_rate == 0) // 如果它老爸没有设置分类则找他爷爷分类看看是否设置分佣
                       {
                           // 找出他爷爷
                           $grandfather_id = $cat_list[$parent_id]['parent_id'];
                           $commission_rate = $cat_list[$grandfather_id]['commission_rate']; // 查看爷爷分类分佣比例
                       } 
                       
                       $tmp_commission = $v['member_goods_price'] * ($commission_rate / 100); // 这个商品的分佣 =  商品价 诚意商品分类设置的分佣比例
                     }
                                        
                    $tmp_commission = $tmp_commission  * $v['goods_num']; // 单个商品的分佣乘以购买数量                    
                    $commission += $tmp_commission; // 所有商品的累积佣金
             }  
			                       
         }else{
             $order_rate = tpCache('distribut.order_rate'); // 订单分成比例  
             $commission = $order['goods_price'] * ($order_rate / 100); // 订单的商品总额 乘以 订单分成比例
         }
                  
            
			// 如果这笔订单没有分销金额
            if($commission == 0) {return false;}
             

            $first_money = $commission * ($first_rate / 100); // 一级赚到的钱 销售佣金
            $second_money = $commission * ($second_rate / 100); // 二级赚到的钱 市场开拓费
            $thirdmoney = $commission * ($third_rate / 100); // 三级赚到的钱
			
			$shichangweihufei_money = $commission * ($shichangweihufei_rate / 100); // 市场维护费
			$lingdaojiang_money = $commission * ($lingdaojiang_rate / 100); // 领导奖
			
            //  微信消息推送
            $wx_user = M('wx_user')->find();
            $jssdk = new \app\mobile\logic\Jssdk($wx_user['appid'],$wx_user['appsecret']);
			
			
		 $today_time = time();
		 $rebate_log_arr = M('rebate_log')->where(" status = 2  and  is_show = 0 ")->select();
		 foreach($rebate_log_arr as $key => $val)
		 {
			$tmp_user = M('users')->where("user_id", $val['user_id'])->find();	
			$tmp_buy_user = M('users')->where("user_id", $val['buy_user_id'])->find();	
				
			if ( strstr($val['jxmc'],'市场维护费') &&  $tmp_user['level'] >= 3 &&  $tmp_user['sfffyj3'] == 3  ) {
				
					$vv['is_show'] = 1;
					$vv['create_time'] = $today_time;
					$vv['remark'] = " 达到市场维护费补齐条件。 ";
					M("rebate_log")->where("id", $val['id'])->save($vv);	
				
					
					if($tmp_user['oauth']== 'weixin')
					{
						$wx_content = "【市场维护费 补齐】您的 ".$var['level']." 级代理".$tmp_buy_user['nickname']."(".$val['buy_user_id']."):订单".$val['order_sn']."如果交易成功，您将获得 ￥".$val['money']."奖励 !";
						$jssdk->push_msg($tmp_user['openid'],$wx_content);
					}
					
			} 
			
			if ( strstr($val['jxmc'],'领导奖')  && $tmp_user['level'] == 4   ) { // && $tmp_user['sfffyj4'] == 4 
				
					$vv['is_show'] = 1;
					$vv['create_time'] = $today_time;
					$vv['remark'] = " 达到领导奖补齐条件P。 ";
					M("rebate_log")->where("id", $val['id'])->save($vv);	
				
					
					if($tmp_user['oauth']== 'weixin')
					{
						$wx_content = "【领导奖 补齐】您的 ".$var['level']." 级代理".$tmp_buy_user['nickname']."(".$val['buy_user_id']."):订单".$var['order_sn']."如果交易成功，您将获得 ￥".$var['money']."奖励 !";
						$jssdk->push_msg($tmp_user['openid'],$wx_content);
					}
					
			}				
													
		 }
			
			
            
			$count1 = 0;
		    $count1 = M('order')->where("user_id='".$order['user_id']."' AND pay_status=1 and order_status not in (3,5)")->count();
			
			
			if( $count1 > 1 ) {
				
				$my_user_id_1 = $order['user_id'];
				$my_money_1 = $first_money;	
				$my_jxmc = '('.$count1.'次)';
				$my_level = 0;
				$my_user_id_1 = $user['first_leader'];
				$my_wx_content = '您';
				
				$data = array(             
				'user_id' => $order['user_id'],
				'buy_user_id'=>$order['user_id'],
				'nickname'=>$user['nickname'],
				'order_sn' => $order['order_sn'],
				'order_id' => $order['order_id'],
				'goods_price' => $order['goods_price'],
				'money' => $first_money,
				'level' => 0,
				'create_time' => time(), 
				'jxmc' => "销售佣金".$my_jxmc,
				'status' => 1,
				'buy_user_level_name' => $user_level['level_name'],
				'user_level_name' => $user_level['level_name'],
				);
				M('rebate_log')->add($data);
				
				
				if($user['oauth']== 'weixin')
				{
					$wx_content = "【销售佣金】您,下了一笔订单:{$order['order_sn']} 如果交易成功您将获得 ￥".sprintf("%.2f", $first_money)."奖励 !";
					$jssdk->push_msg($user['openid'],$wx_content);
				} 

			}			
			
			
			$user_tjr = M('users')->where("user_id", (int)$user['first_leader'])->find();
			$user_level_1 = M('user_level')->where("level_id", (int)$user_tjr['level'])->find();
			if($user_level_1['level_id']>1){
				
					$first_money_1 = $commission * ($user_level_1['tjrfy'] / 100); // (一级)销售佣金的钱
					$second_money_1 = $commission * ($user_level_1['ssjfy'] / 100); // (二级)市场开拓费的钱
					$shichangweihufei_money_1 = $commission * ($user_level_1['shichangweihufei'] / 100); // 市场维护费
					$lingdaojiang_money_1 = $commission * ($user_level_1['lingdaojiang'] / 100); // 领导奖
					
					$my_jxmc = '';
					$my_wx_content = '';
					
					 
					if ( (int)$count1 <= 1 ) {
						$my_user_id_1 = $user['first_leader'];
						$my_money_1 = $first_money_1;	
						$my_level = 1;
						$my_jxmc = '(1次)';
						$my_wx_content = '您的一级代理 '. $user['nickname'];
						
						$data = array(             
						'user_id' => $user['first_leader'],
						'buy_user_id' => $order['user_id'],
						'nickname'=> $user['nickname'],
						'order_sn' => $order['order_sn'],
						'order_id' => $order['order_id'],
						'goods_price' => $order['goods_price'],
						'money' => $first_money_1,
						'level' => 1,
						'create_time' => time(), 
						'jxmc' => "销售佣金(1次)",
						'status' => 1,
						'buy_user_level_name' => $user_level['level_name'],
						'user_level_name' => $user_level_1['level_name'],
						);
						M('rebate_log')->add($data);
						
						// 微信推送消息
						
						if($user_tjr['oauth']== 'weixin')
						{
							$wx_content = "【销售佣金】您的一级代理 ". $user['nickname'] .",下了一笔订单:{$order['order_sn']} 如果交易成功您将获得 ￥".sprintf("%.2f", $first_money_1)."奖励 !";
							$jssdk->push_msg($user_tjr['openid'],$wx_content);
						} 
						
					} 

					 
						if ( $count1>1 ) {
										
								$my_user_id_2 = $user['first_leader'];
								$my_money_2 = $second_money_1;
								$my_jxmc_2 = '('.$count1.'次)';
								$my_level_2 = 1;
								
								$data = array(
									'user_id' =>$user['first_leader'],
									'buy_user_id'=>$order['user_id'],
									'nickname'=>$user['nickname'],
									'order_sn' => $order['order_sn'],
									'order_id' => $order['order_id'],
									'goods_price' => $order['goods_price'],
									'money' => $second_money_1,
									'level' => $my_level_2,
									'create_time' => time(),
									'jxmc' => "市场开拓费".'('.$count1.'次)',  
									'status' => 1,  
									'buy_user_level_name' => $user_level['level_name'],
							        'user_level_name' => $user_level_1['level_name'],        
								);                  
								M('rebate_log')->add($data); 
								// 微信推送消息
								
								if($user_tjr['oauth']== 'weixin')
								{
									$wx_content = "【市场开拓费】您的一级代理 ". $user['nickname'] .",下了一笔订单:{$order['order_sn']} 如果交易成功您将获得 ￥".sprintf("%.2f", $second_money_1)."奖励 !";
									$jssdk->push_msg($user_tjr['openid'],$wx_content);
								}
						}
						
						if ( $count1 > 1 ) {
								//市场维护费
								if ( ($user_tjr['level'] >= 3)&&($user_tjr['sfffyj3'] == 3) ) { 
								     
									 
									 
									 
									 
									 if  ( $shichangweihufei_money_1 >= 0.01) 
									 {                  
										$data = array(
											'user_id' =>$user['first_leader'],
											'buy_user_id'=>$order['user_id'],
											'nickname'=>$user['nickname'],
											'order_sn' => $order['order_sn'],
											'order_id' => $order['order_id'],
											'goods_price' => $order['goods_price'],
											'money' =>$shichangweihufei_money_1,
											'level' => 1,
											'create_time' => time(), 
											'jxmc' => "市场维护费"."(".$count1."次)",
											'status' => 1,
											'buy_user_level_name' => $user_level['level_name'],
											'user_level_name' => $user_level_1['level_name'],
											'is_show' => 1,
		
										);                  
										M('rebate_log')->add($data);  
										
										// 微信推送消息
										
										if($user_tjr['oauth']== 'weixin')
										{
											$wx_content = "【市场维护费】您的一级代理 ". $user['nickname'] .",下了一笔订单:".$order['order_sn']." 如果交易成功您将获得 ￥".sprintf("%.2f", $shichangweihufei_money_1)."奖励 !";
											
											$jssdk->push_msg($user_tjr['openid'],$wx_content);
										} 
									 }	
									 
								} else {
									
									 $my_shichangweihufei_money_1 = $commission * (8 / 100); // 市场维护费
									 if  ( $my_shichangweihufei_money_1 >= 0.01) 
									 {                  
										$data = array(
											'user_id' =>$user['first_leader'],
											'buy_user_id'=>$order['user_id'],
											'nickname'=>$user['nickname'],
											'order_sn' => $order['order_sn'],
											'order_id' => $order['order_id'],
											'goods_price' => $order['goods_price'],
											'money' =>$my_shichangweihufei_money_1,
											'level' => 1,
											'create_time' => time(), 
											'jxmc' => "市场维护费 补齐"."(".$count1."次)",
											'status' => 1,
											'buy_user_level_name' => $user_level['level_name'],
											'user_level_name' => $user_level_1['level_name'],
											'is_show' => 0, //暂不显示
										);                  
										M('rebate_log')->add($data);  
										 
									 }	
									  
										
								}
								//领导奖
								if  ($user_tjr['level'] == 4)  { //&&($user_tjr['sfffyj4'] == 4)
									
																	
									
										 
										 if  ($lingdaojiang_money_1 >= 0.01) 
										 {  
												$data = array(
												'user_id' =>$user['first_leader'],
												'buy_user_id'=>$order['user_id'],
												'nickname'=>$user['nickname'],
												'order_sn' => $order['order_sn'],
												'order_id' => $order['order_id'],
												'goods_price' => $order['goods_price'],
												'money' =>$lingdaojiang_money_1,
												'level' => 1,
												'create_time' => time(), 
												'jxmc' => "领导奖"."(".$count1."次)",
												'status' => 1,
												'buy_user_level_name' => $user_level['level_name'],
												'user_level_name' => $user_level_1['level_name'],
											    );                  
											M('rebate_log')->add($data);  
											
											if($user_tjr['oauth']== 'weixin')
											{
												$wx_content = "【领导奖】您的一级代理 ". $user['nickname'] .",下了一笔订单:".$order['order_sn']." 如果交易成功您将获得 ￥".sprintf("%.2f", $lingdaojiang_money_1)."奖励 !";
												$jssdk->push_msg($user_tjr['openid'],$wx_content);
											} 
										}
									
								} else {
									
									    $my_lingdaojiang_money_1 = $commission * (9 / 100); // 领导奖
										if  ($my_lingdaojiang_money_1 >= 0.01) 
										{  
															
												$data = array(
												'user_id' =>$user['first_leader'],
												'buy_user_id'=>$order['user_id'],
												'nickname'=>$user['nickname'],
												'order_sn' => $order['order_sn'],
												'order_id' => $order['order_id'],
												'goods_price' => $order['goods_price'],
												'money' =>$my_lingdaojiang_money_1,
												'level' => 1,
												'create_time' => time(), 
												'jxmc' => "领导奖 补齐"."(".$count1."次)",
												'status' => 1,
												'buy_user_level_name' => $user_level['level_name'],
												'user_level_name' => $user_level_1['level_name'],
												'is_show' => 0, //暂不显示
											    );                  
											    M('rebate_log')->add($data);  
											 
										}										
										
										
								}								
						}
						
							
			}
  
		  
/****************************二级分销商*********************************************/						
		  
            // 二级分销商赚 的钱
			
			$user_ssj = M('users')->where("user_id", (int)$user['second_leader'])->find();
			$user_level_2 = M('user_level')->where("level_id", (int)$user_ssj['level'])->find();
			if($user_level_2['level_id']>1){
				
					$first_money_2 = $commission * ($user_level_2['tjrfy'] / 100); // (一级)销售佣金的钱
					$second_money_2 = $commission * ($user_level_2['ssjfy'] / 100); // (二级)市场开拓费的钱
					$shichangweihufei_money_2 = $commission * ($user_level_2['shichangweihufei'] / 100); // 市场维护费
					$lingdaojiang_money_2 = $commission * ($user_level_2['lingdaojiang'] / 100); // 领导奖
					
					if ( ( $count1 <= 1 ) && ( $second_money_2 >= 0.01 ) ) {  // 市场开拓费
							$my_user_id_2 = $user['second_leader'];
							$my_money_2 = $second_money_2;
							$my_jxmc_2 = '(1次)';
							$my_level_2 = 2;
							
							$data = array(
								'user_id' =>$user['second_leader'],
								'buy_user_id'=>$order['user_id'],
								'nickname'=>$user['nickname'],
								'order_sn' => $order['order_sn'],
								'order_id' => $order['order_id'],
								'goods_price' => $order['goods_price'],
								'money' => $second_money_2,
								'level' => 2,
								'create_time' => time(),
								'jxmc' => "市场开拓费".$my_jxmc_2,  
								'status' => 1, 
								 
								'buy_user_level_name' => $user_level['level_name'],
								'user_level_name' => $user_level_2['level_name'],
											 
							);                  
							M('rebate_log')->add($data); 
							
							
							// 微信推送消息
							
							if($user_ssj['oauth']== 'weixin')
							{
								$wx_content = "【市场开拓费】您的二级代理 ". $user['nickname'] .",下了一笔订单:{$order['order_sn']} 如果交易成功您将获得 ￥".sprintf("%.2f", $second_money_2)."奖励 !";
								$jssdk->push_msg($user_ssj['openid'],$wx_content);
							}
							
						} 
					 
					
					    
					if (  $count1 <= 1  ) { 
						//市场维护费
						if ( ($user_ssj['level'] >= 3)&&($user_ssj['sfffyj3'] == 3) ) { 
						
						             					
						     
							 if ( $shichangweihufei_money_2 >= 0.01) 
							 {                  
								$data = array(
									'user_id' =>$user['second_leader'],
									'buy_user_id'=>$order['user_id'],
									'nickname'=>$user['nickname'],
									'order_sn' => $order['order_sn'],
									'order_id' => $order['order_id'],
									'goods_price' => $order['goods_price'],
									'money' =>$shichangweihufei_money_2,
									'level' => 2,
									'create_time' => time(), 
									'jxmc' => "市场维护费"."(".$count1."次)",
									'status' => 1,
									'buy_user_level_name' => $user_level['level_name'],
							        'user_level_name' => $user_level_2['level_name'],
								);                  
								M('rebate_log')->add($data);  
								
								// 微信推送消息
								
								if($user_ssj['oauth']== 'weixin')
								{
									$wx_content = "【市场维护费】您的二级代理 ". $user['nickname'] .",下了一笔订单:{$order['order_sn']} 如果交易成功您将获得 ￥".sprintf("%.2f", $shichangweihufei_money_2)."奖励 !";
									$jssdk->push_msg($user_ssj['openid'],$wx_content);
								} 
							 }	
							 
							 
						} else {
							
							 $my_shichangweihufei_money_2 = $commission * (8 / 100); // 市场维护费
							 if ( $my_shichangweihufei_money_2 >= 0.01) 
							 {                  
								$data = array(
									'user_id' =>$user['second_leader'],
									'buy_user_id'=>$order['user_id'],
									'nickname'=>$user['nickname'],
									'order_sn' => $order['order_sn'],
									'order_id' => $order['order_id'],
									'goods_price' => $order['goods_price'],
									'money' =>$my_shichangweihufei_money_2,
									'level' => 2,
									'create_time' => time(), 
									'jxmc' => "市场维护费 补齐"."(".$count1."次)",
									'status' => 1,
									'buy_user_level_name' => $user_level['level_name'],
							        'user_level_name' => $user_level_2['level_name'],
									'is_show' => 0, //暂不显示

								);                  
								M('rebate_log')->add($data);  
								
							 }	
							
						}	
					}
					
					if (  $count1 <= 1  ) { 
					
						//领导奖
						if  ($user_ssj['level'] == 4)  { //&&($user_ssj['sfffyj4'] == 4)
							
									 							    
							     
							    if  ($lingdaojiang_money_2 >= 0.01){   
									$data = array(
										'user_id' =>$user['second_leader'],
										'buy_user_id'=>$order['user_id'],
										'nickname'=>$user['nickname'],
										'order_sn' => $order['order_sn'],
										'order_id' => $order['order_id'],
										'goods_price' => $order['goods_price'],
										'money' =>$lingdaojiang_money_2,
										'level' => 2,
										'create_time' => time(), 
										'jxmc' => "领导奖"."(".$count1."次)",
										'status' => 1,
										'buy_user_level_name' => $user_level['level_name'],
							            'user_level_name' => $user_level_2['level_name'],
										'is_show' => 1,
										
									);                  
									M('rebate_log')->add($data);  
									
									
									if($user_ssj['oauth']== 'weixin')
									{
										$wx_content = "【领导奖】您的一级代理 ". $user['nickname'] .",下了一笔订单:{$order['order_sn']} 如果交易成功您将获得 ￥".sprintf("%.2f", $lingdaojiang_money_2)."奖励 !";
										$jssdk->push_msg($user_ssj['openid'],$wx_content);
									} 
							    }
							
						} else {
							
					        $my_lingdaojiang_money_2 = $commission * (9 / 100); // 领导奖
							
							if  ($my_lingdaojiang_money_2 >= 0.01){   
									$data = array(
										'user_id' =>$user['second_leader'],
										'buy_user_id'=>$order['user_id'],
										'nickname'=>$user['nickname'],
										'order_sn' => $order['order_sn'],
										'order_id' => $order['order_id'],
										'goods_price' => $order['goods_price'],
										'money' =>$my_lingdaojiang_money_2,
										'level' => 2,
										'create_time' => time(), 
										'jxmc' => "领导奖 补齐"."(".$count1."次)",
										'status' => 1,
										'buy_user_level_name' => $user_level['level_name'],
							            'user_level_name' => $user_level_2['level_name'],
										'is_show' => 0, //暂不显示
									);                  
									M('rebate_log')->add($data);  
							}							
						}
						
					}
					 
			}
		  
		 
          // 三级 分销商赚 的钱.
         /*if($user['third_leader'] > 0 && $thirdmoney >= 0.01)
         {                  
            $data = array(
                'user_id' =>$user['third_leader'],
                'buy_user_id'=>$user['user_id'],
                'nickname'=>$user['nickname'],
                'order_sn' => $order['order_sn'],
                'order_id' => $order['order_id'],
                'goods_price' => $order['goods_price'],
                'money' =>$thirdmoney,
                'level' => 3,
                'create_time' => time(), 
				'jxmc' => "",
            );                  
            M('rebate_log')->add($data);      
            // 微信推送消息
            $tmp_user = M('users')->where("user_id", $user['third_leader'])->find();
            if($tmp_user['oauth']== 'weixin')
            {
                $wx_content = "您的三级代理,下了一笔订单:{$order['order_sn']} 如果交易成功您将获得 ￥".sprintf("%.2f", $thirdmoney)."奖励 !";
                $jssdk->push_msg($tmp_user['openid'],$wx_content);
            }              
            
         }*/
		 
		 
		 
         M('order')->where("order_id", $order['order_id'])->save(array("is_distribut"=>1));  //修改订单为已经分成
 
     }
	 
     /**
      * 自动分成 符合条件的 分成记录
      */
     function auto_confirm(){
         
         $switch = tpCache('distribut.switch');
         if($switch == 0)
             return false;
		
		 $today_time = time();
		 $rebate_log_arr = M('rebate_log')->where(" status = 2  and  is_show = 0 ")->select();
		 foreach($rebate_log_arr as $key => $val)
		 {
			$tmp_user = M('users')->where("user_id", $val['user_id'])->find();	
			$tmp_buy_user = M('users')->where("user_id", $val['buy_user_id'])->find();	
				
			if ( strstr($val['jxmc'],'市场维护费') &&  $tmp_user['level'] >= 3 &&  $tmp_user['sfffyj3'] == 3  ) {
				
					$vv['is_show'] = 1;
					$vv['create_time'] = $today_time;
					$vv['remark'] = " 达到市场维护费补齐条件X。 ";
					$vv['status'] = 3;
                    $vv['confirm_time'] = $today_time;
					M("rebate_log")->where("id", $val['id'])->save($vv);	
				
					my_accountLog($val['user_id'], $val['money'], 0, "来自{$tmp_buy_user['nickname']}（{$val['buy_user_id']}）订单:{$val['order_sn']}分佣",$val['money'],$val['order_id'] ,$val['order_sn'],$delivery['id'],$val['goods_price'],$val['jxmc']);
					
			} 
			
			if ( strstr($val['jxmc'],'领导奖')  && $tmp_user['level'] == 4   ) { // && $tmp_user['sfffyj4'] == 4 
				
					$vv['is_show'] = 1;
					$vv['create_time'] = $today_time;
					$vv['remark'] = " 达到领导奖补齐条件Y。 ";
					$vv['status'] = 3;
                    $vv['confirm_time'] = $today_time;
					M("rebate_log")->where("id", $val['id'])->save($vv);	
				
					my_accountLog($val['user_id'], $val['money'], 0, "来自{$tmp_buy_user['nickname']}（{$val['buy_user_id']}）订单:{$val['order_sn']}分佣",$val['money'],$val['order_id'] ,$val['order_sn'],$delivery['id'],$val['goods_price'],$val['jxmc']);
					
			}				
													
		 }			 
			 
			 
         
       
         $distribut_date = tpCache('distribut.date');
         $distribut_time = $distribut_date * (60 * 60 * 24)-1; // 计算天数 时间戳  多减60秒
         //$rebate_log_arr = M('rebate_log')->where("status = 2 and ($today_time - confirm) >  $distribut_time")->select();
         $rebate_log_arr = M('rebate_log')->where(" status = 2 and  is_show = 1 ")->select();
		 
//		 $wx_user = M('wx_user')->find();
//       $jssdk = new \app\mobile\logic\Jssdk($wx_user['appid'],$wx_user['appsecret']);
		 
		 
		 
         foreach ($rebate_log_arr as $key => $val)
         {
			$tmp_user = M('users')->where("user_id", $val['user_id'])->find();
			$tmp_buy_user = M('users')->where("user_id", $val['buy_user_id'])->find();	
			if ( strlen($val['jxmc'])>0 ) {
				$delivery = M('delivery_doc')->where("order_id", $val['order_id'])->find();
				
				if ( strstr($val['jxmc'],'市场维护费') &&  $tmp_user['level'] >= 3 &&  $tmp_user['sfffyj3'] == 3  ) {
					
					my_accountLog($val['user_id'], $val['money'], 0, "来自{$tmp_buy_user['nickname']}（{$val['buy_user_id']}）订单:{$val['order_sn']}分佣",$val['money'],$val['order_id'] ,$val['order_sn'],$delivery['id'],$val['goods_price'],$val['jxmc']);
				} elseif ( strstr($val['jxmc'],'领导奖')  && $tmp_user['level'] == 4   ) { // && $tmp_user['sfffyj4'] == 4 
					
					my_accountLog($val['user_id'], $val['money'], 0, "来自{$tmp_buy_user['nickname']}（{$val['buy_user_id']}）订单:{$val['order_sn']}分佣",$val['money'],$val['order_id'] ,$val['order_sn'],$delivery['id'],$val['goods_price'],$val['jxmc']);
				} //elseif ( strstr($val['jxmc'],'销售佣金') || strstr($val['jxmc'],'市场开拓费') ) {
					else {
					my_accountLog($val['user_id'], $val['money'], 0, "来自{$tmp_buy_user['nickname']}（{$val['buy_user_id']}）订单:{$val['order_sn']}分佣",$val['money'],$val['order_id'] ,$val['order_sn'],$delivery['id'],$val['goods_price'],$val['jxmc']);
				}
				
				
			}else{
				accountLog($val['user_id'], $val['money'], 0,"来自".$tmp_buy_user['nickname']."（{$val['buy_user_id']}）订单:{$val['order_sn']}分佣",$val['money']);          
			}
                 
             $val['status'] = 3;
             $val['confirm_time'] = $today_time;
			 if ( $distribut_date == '0' ) {
				 $val['remark'] = $val['remark']." 确认收货,自动分成.";
			 } else {
				 $val['remark'] = $val['remark']." 满{$distribut_date}天,自动分成.";
			 }
             
             M("rebate_log")->where("id", $val['id'])->save($val);
         }
     }
}