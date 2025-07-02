<?php
require_once '../config/db.php';
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id)) {
    $db = Database::connect();
    // On vérifie s'il n'y a pas déjà une demande en cours pour cet utilisateur
    $checkQuery = "SELECT id FROM specialist_requests WHERE user_id = ? AND status = 'pending'";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bind_param("i", $data->user_id);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Une demande est déjà en cours."]);
        exit();
    }

    $query = "INSERT INTO specialist_requests (user_id, status) VALUES (?, 'pending')";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $data->user_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Demande envoyée avec succès."]);
    } else {
        echo json_encode(["success" => false, "message" => "Erreur lors de l'envoi de la demande."]);
    }
}
?>