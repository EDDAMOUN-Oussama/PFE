<?php
// Read-only deployment check. Never print connection details or account data.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require_once __DIR__ . '/../helpers/database.php';
try {
    $db = Database::connect();
    foreach (['users','foodEntry','exerciseEntry','weightEntry','DailyStats','Goal','appointments','specialist_requests','auth_codes','auth_limits'] as $table) {
        $db->query("SELECT 1 FROM `$table` LIMIT 0");
    }
    $db->query('SELECT startValue FROM Goal LIMIT 0');
    $tls = $db->query("SHOW SESSION STATUS LIKE 'Ssl_cipher'")->fetch_assoc()['Value'] !== '';
    echo 'Database and required schema verified. TLS: ' . ($tls ? 'active' : 'off (local only)') . PHP_EOL;
} catch (Throwable $error) {
    fwrite(STDERR, "Database check failed. Check environment, CA certificate, schema and migrations.\n");
    exit(1);
}
