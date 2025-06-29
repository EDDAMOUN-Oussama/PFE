<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once '../config/db.php';

$db = Database::connect();
$userId = $_GET['user_id'] ?? null;
if (!$userId) exit(json_encode(['success'=>false,'message'=>'ID manquant']));

$query = "SELECT DAYNAME(date) AS day, ROUND(AVG(calories),0) AS calories
          FROM FoodEntry
          WHERE user_id = ? AND date >= CURDATE() - INTERVAL 6 DAY
          GROUP BY date ORDER BY date";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $userId);
$stmt->execute();
$res = $stmt->get_result();
$data = [];
while ($r = $res->fetch_assoc()) {
  $data[] = ['name' => $r['day'], 'calories' => intval($r['calories'])];
}
echo json_encode(['success'=>true, 'data'=>$data]);
$stmt->close();
$db->close();
?>