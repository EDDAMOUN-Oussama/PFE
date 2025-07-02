<?php
hrader("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once '../config/db.php';


$user_id = $_GET['user_id'] ?? null;


if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'user_id requis']);
    exit;
}

$db = Database::connect();

$sql = "SELECT * FROM DailyStats WHERE user_id = ? ORDER BY date DESC LIMIT 1";
$stmt = $db->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    $currentValue = $result->fetch_assoc();
   echo json_encode(['success' => true, 'data' => $currentValue]);
} else {
    echo json_encode(['success' => false, 'message' => 'Aucune donnée trouvée pour cet utilisateur']);
}
$stmt->close();
$db->close();
?>

