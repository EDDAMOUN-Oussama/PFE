<?php
require_once __DIR__ . '/../helpers/bootstrap.php';
$d = input();
$patient = user_id();
$specialist = (int)($d['specialist_id'] ?? 0);
$date = date_value($d['appointment_date'] ?? '');
$time = (string)($d['appointment_time'] ?? '');
if ($date < date('Y-m-d') || !preg_match('/^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::00)?$/D', $time)) throw new ApiError('Date ou heure invalide.');
if (!rows("SELECT id FROM users WHERE id=? AND role='specialist' AND is_verified=1", [$specialist])) throw new ApiError('Specialiste introuvable.', 404);
$type = text_value($d['type'] ?? '', 50);
$reason = trim((string)($d['reason'] ?? ''));
if (mb_strlen($reason) > 2000) throw new ApiError('Motif trop long.');
$stmt = query('INSERT INTO appointments (patient_id,specialist_id,appointment_date,appointment_time,type,reason) VALUES (?,?,?,?,?,?)', [$patient,$specialist,$date,$time,$type,$reason]);
json_response(['success' => true, 'id' => $stmt->insert_id, 'message' => 'Rendez-vous cree.'], 201);
