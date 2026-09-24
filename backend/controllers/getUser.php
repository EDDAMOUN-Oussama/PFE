<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Content-Type: application/json; charset=UTF-8");

// la configuration de la base de données
require_once '../config/db.php';

// Vérifier que l'ID de l'utilisateur est bien fourni
if (!isset($_GET['id'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

// Nettoyer l'ID
$userId = intval($_GET['id']);

try {
    // Connexion à la base de données via votre classe statique
    $conn = Database::connect();

    // Préparer la requête SQL avec LEFT JOIN pour récupérer le statut de la demande
    $stmt = $conn->prepare("
        SELECT
            u.id,
            u.name,
            u.email,
            u.height,
            u.gender,
            u.birthdate,
            u.currentWeight,
            u.goalWeight,
            u.goalCalories,
            u.activityLevel,
            u.role,
            sr.status as specialist_request_status
        FROM users u
        LEFT JOIN specialist_requests sr ON sr.id = (SELECT MAX(id) FROM specialist_requests WHERE user_id = u.id)
        WHERE u.id = ?
    ");

    // Si la préparation de la requête échoue, lancer une exception
    if ($stmt === false) {
        throw new Exception('Failed to prepare statement: ' . $conn->error);
    }

    // Lier l'ID de l'utilisateur au paramètre
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($user = $result->fetch_assoc()) {
        // Succès : l'utilisateur est trouvé, on renvoie ses données
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        // L'utilisateur avec cet ID n'a pas été trouvé
        http_response_code(404); // Not Found
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }

    $stmt->close();
    // Database::close(); // Optionnel si votre classe gère la fermeture

} catch (Exception $e) {
    // Capturer toute autre erreur (connexion, requête SQL, etc.)
    // et renvoyer une erreur 500 avec un message JSON clair
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'success' => false,
        'message' => 'Internal Server Error: ' . $e->getMessage()
    ]);
}
?>
