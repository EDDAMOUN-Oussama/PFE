
<?php
require_once '../config/db.php';
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

try {
    $db = Database::connect();
    $query = "SELECT id, name FROM users WHERE role = 'specialist'";
    $result = $db->query($query);
    $specialists = [];
    while($row = $result->fetch_assoc()) {
        $specialists[] = $row;
    }
    echo json_encode(['success' => true, 'specialists' => $specialists]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur serveur: ' . $e->getMessage()]);
}
?>