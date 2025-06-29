<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once '../config/db.php';

$db = Database::connect();
$userId = $_GET['user_id'] ?? null;
if (!$userId) exit(json_encode(['success'=>false,'message'=>'ID manquant']));

// Sommes journalières moyennes pour protéines/glucides/lipides
$query = "SELECT AVG(protein) AS prot, AVG(carbs) AS carbs, AVG(fats) AS fats
          FROM FoodEntry
          WHERE user_id = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $userId);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();
echo json_encode([
  'success'=>true,
  'data'=>[
    ['name'=>'Protéines','value'=>round($res['prot'])],
    ['name'=>'Glucides','value'=>round($res['carbs'])],
    ['name'=>'Lipides','value'=>round($res['fats'])],
  ]
]);
$stmt->close();
$db->close();
?>