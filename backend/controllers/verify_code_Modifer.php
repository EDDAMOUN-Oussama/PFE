<?php

require_once '../config/db.php';

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Gérer la requête OPTIONS (pré-vol)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = Database::connect();
if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']);
    exit();
}

// Récupérer et sécuriser les données JSON reçues
$data = json_decode(file_get_contents("php://input"), true);

$id = isset($data['id']) ? intval($data['id']) : -1;
$email = isset($data['email']) ? trim($data['email']) : '';
$code = isset($data['code']) ? trim($data['code']) : '';

// Vérification des champs requis
if ($id < 0 || empty($email) || empty($code)) {
    echo json_encode(['success' => false, 'message' => 'Identifiant, email ou code manquant.']);
    exit();
}

// Vérifier le code de vérification dans la base
$sql = "SELECT verification_code FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    echo json_encode(['success' => false, 'message' => 'Utilisateur introuvable.']);
    exit();
}

$user = $result->fetch_assoc();

// Comparaison du code
if ($user['verification_code'] !== $code) {
    echo json_encode(['success' => false, 'message' => 'Code de vérification incorrect.']);
    exit();
}

// Mise à jour de l'email et vérification
$updateSql = "UPDATE users SET is_verified = 1, email = ?, verification_code = NULL WHERE id = ?";
$updateStmt = $conn->prepare($updateSql);
$updateStmt->bind_param("si", $email, $id);

if ($updateStmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Email vérifié avec succès.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la mise à jour.']);
}

$stmt->close();
$updateStmt->close();
$conn->close();
?>
