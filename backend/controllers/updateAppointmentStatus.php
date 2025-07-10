<?php
require_once '../config/db.php';
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->appointment_id) && !empty($data->new_status)) {
    $db = Database::connect();
    $query = "UPDATE appointments SET status = ? WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("si", $data->new_status, $data->appointment_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Statut du rendez-vous mis à jour.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la mise à jour.']);
    }
}
?>