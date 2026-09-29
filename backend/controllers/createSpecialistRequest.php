<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
require_role('user');
$id = user_id();
transaction(function () use ($id) {
    lock_user();
    if (rows("SELECT id FROM specialist_requests WHERE user_id=? AND status='pending'", [$id])) throw new ApiError('Une demande est deja en cours.', 409);
    query("INSERT INTO specialist_requests (user_id,status) VALUES (?,'pending')", [$id]);
});
json_response(['success' => true, 'message' => 'Demande envoyee.'], 201);
