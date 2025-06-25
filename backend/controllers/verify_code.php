<?php

require_once '../config/db.php';

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Origin: http://192.168.56.1:8080");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = Database::connect();
if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']));
}
$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$code = trim($data['code'] ?? '');

if (empty($email) || empty($code)) {
    echo json_encode(['success' => false, 'message' => 'Adresse e-mail ou code manquant']);
    exit();
}

$sql = "SELECT verification_code, is_verified FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();

    if ($row['is_verified'] == 1) {
        echo json_encode(['success' => false, 'message' => 'Compte déjà vérifié']);
    } elseif ($row['verification_code'] === $code) {
        $updateSql = "UPDATE users SET is_verified = 1 WHERE email = ?";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bind_param("s", $email);
        if ($updateStmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Code vérifié avec succès. Votre compte est maintenant actif.']);
        } else {
            echo json_encode(['success' => false, 'message' => "Erreur lors de la mise à jour du compte"]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Code de vérification incorrect']);
    }
} else {
    echo json_encode(['success' => false, 'message' => "Utilisateur introuvable avec cette adresse e-mail"]);
}

Database::close();
?>
