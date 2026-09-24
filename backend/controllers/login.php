<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
require_once __DIR__ . '/../helpers/codes.php';
$d = input(); $email = email_value($d['email'] ?? '');
rate_limit('login-ip:' . ($_SERVER['REMOTE_ADDR'] ?? ''),50);
rate_limit('login:' . $email);
$user = rows('SELECT id,name,email,password,is_verified,role FROM users WHERE email = ?',[$email])[0] ?? null;
if (!$user || !password_verify((string)($d['password'] ?? ''),$user['password'])) throw new ApiError('Email ou mot de passe incorrect.',401);
if (!$user['is_verified']) throw new ApiError('Verifiez votre email avant de vous connecter.',403);
query('DELETE FROM auth_limits WHERE bucket = ?',[hash('sha256','login:' . $email)]);
session_regenerate_id(true);
$_SESSION['user_id'] = (int)$user['id'];
$_SESSION['password_version'] = hash('sha256',$user['password']);
unset($user['password']);
json_response(['success'=>true,'user'=>$user]);
