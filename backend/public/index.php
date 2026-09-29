<?php
// Only this directory is public in Docker. Config, Composer and SQL stay outside it.
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($path === '/health') {
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    } else {
        echo json_encode(['status' => 'ok', 'service' => 'healthytrack-api']);
    }
    exit;
}
if (preg_match('#^/([A-Za-z][A-Za-z0-9_]*\.php)$#D', $path ?? '', $match)) {
    $controller = __DIR__ . '/../controllers/' . $match[1];
    if (is_file($controller)) {
        $_SERVER['SCRIPT_FILENAME'] = $controller;
        require $controller;
        exit;
    }
}
http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
