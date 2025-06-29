<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/db.php';

if (!isset($_GET['user_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Paramètre 'user_id' manquant."]);
    exit();
}

$userId = intval($_GET['user_id']);
$date = date('Y-m-d');

$db = Database::connect();

$query = "SELECT caloriesConsumed, caloriesBurned, (caloriesConsumed - caloriesBurned) as netCalories, exerciseMinutes, weight as currentWeight
          FROM DailyStats WHERE user_id = ? AND date = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("is", $userId, $date);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(["success" => true, "data" => $row]);
} else {
    echo json_encode(["success" => false, "message" => "Aucune donnée trouvée pour aujourd'hui."]);
}

$stmt->close();
$db->close();
