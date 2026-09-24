<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
$user = null;
if (!empty($_SESSION['user_id'])) {
    try { $user = current_user(); unset($user['password']); }
    catch (ApiError $error) { unset($_SESSION['user_id']); }
}
json_response(['success'=>true, 'csrfToken'=>$_SESSION['csrf'], 'user'=>$user]);
