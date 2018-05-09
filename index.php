<?php 

function sendLineMsg($id,$msg){
	$ch = curl_init('https://api.line.me/v2/bot/message/push');
	curl_setopt($ch, CURLOPT_HTTPHEADER, [
		'Content-Type: application/json',
		'Authorization: Bearer uS3+hymC2kO6LVmgRpEuwBWE8UnDN6qhLTnZCrhQyqIEUQaLEpLK9o6BAy3dhvjRBodB3FOiu3hvu2RCPhpLmNw5ZNHBzrqyQwUjGAF06lVcFG3y9jut5nomkNQcLLHys3og6GanCyMocmesZpM8IAdB04t89/1O/w1cDnyilFU=',
	]);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
	curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
		'to'=>$id,
		'messages'=>[
			[
				'type'=>'text',
				'text'=>$msg,
			],
		],
	], JSON_UNESCAPED_UNICODE));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$result=curl_exec($ch);
	curl_close($ch);
}

class HWMDBMan
{
	public $pdo;
	public function __construct() {
		$this->pdo=new PDO('sqlite:hw_manager.sqlite3');
		$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
	}
	public function UpdateKadai($id,$no,$s_code,$title,$expire){
		$this->pdo->beginTransaction();
		$stmt=$this->pdo->prepare('INSERT OR IGNORE INTO kadai (`id`,`no`,`s_code`,`title`,`expire`) VALUES (:id,:no,:s_code,:title,:expire)');
		$stmt->execute([':id'=>$id,':no'=>$no,':s_code'=>$s_code,':title'=>$title,':expire'=>$expire]);
		$stmt=$this->pdo->prepare('UPDATE kadai SET `no`=:no,`s_code`=:s_code,`title`=:title,`expire`=:expire WHERE `id`=:id');
		$stmt->execute([':id'=>$id,':no'=>$no,':s_code'=>$s_code,':title'=>$title,':expire'=>$expire]);
		$this->pdo->commit();
	}
	public function RemoveKadai($id){
		$stmt=$this->pdo->prepare('DELETE FROM kadai WHERE `id`=:id');
		$stmt->execute([':id'=>$id]);
	}
	public function AddComment($id,$comment_id,$comment){
		$stmt=$this->pdo->prepare('SELECT comments FROM kadai WHERE `id`=:id');
		$stmt->execute([':id'=>$id]);
		$comments=$stmt->fetch()['comments'];
		$comments=json_decode($comments,true);
		$found=false;
		foreach($comments as &$cmobj){
			if($cmobj['id']==$comment_id){
				$cmobj['value']=$comment;
				$found=true;
			}
		}
		if(!$found){
			$comments[]=['id'=>$comment_id,'value'=>htmlspecialchars($comment)];
		}
		$stmt=$this->pdo->prepare('UPDATE kadai SET `comments`=:comments WHERE `id`=:id');
		$stmt->execute([':id'=>$id,':comments'=>json_encode($comments)]);
	}
	public function GetAllKadai(){
		$stmt=$this->pdo->prepare('SELECT * FROM kadai');
		$stmt->execute([]);
		$r=[];
		foreach($stmt->fetchAll() as $rec){
			$rec['no']=intval($rec['no']);
			$rec['expire']=intval($rec['expire']);
			$rec['comments']=json_decode($rec['comments'],true);
			$r[$rec['id']]=$rec;
		}
		return $r;
	}
}
$dbm=new HWMDBMan();

date_default_timezone_set('Asia/Tokyo');


function date2unixtime($day){
	return $day*(60*60*24);
}
function getTodayDate(){
	return floor((time()+(60*60*9))/(60*60*24));
}

function getReamingDate($exp){
	$now=getTodayDate();
	$rd=($exp-$now);
	$fd=abs($rd);
	return ['rd'=>$rd,'fd'=>$fd];
}
function getRelativeDateState($exp){
	$r=getReamingDate($exp);
	if($r['rd']<0){
		return $r['fd'].'日前';
	}else{
		return $r['fd'].'日後';
	}
}
function getAbsoluteDateState($exp){
	$exp=date2unixtime($exp);
	return date('Y-m-d',$exp).'('.(["日", "月", "火", "水", "木", "金", "土"][date('w',$exp)]).')';
}


$rpath=substr($_SERVER['REQUEST_URI'],19);//"**/*"
$x=$rpath;
preg_match_all('/^([^?]*)\??(.*)$/', $rpath, $rpath);
$rpath=$rpath[1][0];
$rpath=explode('/', $rpath);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');
header('X-Mochiya98-Api: tiny-core;v0.1a;');

