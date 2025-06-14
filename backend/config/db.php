<?php
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
            self::$conn = new mysqli(self::HOST, self::USER, self::PASS, self::DB);

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
