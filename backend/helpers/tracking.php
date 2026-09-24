<?php
require_once __DIR__ . '/http.php';
function goal_progress(string $type,float $start,float $current,float $target): array {
    if($target<=0) throw new ApiError('Cible invalide.');
    if($type==='weight') {
        $done=$start>$target ? $current<=$target : ($start<$target ? $current>=$target : abs($current-$target)<0.01);
        $progress=$done ? 100 : ($start===$target ? 0 : 100*($current-$start)/($target-$start));
    } else { $progress=100*$current/$target; $done=$current>=$target; }
    return ['progress'=>(int)round(max(0,min(100,$progress))),'status'=>$done ? 'terminé' : 'en cours'];
}
function sync_stats(int $id,string $date): void {
    $food=rows('SELECT COALESCE(SUM(calories),0) AS total FROM foodEntry WHERE user_id=? AND date=?',[$id,$date])[0];
    $exercise=rows('SELECT COALESCE(SUM(caloriesBurned),0) AS calories,COALESCE(SUM(duration),0) AS minutes FROM exerciseEntry WHERE user_id=? AND date=?',[$id,$date])[0];
    $weight=rows('SELECT weight FROM weightEntry WHERE user_id=? AND date<=? ORDER BY date DESC,id DESC LIMIT 1',[$id,$date])[0]['weight'] ?? rows('SELECT currentWeight FROM users WHERE id=?',[$id])[0]['currentWeight'];
    // Caller holds a user row lock to serialize concurrent entry writes.
    query('DELETE FROM DailyStats WHERE user_id=? AND date=?',[$id,$date]);
    query('INSERT INTO DailyStats (user_id,date,caloriesConsumed,caloriesBurned,weight,exerciseMinutes) VALUES (?,?,?,?,?,?)',[$id,$date,(int)$food['total'],(int)$exercise['calories'],(float)$weight,(int)$exercise['minutes']]);
}
function sync_goals(int $id,string $date,string $type,float $increment): void {
    foreach(rows('SELECT * FROM Goal WHERE user_id=? AND type=? AND startDate<=? AND (endDate IS NULL OR endDate>=?) FOR UPDATE',[$id,$type,$date,$date]) as $goal) {
        $current=$type==='weight' ? $increment : (float)$goal['currentValue']+$increment;
        $state=goal_progress($type,(float)$goal['startValue'],$current,(float)$goal['target']);
        query('UPDATE Goal SET currentValue=?,progress=?,status=? WHERE id=?',[$current,$state['progress'],$state['status'],(int)$goal['id']]);
    }
}
