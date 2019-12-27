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
use think\Log;
//use think\Page;

/**
 * 分销逻辑层
 * Class CatsLogic
 * @package Home\Logic
 */
class DistributLogicSY //extends Model
{
     public function hello(){
        echo 'function hello(){'; 
     }

    /**
     * 渠道考核机制
     * @auto lishibo
     */
    public function AssessmentOfChannelsNew()
    {
        Log::write("鸿福堂渠道（月）考核".date('Y-m-d H:i:s'),true);
        /**非首次晋级，主管级别以上**/
        $userList = M('users')->where(" level >= 3 and is_first_level = 1 ")->order('user_id')->select();

        // start if-------------------------------
        if (is_array($userList)) {
            foreach ($userList as $k => $val) {
                $last_num = $val['last_num'];
                $new_flag = false;
                //当前级别
                $currLevel = $val['level'];
                $where_u =  " (first_leader = ".(int)$val['user_id']." or second_leader = ".(int)$val['user_id']." or third_leader = ".(int)$val['user_id']." ) and level >1";
                $where_ud = " first_leader = ".(int)$val['user_id']." and level>1";
                $underling_number =  M('users')->where($where_u)->count();
                $underling_direct_number =  M('users')->where($where_ud)->count();

                $is_reduced_level = 0;

                if(empty($last_num) || $last_num <= 0){ //不判断新增用户
                    $new_flag = true;
                    $last_num = $underling_number;//有效
                    M('users')->where(array('user_id' =>  $val['user_id']))->save(array('last_num' => $last_num));
                }else{  //判断全部条件

                    $numbs = $this->checkNewUndelineNumber($currLevel);
                    $curr_new_nuderlines = $underling_number-$last_num;//当次总数减去上次总数之差（有效）

                    if($curr_new_nuderlines < $numbs){//当前新增小于标准数据
                        if($currLevel>=3){ //最低降到主管级别
                            if($currLevel>3) {
                                $clevel = $currLevel - 1;
                            }else{
                                $clevel = $currLevel;
                            }
                            $is_reduced_level = 1;//被减级别，不参与日常紧急标识 20190226
                            M('users')->where(array('user_id' =>  $val['user_id']))->save(array('level' => $clevel,'is_reduced_level' => $is_reduced_level,'last_num'=>$underling_number));
                        }

                    }else{//符合标准
                        $tmpLevel_udldn = $this->checkLevelUndelineDirectNumber($underling_direct_number);
                        $tmpLevel_udln = $this->checkLevelUndelineNumber($underling_number);
                        if($tmpLevel_udldn < $tmpLevel_udln){//等级对称
                            $tmpLevel = $tmpLevel_udldn;
                        }elseif ($tmpLevel_udldn > $tmpLevel_udln ){
                            $tmpLevel = $tmpLevel_udln;
                        }else{
                            $tmpLevel = $tmpLevel_udldn;
                        }

                        if($tmpLevel>0 && $currLevel<$tmpLevel){//正常晋升条件/恢复原级别/更高
                            $is_reduced_level = 0;//解锁晋级标识 20190226
                            //$numbs = $this->checkNewUndelineNumber($tmpLevel);
                            M('users')->where(array('user_id' =>  $val['user_id']))->save(array('level' => $tmpLevel,'is_reduced_level' => $is_reduced_level,'last_num'=>$underling_number));
                        }

                    }

                }

            }

        }
        // end if-------------------------------

        /**筛选首次晋级用户，变更标识以便次月正常考核**/
        $userFList = M('users')->where(" level >= 3 and ( is_first_level is NULL or is_first_level=0 ) ")->order('user_id')->select();
        if (is_array($userFList)) {
            // end if-------------------------------
            foreach ($userFList as $k => $val) {
                $last_num = $val['last_num'];
                $where_u_f =  " (first_leader = ".(int)$val['user_id']." or second_leader = ".(int)$val['user_id']." or third_leader = ".(int)$val['user_id']." ) and level >1";
                $underling_number =  M('users')->where($where_u_f)->count();
                $is_reduced_level = 0;
                if(empty($last_num) || $last_num <= 0){
                    $last_num = $underling_number;
                    M('users')->where(array('user_id' =>  $val['user_id']))->save(array('last_num' => $last_num ,'is_first_level'=>1));
                }
            }
            // end if-------------------------------
        }
    }


