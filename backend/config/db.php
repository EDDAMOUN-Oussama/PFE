<?php
require_once __DIR__ . '/settings.php';
// backend/config/db.php
class Database
{
    private const HOST = 'localhost';
    private const USER = 'root';
    private const PASS = '';
    private const DB   = 'HealthyTrackdb';

    private static ?mysqli $conn = null;

    public static function connect(): mysqli
    {
        if (!self::$conn) {
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
            self::$conn = new mysqli(setting('DB_HOST', self::HOST), setting('DB_USER', self::USER), setting('DB_PASSWORD', self::PASS), setting('DB_NAME', self::DB), (int)setting('DB_PORT', 3306));

            if (self::$conn->connect_error) {
                die('Erreur de connexion : '.self::$conn->connect_error);
            }

            self::$conn->set_charset('utf8mb4');
        }

        return self::$conn;
    }

    public static function close(): void
    {
        if (self::$conn) {
            self::$conn->close();
            self::$conn = null;
        }
    }
}
