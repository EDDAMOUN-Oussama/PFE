<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../config/db.php';

$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    echo json_encode(['success' => false, 'message' => 'ID utilisateur manquant']);
    exit;
}

$db = Database::connect();

$sql = "SELECT * FROM Goal WHERE user_id = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$goals = [];
while ($row = $result->fetch_assoc()) {
    $goals[] = $row;
}

echo json_encode(['success' => true, 'goals' => $goals]);

$stmt->close();
$db->close();
