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
    !empty($data->name) &&
    !empty($data->email) &&
    !empty($data->birthdate)
) {
    $db = Database::connect();

    $query = "UPDATE users SET name = ?, email = ?, birthdate = ? WHERE id = ?";
    
    $stmt = $db->prepare($query);

    // 3 chaînes de caractères (s) et 1 entier (i)
    $stmt->bind_param("sssi", $data->name, $data->email, $data->birthdate, $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Profil mis à jour avec succès."]);
    } else {
        http_response_code(503); 
        echo json_encode(["success" => false, "message" => "Impossible de mettre à jour le profil."]);
    }
} else {
    http_response_code(400); 
    echo json_encode(["success" => false, "message" => "Données incomplètes."]);
}
?>