<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once '../config/db.php';

$db = Database::connect();
$userId = $_GET['user_id'] ?? null;
if (!$userId) exit(json_encode(['success'=>false,'message'=>'ID manquant']));


$q1 = "SELECT weight, date FROM weightEntry WHERE user_id = ? AND MONTH(date)=MONTH(CURDATE()) AND YEAR(date)=YEAR(CURDATE()) ORDER BY date ASC";
$stmt = $db->prepare($q1);
$stmt->bind_param("i",$userId);
$stmt->execute();
$res = $stmt->get_result();
$rows = $res->fetch_all(MYSQLI_ASSOC);
$first = reset($rows)['weight'] ?? null;
$last  = end($rows)['weight'] ?? null;
$deltaWeight = $first !== null && $last !== null ? ($last - $first) : 0;
$stmt->close();


$q2 = "SELECT ROUND(AVG(total),0) AS avgC FROM (SELECT SUM(calories) AS total FROM foodEntry WHERE user_id=? AND MONTH(date)=MONTH(CURDATE()) AND YEAR(date)=YEAR(CURDATE()) GROUP BY date) AS daily";
$stmt = $db->prepare($q2);
$stmt->bind_param("i",$userId);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();
$avgCalories = intval($res['avgC'] ?? 0);
$stmt->close();


$q3 = "SELECT COUNT(DISTINCT date) as daysEx FROM exerciseEntry WHERE user_id=? AND MONTH(date)=MONTH(CURDATE()) AND YEAR(date)=YEAR(CURDATE())";
$stmt = $db->prepare($q3);
$stmt->bind_param("i",$userId);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();
$daysEx = intval($res['daysEx'] ?? 0);
$stmt->close();

$db->close();

$daysInMonth = intval(date('t'));
$percentRegular = $daysInMonth ? round($daysEx/$daysInMonth*100) : 0;

echo json_encode([
  'success'=>true,
  'data'=>[
    'deltaWeight'=>$deltaWeight,
    'avgCalories'=>$avgCalories,
    'percentRegular'=>$percentRegular,
    'daysEx'=>$daysEx,
    'daysInMonth'=>$daysInMonth
  ]
]);
