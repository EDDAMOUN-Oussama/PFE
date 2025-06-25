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
    empty($data->mealType) ||
    !isset($data->calories) ||
    empty($data->date)
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données manquantes."]);
    exit();
}

$db = Database::connect();

$query = "INSERT INTO foodEntry (user_id, name, maleType, calories, protein, carbs, fats, date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $db->prepare($query);

$protein = isset($data->protein) ? $data->protein : null;
$carbs   = isset($data->carbs) ? $data->carbs : null;
$fat     = isset($data->fat) ? $data->fat : null;

$stmt->bind_param("issiiiis", $data->userId, $data->name, $data->mealType, $data->calories, $protein, $carbs, $fat, $data->date);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Entrée alimentaire ajoutée avec succès."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de l'insertion."]);
}

$stmt->close();
$db->close();
