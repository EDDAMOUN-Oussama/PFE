<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
require_once __DIR__ . '/../helpers/codes.php';
$email = email_value(input()['email'] ?? '');
rate_limit('send-ip:' . ($_SERVER['REMOTE_ADDR'] ?? ''),20);
$user = rows('SELECT id,name,is_verified FROM users WHERE email = ?',[$email])[0] ?? null;
if ($user && ('reset' !== 'register' || !$user['is_verified'])) {
    transaction(function () use ($user,$email) { issue_code((int)$user['id'],'reset',$email,$user['name']); });
}
json_response(['success'=>true,'message'=>'Si ce compte est eligible, un code a ete envoye.']);
