<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Content-Type: application/json");

//  connexion à la base de données
require_once '../config/db.php';

// Vérifie que l'ID de l'utilisateur est bien fourni dans l'URL
if (!isset($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

// Nettoie l'ID pour s'assurer que c'est un nombre entier
$userId = intval($_GET['id']);

try {
    $conn = Database::connect();
    $stmt = $conn->prepare("
        SELECT 
            id, 
            name, 
            email, 
            height, 
            gender,
            birthdate,
            currentWeight, 
            goalWeight, 
            goalCalories, 
            activityLevel
        FROM users 
        WHERE id = ?
    ");

    // Si `prepare` échoue,  renvoie une erreur claire.
    if ($stmt === false) {
        throw new Exception('Failed to prepare statement: ' . $conn->error);
    }

    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($user = $result->fetch_assoc()) {
        // Succès : l'utilisateur est trouvé, on renvoie ses données.
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        // L'utilisateur avec cet ID n'a pas été trouvé dans la base de données.
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    // Capture toute autre erreur (connexion, etc.) et renvoie une erreur 500
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Internal Server Error: ' . $e->getMessage()]);
}
?>
          