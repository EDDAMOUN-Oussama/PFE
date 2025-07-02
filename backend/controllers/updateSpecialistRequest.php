<?php
require_once '../config/db.php';
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->request_id) && !empty($data->new_status)) {
    $db = Database::connect();
    $db->begin_transaction(); // On commence une transaction pour la sécurité

    try {
        // 1. Mettre à jour le statut de la demande
        $query1 = "UPDATE specialist_requests SET status = ? WHERE id = ?";
        $stmt1 = $db->prepare($query1);
        $stmt1->bind_param("si", $data->new_status, $data->request_id);
        $stmt1->execute();

        // 2. Si la demande est approuvée, mettre à jour le rôle de l'utilisateur
        if ($data->new_status === 'approved') {
            // D'abord, trouver le user_id associé à la demande
            $userQuery = "SELECT user_id FROM specialist_requests WHERE id = ?";
            $userStmt = $db->prepare($userQuery);
            $userStmt->bind_param("i", $data->request_id);
            $userStmt->execute();
            $result = $userStmt->get_result();
            $request = $result->fetch_assoc();
            $userId = $request['user_id'];

            // Ensuite, mettre à jour le rôle de cet utilisateur
            $query2 = "UPDATE users SET role = 'specialist' WHERE id = ?";
            $stmt2 = $db->prepare($query2);
            $stmt2->bind_param("i", $userId);
            $stmt2->execute();
        }

        $db->commit(); // Tout s'est bien passé, on valide les changements
        echo json_encode(["success" => true, "message" => "Statut de la demande mis à jour."]);

    } catch (Exception $e) {
        $db->rollback(); // Une erreur s'est produite, on annule tout
        echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour : " . $e->getMessage()]);
    }
}
?>