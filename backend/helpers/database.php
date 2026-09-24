<?php
require_once __DIR__ . '/../config/db.php';
function query(string $sql, array $params = []): mysqli_stmt {
    $stmt = Database::connect()->prepare($sql);
    if ($params) {
        $types = '';
        foreach ($params as $value) {
            $types .= is_int($value) ? 'i' : (is_float($value) ? 'd' : 's');
        }
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    return $stmt;
}
function rows(string $sql, array $params = []): array {
    $stmt = query($sql, $params);
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    return $rows;
}
function transaction(callable $action) {
    $db = Database::connect();
    $db->begin_transaction();
    try { $result = $action(); $db->commit(); return $result; }
    catch (Throwable $error) { $db->rollback(); throw $error; }
}
