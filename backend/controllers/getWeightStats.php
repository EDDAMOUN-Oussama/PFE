<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once '../config/db.php';

$db = Database::connect();
$userId = $_GET['user_id'] ?? null;
if (!$userId) exit(json_encode(['success'=>false,'message'=>'ID manquant']));

$query = "SELECT WEEK(date) AS semaine, AVG(weight) AS weight
          FROM WeightEntry
          WHERE user_id = ?
          GROUP BY WEEK(date)";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $userId);
$stmt->execute();
$res = $stmt->get_result();
$data = [];
while ($r = $res->fetch_assoc()) {
  $data[] = ['name' => 'Semaine '.$r['semaine'], 'weight' => floatval($r['weight'])];
}
echo json_encode(['success'=>true, 'data'=>$data]);
$stmt->close();
$db->close();
