<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
require_once __DIR__ . '/../helpers/codes.php';
$d = input(); $email = email_value($d['email'] ?? '');
$user = rows('SELECT id FROM users WHERE email = ?',[$email])[0] ?? null;
if (!$user) throw new ApiError('Code invalide ou expire.');
consume_code((int)$user['id'],'register',$email,(string)($d['code'] ?? ''),function () use ($user) {
    query('UPDATE users SET is_verified = 1,verification_code = NULL WHERE id = ?',[(int)$user['id']]);
});
json_response(['success'=>true,'message'=>'Compte verifie. Vous pouvez vous connecter.']);
