<?php
// Copy to ignored local.php for WAMP; never commit real credentials.
return [
    'APP_ENV' => 'development',
    'APP_TIMEZONE' => 'Africa/Casablanca',
    'FRONTEND_URL' => 'http://localhost:8080',
    'DB_HOST' => 'localhost', 'DB_PORT' => 3306,
    'DB_NAME' => 'HealthyTrackdb', 'DB_USER' => 'root', 'DB_PASSWORD' => '',
    'DB_SSL_CA' => '', // Required for Aiven: absolute path to its downloaded CA.
    'SESSION_SAMESITE' => 'Lax',
    'MAIL_TRANSPORT' => 'smtp', // Or brevo with BREVO_API_KEY.
    'MAIL_HOST' => 'smtp-relay.brevo.com', 'MAIL_PORT' => 2525,
    'MAIL_ENCRYPTION' => 'tls', 'MAIL_USERNAME' => '', 'MAIL_PASSWORD' => '',
    'MAIL_FROM_ADDRESS' => '', 'MAIL_FROM_NAME' => 'HealthyTrack',
    'BREVO_API_KEY' => '',
];
