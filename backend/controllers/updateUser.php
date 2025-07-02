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
require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->id) &&
    !empty($data->name) &&
    !empty($data->email) &&
    !empty($data->birthdate)
) {
    $db = Database::connect();

    $query = "UPDATE users SET name = ?, birthdate = ? WHERE id = ?";
    
    $stmt = $db->prepare($query);

    // 3 chaînes de caractères (s) et 1 entier (i)
    $stmt->bind_param("ssi", $data->name, $data->birthdate, $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Profil mis à jour avec succès."]);
    } else {
        http_response_code(503); 
        echo json_encode(["success" => false, "message" => "Impossible de mettre à jour le profil."]);
    }
    $stmt->close();

    // Vérification de l'email   
    $query = "SELECT email, name FROM users WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $data->id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows !== 1) {
        http_response_code(404); 
        echo json_encode(["success" => false, "message" => "Utilisateur non trouvé."]);
        $stmt->close();
        database::close();
        exit();
    }
    $row = $result->fetch_assoc();
    if ($data->email !== $row['email']) {
        $reand_code = rand(100000, 999999);
        $name = $row['name'];
        $email = $data->email;
        $query = "UPDATE users SET verification_code = ? WHERE id = ?";
        $stmt2 = $db->prepare($query);
        $stmt2->bind_param("ii", $reand_code , $data->id);
        if ($stmt2->execute()) {
            $stmt2->close();
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
        
                $mail->Subject = 'HealthyTrack - Code de Verification';
                $mail->Body = "Bonjour <strong>$name</strong>,<br><br>Voici votre code de verification : <strong>$reand_code</strong><br><br>pour mettre à jour votre email, veuillez utiliser ce code dans l'application.<br><br>Merci pour votre confiance !";
        
                $mail->send();
            http_response_code(200);
            echo json_encode(["success" => true, "message" => "Code de vérification envoyé à votre nouvel email: $email"]); 
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Erreur lors de l'envoi de l'email: " . $mail->ErrorInfo]);
            }
        } else {
            http_response_code(503); 
            echo json_encode(["success" => false, "message" => "Impossible de mettre à jour l'email."]);
        }
    }
    $stmt->close();
    database::close();
} else {
    http_response_code(400); 
    echo json_encode(["success" => false, "message" => "Données incomplètes."]);
}
?>