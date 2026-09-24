<?php
require_once __DIR__ . '/../helpers/endpoint.php';
require_once __DIR__ . '/../helpers/tracking.php';
$d=input(); $id=entry_user_id($d); $date=date_value($d['date'] ?? '');
if($date>date('Y-m-d')) throw new ApiError('Date future interdite.');
$name=text_value($d['name'] ?? '',50); $meal=(string)($d['maleType'] ?? '');
if(!in_array($meal,['breakfast','lunch','dinner','snack'],true)) throw new ApiError('Type de repas invalide.');
$calories=(int)number_value($d['calories'] ?? null,0,20000); $protein=number_value($d['protein'] ?? 0,0,2000); $carbs=number_value($d['carbs'] ?? 0,0,2000); $fats=number_value($d['fats'] ?? 0,0,2000);
$entry=transaction(function() use($id,$date,$name,$meal,$calories,$protein,$carbs,$fats) {
    lock_entry_user($id);
    $stmt=query('INSERT INTO foodEntry (user_id,name,maleType,calories,protein,carbs,fats,date) VALUES (?,?,?,?,?,?,?,?)',[$id,$name,$meal,$calories,$protein,$carbs,$fats,$date]); $entry=$stmt->insert_id;
    sync_stats($id,$date); sync_goals($id,$date,'calories',$calories); return $entry;
});
json_response(['success'=>true,'id'=>$entry],201);
