<?php
require_once __DIR__ . '/settings.php';

class Database
{
    private static ?mysqli $conn = null;

    public static function connect(): mysqli
    {
        if (self::$conn) return self::$conn;
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        $host = (string)setting('DB_HOST', production() ? '' : 'localhost');
        $user = (string)setting('DB_USER', production() ? '' : 'root');
        $password = (string)setting('DB_PASSWORD', '');
        $name = (string)setting('DB_NAME', production() ? '' : 'HealthyTrackdb');
        $port = filter_var(setting('DB_PORT', 3306), FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 65535]]);
        if (!$host || !$user || !$name || !$port || (production() && $password === '')) {
            throw new RuntimeException('Database environment configuration is incomplete.');
        }
        $ca = (string)setting('DB_SSL_CA', '');
        if ((production() && !$ca) || ($ca && !is_readable($ca))) {
            throw new RuntimeException('A readable DB_SSL_CA certificate is required for production.');
        }
        $db = mysqli_init();
        $db->options(MYSQLI_OPT_CONNECT_TIMEOUT, 10);
        if ($ca) {
            $db->ssl_set(null, null, $ca, null, null);
            $db->options(MYSQLI_OPT_SSL_VERIFY_SERVER_CERT, true);
        }
        try {
            $db->real_connect($host, $user, $password, $name, (int)$port, null, $ca ? MYSQLI_CLIENT_SSL : 0);
            if ($ca && !$db->query("SHOW SESSION STATUS LIKE 'Ssl_cipher'")->fetch_assoc()['Value']) {
                throw new RuntimeException('Database TLS was not established.');
            }
            $db->set_charset('utf8mb4');
            // Keep CURDATE()/NOW() aligned with PHP, including Casablanca DST.
            $offset = (new DateTimeImmutable())->format('P');
            $db->query("SET time_zone = '$offset'");
        } catch (Throwable $error) {
            // Do not expose a hostname, username, password or connection URI.
            error_log('Database connection failed; inspect environment and CA configuration.');
            throw new RuntimeException('Database connection unavailable.');
        }
        self::$conn = $db;
        return $db;
    }

    public static function close(): void
    {
        if (self::$conn) { self::$conn->close(); self::$conn = null; }
    }
}
