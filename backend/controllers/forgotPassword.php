<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
require_once __DIR__ . '/../helpers/codes.php';
$email = email_value(input()['email'] ?? '');
rate_limit('send-ip:' . ($_SERVER['REMOTE_ADDR'] ?? ''), 20);
$user = rows('SELECT id,name,is_verified FROM users WHERE email = ?', [$email])[0] ?? null;
if ($user) {
    try {
        transaction(function () use ($user, $email) { issue_code((int)$user['id'], 'reset', $email, $user['name']); });
    } catch (ApiError $error) {
        // Delivery failure and account-specific throttling must not reveal account existence.
        if (!in_array($error->status, [429, 503], true)) throw $error;
    }
}
json_response(['success' => true, 'message' => 'Si ce compte est eligible, un code a ete envoye.']);
