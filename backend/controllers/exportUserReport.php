<?php
require_once('../vendor/tecnickcom/tcpdf/tcpdf.php');
require_once '../config/db.php';

$userId = intval($_GET['user_id'] ?? 0);
if (!$userId) {
    http_response_code(400);
    exit('Missing user_id');
}

$db = Database::connect();

$stmt = $db->prepare("SELECT name, email, currentWeight, goalWeight, goalCalories FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

$stmt = $db->prepare("SELECT date, weight FROM weightEntry WHERE user_id = ? ORDER BY date ASC LIMIT 30");
$stmt->bind_param("i", $userId);
$stmt->execute();
$weightData = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();


$stmt = $db->prepare("SELECT date, (caloriesConsumed - caloriesBurned) AS netCalories FROM DailyStats WHERE user_id = ? ORDER BY date ASC LIMIT 30");
$stmt->bind_param("i", $userId);
$stmt->execute();
$calData = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();


$initialWeight = $weightData[0]['weight'] ?? null;
$latestWeight = end($weightData)['weight'] ?? null;
$weightDiff = $latestWeight && $initialWeight ? round($latestWeight - $initialWeight, 1) : null;
$weightTrend = $weightDiff < 0 ? 'Perte' : ($weightDiff > 0 ? 'Gain' : 'Stable');


$pdf = new TCPDF();
$pdf->SetCreator('HealthyTrack');
$pdf->SetAuthor($user['name']);
$pdf->SetMargins(15, 20, 15);
$pdf->AddPage();

$pdf->SetFont('helvetica', 'B', 18);
$pdf->SetTextColor(0, 102, 204);
$pdf->Cell(0, 12, "Rapport Santé Mensuel", 0, 1, 'C');
$pdf->SetFont('helvetica', '', 12);
$pdf->SetTextColor(5);
$pdf->Cell(0, 10, "Nom: {$user['name']}  |  Email: {$user['email']}", 0, 1, 'C');
$pdf->Cell(0, 10, "Date: " . date('d/m/Y à H:i'), 0, 1, 'C');
$pdf->Ln(8);


$pdf->SetFillColor(220, 235, 255);
$pdf->SetDrawColor(100, 120, 160);
$pdf->SetFont('helvetica', 'B', 12);
$pdf->Cell(0, 8, 'Objectifs de santé', 1, 1, 'C', 1);
$pdf->SetFillColor(240, 250, 255);
$pdf->SetFont('helvetica', '', 11);
$pdf->Cell(90, 8, "Poids actuel:", 1, 0, 'C', 1);
$pdf->Cell( 0, 8, "{$user['currentWeight']} kg", 1, 1, 'C', 0);
$pdf->Cell(90, 8, "Poids cible:", 1, 0, 'C', 1);
$pdf->Cell( 0, 8, "{$user['goalWeight']} kg", 1, 1, 'C', 0);
$pdf->Cell(90, 8, "Objectif calorique:", 1, 0, 'C', 1);
$pdf->Cell( 0, 8, "{$user['goalCalories']} kcal", 1, 1, 'C', 0);
$pdf->Ln(6);


$pdf->SetFillColor(220, 235, 255);
$pdf->SetDrawColor(100, 120, 160);
$pdf->SetFont('helvetica', 'B', 12);
$pdf->Cell(0, 8, "Évolution du poids", 1, 1, 'C', 1);
$pdf->SetFont('helvetica', '', 10);
$pdf->SetFillColor(240, 250, 255);
$pdf->Cell(80, 7, 'Poids initial', 1, 0, 'C', 1);
$pdf->Cell( 0, 7, $initialWeight ? "{$initialWeight} kg" : '-', 1, 1, 'C', 0);
$pdf->Cell(80, 7, 'Poids final', 1, 0, 'C', 1);
$pdf->Cell( 0, 7, $latestWeight ? "{$latestWeight} kg" : '-', 1, 1, 'C', 0);
$pdf->Cell(80, 7, 'Différence', 1, 0, 'C', 1);
$pdf->Cell( 0, 7, $weightDiff !== null ? "{$weightTrend} ({$weightDiff} kg)" : '---', 1, 1, 'C', 0);
$pdf->Ln(6);


$pdf->SetFillColor(220, 235, 255);
$pdf->SetDrawColor(100, 120, 160);
$pdf->SetFont('helvetica', 'B', 12);
$pdf->Cell(0, 8, "Poids - 30 derniers jours", 1, 1, 'C', 1);

$pdf->SetFont('helvetica', '', 11);
$pdf->SetFillColor(240, 250, 255);
$pdf->Cell(70, 7, 'Date', 1, 0, 'C', 1);
$pdf->Cell(0, 7, 'Poids (kg)', 1, 1, 'C', 1);
$pdf->SetFont('helvetica', '', 10);

foreach ($weightData as $row) {
    $pdf->Cell(70, 6, $row['date'], 1, 0, 'C');
    $pdf->Cell(0, 6, $row['weight'], 1, 1, 'C');
}
$pdf->Ln(6);


$pdf->SetFillColor(220, 235, 255);
$pdf->SetDrawColor(100, 120, 160);
$pdf->SetFont('helvetica', 'B', 12);
$pdf->Cell(0, 8, "Calories nettes - 30 derniers jours", 1, 1, 'C', 1);
$pdf->SetFont('helvetica', '', 11);
$pdf->SetFillColor(240, 250, 255);
$pdf->Cell(60, 7, 'Date', 1, 0, 'C', 1);
$pdf->Cell( 0, 7, 'Net Calories', 1, 1, 'C', 1);
$pdf->SetFont('helvetica', '', 10);

foreach ($calData as $row) {
    $color = $row['netCalories'] > 0 ? [200, 50, 50] : [50, 150, 50];
    $pdf->SetTextColor(...$color);
    $pdf->Cell(60, 6, $row['date'], 1, 0, 'C');
    $pdf->Cell( 0, 6, $row['netCalories'], 1, 1, 'C');
}
$pdf->Ln(8);


$pdf->SetTextColor(0, 210, 255);
$pdf->SetFont('helvetica', 'I', 13);
$pdf->Cell(0, 5, "HealthyTrack", 0, 1, 'R');

$pdf->Output("rapport_sante_{$user['name']}.pdf", 'D');
$db->close();
exit();
