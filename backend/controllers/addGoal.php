<?php
require_once __DIR__ . '/../helpers/endpoint.php';
require_once __DIR__ . '/../helpers/tracking.php';
$d=input(); $id=entry_user_id($d); $type=$d['type'] ?? '';
if(!in_array($type,['weight','calories','exercise'],true)) throw new ApiError('Type objectif invalide.');
$title=text_value($d['title'] ?? ''); $target=number_value($d['target'] ?? null,$type==='weight'?20:1,$type==='weight'?300:1000000);
$current=number_value($d['currentValue'] ?? 0,$type==='weight'?20:0,$type==='weight'?300:1000000);
$deadline=empty($d['deadline'])?null:date_value($d['deadline']);
if($deadline && $deadline<date('Y-m-d')) throw new ApiError('Date limite passee.');
$state=goal_progress($type,$current,$current,$target);
$stmt=query('INSERT INTO Goal (user_id,type,title,startValue,currentValue,target,startDate,endDate,status,progress) VALUES (?,?,?,?,?,?,?,?,?,?)',[$id,$type,$title,$current,$current,$target,date('Y-m-d'),$deadline,$state['status'],$state['progress']]);
$goal=rows('SELECT *,endDate AS deadline FROM Goal WHERE id=?',[$stmt->insert_id])[0];
json_response(['success'=>true,'goal'=>$goal],201);
