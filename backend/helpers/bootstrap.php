<?php
require_once __DIR__ . '/http.php';
set_exception_handler(function (Throwable $error) {
    if ($error instanceof ApiError) json_response(['success' => false, 'message' => $error->getMessage()], $error->status);
    error_log((string)$error);
    json_response(['success' => false, 'message' => 'Erreur serveur. Consultez les journaux PHP et vérifiez la configuration et les migrations.'], 500);
});
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: ' . setting('APP_ORIGIN', 'http://localhost:8080'));
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Vary: Origin');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
session_name('healthytrack_session');
ini_set('session.use_strict_mode', '1');
session_set_cookie_params(['httponly' => true, 'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off', 'samesite' => 'Lax', 'path' => '/']);
session_start();
if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
$endpoint = basename($_SERVER['SCRIPT_FILENAME']);
$read = strpos($endpoint, 'get') === 0 || in_array($endpoint, ['session.php', 'exportUserReport.php'], true);
if ($_SERVER['REQUEST_METHOD'] !== ($read ? 'GET' : 'POST')) throw new ApiError('Méthode non autorisée.', 405);
if (!$read && !hash_equals($_SESSION['csrf'], $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) throw new ApiError('Session expirée. Rechargez la page.', 403);
$public = ['session.php', 'login.php', 'register.php', 'forgotPassword.php', 'resend_code.php', 'verify_code.php', 'resetpass.php'];
if (!in_array($endpoint, $public, true)) {
    $authenticated = current_user();
    if (in_array($endpoint, ['getSpecialistRequests.php', 'updateSpecialistRequest.php'], true)) require_role('admin');
    // Legacy controllers must never trust a user identity supplied by the browser.
    $payload = $read ? $_GET : input();
    if (in_array($endpoint, ['updateGoal.php','deleteGoal.php'], true)) {
        $goalId = (int)($payload[$endpoint === 'deleteGoal.php' ? 'goalId' : 'id'] ?? 0);
        if (!rows('SELECT id FROM Goal WHERE id = ? AND user_id = ?', [$goalId,(int)$authenticated['id']])) throw new ApiError('Objectif introuvable.',404);
    }
    if ($endpoint === 'updateAppointmentStatus.php') {
        require_role('specialist');
        if (!in_array($payload['new_status'] ?? '', ['confirmed','rejected','completed'], true)) throw new ApiError('Statut invalide.');
        if (!rows('SELECT id FROM appointments WHERE id = ? AND specialist_id = ?', [(int)($payload['appointment_id'] ?? 0),(int)$authenticated['id']])) throw new ApiError('Rendez-vous introuvable.',404);
    }
    if ($endpoint === 'getAppointments.php') $_GET['role'] = $authenticated['role'];
    if ($endpoint === 'updateSpecialistRequest.php' && !in_array($payload['new_status'] ?? '', ['approved','rejected'], true)) throw new ApiError('Statut invalide.');
    $identityKeys = ['userId', 'user_id', 'patient_id'];
    if (in_array($endpoint, ['getUser.php', 'updateUser.php', 'updateUserHealth.php', 'verify_code_Modifer.php'], true)) $identityKeys[] = 'id';
    foreach ($identityKeys as $key) {
        if (isset($payload[$key]) && (string)$payload[$key] !== (string)$authenticated['id']) throw new ApiError('Accès refusé.', 403);
    }
}
