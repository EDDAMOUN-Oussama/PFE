# HealthyTrack

HealthyTrack is a final-year project (PFE) for tracking nutrition, exercise, weight, and personal health goals. It combines a French-language React dashboard with a PHP/MySQL backend, and includes appointment booking and specialist-request management.

## Features

| Area | Functionality |
| --- | --- |
| Accounts | Registration, email verification, login, password reset, profile editing, and account deletion |
| Dashboard | Daily calorie intake, calories burned, activity duration, weight, and goal summaries |
| Nutrition | Food entries with calories, protein, carbohydrates, and fats |
| Exercise | Activity entries with duration and calories burned |
| Weight and goals | Weight history, goal creation, editing, and progress displays |
| Reports | Weight and nutrition charts, monthly summaries, and PDF export |
| Appointments | Booking requests and specialist appointment-status management |
| Administration | Review and approve or reject requests to become a specialist |
| Appearance | Light, dark, and system themes |

The notification page derives events from saved goals. Read, hide, and one-hour snooze actions are stored per account in the current browser. The interface is French; the language setter does not currently switch languages.

## Technology

- **Frontend:** React 18, TypeScript, Vite 5, React Router, Tailwind CSS, shadcn/ui and Radix UI.
- **Forms and charts:** React Hook Form, Zod, and Recharts.
- **Backend:** PHP controllers, MySQL through MySQLi, and Composer.
- **Email and documents:** PHPMailer and TCPDF. The Composer manifest also includes PhpSpreadsheet and TCPDI.
- **Local environment:** Wampserver on Windows (Apache, PHP, and MySQL).

## Before you start

You need Git, Node.js with npm, Composer, and a PHP/MySQL web-server environment. The locked frontend tooling requires Node.js 18 or newer; use a maintained Node.js release compatible with the lockfile. PHP 8.2 is a suitable local target for the declared backend dependencies; verify your installation with Composer's platform check below.

Enable MySQLi and the PHP extensions required by Composer, including curl, dom, fileinfo, gd, mbstring, xml, xmlreader, xmlwriter, zip, and OpenSSL for email. Composer reports any additional missing requirements.

**Database setup:** a schema-only SQL file is included at `backend/database/schema.sql`. Fresh installations must import it and run `backend/database/migrate.php`. Existing installations must back up their database and run the migration; do not import the schema over existing tables.

**Access-control status:** session login and account verification have been implemented. Applying the shared authentication/ownership guard to the remaining tracking, reporting, appointment, and administrator endpoints is still pending. These endpoints must not be exposed publicly until that integration is completed. Frontend route checks do not replace backend authorization.

## Local setup with Wampserver

### 1. Place the repository at the expected URL

For a new checkout, run these commands only if `C:\wamp64\www\Healthy_track` does not already contain a project:

```powershell
cd C:\wamp64\www
git clone https://github.com/EDDAMOUN-Oussama/PFE.git Healthy_track
cd Healthy_track
```

The expected layout is:

```text
C:\wamp64\www\Healthy_track\
  README.md
  backend\
  frontend\
```

The frontend calls a single `/api` base URL. Vite proxies those calls to Apache and detects this checkout's directory under WAMP's `www` directory, including a nested `pfe/PFE` checkout.

For a different server layout, copy `frontend/.env.example` to `frontend/.env.local` and set `BACKEND_ORIGIN` and `BACKEND_PATH`. For production, configure a same-origin `/api` reverse proxy, or set `VITE_API_BASE_URL` and the backend `APP_ORIGIN` explicitly. Restart Vite after changing environment settings.

### 2. Start Apache and MySQL

Open Wampserver and select **Start All Services** from its tray menu. Confirm that Apache and MySQL are running, then open `http://localhost/phpmyadmin`.

Use the MySQL instance that contains your project database. A separate MariaDB instance may have different databases and connection settings.

### 3. Import and configure the database

For a fresh installation, create `HealthyTrackdb` with the `utf8mb4` character set and import [`backend/database/schema.sql`](backend/database/schema.sql) in phpMyAdmin. This file contains table definitions only, with no user accounts or personal data.

