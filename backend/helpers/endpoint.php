<?php
require_once __DIR__ . '/bootstrap.php';
// Identity is derived from the session; bootstrap rejects conflicting payload IDs.
function entry_user_id(array $data): int { return user_id(); }
function lock_entry_user(int $id): void {
    if (!rows('SELECT id FROM users WHERE id=? FOR UPDATE', [$id])) throw new ApiError('Utilisateur introuvable.', 404);
}
