<?php
require_once '../config/db.php';

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
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