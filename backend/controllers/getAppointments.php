<?php
require_once '../config/db.php';

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

try {
    $db = Database::connect();
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
    $role = isset($_GET['role']) ? $_GET['role'] : '';
    
    $appointments = [];

    if ($user_id > 0) {
        if ($role === 'specialist') {
            $query = "SELECT a.*, u.name as patient_name FROM appointments a JOIN users u ON a.patient_id = u.id WHERE a.specialist_id = ?";
        } else {
            $query = "SELECT a.*, u.name as specialist_name FROM appointments a JOIN users u ON a.specialist_id = u.id WHERE a.patient_id = ?";
        }
        
        $stmt = $db->prepare($query);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        while($row = $result->fetch_assoc()) {
            $appointments[] = $row;
        }
    }
    echo json_encode(['success' => true, 'appointments' => $appointments]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur serveur: ' . $e->getMessage()]);
}
?>