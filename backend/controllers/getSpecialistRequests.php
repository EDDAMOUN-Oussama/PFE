<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
require_once __DIR__ . '/../config/db.php';



header("Content-Type: application/json; charset=UTF-8");


$db = Database::connect();
$query = "SELECT sr.id, u.name, u.email 
          FROM specialist_requests sr
          JOIN users u ON sr.user_id = u.id
          WHERE sr.status = 'pending'";

$result = $db->query($query);
$requests = [];
while($row = $result->fetch_assoc()) {
    $requests[] = $row;
}

echo json_encode(["success" => true, "requests" => $requests]);
?>