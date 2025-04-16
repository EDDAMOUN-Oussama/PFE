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
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

require_once '../config/db.php';

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// البحث عن المستخدم ومطابقة الإيميل وكلمة المرور كما هي
$stmt = $conn->prepare("SELECT id, name FROM users WHERE email = ? AND password = ?");
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $email
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Incorrect email or password']);
}
