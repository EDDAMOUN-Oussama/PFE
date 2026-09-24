<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once '../config/db.php';

$db = Database::connect();
$userId = $_GET['user_id'] ?? null;
if (!$userId) exit(json_encode(['success'=>false,'message'=>'ID manquant']));

$query = "SELECT DATE_FORMAT(date, '%W') AS day, SUM(calories) AS calories
      FROM foodEntry
      WHERE user_id = ? AND date >= CURDATE() - INTERVAL 6 DAY
      GROUP BY date ORDER BY date";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $userId);
$stmt->execute();
$res = $stmt->get_result();

$dayTranslations = [
  'Monday' => 'Lundi',
  'Tuesday' => 'Mardi',
  'Wednesday' => 'Mercredi',
  'Thursday' => 'Jeudi',
  'Friday' => 'Vendredi',
  'Saturday' => 'Samedi',
  'Sunday' => 'Dimanche'
];

$data = [];
while ($r = $res->fetch_assoc()) {
  $frenchDay = $dayTranslations[$r['day']] ?? $r['day'];
  $data[] = ['name' => $frenchDay, 'calories' => intval($r['calories'])];
}
echo json_encode(['success'=>true, 'data'=>$data]);
$stmt->close();
$db->close();
?>
