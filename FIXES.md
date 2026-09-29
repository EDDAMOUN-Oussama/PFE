# Fixes and deployment readiness

Updated 2026-09-29. This file records repository work and actual local checks; it does not claim a live deployment exists.

## Implemented

- Preserved the CalorieTracker fix and regression test: rendering no longer triggers a full dashboard refresh loop.
- Applied the shared session, ownership and role guard to every private PHP controller after explicit approval. Tracking, reports, profiles, goals, appointments and administrator actions now require the appropriate identity/permissions. CSRF is checked before writes.
- Centralized exact-origin CORS and production cookie configuration. Vercel's `/api` proxy keeps PHP sessions on the browser's own origin; stale CSRF tokens get one bounded retry.
- Added a PHP 8.3/Apache Docker image, Render PORT startup, a restricted public document root and a non-sensitive `/health` endpoint.
- Added environment-based database configuration with verified MySQL TLS/CA, utf8mb4 and consistent application/database dates. Production cannot fall back to local root credentials or an unverified database connection.
- Added Brevo HTTPS email while preserving PHPMailer SMTP and legacy local settings. Reset codes remain random, hashed, expiring, purpose-bound, single-use and attempt-limited. Generic reset responses also cover provider failures. Reset email links use `FRONTEND_URL`.
- Removed password/form payload logging and sensitive database error responses. PDF reports now use one correct content type and `no-store` caching.
- Updated vulnerable frontend tooling/router dependencies and removed unused spreadsheet/PDF-import packages. React 18 and the existing UI are retained.
- Updated the complete schema for new installations; added a read-only database/schema check. The legacy migration remains explicit and CLI-only.
- Added safe environment examples, Docker/Git exclusions, a rewritten README and a step-by-step deployment guide.

## Validation actually executed

| Check | Result |
| --- | --- |
| `npm install` | Passed; lockfile updated. Windows reported cleanup warnings for old dependency files held by a running process. |
| `npm test` | 12 tests passed, including CalorieTracker, API/CSRF, date/statistics and Vercel config tests. |
| `npm run build` | Passed; TypeScript application/config checks and Vite 7.3.6 production bundle completed. |
| `npm run lint` | Passed with 0 errors and 9 pre-existing Fast Refresh warnings. |
| `npm audit` | 0 reported vulnerabilities after dependency updates. |
| Composer install / platform check | Passed on local PHP 8.2.0. Docker targets maintained PHP 8.3. |
| `composer validate` | Valid; warning that no project license is specified. No license was invented. |
| `composer audit` | No reported advisories. |
| PHP syntax | 61 project PHP files passed; ignored private config/vendor code excluded. |
| `php tests/config.php` | 9 production-origin, cookie and required-CA checks passed. |
| `php -n tests/mail.php` | 11 mocked mail checks passed; no external email sent. |
| `backend/tests/security.py` | 148 isolated API authorization, workflow, data integrity and proxy checks passed. |
| SQL schema/import | Created/imported/migrated in uniquely named local test databases; no table-name case mismatches found in controller queries. |
| Docker start script | Shell syntax passed. |
| Secrets review | No credential-pattern findings or copied private credential values in the candidate tree. Only example environment files are tracked. |

The integration suite tested anonymous denial for every private endpoint, cross-account access, role checks, appointment ownership/status, admin approval, decimal weights, goals, food/exercise totals, transactions, profile rollback, reset expiry/replay/attempt limits, email-change verification, PDF export, account cleanup, CORS, protected internal paths and PHP session login through Vite.

Early verification failures were resolved: PDF headers were corrected; frontend dependencies finished updating before the final checks; the TypeScript ESLint adapter was updated to match the patched ESLint release; mock mail functions were made compatible with normal PHP syntax checking.

## Not verified / remaining owner actions

- **NOT VERIFIED:** Docker image build/start; Docker is not installed in this workspace. Build it locally or inspect the first Render build.
- **NOT VERIFIED:** Aiven service-specific TLS connectivity and import. Create the service, download its CA, import the clean schema, and run `php database/check.php` with that service's settings.
- **NOT VERIFIED:** Actual Vercel deployment/routing and browser cookie behavior. Configure the exact Render URL and frontend origin, deploy, and run the acceptance tests in `DEPLOYMENT.md`.
- **NOT VERIFIED:** Live Brevo delivery/sender setup. Create a new key, verify the sender, configure Render and test with your own account.
- **NOT VERIFIED:** Visual browser review, real-provider cold starts and availability. No browser automation runtime is available here.
- Rotate the old SMTP credentials found in Git history. Their values were not printed and history was not rewritten.
- Free Render session files are ephemeral; a restart/sleep requires login again. Health data stays in Aiven. Free hosting has availability/resource limits.

## Existing installations

The application database was **not modified** by this deployment preparation. Only generated test databases were created and dropped. Existing ignored `backend/config/local.php` was preserved.

Before updating an existing database, back it up and run the documented CLI migration. A new deployment imports the current clean schema instead. Restart the local Vite server after installing the updated dependencies.
