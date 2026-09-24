<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
require_once __DIR__ . '/../helpers/codes.php';
$d = input(); $email = email_value($d['email'] ?? '');
rate_limit('register:' . ($_SERVER['REMOTE_ADDR'] ?? ''),10);
$name = text_value($d['fullName'] ?? '',50); $password = password_hash(password_value($d['password'] ?? ''),PASSWORD_BCRYPT);
$birthdate = date_value($d['dateOfBirth'] ?? '');
if ($birthdate > date('Y-m-d')) throw new ApiError('Date de naissance invalide.');
$weight = number_value($d['currentWeight'] ?? null,20,300); $goal = number_value($d['goalWeight'] ?? null,20,300);
$height = number_value($d['height'] ?? null,100,250); $calories = number_value($d['goalCalories'] ?? 2000,800,5000);
$gender = text_value($d['gender'] ?? '',20); $activity = text_value($d['activityLevel'] ?? '',20);
if (rows('SELECT id FROM users WHERE email = ?',[$email])) throw new ApiError('Email deja enregistre. Connectez-vous ou demandez un nouveau code.',409);
transaction(function () use ($name,$email,$password,$birthdate,$calories,$goal,$weight,$height,$gender,$activity) {
    $stmt = query("INSERT INTO users (name,email,password,birthdate,goalCalories,goalWeight,currentWeight,height,gender,activityLevel,is_verified,role) VALUES (?,?,?,?,?,?,?,?,?,?,0,'user')",[$name,$email,$password,$birthdate,$calories,$goal,$weight,$height,$gender,$activity]);
    issue_code($stmt->insert_id,'register',$email,$name);
});
json_response(['success'=>true,'message'=>'Compte cree. Un code a ete envoye.'],201);
