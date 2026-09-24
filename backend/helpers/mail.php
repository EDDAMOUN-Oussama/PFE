<?php
require_once __DIR__ . '/../vendor/autoload.php';
function send_code_email(string $email, string $name, string $code): void {
    if (!setting('SMTP_USER') || !setting('SMTP_PASSWORD') || !setting('SMTP_FROM')) throw new ApiError('Envoi des emails non configuré. Contactez l’administrateur.', 503);
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = setting('SMTP_HOST', 'smtp.gmail.com');
    $mail->SMTPAuth = true;
    $mail->Username = setting('SMTP_USER');
    $mail->Password = setting('SMTP_PASSWORD');
    $mail->SMTPSecure = setting('SMTP_ENCRYPTION', 'ssl');
    $mail->Port = (int)setting('SMTP_PORT', 465);
    $mail->Timeout = 15;
    $mail->CharSet = 'UTF-8';
    $mail->setFrom(setting('SMTP_FROM'), 'HealthyTrack');
    $mail->addAddress($email, $name);
    $mail->Subject = 'HealthyTrack : code de vérification';
    $mail->Body = "Bonjour $name,\n\nVotre code est : $code\nIl expire dans 10 minutes et ne peut être utilisé qu’une fois.";
    try { $mail->send(); }
    catch (Throwable $error) { error_log('SMTP delivery failed'); throw new ApiError('Impossible d’envoyer le code. Vérifiez la configuration SMTP.', 503); }
}
