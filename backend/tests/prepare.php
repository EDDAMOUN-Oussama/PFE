<?php
if (PHP_SAPI !== 'cli') exit;
$name = getenv('DB_NAME');
if (!preg_match('/^healthytrack_test_[a-z0-9_]+$/', $name ?: '')) throw new RuntimeException('A dedicated test database is required.');
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$db = new mysqli('127.0.0.1','root','');
$db->query("CREATE DATABASE `$name` CHARACTER SET utf8mb4");
$db->select_db($name);
$db->multi_query(file_get_contents(__DIR__ . '/../database/schema.sql'));
do { if ($result = $db->store_result()) $result->free(); } while ($db->more_results() && $db->next_result());
require __DIR__ . '/../database/migrate.php';
$password = password_hash('TestPassword123!', PASSWORD_BCRYPT);
foreach (['user','user','admin','specialist'] as $i => $role) {
    query('INSERT INTO users (name,email,password,birthdate,gender,height,currentWeight,goalWeight,goalCalories,activityLevel,is_verified,role) VALUES (?,?,?,?,?,?,?,?,?,?,1,?)', ['Test ' . $i,'test' . $i . '@example.test',$password,'1995-01-01','male',175,80.5,70,2000,'moderate',$role]);
}
echo "Test users created.\n";
