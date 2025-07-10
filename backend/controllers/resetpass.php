<?php

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/db.php';

$conn = Database::connect();
if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']));
}
$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$code = trim($data['code_viryfication'] ?? '');
$newPassword = trim($data['password'] ?? '');

if (empty($email) || empty($code) || empty($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'Adresse e-mail, code ou nouveau mot de passe manquant']);
    exit();
}

$sql = "SELECT verification_code, is_verified FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();

    // if ($row['is_verified'] >= 1) {
    //     echo json_encode(['success' => false, 'message' => 'Compte déjà vérifié']);
    // } else
    if ($row['verification_code'] === $code) {
        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
        $updateSql = "UPDATE users SET is_verified = 1, password = ? WHERE email = ?";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bind_param("ss", $hashedPassword, $email);
        if ($updateStmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Code vérifié avec succès. Votre mot de passe a été mis à jour.']);
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
