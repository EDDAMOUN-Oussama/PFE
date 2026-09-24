<?php
require_once __DIR__ . '/../helpers/endpoint.php';
require_once __DIR__ . '/../helpers/tracking.php';
$d=input(); $id=entry_user_id($d); $date=date_value($d['date'] ?? date('Y-m-d'));
transaction(function() use($id,$date) { lock_entry_user($id); sync_stats($id,$date); });
json_response(['success'=>true]);
