<?php


header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");
require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$userId = intval($data['userId'] ?? 0);
$code = trim($data['code'] ?? '');

if (!$userId || !$code) {
    echo json_encode(['success' => false, 'message' => 'Paramètres manquants.']);
    exit;
}

$db = Database::connect();


$stmt = $db->prepare("SELECT password FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$stmt->bind_result($storedPassword);
$stmt->fetch();
$stmt->close();

// Verify password
if (!$storedPassword || !password_verify($code, $storedPassword)) {
    echo json_encode(['success' => false, 'message' => 'Mot de passe incorrect.']);
    exit;
}


$tables = ['foodEntry', 'exerciseEntry', 'weightEntry', 'Goal', 'mealPlan', 'DailyStats'];
foreach ($tables as $table) {
    $stmt = $db->prepare("DELETE FROM $table WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $stmt->close();
}


$stmt = $db->prepare("DELETE FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$success = $stmt->execute();
$stmt->close();

$db->close();

echo json_encode([
    'success' => $success,
    'message' => $success ? 'Compte supprimé.' : 'Erreur lors de la suppression du compte.'
]);
