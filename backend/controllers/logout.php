<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
$_SESSION = [];
setcookie(session_name(), '', ['expires'=>time()-3600, 'path'=>'/', 'httponly'=>true, 'samesite'=>'Lax']);
session_destroy();
json_response(['success'=>true]);