    public function AssessmentOfChannels()
    {
        Log::write("鸿福堂渠道（月）考核".date('Y-m-d H:i:s'),true);
        /**非首次晋级，主管级别以上**/
        $userList = M('users')->where(" level >= 3 and is_first_level = 1 ")->order('user_id')->select();

        // start if-------------------------------
        if (is_array($userList)) {
            foreach ($userList as $k => $val) {
                $last_num = $val['last_num'];
                $new_flag = false;
                //当前级别
                $currLevel = $val['level'];
                //直推人数
                $underling_direct_number = $val['underling_direct_number'];
                //三级下线人数
                $underling_number = $val['underling_number'];

                $is_reduced_level = 0;

                if(empty($last_num) || $last_num <= 0){ //不判断新增用户
                    $new_flag = true;
                    $last_num = $underling_number;
                    M('users')->where(array('user_id' =>  $val['user_id']))->save(array('last_num' => $last_num));
                }else{  //判断全部条件

                    $numbs = $this->checkNewUndelineNumber($currLevel);
                    $curr_new_nuderlines = $underling_number-$last_num;//当次总数减去上次总数之差

                    if($curr_new_nuderlines < $numbs){//当前新增小于标准数据
                        if($currLevel>=3){ //最低降到主管级别
                            if($currLevel>3) {
                                $clevel = $currLevel - 1;
                            }else{
                                $clevel = $currLevel;
                            }
                            $is_reduced_level = 1;//被减级别，不参与日常紧急标识 20190226
                            M('users')->where(array('user_id' =>  $val['user_id']))->save(array('level' => $clevel,'is_reduced_level' => $is_reduced_level,'last_num'=>$underling_number));
                        }

                    }else{//符合标准
                        $tmpLevel_udldn = $this->checkLevelUndelineDirectNumber($underling_direct_number);
                        $tmpLevel_udln = $this->checkLevelUndelineNumber($underling_number);
                        if($tmpLevel_udldn < $tmpLevel_udln){//等级对称
                            $tmpLevel = $tmpLevel_udldn;
                        }elseif ($tmpLevel_udldn > $tmpLevel_udln ){
                            $tmpLevel = $tmpLevel_udln;
                        }else{
                            $tmpLevel = $tmpLevel_udldn;
                        }

                        if($tmpLevel>0 && $currLevel<$tmpLevel){//正常晋升条件/恢复原级别/更高
                            $is_reduced_level = 0;//解锁晋级标识 20190226
                            //$numbs = $this->checkNewUndelineNumber($tmpLevel);
                            M('users')->where(array('user_id' =>  $val['user_id']))->save(array('level' => $tmpLevel,'is_reduced_level' => $is_reduced_level,'last_num'=>$underling_number));
                        }

                    }

                }

            }

        }
        // end if-------------------------------

        /**筛选首次晋级用户，变更标识以便次月正常考核**/
        $userFList = M('users')->where(" level >= 3 and ( is_first_level is NULL or is_first_level=0 ) ")->order('user_id')->select();
        if (is_array($userFList)) {
            // end if-------------------------------
            foreach ($userFList as $k => $val) {
                $last_num = $val['last_num'];
                $underling_number = $val['underling_number'];
                $is_reduced_level = 0;
                if(empty($last_num) || $last_num <= 0){
                    $last_num = $underling_number;
                    M('users')->where(array('user_id' =>  $val['user_id']))->save(array('last_num' => $last_num ,'is_first_level'=>1));
                }
            }
            // end if-------------------------------
        }
    }

    /**
     *  根据当前等级核算新增标准
     * @autho lishibo 20190226
     * @param $level
     * @return int
     */
    function checkNewUndelineNumber($level){
        $numbs = 0;
        if($level == 3 ){//主管
            $numbs = 2;
        }elseif($level == 4){//经理
            $numbs = 8 ;
        }elseif($level == 5){//总监
            $numbs=15;
        }elseif($level == 6){//合伙人
            $numbs=100;
        }
        return $numbs;
    }



    /**
     * 检查累计人数对应的等级
     * @author  lishibo 20190215
     * @param $underling_number
     * @return int
     */
    function checkLevelUndelineNumber($underling_number){
        $tmpLevel = 0;
        if(10 <= $underling_number && $underling_number < 50){//主管
            $tmpLevel=3;
        }elseif(50 <= $underling_number && $underling_number < 400){//经理
            $tmpLevel=4;
        }elseif(400 <= $underling_number && $underling_number < 1500){//总监
            $tmpLevel=5;
        }elseif(1500 <= $underling_number){//合伙人
            $tmpLevel=6;
        }
        return $tmpLevel;
    }

