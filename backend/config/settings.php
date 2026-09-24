<?php
// Environment variables override the optional, ignored local configuration.
function setting(string $key, $default = null) {
    static $local;
    if ($local === null) {
        $file = __DIR__ . '/local.php';
        $local = is_file($file) ? require $file : [];
    }
    $value = getenv($key);
    return $value !== false ? $value : ($local[$key] ?? $default);
}
date_default_timezone_set(setting('APP_TIMEZONE', 'Africa/Casablanca'));
