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

if (
    !empty($data->id) &&
    !empty($data->currentWeight) &&
    !empty($data->goalWeight) &&
    !empty($data->height) &&
    !empty($data->goalCalories) &&
    !empty($data->activityLevel)
) {
    $db = Database::connect();

    $query = "UPDATE users SET currentWeight = ?, goalWeight = ?, height = ?, goalCalories = ?, activityLevel = ? WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param(
        "iiiisi",
        $data->currentWeight,
        $data->goalWeight,
        $data->height,
        $data->goalCalories,
        $data->activityLevel,
        $data->id
    );
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Santé de l'utilisateur mise à jour avec succès."]);
    } else {
        http_response_code(503);
        echo json_encode(["success" => false, "message" => "Impossible de mettre à jour la santé de l'utilisateur."]);
    }
    $stmt->close();
    Database::close();
}