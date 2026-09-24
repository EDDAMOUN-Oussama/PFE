<?php
require_once __DIR__ . '/../helpers/endpoint.php';
require_once __DIR__ . '/../helpers/tracking.php';
$d=input(); $id=entry_user_id($d); $date=date_value($d['date'] ?? '');
if($date>date('Y-m-d')) throw new ApiError('Date future interdite.');
$name=text_value($d['name'] ?? '',50); $type=(string)($d['type'] ?? '');
if(!in_array($type,['cardio','strength','flexibility','sports','other','Musculation','Flexibilité','Autre'],true)) throw new ApiError('Type exercice invalide.');
$minutes=(int)number_value($d['duration'] ?? null,1,1440); $calories=(int)number_value($d['caloriesBurned'] ?? null,0,20000);
$entry=transaction(function() use($id,$date,$name,$type,$minutes,$calories) {
    lock_entry_user($id);
    $stmt=query('INSERT INTO exerciseEntry (user_id,name,type,duration,caloriesBurned,date) VALUES (?,?,?,?,?,?)',[$id,$name,$type,$minutes,$calories,$date]); $entry=$stmt->insert_id;
    sync_stats($id,$date); sync_goals($id,$date,'exercise',$minutes); return $entry;
});
json_response(['success'=>true,'id'=>$entry],201);
