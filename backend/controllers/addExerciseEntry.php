<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"));

if (
    empty($data->userId) ||
    empty($data->name) ||
    empty($data->type) ||
    !isset($data->duration) ||
    !isset($data->caloriesBurned) ||
    empty($data->date)
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données manquantes."]);
    exit();
}

$db = Database::connect();

$query = "INSERT INTO exerciseEntry (user_id, name, type, duration, caloriesBurned, date) 
          VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $db->prepare($query);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur de préparation de la requête."]);
    exit();
}

$stmt->bind_param(
    "issiis",
    $data->userId,
    $data->name,
    $data->type,
    $data->duration,
    $data->caloriesBurned,
    $data->date
);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Exercice ajouté avec succès."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de l'ajout de l'exercice."]);
}

$stmt->close();
$db->close();
