<?php
if (PHP_SAPI !== 'cli-server' || strpos(getenv('DB_NAME') ?: '', 'healthytrack_test_') !== 0) { http_response_code(404); exit; }
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (strpos($path,'/guard/') === 0) {
    $_SERVER['SCRIPT_FILENAME'] = basename($path);
    require __DIR__ . '/../helpers/bootstrap.php';
    json_response(['success'=>true]);
}
return false;
