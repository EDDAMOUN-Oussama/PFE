<?php
require_once __DIR__ . '/../helpers/endpoint.php';
require_once __DIR__ . '/../helpers/tracking.php';
$d=input();
transaction(function() use($d) {
    $goal=rows('SELECT * FROM Goal WHERE id=? FOR UPDATE',[(int)($d['id'] ?? 0)])[0] ?? null;
    if(!$goal) throw new ApiError('Objectif introuvable.',404);
    $current=number_value($d['currentValue'] ?? null,$goal['type']==='weight'?20:0,$goal['type']==='weight'?300:1000000);
    $state=goal_progress($goal['type'],(float)$goal['startValue'],$current,(float)$goal['target']);
    query('UPDATE Goal SET currentValue=?,progress=?,status=? WHERE id=?',[$current,$state['progress'],$state['status'],(int)$goal['id']]);
});
json_response(['success'=>true]);
