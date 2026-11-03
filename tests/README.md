# SPC tests (local only)

Both suites run against the **Firebase emulators on this computer** — they never
read or write the live `fireacademy1-c8ef2` database. The app test aborts any
request to live Google/Firebase servers and reports how many it blocked (should be 0).

Needs Node 18+ and Java 11+.

```
cd tests
npm install
npx playwright install chromium   # first time only
npm test            # if Playwright says the browser is missing, set CHROME_PATH to a Chrome/Chromium binary
```

- `rules.test.mjs` — 74 checks of `firestore.rules`: signed-out, no-profile,
  student, deactivated student, instructor, deactivated instructor, Master Admin,
  and first-run setup.
- `e2e.cjs` — loads the real `index.html` (Firebase SDK served from
  `node_modules`, pointed at the emulators) and walks through: first-run Master
  Admin setup → creating instructor/student accounts → instructor grading →
  student sees only their own records → password reset (twice) → old password
  and old login refused → deactivated account blocked. Screenshots go to
  `tests/shots/`.

Known first-run race (one-time setup only): right after **CREATE MASTER ADMIN**,
the data/roster listeners can start before the new admin profile reaches the
server, get refused once, and stay empty until the page is reloaded. The test
reloads after setup. Production setup is already done, so this does not affect
daily use.
