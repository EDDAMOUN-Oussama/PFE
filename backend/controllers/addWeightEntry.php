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
if (empty($data->userId) || empty($data->weight) || empty($data->date)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données manquantes."]);
    exit();
}
$db = Database::connect();

$query = "INSERT INTO weightEntry (user_id, weight, date) VALUES (?, ?, ?)";

$stmt = $db->prepare($query);

$stmt->bind_param("iis", $data->userId, $data->weight, $data->date);

if (!$stmt->execute()) {
    http_response_code(503); 
    echo json_encode(["success" => false, "message" => "Impossible d'ajouter l'entrée de poids."]);
    $stmt->close();
    exit();
}
$stmt->close();

$query = "UPDATE users SET currentWeight = ? WHERE id = ?";

$stmt = $db->prepare($query);

$stmt->bind_param("ii", $data->weight, $data->userId);

if (!$stmt->execute()) {
    http_response_code(503); 
    echo json_encode(["success" => false, "message" => "Impossible de mettre à jour le poids actuel."]);
    exit();
}

$inputDate = $data->date;
$dateObj = new DateTime($inputDate);
$date = $dateObj->format('Y-m-d');
$userId = $data->userId;

$query = "SELECT * FROM DailyStats WHERE user_id = ? AND date = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("is", $userId, $date);
$stmt->execute();
$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    $weight =  $data->weight;
    $stmt->close();
    $query = "UPDATE DailyStats SET weight = ? WHERE user_id = ? AND date = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("iis", $weight, $data->userId, $date);
} else {
    $stmt->close();
    $query = "INSERT INTO DailyStats (user_id, date, weight) VALUES (?, ?, ?)";
    $stmt = $db->prepare($query);
    $stmt->bind_param("isi", $data->userId, $date, $data->weight);
}
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour des statistiques quotidiennes."]);
    exit();
}

$stmt->close();


$goalQuery = "SELECT * FROM goal WHERE progress < 100 AND user_id = ? AND ? < endDate AND ? >= startDate AND type = 'weight'";
$stmt = $db->prepare($goalQuery);
$stmt->bind_param("iss", $userId, $date, $date);
$stmt->execute();
$goalResult = $stmt->get_result();

while ($goal = $goalResult->fetch_assoc()) {
    $newCurrentValue = $data->weight;
    $targetValue = $goal['target'];
    $newProgress = min(100, ($newCurrentValue / $targetValue) * 100);
    if ($newCurrentValue >= $targetValue) {
        $newProgress = 100;
        $goal['status'] = 'terminé';
    } else {
        $goal['status'] = 'en cours';
    } 

    $updateGoalQuery = "UPDATE goal SET currentValue = ?, progress = ?, status = ? WHERE id = ?";
    $updateStmt = $db->prepare($updateGoalQuery);
    $updateStmt->bind_param("disi", $newCurrentValue, $newProgress, $goal['status'], $goal['id']);
    $updateStmt->execute();
    $updateStmt->close();
}
$stmt->close();


http_response_code(200);
echo json_encode(["success" => true, "message" => "Poids actuel mis à jour avec succès."]);
$db->close();