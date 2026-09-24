<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
require_once __DIR__ . '/../helpers/codes.php';
$d = input(); $id = user_id(); $email = email_value($d['email'] ?? ''); $name = text_value($d['name'] ?? '',50); $birthdate = date_value($d['birthdate'] ?? '');
if ($birthdate > date('Y-m-d')) throw new ApiError('Date de naissance invalide.');
$changed = $email !== current_user()['email'];
if ($changed && rows('SELECT id FROM users WHERE email = ? AND id <> ?',[$email,$id])) throw new ApiError('Email deja utilise.',409);
transaction(function () use ($id,$name,$birthdate,$changed,$email) {
    query('UPDATE users SET name = ?,birthdate = ? WHERE id = ?',[$name,$birthdate,$id]);
    if ($changed) issue_code($id,'email',$email,$name);
});
json_response(['success'=>true,'needsEmailVerification'=>$changed,'message'=>$changed ? 'Code envoye a la nouvelle adresse.' : 'Profil mis a jour.']);
