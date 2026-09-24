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

The notification page currently uses demonstration data. The interface is French; the language setter does not currently switch languages.

## Technology

- **Frontend:** React 18, TypeScript, Vite 5, React Router, Tailwind CSS, shadcn/ui and Radix UI.
- **Forms and charts:** React Hook Form, Zod, and Recharts.
- **Backend:** PHP controllers, MySQL through MySQLi, and Composer.
- **Email and documents:** PHPMailer and TCPDF. The Composer manifest also includes PhpSpreadsheet and TCPDI.
- **Local environment:** Wampserver on Windows (Apache, PHP, and MySQL).

## Before you start

You need Git, Node.js with npm, Composer, and a PHP/MySQL web-server environment. The locked frontend tooling requires Node.js 18 or newer; use a maintained Node.js release compatible with the lockfile. PHP 8.2 is a suitable local target for the declared backend dependencies; verify your installation with Composer's platform check below.

Enable MySQLi and the PHP extensions required by Composer, including curl, dom, fileinfo, gd, mbstring, xml, xmlreader, xmlwriter, zip, and OpenSSL for email. Composer reports any additional missing requirements.

**Database prerequisite:** this repository does not include a SQL schema, migrations, or seed data. Obtain a compatible `HealthyTrackdb` SQL export from the project team before attempting a fresh database installation. Creating an empty database alone is insufficient. Never commit an export containing real user information.

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

The frontend currently contains absolute API URLs beginning with `http://localhost/Healthy_track/backend/controllers/`. Apache must serve **this checkout's** backend at that address.

### 2. Start Apache and MySQL

Open Wampserver and select **Start All Services** from its tray menu. Confirm that Apache and MySQL are running, then open `http://localhost/phpmyadmin`.

Use the MySQL instance that contains your project database. A separate MariaDB instance may have different databases and connection settings.

### 3. Import and configure the database

In phpMyAdmin, import the compatible SQL export into `HealthyTrackdb`. If the export does not create the database, create it first with the `utf8mb4` character set.

The controllers reference these tables (spelling and capitalization vary between queries):

- `users`
- `foodEntry`
- `exerciseEntry`
- `weightEntry`
- `DailyStats`
- `Goal`
- `appointments`
- `specialist_requests`

Check the connection constants in [`backend/config/db.php`](backend/config/db.php):

| Setting | Local default |
| --- | --- |
| Host | `localhost` |
| User | `root` |
| Password | Empty string |
| Database | `HealthyTrackdb` |

Update them for your local MySQL installation. Database configuration is currently read directly from this PHP file; adding a `.env` file alone will not change it.

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

Registration, verification-code resending, password recovery, and email changes use SMTP. Review the PHPMailer configuration in:

- [`register.php`](backend/controllers/register.php)
- [`resend_code.php`](backend/controllers/resend_code.php)
- [`forgotPassword.php`](backend/controllers/forgotPassword.php)
- [`updateUser.php`](backend/controllers/updateUser.php)

Configure your own SMTP host, username, password, sender, encryption, and port consistently in these files. The current configuration uses SSL on port 465. Do not reuse or publish embedded credentials; move real credentials into a local configuration mechanism before deployment. The application does not currently load SMTP settings from `.env` automatically.

New accounts must complete email verification before login. There are no documented default demonstration credentials or automatic administrator seed accounts.

### 6. Install and start the frontend

From the repository root:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev -- --port 8080 --strictPort
```

Open **http://localhost:8080** and keep the terminal running. On shells other than Windows PowerShell, use `npm` instead of `npm.cmd`.

Use exactly `localhost:8080`: backend CORS headers expect this origin. If port 8080 is occupied, stop the conflicting development server or update the CORS configuration consistently before choosing a different origin.

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

There is no automated test script in `package.json`. A successful frontend build does not validate database connectivity, email delivery, or PHP endpoint behavior.

## Project structure

```text
backend/
  config/db.php          MySQL connection
  controllers/          Account, tracking, appointment, and report endpoints
  helpers/              JSON response helper
  routes/api.php        Legacy partial router
  composer.json         PHP dependency definitions
  composer.lock         Locked PHP dependency versions
frontend/
  public/               Static images and browser assets
  src/
    components/         Feature components and shared UI primitives
    contexts/           Health state, French translations, and themes
    hooks/              Shared React hooks
    pages/              Application screens
    types/              Health-related TypeScript definitions
    App.tsx             Client-side routes
    main.tsx            React entry point
  package.json          Frontend dependencies and scripts
  package-lock.json     npm dependency lockfile
  vite.config.ts        Development server and import aliases
```

The frontend calls PHP controller files directly. `backend/routes/api.php` is incomplete and references missing `food.php` and `stats.php`; it is not the entry point used by the current frontend.

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
| Reports keep showing a loading message | The current report screen expects weight, calorie, and macro datasets; empty datasets can leave it on the loading screen. |
| Daily-stat updates fail despite successful exercise loading | `getExerciseEntries.php` returns an array, while one `HealthContext` update path expects `{ success, entries }`; these response contracts need to be aligned. |

## Current limitations and deployment

This is an academic application with unfinished areas. In addition to the missing database schema and demonstration notifications, weight-goal progress uses a fixed value in some cases and needs a consistent completion rule.

Before hosting it publicly, implement server-side authentication and authorization for every protected endpoint. Several controllers currently trust client-provided user IDs, and the legacy authentication controller compares passwords directly. Existing SMTP credentials in source must be replaced and removed from tracked configuration. A `.gitignore` cannot remove secrets already present in Git history.

Deployment also requires replacing localhost API URLs and CORS origins, configuring Apache/PHP and MySQL, and adding an SPA fallback to `index.html` for React Router routes. Table-name capitalization should be normalized before moving to a case-sensitive MySQL environment. Uploading `frontend/dist` alone does not deploy the backend.

## Contributors

The repository's Git history credits the following contributors. Multiple author aliases have been grouped under the same person where identifiable:

- **Oussama Eddamoun** — [EDDAMOUN-Oussama](https://github.com/EDDAMOUN-Oussama) (also recorded as OussamaPC and Oussama Eddamoun).
- **Zakariae Assabiri** — [Zakariae-Assabiri](https://github.com/Zakariae-Assabiri).
- **Omar** — [OmarKADDOUR10](https://github.com/OmarKADDOUR10).

Specific responsibilities are not documented in the repository, so no role assignments are inferred. The frontend originated from a Lovable scaffold and uses the open-source libraries listed in its package manifest.

## Contributing and license

Describe changes and reproduction steps clearly, run relevant build/lint checks, and keep dependencies, build outputs, credentials, and personal database exports out of commits. Commit dependency manifests and lockfiles so installations are reproducible.

No project-level license file is currently included. Contact the maintainers about reuse or redistribution; third-party dependencies retain their own licenses.
