<?php
require_once __DIR__ . '/../helpers/bootstrap.php';



header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once __DIR__ . '/../config/db.php';

$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    echo json_encode(["success" => false, "message" => "ID utilisateur manquant"]);
    exit;
}

$db = Database::connect();

$query = "SELECT id, name, maleType, calories, protein, carbs, fats, date FROM foodEntry WHERE user_id = ? AND date = CURDATE() ORDER BY date DESC";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$entries = [];
while ($row = $result->fetch_assoc()) {
    $entries[] = $row;
}

echo json_encode(["success" => true, "entries" => $entries]);

$stmt->close();
$db->close();
