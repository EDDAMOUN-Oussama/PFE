<?php
require_once __DIR__ . '/../helpers/endpoint.php';
$d=input(); $id=(int)($d['id'] ?? 0);
if($id<=0) throw new ApiError('Utilisateur manquant.');
query('UPDATE users SET currentWeight=?,goalWeight=?,height=?,goalCalories=?,activityLevel=? WHERE id=?',[
    number_value($d['currentWeight'] ?? null,20,300),
    number_value($d['goalWeight'] ?? null,20,300),
    number_value($d['height'] ?? null,100,250),
    (int)number_value($d['goalCalories'] ?? null,800,5000),
    text_value($d['activityLevel'] ?? '',20),$id
]);
json_response(['success'=>true]);
