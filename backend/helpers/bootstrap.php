<?php
require_once __DIR__ . '/web.php';
initialize_http();
initialize_session();
$endpoint = basename($_SERVER['SCRIPT_FILENAME']);
$read = strpos($endpoint, 'get') === 0 || in_array($endpoint, ['session.php', 'exportUserReport.php'], true);
if ($_SERVER['REQUEST_METHOD'] !== ($read ? 'GET' : 'POST')) throw new ApiError('Méthode non autorisée.', 405);
if (!$read && !hash_equals($_SESSION['csrf'], $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) {
    json_response(['success' => false, 'code' => 'csrf_expired', 'message' => 'Session expiree. Reessayez.'], 403);
}
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
