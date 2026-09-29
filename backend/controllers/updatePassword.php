<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
require_once __DIR__ . '/../helpers/codes.php';
$d = input();
$user = current_user();
rate_limit('change-password:' . $user['id']);
if (!password_verify((string)($d['currentPassword'] ?? ''), $user['password'])) throw new ApiError('Mot de passe actuel incorrect.');
$password = password_hash(password_value($d['newPassword'] ?? ''), PASSWORD_BCRYPT);
query('UPDATE users SET password = ? WHERE id = ?', [$password, (int)$user['id']]);
// Keep this session; every other session fails password-version validation.
session_regenerate_id(true);
$_SESSION['password_version'] = hash('sha256', $password);
json_response(['success' => true, 'message' => 'Mot de passe mis a jour.']);