    /**
     * 检查直推人数对应的等级
     * @author  lishibo 20190215
     * @param $underling_direct_number
     * @return int
     */
    function checkLevelUndelineDirectNumber ($underling_direct_number){
        $tmpLevel = 0;
        if(5 <= $underling_direct_number && $underling_direct_number < 20){//主管
            $tmpLevel=3;
        }elseif(20 <= $underling_direct_number && $underling_direct_number < 80){//经理
            $tmpLevel=4;
        }elseif(80 <= $underling_direct_number && $underling_direct_number < 200){//总监
            $tmpLevel=5;
        }elseif(200 <= $underling_direct_number){//合伙人
            $tmpLevel=6;
        }
        return $tmpLevel;
    }


    /**
     * @author  lishibo 2019-02-13
     * @param $user 消费者
     * @param $tmp_user 分成者
     * @param $order 订单
     * @param $money 分成（一级奖励 or 渠道奖励）
     * @param $level 获取分成得目标级别
     * @param $jxmc  奖项名称
     * @param $jssdk weixin api
     */
    public function rebate_log_business($user,$tmp_user,$order,$money,$level,$jxmc,$jssdk,$buy_user_level,$user_level){

        $content = "您的".$level."级代理,下了一笔订单:{$order['order_sn']} 如果交易成功您将获得 ￥". $money."奖励 !";
        $data = array(
            'user_id' =>$tmp_user['user_id'],
            'buy_user_id'=>$user['user_id'],
            'nickname'=>$user['nickname'],
            'order_sn' => $order['order_sn'],
            'order_id' => $order['order_id'],
            'goods_price' => $order['goods_price'],
            'money' =>$money,
            'level' => $level,
            'create_time' => time(),
            'remark' => $content,
            'jxmc' => $jxmc,
            'status' => 1,//0未付款,1已付款, 2等待分成(已收货) 3已分成, 4已取消
            'buy_user_level_name' => $buy_user_level['level_name'],
            'user_level_name' => $user_level['level_name'],
        );

        M('rebate_log')->add($data);

        // 微信推送消息
        //$tmp_user = M('users')->where("user_id", $user['third_leader'])->find();
        if($tmp_user['oauth']== 'weixin')
        {
            $jssdk->push_msg($tmp_user['openid'],$content);
        }
    }

