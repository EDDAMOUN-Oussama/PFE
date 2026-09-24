<?php
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require_once __DIR__ . '/../helpers/database.php';
$db = Database::connect();
// Run after backing up the existing database. No application rows are deleted.
foreach (['users','foodEntry','exerciseEntry','weightEntry','DailyStats','Goal','appointments','specialist_requests'] as $table) $db->query("SELECT 1 FROM `$table` LIMIT 0");
$db->query("CREATE TABLE IF NOT EXISTS auth_codes (user_id INT NOT NULL, purpose VARCHAR(20) NOT NULL, email VARCHAR(255) NOT NULL, code_hash VARCHAR(255) NOT NULL, expires_at DATETIME NOT NULL, attempts INT NOT NULL DEFAULT 0, PRIMARY KEY(user_id,purpose)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
$db->query("CREATE TABLE IF NOT EXISTS auth_limits (bucket CHAR(64) PRIMARY KEY, attempts INT NOT NULL, expires_at DATETIME NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
foreach (['users','foodEntry','exerciseEntry','weightEntry','DailyStats','Goal','appointments','specialist_requests'] as $table) $db->query("ALTER TABLE `$table` ENGINE=InnoDB");
foreach (['users'=>['currentWeight','goalWeight','height'], 'weightEntry'=>['weight'], 'DailyStats'=>['weight'], 'Goal'=>['currentValue','target'], 'foodEntry'=>['protein','carbs','fats']] as $table=>$columns) {
    foreach ($columns as $column) $db->query("ALTER TABLE `$table` MODIFY `$column` DECIMAL(12,2) NOT NULL DEFAULT 0");
}
if (!rows("SHOW COLUMNS FROM Goal LIKE 'startValue'")) {
    $db->query('ALTER TABLE Goal ADD startValue DECIMAL(12,2) NULL');
    $db->query('UPDATE Goal SET startValue = currentValue');
}
$db->query('ALTER TABLE Goal MODIFY endDate DATE NULL');
echo "Migration completed. Existing goals use their current value as the starting baseline.\n";
