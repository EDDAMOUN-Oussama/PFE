<?php
require_once __DIR__ . '/http.php';

function initialize_http(): void {
    ini_set('display_errors', '0');
    set_exception_handler(function (Throwable $error) {
        if ($error instanceof ApiError) json_response(['success' => false, 'message' => $error->getMessage()], $error->status);
        // Exception traces can contain sensitive function arguments.
        error_log('API failure: ' . get_class($error) . ' in ' . basename($error->getFile()) . ':' . $error->getLine());
        json_response(['success' => false, 'message' => "Erreur serveur. Contactez l'administrateur."], 500);
    });
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, private');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: no-referrer');
    header('Vary: Origin');
    $allowed = frontend_url();
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '' && $origin !== $allowed) throw new ApiError('Origine non autorisee.', 403);
    if ($origin === $allowed) {
        header('Access-Control-Allow-Origin: ' . $allowed);
        header('Access-Control-Allow-Credentials: true');
    }
    header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
}

function session_cookie_options(): array {
    $secure = production() || bool_setting('SESSION_SECURE', !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    $sameSite = (string)setting('SESSION_SAMESITE', 'Lax');
    if (!in_array($sameSite, ['Lax', 'Strict', 'None'], true) || ($sameSite === 'None' && !$secure)) {
        throw new RuntimeException('Invalid session cookie configuration.');
    }
    // A host-only cookie works through the Vercel /api reverse proxy.
    return ['httponly' => true, 'secure' => $secure, 'samesite' => $sameSite, 'path' => '/'];
}

function initialize_session(): void {
    session_name('healthytrack_session');
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.gc_maxlifetime', '7200');
    ini_set('session.gc_probability', '1');
    ini_set('session.gc_divisor', '100');
    session_set_cookie_params(session_cookie_options());
    session_start();
    if (isset($_SESSION['last_activity']) && time() - $_SESSION['last_activity'] > 7200) {
        $_SESSION = [];
        session_regenerate_id(true);
    }
    $_SESSION['last_activity'] = time();
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
}
