<?php
// JSON/method handling only; authentication integration is explicitly pending.
require_once __DIR__ . '/http.php';
set_exception_handler(function(Throwable $error) {
    if ($error instanceof ApiError) json_response(['success'=>false,'message'=>$error->getMessage()],$error->status);
    error_log((string)$error); json_response(['success'=>false,'message'=>'Erreur serveur. Verifiez les migrations.'],500);
});
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . setting('APP_ORIGIN','http://localhost:8080'));
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD']==='OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD']!=='POST') throw new ApiError('Methode non autorisee.',405);
function entry_user_id(array $d): int { $id=(int)($d['userId'] ?? 0); if($id<=0) throw new ApiError('Utilisateur manquant.'); return $id; }
function lock_entry_user(int $id): void { if(!rows('SELECT id FROM users WHERE id=? FOR UPDATE',[$id])) throw new ApiError('Utilisateur introuvable.',404); }
