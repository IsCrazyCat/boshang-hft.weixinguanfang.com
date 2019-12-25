<?php
$mysql_server_name='127.0.0.1'; //�ĳ��Լ���mysql���ݿ������
$mysql_username='hft'; //�ĳ��Լ���mysql���ݿ��û���
$mysql_password='hft123456'; //�ĳ��Լ���mysql���ݿ�����
$mysql_database='hft_weixinguanfang_com'; //�ĳ��Լ���mysql���ݿ���
$conn=mysql_connect($mysql_server_name,$mysql_username,$mysql_password) or die("error connecting") ; //�������ݿ�
mysql_select_db($mysql_database); //�����ݿ� $_W['os'] 
?>
