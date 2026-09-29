<?php
// Runtime environment wins over the ignored WAMP configuration.
function setting(string $key, $default = null) {
    static $local;
    if ($local === null) {
        $file = __DIR__ . '/local.php';
        $local = getenv('APP_ENV') !== 'production' && is_file($file) ? require $file : [];
    }
    $value = getenv($key);
    return $value !== false ? $value : ($local[$key] ?? $default);
}
function production(): bool { return setting('APP_ENV', 'development') === 'production'; }
function bool_setting(string $key, bool $default): bool {
    $value = filter_var(setting($key, $default), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    if ($value === null) throw new RuntimeException('Invalid boolean configuration: ' . $key);
    return $value;
}
function frontend_url(): string {
    $url = rtrim((string)setting('FRONTEND_URL', setting('APP_ORIGIN', production() ? '' : 'http://localhost:8080')), '/');
    $parts = parse_url($url);
    if (!$parts || empty($parts['host']) || !in_array($parts['scheme'] ?? '', production() ? ['https'] : ['http', 'https'], true)
        || isset($parts['user'], $parts['pass']) || isset($parts['user']) || isset($parts['query']) || isset($parts['fragment']) || !empty($parts['path'])) {
        throw new RuntimeException('FRONTEND_URL must be a single valid frontend origin.');
    }
    return $url;
}
date_default_timezone_set(setting('APP_TIMEZONE', 'Africa/Casablanca'));
