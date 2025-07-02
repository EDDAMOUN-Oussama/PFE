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

if (empty($data->userId) || empty($data->date)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Paramètres requis manquants."]);
    exit();
}

$inputDate = $data->date;
$dateObj = new DateTime($inputDate);
$date = $dateObj->format('Y-m-d');
$userId = $data->userId;

$caloriesConsumed = isset($data->caloriesConsumed) ? (int)$data->caloriesConsumed : 0;
$caloriesBurned   = isset($data->caloriesBurned)   ? (int)$data->caloriesBurned   : 0;
$weight           = isset($data->weight)           ? (float)$data->weight         : 0;
$exerciseMinutes  = isset($data->exerciseMinutes)  ? (int)$data->exerciseMinutes  : 0;


if (isset($data->weight) && $data->weight > 0) {
    $weight = (float)$data->weight;
} else {
    $userQuery = "SELECT currentWeight FROM users WHERE id = ?";
    $stmt = $db->prepare($userQuery);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $userResult = $stmt->get_result();
    $weight = ($userRow = $userResult->fetch_assoc()) ? (float)$userRow['currentWeight'] : 0;
    $stmt->close();
}

$db = Database::connect();

$checkQuery = "SELECT * FROM DailyStats WHERE user_id = ? AND date = ?";
$stmt = $db->prepare($checkQuery);
$stmt->bind_param("is", $userId, $date);
$stmt->execute();
$result = $stmt->get_result();
$exists = $result->num_rows > 0;
$stmt->close();

if ($exists) {
    $existing = $result->fetch_assoc();
    $caloriesConsumed += $existing['caloriesConsumed'] ?? 0;
    $caloriesBurned   += $existing['caloriesBurned'] ?? 0;
    $weight = $weight > 0 ? $weight : ($existing['weight'] ?? 0);
    $exerciseMinutes  += $existing['exerciseMinutes'] ?? 0;

    $updateQuery = "UPDATE DailyStats SET caloriesConsumed = ?, caloriesBurned = ?, weight = ?, exerciseMinutes = ? WHERE user_id = ? AND date = ?";
    $stmt = $db->prepare($updateQuery);
    $stmt->bind_param("iidiis", $caloriesConsumed, $caloriesBurned, $weight, $exerciseMinutes, $userId, $date);
} else {
    $insertQuery = "INSERT INTO DailyStats (user_id, date, caloriesConsumed, caloriesBurned, weight, exerciseMinutes) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $db->prepare($insertQuery);
    $stmt->bind_param("isiiid", $userId, $date, $caloriesConsumed, $caloriesBurned, $weight, $exerciseMinutes);
}

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Mise à jour réussie."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour."]);
}

$stmt->close();
$db->close();
