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

$data = json_decode(file_get_contents("php://input"));
$userId = isset($data->userId) ? intval($data->userId) : 0;

if ($userId <= 0) {
    echo json_encode(["success" => false, "message" => "ID utilisateur invalide"]);
    exit();
}

$db = Database::connect();

$query = "SELECT id, weight, date FROM weightEntry WHERE user_id = ? ORDER BY date ASC";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();
$entries = [];

while ($row = $result->fetch_assoc()) {
    $entries[] = [
        "id" => $row["id"],
        "weight" => (float) $row["weight"],
        "date" => $row["date"]
    ];
}

echo json_encode(["success" => true, "entries" => $entries]);

$stmt->close();
$db->close();
