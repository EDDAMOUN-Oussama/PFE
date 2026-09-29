<?php
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
// No database/network access: configuration and production cookie invariants.
require_once __DIR__ . '/../helpers/web.php';
$checks = 0;
function check(bool $ok): void { global $checks; if (!$ok) throw new RuntimeException('Configuration regression'); $checks++; }
putenv('APP_ENV=production');
putenv('FRONTEND_URL=https://healthytrack.example');
putenv('SESSION_SAMESITE=Lax');
putenv('SESSION_SECURE=false');
check(frontend_url() === 'https://healthytrack.example');
$cookies = session_cookie_options();
check($cookies['secure'] && $cookies['httponly'] && $cookies['samesite'] === 'Lax' && !isset($cookies['domain']));
foreach (['*', '', 'http://localhost', 'https://example.test/path', 'https://user:pass@example.test'] as $invalid) {
    putenv('FRONTEND_URL=' . $invalid);
    try { frontend_url(); throw new LogicException('Origin should be rejected'); }
    catch (RuntimeException $e) { check(true); }
}
putenv('APP_ENV=development');
putenv('SESSION_SAMESITE=None');
try { session_cookie_options(); throw new LogicException('Insecure SameSite=None should fail'); }
catch (RuntimeException $e) { check(true); }
putenv('APP_ENV=production');
putenv('DB_HOST=example.invalid'); putenv('DB_USER=test'); putenv('DB_PASSWORD=not-a-real-secret'); putenv('DB_NAME=test'); putenv('DB_SSL_CA=');
try { Database::connect(); throw new LogicException('Production without CA must fail before connecting'); }
catch (RuntimeException $e) { check(str_contains($e->getMessage(), 'DB_SSL_CA')); }
echo "$checks configuration checks passed.\n";
