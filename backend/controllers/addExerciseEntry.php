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
    empty($data->type) ||
    !isset($data->duration) ||
    !isset($data->caloriesBurned) ||
    empty($data->date)
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données manquantes."]);
    exit();
}

$db = Database::connect();

$insertQuery = "INSERT INTO exerciseEntry (user_id, name, type, duration, caloriesBurned, date) 
                VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $db->prepare($insertQuery);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur de préparation de la requête."]);
    exit();
}

$stmt->bind_param(
    "issiis",
    $data->userId,
    $data->name,
    $data->type,
    $data->duration,
    $data->caloriesBurned,
    $data->date
);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de l'ajout de l'exercice."]);
    exit();
}
$stmt->close();


$inputDate = $data->date;
$dateObj = new DateTime($inputDate);
$date = $dateObj->format('Y-m-d');
$userId = $data->userId;

$selectQuery = "SELECT * FROM DailyStats WHERE user_id = ? AND date = ?";
$stmt = $db->prepare($selectQuery);
$stmt->bind_param("is", $userId, $date);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $updatedCalories = $row['caloriesBurned'] + $data->caloriesBurned;
    $updatedDuration = $row['exerciseMinutes'] + $data->duration;

    $stmt->close();

    $updateQuery = "UPDATE DailyStats SET caloriesBurned = ?, exerciseMinutes = ? WHERE user_id = ? AND date = ?";
    $stmt = $db->prepare($updateQuery);
    $stmt->bind_param("iiis", $updatedCalories, $updatedDuration, $userId, $date);
} else {
    $stmt->close();

    $insertStatsQuery = "INSERT INTO DailyStats (user_id, date, exerciseMinutes, caloriesBurned) VALUES (?, ?, ?, ?)";
    $stmt = $db->prepare($insertStatsQuery);
    $stmt->bind_param("isii", $userId, $date, $data->duration, $data->caloriesBurned);
}

if (!$stmt->execute()) {
    $stmt->close();
    $db->close();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour des statistiques quotidiennes."]);
    exit();
}

$stmt->close();

$goalQuery = "SELECT * FROM goal WHERE progress < 100 AND user_id = ? AND ? < endDate AND ? >= startDate AND type = 'exercise'";
$stmt = $db->prepare($goalQuery);
$stmt->bind_param("iss", $userId, $date, $date);
$stmt->execute();
$goalResult = $stmt->get_result();

while ($goal = $goalResult->fetch_assoc()) {
    $newCurrentValue = $goal['currentValue'] + $data->duration;
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

$db->close();

http_response_code(201);
echo json_encode(["success" => true, "message" => "Exercice ajouté avec succès."]);
