<?php
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        require_once '../controllers/auth.php';
        break;
    case 'add_food':
        require_once '../controllers/food.php';
        break;
    case 'get_stats':
        require_once '../controllers/stats.php';
        break;
    // وهكذا مع باقي الملفات...
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid route']);
}
