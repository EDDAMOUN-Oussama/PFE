<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
$d = input();
transaction(function () use ($d) {
    $request = rows("SELECT user_id,status FROM specialist_requests WHERE id=? FOR UPDATE", [(int)($d['request_id'] ?? 0)])[0] ?? null;
    if (!$request) throw new ApiError('Demande introuvable.', 404);
    if ($request['status'] !== 'pending') throw new ApiError('Demande deja traitee.', 409);
    query('UPDATE specialist_requests SET status=? WHERE id=?', [$d['new_status'],(int)$d['request_id']]);
    if ($d['new_status'] === 'approved') query("UPDATE users SET role='specialist' WHERE id=? AND role='user'", [(int)$request['user_id']]);
});
json_response(['success' => true, 'message' => 'Statut mis a jour.']);
