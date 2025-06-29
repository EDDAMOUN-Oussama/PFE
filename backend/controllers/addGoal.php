<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (
  !isset($data['userId'], $data['type'], $data['target'], $data['currentValue'],
          $data['deadline'], $data['progress'] , $data['title'])
) {
  echo json_encode(['success' => false, 'message' => 'Paramètres manquants ', $data]); 
  exit;
}

$conn = Database::connect();
if (!$conn) {
  echo json_encode(['success' => false, 'message' => 'Échec de la connexion à la base de données']);
  exit;
}

$userId = $data['userId'];
$type = $data['type'];
$title = $data['title'];
$target = intval($data['target']);
$deadline = $data['deadline'];
$startDate = date('Y-m-d');
$status = "en cours";
$currentValue = intval($data['currentValue']);
$progress = intval($data['progress']);
if ($currentValue >= $target) {
  $status = "terminé";
  $progress = 100;
}


try {
  $stmt = $conn->prepare("INSERT INTO Goal (type, title, currentValue, target, startDate, endDate, status, progress, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("ssiisssii", $type, $title, $currentValue, $target, $startDate, $deadline, $status, $progress, $userId);

  $stmt->execute();
  $newGoalId = $stmt->insert_id;

  echo json_encode([
    'success' => true,
    'id' => $newGoalId,
    'goal' => [
      'title' => $title,
      'id' => $newGoalId,
      'type' => $type,
      'target' => $target,
      'currentValue' => $currentValue,
      'progress' => $progress,
      'deadline' => $deadline,
    ]
  ]);
} catch (PDOException $e) {
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$stmt = null;
$conn = null;
