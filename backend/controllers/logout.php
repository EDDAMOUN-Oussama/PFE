<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
$_SESSION = [];
setcookie(session_name(), '', ['expires' => time() - 3600] + session_cookie_options());
session_destroy();
json_response(['success'=>true]);
