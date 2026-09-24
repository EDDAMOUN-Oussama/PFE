<?php
require_once __DIR__ . '/../helpers/endpoint.php';
require_once __DIR__ . '/../helpers/tracking.php';
$d=input(); $id=entry_user_id($d); $date=date_value($d['date'] ?? ''); $weight=number_value($d['weight'] ?? null,20,300);
if($date>date('Y-m-d')) throw new ApiError('Date future interdite.');
$entry=transaction(function() use($id,$date,$weight) {
    lock_entry_user($id);
    $stmt=query('INSERT INTO weightEntry (user_id,weight,date) VALUES (?,?,?)',[$id,$weight,$date]); $entry=$stmt->insert_id;
    $latest=rows('SELECT weight FROM weightEntry WHERE user_id=? ORDER BY date DESC,id DESC LIMIT 1',[$id])[0];
    query('UPDATE users SET currentWeight=? WHERE id=?',[(float)$latest['weight'],$id]);
    sync_stats($id,$date); sync_goals($id,$date,'weight',$weight); return $entry;
});
json_response(['success'=>true,'id'=>$entry],201);
