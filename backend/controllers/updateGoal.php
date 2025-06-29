<?php

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$db = Database::connect();

if (!$db) {
    echo json_encode(['success' => false, 'message' => 'Échec de la connexion à la base de données']);
    exit;
}

if (
    !isset(
        $data['id'], $data['type'], $data['target'],
        $data['startDate'], $data['endDate'],
        $data['status'], $data['progress']
    )
) {
    echo json_encode(['success' => false, 'message' => 'Paramètres manquants']);
    exit;
}

$id = intval($data['id']);
$type = $data['type'];
$target = intval($data['target']);
$startDate = $data['startDate'];
$endDate = $data['endDate'];
$status = $data['status'];
$progress = intval($data['progress']);

try {
    $stmt = $db->prepare("UPDATE Goal SET type = ?, target = ?, startDate = ?, endDate = ?, status = ?, progress = ? WHERE id = ?");
    $stmt->bind_param("sissssi", $type, $target, $startDate, $endDate, $status, $progress, $id);
    $stmt->execute();

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$stmt->close();
$db->close();
