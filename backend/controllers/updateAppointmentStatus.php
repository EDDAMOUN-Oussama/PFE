<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
require_once __DIR__ . '/../config/db.php';



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