For an existing database, retain the tables and records. Make a backup first, then run the migration after installing Composer dependencies:

```powershell
cd backend
php database/migrate.php
```

The migration adds verification-code and rate-limit tables, converts workflow tables to InnoDB for transactions, preserves decimal weights, and adds a starting baseline to goals. Existing goals use their current value at migration time as that baseline; review ongoing weight goals if their original starting weights differ. It does not delete application records. The migration is CLI-only and can be run again.

Copy `backend/config/local.example.php` to `backend/config/local.php` and set your local database settings. The local file is ignored by Git; environment variables override it. Defaults remain host `localhost`, database `HealthyTrackdb`, user `root`, and an empty password. PHP does not automatically read `.env` files.

### 4. Install backend dependencies

From the repository root:

```powershell
cd backend
php -v
composer install
composer check-platform-reqs
cd ..
```

Make sure Composer uses the intended PHP executable. Changing the PHP version in Wampserver does not necessarily change the `php` executable on your terminal's `PATH`. Do not bypass missing extension requirements with `--ignore-platform-reqs`.

### 5. Configure email verification

Registration, verification-code resending, password recovery, and email changes share [`backend/helpers/mail.php`](backend/helpers/mail.php). Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_ENCRYPTION`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` in the ignored `backend/config/local.php`, or provide them as environment variables.

Credentials formerly embedded in the controllers have been removed from the working tree. Replace those credentials at the email provider; their presence in older Git history is not undone by this change. Use newly issued credentials in private configuration. Email delivery has not been tested with a real mailbox.

Codes expire after ten minutes, allow at most five attempts, and are bound to their purpose and destination address. Successfully used codes cannot be reused. Accounts must verify their email before login; there are no seeded real accounts or default administrator credentials.

### 6. Install and start the frontend

From the repository root:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev -- --port 8080 --strictPort
```

Open **http://localhost:8080** and keep the terminal running. On shells other than Windows PowerShell, use `npm` instead of `npm.cmd`.

Use `localhost:8080` with the development proxy. Backend `APP_ORIGIN` controls direct cross-origin requests. If port 8080 is occupied, stop the conflicting development server or update the CORS configuration consistently before choosing a different origin.

Apache serves the PHP backend; the Vite server serves the React frontend. Both must remain running. Vite alone does not run PHP.

## First-use walkthrough

1. Register with an email address that can receive the verification code.
2. Verify the account and log in.
3. Complete your health profile, including weight, height, and goals.
4. Add a food entry, an exercise entry, and a weight measurement.
5. Review the dashboard and create a personal goal.
6. Open Reports to view available data and export a PDF.
7. Use Appointments to request a consultation. Specialist and administrator workflows require the corresponding database roles; they are not assigned by ordinary registration.

## Development commands

Run the following from `frontend/`:

| Command | Purpose |
| --- | --- |
| `npm.cmd run dev -- --port 8080 --strictPort` | Start local development at the expected origin |
| `npm.cmd run build` | Generate production frontend files in `dist/` |
| `npm.cmd run build:dev` | Build with Vite's development mode |
| `npm.cmd run lint` | Run ESLint |
| `npm.cmd run preview -- --port 8080 --strictPort` | Preview an existing build at the expected origin |

Run `npm.cmd test` in `frontend/` for statistics/date regression tests. From the repository root, run `py -3.11 backend/tests/security.py` for the isolated PHP/MySQL integration suite (Python 3 and PHP on PATH are required). The suite creates a uniquely named `healthytrack_test_*` database using local MySQL root access, inserts only synthetic accounts, and drops that database afterwards. It never uses application records. Ports 8099 and 8199 must be free; frontend dependencies must be installed for the proxy checks.

The integration suite tests the pending authorization helper separately from the endpoints where it has not yet been installed. Passing those helper tests is not evidence that every endpoint is already protected. A frontend build also does not verify real SMTP delivery or visual browser behavior.

## Project structure

```text
backend/
  config/db.php          MySQL connection
  config/local.example.php  Private configuration template
  database/              Schema-only SQL and migration CLI
  tests/                 Isolated integration checks
  controllers/          Account, tracking, appointment, and report endpoints
  helpers/              JSON response helper
  routes/api.php        Retired router (HTTP 410)
  composer.json         PHP dependency definitions
  composer.lock         Locked PHP dependency versions