    /**
     * @author  lishibo 2019-02-13
     *  分销记录
     */
     public function rebate_log($order){

		if ( $order['pay_status'] == 0 ) {
		   return;
		}
		$mymap = array('order_id' => $order['order_id']);
		$abccount = 0;
		$abccount =  M('rebate_log')->where($mymap)->count(); // 查询满足要求的总记录数
		if ((int)$abccount >= 1) {
			return;
		}
	     
         $user = M('users')->where("user_id", $order['user_id'])->find();
         $pattern = tpCache('distribut.pattern'); // 分销模式

        /*查看购买者等级  区分渠道分成体系*/
        $buy_user_level = M('user_level')->where("level_id", (int)$user['level'])->find();

        //  微信消息推送
        $wx_user = M('wx_user')->find();
        $jssdk = new \app\mobile\logic\Jssdk($wx_user['appid'],$wx_user['appsecret']);

        $today_time = time();
       // $rebate_log_arr = M('rebate_log')->where(" status = 2  and  is_show = 0 ")->select();
            //查找三级关系，判断有无上级
            $first_leader_id=(int)$user['first_leader'];
            $tmp_level=0;//上线等级

            //直推人
            if($first_leader_id>0){

                 $first_leader = M('users')->where("user_id", $first_leader_id)->find();
                 $first_leader_level = (int)$first_leader['level'];
                 $user_level =  M('user_level')->where("level_id", $first_leader_level)->find();
                 $tmp_level = $first_leader_level;

                 $order_goods = D('order_goods')->where('order_id',$order['order_id'])->select();
                 $count = 0;//分成份数 每一贴分成一次
                 foreach($order_goods as $key=>$val){
                     $count += $val['goods_num'];
                 }
                 //直推人（一级奖励）
                 if($first_leader_level == 6 ){
                     $this->rebate_log_business($user,$first_leader,$order,2*$count,1,'一级奖励',$jssdk,$buy_user_level,$user_level);
                 }
                 //上级合伙人和平级合伙人
                $up_id = $first_leader_id;
                $count = 0;
                for($i=0;;$i++){
                    $up_user = M('users')->where("user_id", $up_id)->find();
                    if(empty($up_user)){
                        break;
                    }
                    $up_id = $up_user['first_leader'];
                    if($count == 0){
                        if($up_user['level']==7){
                            $up_level =  M('user_level')->where("level_id", $up_user['level'])->find();
                            $this->rebate_log_business($user,$up_user,$order,5*$count,1,'一级合伙人奖励',$jssdk,$buy_user_level,$up_level);
                            $count++;
                        }
                    }else if($count == 1){
                        if($up_user['level']==7){
                            $up_level =  M('user_level')->where("level_id", $up_user['level'])->find();
                            $this->rebate_log_business($user,$up_user,$order,3*$count,1,'二级合伙人奖励',$jssdk,$buy_user_level,$up_level);
                            $count++;
                            break;
                        }

                    }
                }
             }

         M('order')->where("order_id", $order['order_id'])->save(array("is_distribut"=>1));  //修改订单为已经分成
     }

	 
     /**
      * 分销关系之间进行分成
      * 确认收货后判断分成条件
      * @author  lishibo
      * 20190214
      */
     function confirm_justs($order_id)
     {

         $switch = tpCache('distribut.switch');
         if ($switch == 0) {
             return false;
         }

         //当前订单待分成记录
         $where['order_id'] = $order_id;
         $where['status'] = 2;
         $rebate_log_arr = M('rebate_log')->where($where)->select();

         //判断分成条件
         $today_time = time();
         $distribut_date = tpCache('distribut.date');
//         if ($distribut_date == '0') {
             //------------
             foreach ($rebate_log_arr as $key => $val) {
                 $tmp_user = M('users')->where("user_id", $val['user_id'])->find();
                 $tmp_buy_user = M('users')->where("user_id", $val['buy_user_id'])->find();

                 if (strlen($val['jxmc']) > 0) {

                     $vv['is_show'] = 1;
                     $vv['create_time'] = $today_time;
                     $vv['remark'] = "达到" . $val['jxmc'] . "条件,确认收货,自动分成.";
                     $vv['status'] = 3;
                     $vv['confirm_time'] = $today_time;
                     M("rebate_log")->where("id", $val['id'])->save($vv);

                     $delivery = M('delivery_doc')->where("order_id", $val['order_id'])->find();
                     my_accountLog($val['user_id'], $val['money'], 0, "来自{$tmp_buy_user['nickname']}（{$val['buy_user_id']}）订单:{$val['order_sn']}分佣", $val['money'], $val['order_id'], $val['order_sn'], $delivery['id'], $val['goods_price'], $val['jxmc']);

                 } else {
                     accountLog($val['user_id'], $val['money'], 0, "来自" . $tmp_buy_user['nickname'] . "（{$val['buy_user_id']}）订单:{$val['order_sn']}分佣", $val['money']);
                 }
             }
             //------------

//         } else {//待分成
//
//             foreach ($rebate_log_arr as $key => $val) {
//                 $tmp_user = M('users')->where("user_id", $val['user_id'])->find();
//                 $tmp_buy_user = M('users')->where("user_id", $val['buy_user_id'])->find();
//                 if (strlen($val['jxmc']) > 0) {
//                     $vv['is_show'] = 1;
//                     $vv['create_time'] = $today_time;
//                     $vv['remark'] = $val['jxmc'] . " 自动分成{$distribut_date}天等待期,期满后平台自动分成.";
//                     //$vv['status'] = 3;
//                     //$vv['confirm_time'] = $today_time;
//                     M("rebate_log")->where("id", $val['id'])->save($vv);
//                 }
//             }
//
//         }
     }


