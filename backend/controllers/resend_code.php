<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require '../config/db.php';
require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Données invalides']);
    exit;
}

$requiredFields = ['email'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        echo json_encode(['success' => false, 'message' => "Le champ '$field' est requis"]);
        exit;
    }
}

$conn = Database::connect();
if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']);
    exit;
}

$stmt = $conn->prepare("SELECT id, name FROM users WHERE email = ?");
$stmt->bind_param("s", $data['email']);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Email non trouvé']);
    exit;
}

$stmt->bind_result($userId, $name);
$stmt->fetch();
$stmt->close();

$verification_code = rand(100000, 999999);

$stmt = $conn->prepare("UPDATE users SET verification_code = ? WHERE id = ?");
$stmt->bind_param("si", $verification_code, $userId);
if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Échec de la mise à jour du code de vérification']);
    exit;
}
$stmt->close();

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'healthytrack25@gmail.com';
    $mail->Password = 'unim pvrv uvce sopl';
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;

    $mail->setFrom('healthytrack25@gmail.com', 'HealthyTrack');
    $mail->addAddress($data['email'], $name);
    $mail->isHTML(true);

    $mail->Subject = 'HealthyTrack - Code de Verification';
    $mail->Body = "Bonjour <strong>$name</strong>,<br><br>Voici votre code de verification : <strong>$verification_code</strong><br><br>Merci pour votre inscription sur HealthyTrack !";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Un email de vérification a été envoyé.']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Échec de l\'envoi du courriel. Erreur : ' . $mail->ErrorInfo]);
}

$conn->close();
?>