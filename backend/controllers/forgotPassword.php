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
if (empty($data['email'])) {
    echo json_encode(['success' => false, 'message' => "Le champ 'email' est requis"]);
    exit;
}
$email = $data['email'];
if (!$email) {
    echo json_encode(['success' => false, 'message' => 'L\'adresse e-mail est requise']);
    exit;
}

$conn = Database::connect();
if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']));
}

$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Aucun compte trouvé avec cette adresse e-mail']);
    exit;
}
$stmt->close();


$stmt = $conn->prepare("SELECT name FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Aucun nom trouvé pour cette adresse e-mail']);
    exit;
}
$row = $result->fetch_assoc();
$name = $row['name'];
if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Le nom complet est requis']);
    exit;
}
$stmt->close();

$verification_code = rand(100000, 999999);

$stmt = $conn->prepare("UPDATE users SET verification_code = ?, is_verified = 0 WHERE email = ?");
$stmt->bind_param("is", $verification_code, $email);
if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la mise à jour du code de vérification']);
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
    $mail->addAddress($email, $name);
    $mail->isHTML(true);
    $mail->Subject = 'HealthyTrack - Code de Verification pour le mot de passe oublié';
    $mail->Body = "
        <h1>Bonjour $name,</h1>
        <p>Vous avez demandé à réinitialiser votre mot de passe sur HealthyTrack.</p>
        <p>Voici votre code de vérification : <strong>$verification_code</strong></p>
        <p>Veuillez entrer ce code dans l'application pour continuer.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.</p>
        <p>Cordialement,<br>L'équipe HealthyTrack</p>";
    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Un e-mail de réinitialisation du mot de passe a été envoyé avec succès']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Échec de l\'envoi de l\'e-mail. Erreur : ' . $mail->ErrorInfo]);
}
$conn->close();
?>
