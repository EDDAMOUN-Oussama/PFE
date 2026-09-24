<?php
require_once __DIR__ . '/mail.php';
function rate_limit(string $key, int $limit = 10): void {
    $key = hash('sha256', $key);
    query('INSERT INTO auth_limits (bucket, attempts, expires_at) VALUES (?, 1, DATE_ADD(NOW(), INTERVAL 15 MINUTE)) ON DUPLICATE KEY UPDATE attempts = IF(expires_at < NOW(), 1, attempts + 1), expires_at = IF(expires_at < NOW(), DATE_ADD(NOW(), INTERVAL 15 MINUTE), expires_at)', [$key]);
    if ((int)rows('SELECT attempts FROM auth_limits WHERE bucket = ?', [$key])[0]['attempts'] > $limit) throw new ApiError('Trop de tentatives. Réessayez dans 15 minutes.', 429);
}
function issue_code(int $id, string $purpose, string $email, string $name): void {
    rate_limit('send:' . $id . ':' . $purpose, 5);
    $code = (string)random_int(100000, 999999);
    // Call inside the same transaction as any accompanying account update.
    query('INSERT INTO auth_codes (user_id, purpose, email, code_hash, expires_at, attempts) VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE), 0) ON DUPLICATE KEY UPDATE email = VALUES(email), code_hash = VALUES(code_hash), expires_at = VALUES(expires_at), attempts = 0', [$id, $purpose, $email, password_hash($code, PASSWORD_DEFAULT)]);
    send_code_email($email, $name, $code);
}
function consume_code(int $id, string $purpose, string $email, string $code, callable $action): void {
    // Failed attempts must be committed; do not throw inside this transaction.
    $valid = transaction(function () use ($id, $purpose, $email, $code, $action) {
        $record = rows('SELECT *, expires_at > NOW() AS fresh FROM auth_codes WHERE user_id = ? AND purpose = ? FOR UPDATE', [$id, $purpose])[0] ?? null;
        if (!$record || !$record['fresh'] || $record['attempts'] >= 5) return false;
        query('UPDATE auth_codes SET attempts = attempts + 1 WHERE user_id = ? AND purpose = ?', [$id, $purpose]);
        if ($record['email'] !== $email || !preg_match('/^\d{6}$/', $code) || !password_verify($code, $record['code_hash'])) return false;
        $action();
        query('DELETE FROM auth_codes WHERE user_id = ? AND purpose = ?', [$id, $purpose]);
        return true;
    });
    if (!$valid) throw new ApiError('Code invalide, expiré ou déjà utilisé.');
}
