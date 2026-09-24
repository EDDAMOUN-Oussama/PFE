<?php
require_once __DIR__ . '/database.php';
class ApiError extends RuntimeException {
    public int $status;
    public function __construct(string $message, int $status = 400) {
        parent::__construct($message); $this->status = $status;
    }
}
function json_response(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    exit;
}
function input(): array {
    static $data;
    if ($data === null) {
        $raw = file_get_contents('php://input');
        $data = $raw === '' ? [] : json_decode($raw, true);
        if (!is_array($data)) throw new ApiError('Requête JSON invalide.');
    }
    return $data;
}
function number_value($value, float $min, float $max): float {
    if (!is_numeric($value) || !is_finite((float)$value) || $value < $min || $value > $max) {
        throw new ApiError('Valeur numérique hors limites.');
    }
    return (float)$value;
}
function date_value($value): string {
    $text = substr((string)$value, 0, 10);
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $text);
    if (!$date || $date->format('Y-m-d') !== $text) throw new ApiError('Date invalide.');
    return $text;
}
function email_value($value): string {
    $email = strtolower(trim((string)$value));
    if (strlen($email) > 100 || !filter_var($email, FILTER_VALIDATE_EMAIL)) throw new ApiError('Adresse email invalide.');
    return $email;
}
function password_value($value): string {
    $password = (string)$value;
    if (strlen($password) < 8 || strlen($password) > 72) throw new ApiError('Le mot de passe doit contenir entre 8 et 72 octets.');
    return $password;
}
function text_value($value, int $max = 255): string {
    $text = trim((string)$value);
    if ($text === '' || mb_strlen($text) > $max) throw new ApiError('Texte manquant ou trop long.');
    return $text;
}
function current_user(): array {
    $id = (int)($_SESSION['user_id'] ?? 0);
    $user = $id ? (rows('SELECT id, name, email, role, password, is_verified FROM users WHERE id = ?', [$id])[0] ?? null) : null;
    if (!$user || !$user['is_verified'] || !hash_equals($_SESSION['password_version'] ?? '', hash('sha256', $user['password']))) {
        unset($_SESSION['user_id']);
        throw new ApiError('Veuillez vous connecter.', 401);
    }
    return $user;
}
function user_id(): int { return (int)current_user()['id']; }
function require_role(string $role): void {
    if (current_user()['role'] !== $role) throw new ApiError('Accès refusé.', 403);
}
function lock_user(): int {
    $id = user_id();
    query('SELECT id FROM users WHERE id = ? FOR UPDATE', [$id]);
    return $id;
}
