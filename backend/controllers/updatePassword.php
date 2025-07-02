<?php

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");
require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$userId = intval($data['userId'] ?? 0);
$newPassword = trim($data['newPassword'] ?? '');
$currentPassword = trim($data['currentPassword'] ?? '');
if (!$userId || !$newPassword || !$currentPassword) {
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

if (!$storedPassword || !password_verify($currentPassword, $storedPassword)) {
    echo json_encode(['success' => false, 'message' => 'Mot de passe actuel incorrect.']);
    exit;
}
$newPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT);
$stmt = $db->prepare("UPDATE users SET password = ? WHERE id = ?");
$stmt->bind_param("si", $newPasswordHash, $userId);
$success = $stmt->execute();
$stmt->close();
$db->close();
echo json_encode([
    'success' => $success,
    'message' => $success ? 'Mot de passe mis à jour avec succès.' : 'Échec de la mise à jour du mot de passe.'
]);
exit;
?>