$resp=new stdClass;
$resp->error=null;
$resp->result=null;

$action=$_SERVER['REQUEST_METHOD'];
if(isset($_POST['_method'])&&$_POST['_method']!==''){
	$action=strtoupper($_POST['_method']);
}

if($action=='GET'&&count($rpath)==1&&$rpath[0]=='hws'){
	//全課題一覧
	$resp->result=$dbm->GetAllKadai();
}else if($action=='GET'&&count($rpath)==2&&$rpath[0]=='hws'){
	//var_dump('GET /hws/*');
	//課題単体
	$hwid=$rpath[1];
}else if($action=='PUT'&&count($rpath)==2&&$rpath[0]=='hws'){
	//var_dump('POST /hws/*');
	//課題登録/編集
	$hwid=$rpath[1];
	if(!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/',$hwid)){
		$resp->error='bad-uuid-format';
		echo json_encode($resp);
		die();
	}
	if(!isset($_POST['s_code'])||$_POST['s_code']==''){
		$resp->error='bad-no-attrib';
		echo json_encode($resp);
		die();
	}
	if(!isset($_POST['no'])||$_POST['no']==''||!ctype_digit($_POST['no'])||$_POST['no']<1||$_POST['no']>99){
		$resp->error='bad-no-attrib';
		echo json_encode($resp);
		die();
	}
	if(!isset($_POST['title'])||$_POST['title']==''){
		$resp->error='bad-title-attrib';
		echo json_encode($resp);
		die();
	}
	if(!isset($_POST['expire'])||$_POST['expire']==''||!ctype_digit($_POST['expire'])){
		$resp->error='bad-expire-attrib';
		echo json_encode($resp);
		die();
	}
	try{
		$no=$_POST['no'];
		$s_code=$_POST['s_code'];
		$title=$_POST['title'];
		$expire=$_POST['expire'];
		$dbm->UpdateKadai($hwid,$no,$s_code,$title,$expire);
		$resp->result=['status'=>'ok'];
	}catch(Exception $e){
		$resp->error='server-error';
	}
}else if($action=='DELETE'&&count($rpath)==2&&$rpath[0]=='hws'){
	//課題削除
	$hwid=$rpath[1];
	if(!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/',$hwid)){
		$resp->error='bad-uuid-format';
		return;
	}
	try{
		$dbm->RemoveKadai($hwid);
		$resp->result=['status'=>'ok'];
	}catch(Exception $e){
		$resp->error='server-error';
	}
}else if($action=='PUT'&&count($rpath)==4&&$rpath[0]=='hws'&&$rpath[2]=='comments'){
	//var_dump('POST /hws/*/comments');
	//コメント送信
	$hwid=$rpath[1];
	$comment_id=$rpath[3];
	if(!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/',$hwid)){
		$resp->error='bad-uuid-format';
		return;
	}
	if(!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/',$comment_id)){
		$resp->error='bad-uuid-format';
		return;
	}
	
	if(isset($_POST['comment'])&&$_POST['comment']!=''){
		try{
			$dbm->AddComment($hwid,$comment_id,$_POST['comment']);
			$resp->result=['status'=>'ok'];
		}catch(Exception $e){
			$resp->error='maybe bad-kadai_id';
		}
	}else{
		$resp->error='must set comment attrib';
		$resp->result=$_POST;
	}
}else if($action=='GET'&&count($rpath)==1&&$rpath[0]=='hws_line'){
	header('Content-Type: text/plain; charset=utf-8');
	$t='[HW Manager]'."\n";
	$t.='明日期限の課題があります。'."\n";
	$kadail=$dbm->GetAllKadai();
	$kadail=array_filter($kadail,function($kadai){
		$rd=getReamingDate($kadai['expire'])['rd'];
		//return 0<=$rd&&$rd<=7;
		return $rd==1;
	});
	$id=[];
	foreach($kadail as $key=>$value){
	    $id[$key] = $value['expire'];
	}
	array_multisort($id ,SORT_ASC,$kadail);
	if(count($kadail)==0)exit();
	foreach($kadail as $kadai){
		//$t.='@'.getRelativeDateState($kadai['expire']).' '.getAbsoluteDateState($kadai['expire'])."\n";
		$t.=$kadai['s_code'].' '.$kadai['title']."\n";
	}
	$t.='http://mochiya98.starfree.jp/hw_manager/';
	sendLineMsg('C4835c2959ce9ee4c8030ff82d1eb845e',$t);
	exit();
}else{
	header('HTTP/1.1 404 Not Found');
	$resp->error=$x.'unknown route';
}
echo json_encode($resp);