    /**
     * 筛选符合条件的分成记录进行分成
     * @author  lishibo
     * 20190214
     */
     function auto_confirm(){

         echo "CONSOLE: win计划任务自动分成".date('Y-m-d H:i:s')."\r\n";
         Log::write("LOG: win计划任务自动分成".date('Y-m-d H:i:s'),true);

         $switch = tpCache('distribut.switch');
         if($switch == 0){ return false;}
         $today_time = time();
         $distribut_date = tpCache('distribut.date');
         $distribut_time = $distribut_date * (60 * 60 * 24)-1; // 计算天数 时间戳  多减60秒
         $rebate_log_arr = M('rebate_log')->where("status = 2 and ($today_time - confirm) >  $distribut_time")->select();

         foreach ($rebate_log_arr as $key => $val)
         {
			$tmp_user = M('users')->where("user_id", $val['user_id'])->find();
			$tmp_buy_user = M('users')->where("user_id", $val['buy_user_id'])->find();

			if ( strlen($val['jxmc'])>0 ) {

                   $vv['is_show'] = 1;
                   $vv['create_time'] = $today_time;
                   $vv['remark'] = "达到".$val['jxmc']."条件,确认收货,自动分成.";
                   $vv['status'] = 3;
                   $vv['confirm_time'] = $today_time;
                   M("rebate_log")->where("id", $val['id'])->save($vv);

                   $delivery = M('delivery_doc')->where("order_id", $val['order_id'])->find();
                   my_accountLog($val['user_id'], $val['money'], 0, "来自{$tmp_buy_user['nickname']}（{$val['buy_user_id']}）订单:{$val['order_sn']}分佣",$val['money'],$val['order_id'] ,$val['order_sn'],$delivery['id'],$val['goods_price'],$val['jxmc']);

			}else{
				accountLog($val['user_id'], $val['money'], 0,"来自".$tmp_buy_user['nickname']."（{$val['buy_user_id']}）订单:{$val['order_sn']}分佣",$val['money']);
			}

         }
     }
    /**
     * 管理津贴自动计算
     * 不区分等级，只计算一代和二代的当月直推业绩
     * 20190214
     */
    function auto_confirm_gljt(){

        echo "CONSOLE: win计划任务自动计算管理津贴".date('Y-m-d H:i:s')."\r\n";
        Log::write("LOG: win计划任务自动计算管理津贴".date('Y-m-d H:i:s'),true);

        //定于每月1号执行 获取上月月份

        $firstday=date('Y-m-01',strtotime(date('Y',time()).'-'.(date('m',time())-1).'-01'));
        $lastday=date('Y-m-d',strtotime("$firstday +1 month -1 day"));
        //获取所有用户
        $users = M('Users')->select();
        foreach ($users as $key=>$val){
            //获取所有一级二级用户
            $under_user_ids = M('users')->where('first_leader',$val['user_id'])->whereOr('second_leader',$val['user_id'])->select();
            //获取所有一级二级用户订单，统计上月消费额
            $total_consume = M('Order')->where(array('user_id'=>array('IN',$under_user_ids),'pay_status'=>1,
                'pay_time'=>array('between',"$firstday,$lastday")))->SUM('order_amount');
            $gljt = 0;
            if($total_consume>150000){
                $gljt = 14;
            }else if($total_consume>100000){
                $gljt = 13;
            }else if($total_consume>50000){
                $gljt = 12;
            }else if($total_consume>20000){
                $gljt = 11;
            }else if($total_consume>5000){
                $gljt = 10;
            }else{
                $gljt = 9;
            }
            $gljt = $total_consume * $gljt / 100;
            my_accountLog($val['user_id'], $gljt, 0, "用户：{$val['nickname']} {$firstday} - {$lastday} 的管理津贴发放{$gljt}",$gljt,0,0,0,$total_consume,"用户：{$val['nickname']} {$firstday} - {$lastday} 的管理津贴发放{$gljt}");
        }
    }


         /**
          * 初备
          * @return bool
          */
     function confirm__copy(){

         $switch = tpCache('distribut.switch');
         if($switch == 0){ return false;}
         $today_time = time();
         $distribut_date = tpCache('distribut.date');
         $rebate_log_arr = M('rebate_log')->where(" status = 2 ")->select();

         foreach ($rebate_log_arr as $key => $val)
         {
			$tmp_user = M('users')->where("user_id", $val['user_id'])->find();
			$tmp_buy_user = M('users')->where("user_id", $val['buy_user_id'])->find();

			if ( strlen($val['jxmc'])>0 ) {

                   $vv['is_show'] = 1;
                   $vv['create_time'] = $today_time;
                   $vv['remark'] = "达到".$val['jxmc']."条件,确认收货,自动分成.";
                   $vv['status'] = 3;
                   $vv['confirm_time'] = $today_time;
                   M("rebate_log")->where("id", $val['id'])->save($vv);

                   $delivery = M('delivery_doc')->where("order_id", $val['order_id'])->find();
                   my_accountLog($val['user_id'], $val['money'], 0, "来自{$tmp_buy_user['nickname']}（{$val['buy_user_id']}）订单:{$val['order_sn']}分佣",$val['money'],$val['order_id'] ,$val['order_sn'],$delivery['id'],$val['goods_price'],$val['jxmc']);

			}else{
				accountLog($val['user_id'], $val['money'], 0,"来自".$tmp_buy_user['nickname']."（{$val['buy_user_id']}）订单:{$val['order_sn']}分佣",$val['money']);
			}

         }
     }


     /**
      * 自动分成 符合条件的 分成记录
      */
     function auto_confirm_copy(){

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