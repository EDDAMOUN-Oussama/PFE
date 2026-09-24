<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once '../config/db.php';

$db = Database::connect();
$userId = $_GET['user_id'] ?? null;
if (!$userId) exit(json_encode(['success'=>false,'message'=>'ID manquant']));

$query = "SELECT DATE(date) AS date, weight
      FROM weightEntry
      WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      ORDER BY date ASC";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $userId);
$stmt->execute();
$res = $stmt->get_result();
$data = [];
while ($r = $res->fetch_assoc()) {
  $data[] = ['name' => $r['date'], 'weight' => intval($r['weight'])];
}
echo json_encode(['success'=>true, 'data'=>$data]);
$stmt->close();
$db->close();
