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

// بيانات الوزن
$stmt = $db->prepare("SELECT date, weight FROM weightEntry WHERE user_id = ? ORDER BY date DESC LIMIT 30");
$stmt->bind_param("i", $userId);
$stmt->execute();
$weightData = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

// بيانات السعرات
$stmt = $db->prepare("SELECT date, (caloriesConsumed - caloriesBurned) AS netCalories FROM DailyStats WHERE user_id = ? ORDER BY date DESC LIMIT 30");
$stmt->bind_param("i", $userId);
$stmt->execute();
$calData = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

// إنشاء PDF
$pdf = new TCPDF();
$pdf->SetCreator('HealthyTrack');
$pdf->SetAuthor($user['name']);
$pdf->SetMargins(15, 20, 15);
$pdf->AddPage();

// الغلاف
$pdf->SetFont('helvetica', 'B', 18);
$pdf->SetTextColor(33, 37, 41);
$pdf->Cell(0, 12, "📊 Rapport Santé Mensuel", 0, 1, 'C');
$pdf->SetFont('helvetica', '', 12);
$pdf->SetTextColor(55, 55, 55);
$pdf->Cell(0, 10, "Nom: {$user['name']}  |  Email: {$user['email']}", 0, 1, 'C');
$pdf->Ln(3);
$pdf->SetTextColor(90, 90, 90);
$pdf->MultiCell(0, 6, "Date de génération: ".date('d/m/Y à H:i'), 0, 'C');
$pdf->Ln(6);

// معلومات الوزن والأهداف
$pdf->SetFillColor(230, 240, 255);
$pdf->SetDrawColor(180, 180, 200);
$pdf->SetTextColor(0);
$pdf->SetFont('helvetica', 'B', 12);
$pdf->Cell(0, 8, '⚙️  Résumé des objectifs', 1, 1, 'L', 1);

$pdf->SetFont('helvetica', '', 11);
$pdf->Cell(90, 8, "Poids actuel:", 1);
$pdf->Cell(90, 8, "{$user['currentWeight']} kg", 1, 1);
$pdf->Cell(90, 8, "Poids cible:", 1);
$pdf->Cell(90, 8, "{$user['goalWeight']} kg", 1, 1);
$pdf->Cell(90, 8, "Objectif calorique journalier:", 1);
$pdf->Cell(90, 8, "{$user['goalCalories']} kcal", 1, 1);
$pdf->Ln(6);

// جدول الوزن
$pdf->SetFont('helvetica', 'B', 12);
$pdf->SetFillColor(230, 230, 230);
$pdf->Cell(0, 8, "📉 Poids - Derniers 30 jours", 1, 1, 'L', 1);
$pdf->SetFont('helvetica', '', 10);
$pdf->SetFillColor(245, 245, 245);
$pdf->SetTextColor(33, 33, 33);
$pdf->Cell(60, 7, 'Date', 1, 0, 'C', 1);
$pdf->Cell(60, 7, 'Poids (kg)', 1, 1, 'C', 1);

foreach ($weightData as $row) {
    $pdf->Cell(60, 6, $row['date'], 1);
    $pdf->Cell(60, 6, $row['weight'], 1, 1, 'R');
}
$pdf->Ln(6);

// جدول السعرات
$pdf->SetFont('helvetica', 'B', 12);
$pdf->SetFillColor(230, 230, 230);
$pdf->Cell(0, 8, "🔥 Calories nettes - Derniers 30 jours", 1, 1, 'L', 1);
$pdf->SetFont('helvetica', '', 10);
$pdf->SetFillColor(245, 245, 245);
$pdf->Cell(60, 7, 'Date', 1, 0, 'C', 1);
$pdf->Cell(60, 7, 'Calories nettes', 1, 1, 'C', 1);

foreach ($calData as $row) {
    $pdf->Cell(60, 6, $row['date'], 1);
    $pdf->Cell(60, 6, $row['netCalories'], 1, 1, 'R');
}
$pdf->Ln(8);

// توقيع
$pdf->SetTextColor(120, 120, 120);
$pdf->SetFont('helvetica', 'I', 9);
$pdf->Cell(0, 5, "🖋️  Généré par HealthyTrack", 0, 1, 'R');

$pdf->Output("rapport_sante_{$user['name']}.pdf", 'D');
$db->close();
exit();
?>
