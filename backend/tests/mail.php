<?php
// Run with php -n so cURL can be mocked. No network or real provider credentials.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
if (extension_loaded('curl')) { fwrite(STDERR, "Run this test with php -n.\n"); exit(1); }
foreach (['CURLOPT_POST','CURLOPT_RETURNTRANSFER','CURLOPT_CONNECTTIMEOUT','CURLOPT_TIMEOUT','CURLOPT_SSL_VERIFYPEER','CURLOPT_SSL_VERIFYHOST','CURLOPT_HTTPHEADER','CURLOPT_POSTFIELDS','CURLINFO_HTTP_CODE'] as $i => $name) define($name, $i + 1);
$GLOBALS['status'] = 201;
$GLOBALS['checks'] = 0;
if (!extension_loaded('curl')) {
function curl_init($url) { $GLOBALS['url'] = $url; return new stdClass(); }
function curl_setopt_array($handle, $options) { $GLOBALS['options'] = $options; return true; }
function curl_exec($handle) { return '{"messageId":"synthetic"}'; }
function curl_getinfo($handle, $option) { return $GLOBALS['status']; }
function curl_close($handle) {}
}
function check(bool $ok): void { if (!$ok) throw new RuntimeException('Mail regression'); $GLOBALS['checks']++; }
putenv('APP_ENV=production');
putenv('FRONTEND_URL=https://healthytrack.example');
putenv('MAIL_TRANSPORT=brevo');
putenv('BREVO_API_KEY=synthetic-test-key');
putenv('MAIL_FROM_ADDRESS=sender@example.test');
putenv('MAIL_FROM_NAME=HealthyTrack');
require_once __DIR__ . '/../helpers/mail.php';
send_code_email('recipient@example.test', 'Test user', '123456', 'reset');
check($GLOBALS['url'] === 'https://api.brevo.com/v3/smtp/email');
$options = $GLOBALS['options'];
check($options[CURLOPT_SSL_VERIFYPEER] === true && $options[CURLOPT_SSL_VERIFYHOST] === 2);
check(in_array('api-key: synthetic-test-key', $options[CURLOPT_HTTPHEADER], true));
$payload = json_decode($options[CURLOPT_POSTFIELDS], true);
check($payload['sender']['email'] === 'sender@example.test');
check($payload['to'][0]['email'] === 'recipient@example.test');
check(str_contains($payload['textContent'], 'https://healthytrack.example/reset-password'));
check(str_contains($payload['textContent'], '123456') && !str_contains($payload['textContent'], '?token='));
foreach ([401, 429, 500] as $status) {
    $GLOBALS['status'] = $status;
    try { send_code_email('recipient@example.test', 'Test', '123456'); throw new LogicException('Provider failure should be rejected'); }
    catch (ApiError $error) { check($error->status === 503 && !str_contains($error->getMessage(), 'synthetic-test-key')); }
}
putenv('MAIL_TRANSPORT=smtp'); putenv('MAIL_USERNAME='); putenv('MAIL_PASSWORD=');
try { send_code_email('recipient@example.test', 'Test', '123456'); throw new LogicException('Missing SMTP config should fail'); }
catch (ApiError $error) { check($error->status === 503); }
echo $GLOBALS['checks'] . " mail transport checks passed (mock HTTPS only).\n";
