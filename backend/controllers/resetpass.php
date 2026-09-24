<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
require_once __DIR__ . '/../helpers/codes.php';
$d = input(); $email = email_value($d['email'] ?? ''); $password = password_hash(password_value($d['password'] ?? ''),PASSWORD_BCRYPT);
$user = rows('SELECT id FROM users WHERE email = ?',[$email])[0] ?? null;
if (!$user) throw new ApiError('Code invalide ou expire.');
consume_code((int)$user['id'],'reset',$email,(string)($d['code_viryfication'] ?? ''),function () use ($user,$password) {
    query('UPDATE users SET password = ?,is_verified = 1,verification_code = NULL WHERE id = ?',[$password,(int)$user['id']]);
});
json_response(['success'=>true,'message'=>'Mot de passe modifie. Reconnectez-vous.']);
