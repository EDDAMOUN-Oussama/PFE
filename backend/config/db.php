<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "HealthyTrackdb";

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("ERROR: connection database fatal!!! " . mysqli_connect_error());
}
?>