frontend/
  public/               Static images and browser assets
  src/
    components/         Feature components and shared UI primitives
    contexts/           Shared health state, French translations, and themes
    lib/api.ts          Session-aware API client
    lib/health.ts       Pure date/statistics calculations
    hooks/              Shared React hooks
    pages/              Application screens
    types/              Health-related TypeScript definitions
    App.tsx             Client-side routes
    main.tsx            React entry point
  package.json          Frontend dependencies and scripts
  package-lock.json     npm dependency lockfile
  vite.config.ts        Development server and import aliases
```

The frontend calls PHP controller files directly. `backend/routes/api.php` is retired and returns HTTP 410. The frontend uses the controller endpoints through the API client.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `localhost` refuses the connection | Start Apache and MySQL in Wampserver. |
| Frontend cannot reach PHP or receives HTML instead of JSON | Verify the `/Healthy_track/backend/` mapping, especially with nested project copies; inspect the failing request and PHP error logs. |
| Unknown database or missing table | Import the compatible schema into the MySQL instance configured in `db.php`. |
| `vendor/autoload.php` or TCPDF is missing | Run `composer install` inside `backend/`. |
| Composer reports a missing extension or PHP mismatch | Check `php -v`, `php --ini`, and `composer check-platform-reqs`; enable extensions for the CLI PHP installation too. |
| PowerShell blocks `npm.ps1` | Use `npm.cmd`, as in the commands above. |
| Browser reports CORS errors | Use `http://localhost:8080` and confirm the endpoint allows that origin. |
| Verification email never arrives | Check SMTP configuration, sender permissions, spam folders, and the endpoint's email error. |
| Login says the account is unverified | Complete email verification before signing in. |
| Session requests fail after updating | Run `php database/migrate.php` in `backend/`, then sign in again. |
| A goal baseline differs from its original starting weight | Existing goals are baselined from their current value during migration. Review or recreate an ongoing goal with its intended starting value. |

## Current limitations and deployment

The remaining backend authorization integration is the primary outstanding security requirement. The prepared helper is `backend/helpers/bootstrap.php`; it is active on session/login and account-verification endpoints but not on the remaining legacy/data endpoints. Complete ownership and role enforcement there before deployment.

Statistics are recalculated from persisted entries, and multi-step tracking writes use transactions. Weight goals use a starting baseline and support loss or gain. Calorie and exercise goals accumulate over their selected period; they are not automatic daily or weekly reset schedules.

Notifications are generated from goals and stored locally for this browser. They do not send email, push notifications, or background alarms. TypeScript's legacy project settings remain permissive, and some shared UI/context modules still produce development-only Fast Refresh lint warnings.

Deployment requires Apache/PHP, MySQL, private configuration, the migration, and an SPA fallback for React Router. Configure the API proxy/base URL and allowed origin for your host. Uploading `frontend/dist` alone does not deploy the backend. Browser layout and real email delivery require verification in the target environment.

## Contributors

The repository's Git history credits the following contributors. Multiple author aliases have been grouped under the same person where identifiable:

- **Oussama Eddamoun** — [EDDAMOUN-Oussama](https://github.com/EDDAMOUN-Oussama) (also recorded as OussamaPC and Oussama Eddamoun).
- **Zakariae Assabiri** — [Zakariae-Assabiri](https://github.com/Zakariae-Assabiri).
- **Omar** — [OmarKADDOUR10](https://github.com/OmarKADDOUR10).

Specific responsibilities are not documented in the repository, so no role assignments are inferred. The frontend originated from a Lovable scaffold and uses the open-source libraries listed in its package manifest.

## Contributing and license

Describe changes and reproduction steps clearly, run relevant build/lint checks, and keep dependencies, build outputs, credentials, and personal database exports out of commits. Commit dependency manifests and lockfiles so installations are reproducible.

No project-level license file is currently included. Contact the maintainers about reuse or redistribution; third-party dependencies retain their own licenses.
