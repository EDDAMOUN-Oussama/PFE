<?php
require_once '../config/db.php';

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(); 
}

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->patient_id) && 
    !empty($data->specialist_id) && 
    !empty($data->appointment_date) && 
    !empty($data->appointment_time) && 
    !empty($data->type)
) {
    try {
        $db = Database::connect();
        $query = "INSERT INTO appointments (patient_id, specialist_id, appointment_date, appointment_time, type, reason) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($query);
        
        // S'assurer que 'reason' existe, sinon utiliser une chaîne vide
        $reason = $data->reason ?? '';

        $stmt->bind_param("iissss", $data->patient_id, $data->specialist_id, $data->appointment_date, $data->appointment_time, $data->type, $reason);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Rendez-vous créé avec succès.']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erreur lors de la création du rendez-vous.']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur serveur: ' . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données incomplètes.']);
}
?>