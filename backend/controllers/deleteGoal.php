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

$conn = Database::connect();
if (!$conn) {
  echo json_encode(['success' => false, 'message' => 'Échec de la connexion à la base de données']);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['goalId'])) {
  echo json_encode(['success' => false, 'message' => 'ID manquant']);
  exit;
}

$goalId = intval($data['goalId']);

$stmt = $conn->prepare("DELETE FROM Goal WHERE id = ?");
if (!$stmt) {
  echo json_encode(['success' => false, 'message' => 'Erreur préparation requête']);
  exit;
}

$stmt->bind_param("i", $goalId);
$success = $stmt->execute();

if ($success) {
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['success' => false, 'message' => 'Erreur exécution requête']);
}

$stmt->close();
$conn->close();
