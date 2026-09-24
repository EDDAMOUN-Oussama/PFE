# Fixes and rollout status

## Implemented

- Shared typed health state, a consistent exercise API response, local calendar dates, and latest-weight fallback.
- Deterministic daily totals, decimal weights, transactions, and correct weight-loss/weight-gain completion.
- One JSON response for profile updates; verification starts only after email delivery succeeds.
- Private SMTP configuration; expiring, hashed, purpose-bound, single-use verification codes with attempt limits.
- PHP session login/logout and password-version invalidation for changed passwords.
- Directory-aware Vite API proxy; shared responsive sidebar; separate report loading/empty/error states.
- Goal-derived notifications with per-account local read/hide/snooze actions.
- Regression tests, a schema-only SQL file, and an explicit CLI migration.

## Intentionally pending

The shared backend authentication guard has NOT been applied to all controllers. Its tests pass in isolation, but tracking, reports, appointments, and administrator endpoints still need that integration and endpoint-level verification. The existing authorization gaps in those endpoints remain. This rollout was explicitly deferred; no script applies it automatically.

## Required local steps

1. Back up the application database.
2. Install backend dependencies with `composer install`.
3. Run `php database/migrate.php` from `backend/`. The application database has not been migrated by this code change.
4. Copy `backend/config/local.example.php` to the ignored `backend/config/local.php` and supply database and NEW SMTP credentials. Replace previously exposed credentials at the email provider.
5. Restart the frontend development server and log in again.

## Validation

- Frontend TypeScript checks and production build passed.
- All 56 PHP files passed syntax checks.
- ESLint reports zero errors and nine Fast Refresh warnings in shared UI/context modules.
- Four statistics/date regression tests passed with `npm.cmd test` in `frontend/`.
- 61 isolated session-helper, data-integrity and Vite proxy checks passed with `py -3.11 backend/tests/security.py`. Only synthetic MySQL accounts are used.

The broader authorization rollout, provider-side credential replacement, real email delivery, and visual browser verification are not covered by a successful build.
