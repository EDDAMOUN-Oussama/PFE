<?php
// header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        'success' => false,
        'message' => 'No data received'
    ]);
    exit;
}

require_once '../config/db.php';

$name = $data['fullName'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// بيانات افتراضية
$goalWeight = 70;
$currentWeight = 80;
$height = 170;
$age = 25;
$gender = "male";
$goalCalories = 2000;
$activityLevel = "medium";

// تحقق من الإيميل
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already exists']);
    exit;
}
$stmt->close();

// أضف المستخدم
$stmt = $conn->prepare("INSERT INTO users (name, email, password, goalWeight, currentWeight, height, age, gender, goalCalories, activityLevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssiiiissi", $name, $email, $password, $goalWeight, $currentWeight, $height, $age, $gender, $goalCalories, $activityLevel);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'User registered successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Registration failed']);
}
