<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/http.php';

function mail_setting(string $key, string $legacy, $default = '') {
    return setting($key, setting($legacy, $default));
}

function send_code_email(string $email, string $name, string $code, string $purpose = 'register'): void {
    $transport = (string)setting('MAIL_TRANSPORT', 'smtp');
    $from = (string)mail_setting('MAIL_FROM_ADDRESS', 'SMTP_FROM');
    $fromName = (string)setting('MAIL_FROM_NAME', 'HealthyTrack');
    if (!filter_var($from, FILTER_VALIDATE_EMAIL)) throw new ApiError('Envoi des emails non configure.', 503);
    $subject = 'HealthyTrack : code de verification';
    $body = "Bonjour $name,\n\nVotre code est : $code\nIl expire dans 10 minutes et ne peut etre utilise qu'une fois.";
    if ($purpose === 'reset') $body .= "\n\nSaisissez ce code et votre adresse email sur : " . frontend_url() . '/reset-password';
    $body .= "\n\nSi vous n'avez pas demande ce code, ignorez ce message.";

    try {
        if ($transport === 'brevo') {
            $key = (string)setting('BREVO_API_KEY', '');
            if ($key === '') throw new RuntimeException('Missing mail configuration');
            $curl = curl_init('https://api.brevo.com/v3/smtp/email');
            curl_setopt_array($curl, [
                CURLOPT_POST => true,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CONNECTTIMEOUT => 10,
                CURLOPT_TIMEOUT => 20,
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_SSL_VERIFYHOST => 2,
                CURLOPT_HTTPHEADER => ['Accept: application/json', 'Content-Type: application/json', 'api-key: ' . $key],
                CURLOPT_POSTFIELDS => json_encode([
                    'sender' => ['email' => $from, 'name' => $fromName],
                    'to' => [['email' => $email, 'name' => $name]],
                    'subject' => $subject, 'textContent' => $body,
                ], JSON_THROW_ON_ERROR),
            ]);
            $response = curl_exec($curl);
            $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            curl_close($curl);
            if ($response === false || $status < 200 || $status >= 300) throw new RuntimeException('Mail delivery failed');
            return;
        }
        if ($transport !== 'smtp') throw new RuntimeException('Unknown mail transport');
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = (string)mail_setting('MAIL_HOST', 'SMTP_HOST', 'smtp-relay.brevo.com');
        $mail->Username = (string)mail_setting('MAIL_USERNAME', 'SMTP_USER');
        $mail->Password = (string)mail_setting('MAIL_PASSWORD', 'SMTP_PASSWORD');
        $mail->SMTPSecure = (string)mail_setting('MAIL_ENCRYPTION', 'SMTP_ENCRYPTION', 'tls');
        if (!$mail->Username || !$mail->Password || !in_array($mail->SMTPSecure, ['tls', 'ssl'], true)) throw new RuntimeException('Missing mail configuration');
        $mail->SMTPAuth = true;
        $mail->Port = (int)mail_setting('MAIL_PORT', 'SMTP_PORT', 2525);
        $mail->Timeout = 15;
        $mail->CharSet = 'UTF-8';
        $mail->setFrom($from, $fromName);
        $mail->addAddress($email, $name);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->send();
    } catch (Throwable $error) {
        // Provider responses/debug traces can contain addresses, codes and API keys.
        error_log('Mail delivery failed; check the provider dashboard and mail configuration.');
        throw new ApiError('Impossible d\'envoyer le code. Contactez l\'administrateur.', 503);
    }
}
