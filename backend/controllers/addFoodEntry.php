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

if (
    empty($data->userId) ||
    empty($data->name) ||
    empty($data->maleType) ||
    !isset($data->calories) ||
    empty($data->date)
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données manquantes."]);
    exit();
}

$db = Database::connect();

$query = "INSERT INTO foodEntry (user_id, name, maleType, calories, protein, carbs, fats, date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $db->prepare($query);

$protein = isset($data->protein) ? $data->protein : 0;
$carbs   = isset($data->carbs) ? $data->carbs : 0;
$fat     = isset($data->fats) ? $data->fats : 0;

$stmt->bind_param("issiiiis", $data->userId, $data->name, $data->maleType, $data->calories, $protein, $carbs, $fat, $data->date);

if (!$stmt->execute()) {
    http_response_code(501);
    echo json_encode(["success" => false, "message" => "Erreur lors de l'insertion."]);
    exit();
}

$stmt->close();


$inputDate = $data->date;
$dateObj = new DateTime($inputDate);
$date = $dateObj->format('Y-m-d');
$userId = $data->userId;

$query = "SELECT * FROM DailyStats WHERE user_id = ? AND date = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("is", $data->userId, $date);
$stmt->execute();
$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    $calories = $row['caloriesConsumed'] + $data->calories;
    $stmt->close();
    $query = "UPDATE DailyStats SET caloriesConsumed = ? WHERE user_id = ? AND date = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("iis", $calories, $data->userId, $date);
} else {
    $stmt->close();
    $query = "INSERT INTO DailyStats (user_id, date, caloriesConsumed) VALUES (?, ?, ?)";
    $stmt = $db->prepare($query);
    $stmt->bind_param("isi", $data->userId, $date, $data->calories);
}
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour des statistiques quotidiennes."]);
    exit();
}

$stmt->close();


$goalQuery = "SELECT * FROM goal WHERE progress < 100 AND user_id = ? AND ? < endDate AND ? >= startDate AND type = 'calories'";
$stmt = $db->prepare($goalQuery);
$stmt->bind_param("iss", $userId, $date, $date);
$stmt->execute();
$goalResult = $stmt->get_result();

while ($goal = $goalResult->fetch_assoc()) {
    $newCurrentValue = $goal['currentValue'] + $data->calories;
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


http_response_code(201);
echo json_encode(["success" => true, "message" => "Entrée alimentaire ajoutée avec succès."]);


$db->close();
