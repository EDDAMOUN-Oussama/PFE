# Deploy HealthyTrack: Vercel + Render + Aiven

This guide uses the repository `EDDAMOUN-Oussama/PFE`, branch `main`. The Git root contains `frontend/` and `backend/`; do **not** use `PFE/frontend` as a hosting Root Directory.

The accounts, credentials, real hostnames and provider-side tests below must be completed by the project owner. No cloud service was created by the repository changes.

## 1. Prepare GitHub and credentials

1. Keep the production configuration committed, including both lockfiles, `backend/Dockerfile`, `backend/public/`, `frontend/vercel.ts` and the clean SQL schema.
2. Exclude `.env`, `config/local.php`, keys/CA files, `node_modules`, `vendor`, `dist`, logs and database backups.
3. Rotate the SMTP credentials that appeared in historical commits. Use a new Brevo API key for deployment. Do not paste credentials into GitHub or frontend variables.
4. Run the checks in [README.md](README.md#testing), then push `main`.

```sh
git status
git diff --stat
git push origin main
```

Use only hosting plans labelled **Free/Hobby**, and review the provider limits before confirming. Render free services sleep and can restart; an inactive service can take around a minute to wake. Aiven free MySQL has limited resources and no SLA. This setup is intended for a student/hobby deployment rather than guaranteed availability. [Render limits](https://render.com/docs/free), [Aiven free plan](https://aiven.io/docs/products/mysql/concepts/mysql-free-tier)

## 2. Create Aiven MySQL

1. Create an Aiven account and a **Free MySQL** service, not a time-limited paid trial.
2. Wait until the service is running.
3. Open its connection information and record the host, port, username, password and database name privately.
4. Download that service's CA certificate and keep it locally as `aiven-ca.pem` outside Git.
5. Use an empty database such as the provided `defaultdb`, or create a dedicated `healthytrack` database in Aiven's database UI.

| Aiven value | Backend setting |
| --- | --- |
| Host | `DB_HOST` |
| Port | `DB_PORT` (use the supplied value; it may not be 3306) |
| User | `DB_USER` |
| Password | `DB_PASSWORD` |
| Database selected for import | `DB_NAME` |
| Downloaded CA certificate | `DB_SSL_CA` (path to mounted certificate) |

Use Aiven's hostname, not a resolved IP, so the certificate identity can be checked. HealthyTrack requires verified TLS in production even if a server permits unencrypted clients. Keep certificate validation enabled. [Aiven connection documentation](https://aiven.io/docs/products/mysql/howto/connect-with-mysql-cli)

## 3. Import the database

Install/use a MySQL 8 client or MySQL Workbench on your computer. The command below prompts for the password; it never puts it in command history. Replace the placeholders with Aiven's values:

```sh
mysql --host=<AIVEN_HOST> --port=<AIVEN_PORT> --user=<AIVEN_USER> --password --ssl-mode=VERIFY_IDENTITY --ssl-ca=<ABSOLUTE_CA_PATH> <DB_NAME>
```

At the MySQL prompt, confirm that this is the intended **empty** database and import the schema:

```sql
SELECT DATABASE();
SHOW TABLES;
SOURCE C:/wamp64/www/pfe/PFE/backend/database/schema.sql;
SHOW TABLES;
SHOW SESSION STATUS LIKE 'Ssl_cipher';
```

Use your own checkout path for `SOURCE`. The TLS cipher must be nonempty. The import creates ten tables, including `auth_codes` and `auth_limits`. It contains no user data and is already current; fresh installs do not need the legacy migration.

Workbench alternative: configure the same connection with **Require and Verify Identity**, select the downloaded CA file, then open and run `backend/database/schema.sql` against the empty database.

For an existing database, take a backup and run `php database/migrate.php` from a local machine configured for that database. Do not import the fresh schema or run schema changes automatically when a container starts. A free Render instance has no interactive shell, so the guide performs initialization from your computer. [Render free-service restrictions](https://render.com/docs/free)

## 4. Create the Render backend

Create **New > Web Service**, connect GitHub and choose the repository:

| Render field | Exact setting |
| --- | --- |
| Repository | `EDDAMOUN-Oussama/PFE` |
| Branch | `main` |
| Language / Runtime | Docker |
| Root Directory | `backend` |
| Dockerfile Path | `./Dockerfile` (relative to Root Directory) |
| Docker Build Context | `.` (the `backend` directory) |
| Docker Command | Leave blank; use the image's CMD |
| Instance Type | Free |
| Health Check Path | `/health` |

The image uses PHP 8.3/Apache, installs locked Composer dependencies and listens on Render's `PORT`. It does not run migrations or copy private configuration into the image. [Render Docker setup](https://render.com/docs/docker)

## 5. Configure Render environment variables and CA

In the Render service settings, add a **Secret File** named `aiven-ca.pem`. Paste the complete CA certificate downloaded from this Aiven service, including its BEGIN/END lines. Render makes it available at `/etc/secrets/aiven-ca.pem`; it must not be committed or copied into the Docker image.

Enter these environment variables. Values below are placeholders except the safe defaults:

```env
APP_ENV=production
APP_TIMEZONE=Africa/Casablanca
DB_HOST=<AIVEN_HOST>
DB_PORT=<AIVEN_PORT>
DB_NAME=<DATABASE_IMPORTED_IN_STEP_3>
DB_USER=<AIVEN_USER>
DB_PASSWORD=<AIVEN_PASSWORD>
DB_SSL_CA=/etc/secrets/aiven-ca.pem
FRONTEND_URL=https://<YOUR_VERCEL_PROJECT>.vercel.app
SESSION_SAMESITE=Lax
MAIL_TRANSPORT=brevo
BREVO_API_KEY=<NEW_BREVO_API_KEY>
MAIL_FROM_ADDRESS=<VERIFIED_SENDER_EMAIL>
MAIL_FROM_NAME=HealthyTrack
```

Render provides `PORT` automatically. Do not add real secrets to a `VITE_*` setting. `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME` and `MAIL_PASSWORD` are unnecessary with `MAIL_TRANSPORT=brevo`.

If the Vercel domain is not known yet, use your intended project hostname temporarily and replace it in step 9. `/health` can be checked before the frontend is available, but account actions need the correct origin.

## 6. Deploy and test the API process

Deploy the Render service and inspect its build/runtime logs. Record its real URL, for example `https://<YOUR_RENDER_SERVICE>.onrender.com`.

Open:

```text
https://<YOUR_RENDER_SERVICE>.onrender.com/health
```

Expected JSON:

```json
{"status":"ok","service":"healthytrack-api"}
```

This is a process health check, not a database or email test. `/config/local.php`, `/database/schema.sql`, `/vendor/autoload.php` and `/controllers/getUser.php` must return 404. The public account route is `/getUser.php`, and an anonymous request must return 401.

To verify database/schema connectivity separately, configure a local PHP CLI with the Aiven environment variables and the local CA path, then run from `backend/`:

```sh
php database/check.php
```

Expected output includes `TLS: active`. This command performs no data changes. Do not troubleshoot by disabling TLS checks.

## 7. Create the Vercel frontend project

Import the same GitHub repository into Vercel:

| Vercel field | Exact setting |
| --- | --- |
| Repository | `EDDAMOUN-Oussama/PFE` |
| Production branch | `main` |
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Node.js Version | 22.x |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

## 8. Set the real backend URL before building

Before clicking Deploy, add this Vercel variable for **Production**:

```env
VITE_API_URL=https://<YOUR_RENDER_SERVICE>.onrender.com
```

Use the real URL from step 6, with no `/api`, `/controllers` or endpoint suffix. `frontend/vercel.ts` validates the URL and creates these ordered rewrites:

```text
/api/:path*  -> https://<YOUR_RENDER_SERVICE>.onrender.com/:path*
/(.*)       -> /index.html
```

The browser continues calling its own Vercel domain. Vercel forwards requests and host-only session cookies to Render. Backend cookies are `HttpOnly`, `Secure`, `SameSite=Lax`, with no fixed Domain. The API client includes credentials and CSRF headers.

This design avoids unreliable third-party session cookies across the two providers. Do not replace `/api` calls with direct Render requests. Do not add a conflicting `vercel.json`. Vercel supports environment-dependent configuration through `vercel.ts`. [Vercel configuration](https://vercel.com/docs/project-configuration/vercel-ts), [external rewrites](https://vercel.com/docs/routing/rewrites)

## 9. Update FRONTEND_URL on Render

After Vercel assigns the production domain, copy its exact origin to Render:

```env
FRONTEND_URL=https://<ACTUAL_VERCEL_PROJECT>.vercel.app
```

No trailing path, wildcard or comma-separated origins. This value controls CORS and reset-page email links. If you adopt a custom domain, update it here.

Deploy/restart the Render service after changing environment settings. Preview deployments have different origins and are intentionally not automatically trusted. Use a separate backend/database for previews, or test only on the configured production domain.

## 10. Configure Brevo email

1. Create a Brevo account and enable transactional email.
2. Verify a sender address (and authenticate your sending domain if using one).
3. Create a new API key, store it only in Render's `BREVO_API_KEY`, and set the matching `MAIL_FROM_ADDRESS`.
4. Use `MAIL_TRANSPORT=brevo`. Requests use HTTPS with certificate checks; the API key never goes to the browser.
5. Check Brevo's transactional logs and sending quota when testing registration or resets.

The application retains secure verification codes; it does not email passwords. Codes expire in ten minutes, are limited to five attempts and can be consumed only once. Reset emails link to the configured frontend's `/reset-password` page. Enter the email and code on that page, including when opening it on another device.

SMTP alternative, if your provider/account supports it:

```env
MAIL_TRANSPORT=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=2525
MAIL_ENCRYPTION=tls
MAIL_USERNAME=<BREVO_SMTP_LOGIN>
MAIL_PASSWORD=<BREVO_SMTP_KEY>
MAIL_FROM_ADDRESS=<VERIFIED_SENDER_EMAIL>
MAIL_FROM_NAME=HealthyTrack
```

Do not use Gmail ports 465/587 on Render Free. The HTTPS API is the recommended path. SMTP and API keys are different credentials. [Brevo email API](https://developers.brevo.com/docs/send-a-transactional-email), [Brevo SMTP](https://developers.brevo.com/docs/smtp-integration)

## 11. Redeploy configuration changes

- Render environment/secret file changes require a deploy or restart.
- Changes to `VITE_API_URL` require a new Vercel deployment; it is a build-time setting.
- Verify the final Vercel domain matches `FRONTEND_URL` exactly.
- A Render restart invalidates PHP session files. Users sign in again; MySQL health data is retained. The frontend renews stale CSRF tokens once and never blindly retries failed writes.

## 12. Final production acceptance tests

Use dedicated test accounts and modest synthetic data:

1. Open `/login`, `/dashboard`, `/profile` and `/reset-password` directly on Vercel; refresh each route. There must be no hosting 404.
2. Register a new account, receive its code and verify it. Log in, refresh the page and confirm the session remains connected without flickering.
3. Add a meal, exercise, decimal weight and goal. Confirm the dashboard, charts and monthly totals update. Download the PDF.
4. Edit profile and health data; verify an email change. Change the password and confirm another session is invalidated.
5. Request a password-reset code; reset the password and verify that reusing the same code fails. Compare the public response for an unknown email.
6. Log out and confirm private requests return 401. With a logged-in test account, changing a requested `user_id` to another account must return 403.
7. From a regular account, administrator APIs must return 403. Specialists must only modify appointments assigned to them.
8. Test appointment creation, specialist requests, administrator approval and specialist status changes using separate accounts.
9. In browser DevTools, check that requests use `/api`, cookies include `HttpOnly`, `Secure`, `SameSite=Lax`, and API/PDF responses have `Cache-Control: no-store`.
10. Delete only a disposable account and verify its associated records are cleaned up.
11. Repeat login after Render has slept or restarted; wait for wake-up if needed. Record provider-side TLS, mail delivery and cold-start results.

For the first administrator, register/verify your account, identify it privately in the database console, then run an update scoped to that account:

```sql
UPDATE users SET role = 'admin'
WHERE email = '<YOUR_VERIFIED_ADMIN_EMAIL>' AND is_verified = 1 AND role = 'user';
```

Never promote accounts based on an unauthenticated browser request. There are no seeded administrator credentials.

## Verification limits and rollback

**NOT VERIFIED until you run the provider tests:** Docker build/start on Render, Aiven TLS connectivity using your service certificate, Vercel's actual proxy/cookie behavior, live email delivery, browser appearance and cold starts. Local regression results are recorded in [FIXES.md](FIXES.md).

Keep a database backup before migrating an existing installation. Code rollback is a Git revert followed by redeployment; avoid restoring vulnerable public endpoints. Never import a blank schema or drop your production database to repair a deployment. Retain the last working Vercel/Render deployment while diagnosing configuration failures.
