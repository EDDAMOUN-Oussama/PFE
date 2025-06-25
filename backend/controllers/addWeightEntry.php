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
if (empty($data->userId) || empty($data->weight) || empty($data->date)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données manquantes."]);
    exit();
}
$db = Database::connect();

$query = "INSERT INTO weightEntry (user_id, weight, date) VALUES (?, ?, ?)";

$stmt = $db->prepare($query);

$stmt->bind_param("iis", $data->userId, $data->weight, $data->date);

if (!$stmt->execute()) {
    http_response_code(503); 
    echo json_encode(["success" => false, "message" => "Impossible d'ajouter l'entrée de poids."]);
    $stmt->close();
    exit();
}
$stmt->close();

$query = "UPDATE users SET currentWeight = ? WHERE id = ?";

$stmt = $db->prepare($query);

$stmt->bind_param("ii", $data->weight, $data->userId);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Poids actuel mis à jour avec succès."]);
} else {
    http_response_code(503); 
    echo json_encode(["success" => false, "message" => "Impossible de mettre à jour le poids actuel."]);
}
$stmt->close();
$db->close();