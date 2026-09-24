<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Méthode non autorisée"]);
    exit();
}

$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
if ($userId <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "ID utilisateur invalide"]);
    exit();
}

$db = Database::connect();

$stmt = $db->prepare("SELECT id, name, type, duration, caloriesBurned, date FROM exerciseEntry WHERE user_id = ? ORDER BY date DESC");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$entries = [];
while ($row = $result->fetch_assoc()) {
    $entries[] = $row;
}

echo json_encode(['success' => true, 'entries' => $entries]);

$stmt->close();
$db->close();
