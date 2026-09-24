<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
require_once __DIR__ . '/../helpers/codes.php';
$d = input(); $id = user_id(); $email = email_value($d['email'] ?? '');
consume_code($id,'email',$email,(string)($d['code'] ?? ''),function () use ($id,$email) {
    if (rows('SELECT id FROM users WHERE email = ? AND id <> ?',[$email,$id])) throw new ApiError('Email deja utilise.',409);
    query('UPDATE users SET email = ?,verification_code = NULL WHERE id = ?',[$email,$id]);
});
json_response(['success'=>true,'message'=>'Email mis a jour.']);
