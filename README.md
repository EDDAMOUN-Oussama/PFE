# HealthyTrack

HealthyTrack is a final-year project (PFE) for tracking nutrition, exercise, weight and health goals. It has a French React dashboard, a PHP REST API, MySQL storage, account verification and appointment workflows.

**Start here:** [local setup](#local-installation) or the step-by-step [deployment guide](DEPLOYMENT.md). Existing installations should also read [FIXES.md](FIXES.md).

## Main features

- Registration, email verification, login/logout, password reset and profile/account management.
- Daily calories, macronutrients, exercise duration, weight history, goals and progress charts.
- Monthly statistics and downloadable PDF health reports.
- Appointment requests, specialist appointment management and administrator review of specialist applications.
- Light/dark/system themes and goal-derived notifications stored per account in the browser.

The interface is French. The language setting does not currently translate the whole application. Notification read/hide/snooze state is local to the browser. There is no file-upload feature or persistent uploaded-media directory.

## Architecture

```text
Browser
   | HTTPS, host-only session cookie
   v
Vercel: React + Vite
   | /api/* reverse proxy (HTTPS)
   v
Render: Docker / Apache / PHP
   | verified TLS                 | HTTPS
   v                              v
Aiven MySQL                     Brevo email API
```

The browser always calls `/api`. `VITE_API_URL` configures the upstream in Vercel and optionally Vite. This preserves PHP sessions on unrelated `vercel.app` and `onrender.com` domains without requiring third-party cookies. No JWT conversion is involved.

The backend exposes existing `/<controller>.php` endpoints and `GET /health`. The Docker document root is `backend/public`; configuration, vendor libraries and SQL are outside the public directory. All private controllers use session, CSRF, ownership and role checks.

## Technologies and requirements

| Component | Version / purpose |
| --- | --- |
| Node.js | 22.12+ within the 22.x release line; `.nvmrc` selects 22 |
| Frontend | React 18, TypeScript, Vite 7, React Router 7, Tailwind, Radix/shadcn UI, Recharts |
| PHP | 8.2-8.4; Docker uses PHP 8.3 with Apache |
| Database | MySQL 8, MySQLi prepared statements, utf8mb4, InnoDB |
| Composer | 2; locked PHPMailer and TCPDF dependencies |
| Local server | Wampserver or PHP's development server; Docker is optional locally |

PHP needs MySQLi/mysqlnd, curl, mbstring and OpenSSL, plus the normal core extensions. Docker also includes PDO MySQL, GD, ZIP and OPcache. `composer check-platform-reqs` checks your installation. Unused spreadsheet/PDF-import libraries were removed; PDF generation remains available through TCPDF.

## Repository structure

```text
backend/
  config/          Environment settings, database connection, private local.php
  controllers/     Account, tracking, reporting and appointment endpoints
  helpers/         HTTP/CORS, authentication, mail, codes and tracking logic
  public/          Docker/public-server entry point and /health
  database/        Clean schema, legacy migration and read-only connection check
  docker/          Apache/PHP settings and Render PORT startup script
  tests/           Isolated regression tests
  Dockerfile
  .env.example
frontend/
  src/             Pages, components, contexts, types and shared API client
  tests/           Node regression tests
  .env.example
  vercel.ts        Environment-driven API proxy and SPA routing
  vite.config.ts   Local development/preview proxy
DEPLOYMENT.md
FIXES.md
```

## Local installation

Run commands from the actual Git checkout, currently `C:/wamp64/www/pfe/PFE`, not its parent directory. Keep existing `backend/config/local.php`; do not overwrite it with the example.

### 1. Backend configuration

Start Apache and MySQL in Wampserver. Select PHP 8.2 or newer for both Apache and your terminal. Check `php -v`: this machine originally had PHP 7.4 first on PATH.

```powershell
cd C:/wamp64/www/pfe/PFE/backend
composer install
composer check-platform-reqs
# Only if local.php does not already exist:
Copy-Item config/local.example.php config/local.php
```

Edit the ignored `config/local.php` with your local database credentials, frontend origin and mail settings. Environment variables override this file. Existing `SMTP_*` and `APP_ORIGIN` settings are accepted for WAMP compatibility; new installations should use `MAIL_*` and `FRONTEND_URL`.

PHP does **not** automatically load `.env` files. `backend/.env.example` is a template for Render environment settings or Docker's `--env-file`. WAMP uses `config/local.php` or process environment variables.

### 2. Database initialization

For a **new, empty database**, create `HealthyTrackdb` with utf8mb4 in phpMyAdmin and import [`backend/database/schema.sql`](backend/database/schema.sql). It contains the complete current schema, including verification codes/rate limits, decimal measurements and goal baselines. There are no accounts, password hashes, seeds or private data.

For an **existing installation**, back up the database and run this from `backend/`:

```powershell
php database/migrate.php
```

Do not import the fresh schema over an existing database. The legacy migration preserves records, converts workflow tables to InnoDB and adds missing columns/tables. Existing goals use their current value as their initial baseline. Review ongoing weight goals if you know a different original baseline.

Then run the read-only check:

```powershell
php database/check.php
```

### 3. Frontend development

```powershell
cd C:/wamp64/www/pfe/PFE/frontend
npm install
npm run dev
```

Open `http://localhost:8080`. Vite detects the checkout's path below WAMP's `www`, including the nested `pfe/PFE` directory. API calls go through `/api` to the PHP controllers.

For another layout, copy `frontend/.env.example` to the ignored `frontend/.env.local` and set `BACKEND_ORIGIN` / `BACKEND_PATH`. Restart Vite after changes. `npm ci` is preferred for reproducing the committed lockfile.

### 4. Optional PHP development server

From `backend/`:

```powershell
php -S 127.0.0.1:8000 -t public public/index.php
```

In `frontend/.env.local`, set `VITE_API_URL=http://127.0.0.1:8000`, retain `FRONTEND_URL=http://localhost:8080` on PHP, and restart Vite. This exercises the same public router used by Docker. PHP's built-in server is only for local development.

### 5. Optional local Docker

```powershell
docker build -t healthytrack-api ./backend
# Create an ignored backend/.env from the example and set your local values first.
docker run --rm -p 8000:10000 --env-file backend/.env healthytrack-api
```

For HTTP-only local Docker use `APP_ENV=development`, `FRONTEND_URL=http://localhost:8080`, `SESSION_SAMESITE=Lax`, and `DB_HOST=host.docker.internal` for MySQL on the Windows host. Production always requires HTTPS cookies and a verified database CA. If using Aiven locally, mount its CA read-only and set `DB_SSL_CA` to the container path.

## Environment variables

| Variable | Where / meaning |
| --- | --- |
| `VITE_API_URL` | Vercel: real Render HTTPS origin, without a path. Vite: optional backend override. Never a secret. |
| `BACKEND_ORIGIN`, `BACKEND_PATH` | Optional local WAMP proxy overrides only |
| `APP_ENV` | Backend; `production` in Docker/Render, `development` locally |
| `FRONTEND_URL` | Exact allowed frontend origin and base for reset-page links; no path or wildcard |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Backend database connection; use the port Aiven supplies |
| `DB_SSL_CA` | Absolute path to Aiven's downloaded CA; required in production |
| `APP_TIMEZONE` | Optional, defaults to `Africa/Casablanca`; aligns PHP/MySQL dates |
| `SESSION_SAMESITE` | Optional, defaults to `Lax` for the recommended proxy |
| `SESSION_SECURE` | Local override; production always forces secure cookies |
| `MAIL_TRANSPORT` | `brevo` (recommended on Render) or `smtp` |
| `BREVO_API_KEY` | Backend only; required with Brevo HTTPS |
| `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME` | Verified sender; name defaults to `HealthyTrack` |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_ENCRYPTION` | SMTP only; Brevo relay / 2525 / `tls` is an alternative |
| `MAIL_USERNAME`, `MAIL_PASSWORD` | SMTP only; provider-issued credentials |
| `PORT` | Render supplies this; Docker defaults to 10000 |

Keep secrets in Render settings, a Render secret file, ignored local PHP configuration, or ignored Docker environment files. Never put database credentials or mail keys in a `VITE_*` variable: frontend build variables can be public.

## Production deployment

Follow [DEPLOYMENT.md](DEPLOYMENT.md) for the exact sequence, certificate upload, database import, hosting fields, environment values and final checks.

| Service | Settings |
| --- | --- |
| Aiven | Free MySQL service; import the clean schema with verified TLS |
| Render | Web Service, Docker, branch `main`, root `backend`, Dockerfile `./Dockerfile`, context `.`, health `/health` |
| Vercel | Root `frontend`, Vite, Node 22.x, `npm ci`, `npm run build`, output `dist` |
| Email | Brevo HTTPS API with a verified sender; optional PHPMailer SMTP |

`frontend/vercel.ts` is the supported programmatic equivalent of `vercel.json`: it reads `VITE_API_URL`, proxies `/api/*` and sends frontend routes to `index.html`. Do not add a second Vercel configuration file. [Vercel configuration reference](https://vercel.com/docs/project-configuration/vercel-ts)

Free hosting is suitable for a student demonstration, with limits: Render sleeps after inactivity and can restart; its ephemeral PHP session files disappear, requiring login again. It is not an always-on production service. Aiven's free plan also has resource limits and no SLA. [Render free services](https://render.com/docs/free), [Aiven free MySQL](https://aiven.io/docs/products/mysql/concepts/mysql-free-tier)

## Email and password reset

Render's free service blocks the usual SMTP ports. Set `MAIL_TRANSPORT=brevo` to use `https://api.brevo.com/v3/smtp/email` over HTTPS instead; TLS verification remains enabled. PHPMailer SMTP remains available for WAMP and compatible providers. [Brevo transactional email API](https://developers.brevo.com/docs/send-a-transactional-email)

The existing six-digit code flow is retained: codes are cryptographically random, hashed, purpose-bound, valid for 10 minutes and single-use, with at most five verification attempts. Passwords use bcrypt. Reset emails link to `${FRONTEND_URL}/reset-password`; the user enters their email and code there. No password or code is placed in the URL. Reset/resend responses do not reveal whether an account exists, including when delivery fails.

## Security notes

- Every private API endpoint checks the session. User identity, goal ownership, appointment ownership and administrator/specialist roles are checked on the server.
- Mutations require a session-bound CSRF token. CORS allows the exact configured origin; API and PDF responses are not cached.
- Production sessions use host-only `HttpOnly; Secure; SameSite=Lax` cookies through Vercel. Sessions expire after two hours of inactivity and after a Render restart. Changed passwords invalidate other sessions.
- Aiven connections require its CA and certificate verification. There is no insecure TLS bypass or production fallback to local root credentials.
- Local settings, environment files, keys, dependencies and builds are ignored by Git. Docker copies only selected source directories and excludes credentials.
- Historical commits contain old SMTP credentials. **Revoke/rotate them at the provider before deployment.** Removing them from current files does not remove their history. No history rewrite was performed.
- Use backups and dedicated test accounts.

To bootstrap an administrator, register and verify your own account, then use your private database console to change only that account's role to `admin`. There is no default administrator password or public promotion endpoint.

## Testing

```powershell
cd frontend
npm ci
npm test
npm run lint
npm run build
npm audit
cd ../backend
composer install
composer validate
composer check-platform-reqs
composer audit
php tests/config.php
php -n tests/mail.php
```

From the repository root, with a running **local development MySQL** instance and Python 3.11:

```powershell
$env:PHP_BIN = 'C:/wamp64/bin/php/php8.2.0/php.exe'
py -3.11 backend/tests/security.py
```

The integration script creates and drops only its uniquely named `healthytrack_test_<timestamp>` database, using the local test server's root account with an empty password. It cannot be pointed at the application database by `DB_NAME`; it chooses its own test name. Do not run it against a production MySQL server. It starts temporary PHP/Vite servers on ports 8099/8199 and disables real mail credentials. Mail transport tests mock HTTPS; they do not send email.

The production database check is read-only; `/health` checks the API process, not database connectivity. Docker/cloud/TLS/mail delivery checks require the environment described in the deployment guide. See [FIXES.md](FIXES.md) for the latest actual results and limitations.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Dashboard flashes after login | Keep the CalorieTracker fix: never fetch full health state during render. |
| HTML returned instead of JSON | Check `/health`, the Vite proxy path or Vercel `VITE_API_URL`. A free Render instance may still be waking. |
| Login immediately disappears | Use the Vercel `/api` proxy; check cookie attributes and exact `FRONTEND_URL`. Clear old cookies once. |
| 403 origin error | Frontend origin must match exactly (scheme, hostname and port); preview domains are not automatically trusted. |
| Database error | Check Aiven hostname/port, `DB_SSL_CA`, certificate permissions and the imported schema. Run `database/check.php`. |
| SQL tables missing on Linux | Import the provided schema; table-name capitalization matters. |
| Reset email never arrives | Check verified sender, provider limits and Brevo logs; public reset responses deliberately stay generic. |
| PHP dependency error | Ensure terminal and Apache use supported PHP; run Composer's platform check. |
| Locked npm files on Windows | Stop the project's dev server before installing dependency updates, then retry `npm install`. |
| First request is slow | Wait for Render to wake and retry; health data is kept in MySQL, not the container filesystem. |

## Contributors

Git history credits Oussama Eddamoun ([EDDAMOUN-Oussama](https://github.com/EDDAMOUN-Oussama), also `OussamaPC`), [Zakariae-Assabiri](https://github.com/Zakariae-Assabiri), and [OmarKADDOUR10](https://github.com/OmarKADDOUR10). See `git shortlog -sn --all` for the recorded contributions. No project license has been declared.
