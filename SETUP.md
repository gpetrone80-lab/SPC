# SPC Fire College — Big Two Tracker v2 · One-time setup

The v2 app adds real logins (Master Admin / Instructor / Student), role-based
reports, and offline-first saving. Two one-time Firebase steps are required
before the first login can be created. The app itself, all existing
evaluations, and the roster carry over — nothing is re-entered.

Project: **fireacademy1-c8ef2** · Site: https://gpetrone80-lab.github.io/SPC/

## Step 1 — Turn on Email/Password sign-in (≈1 minute)

1. Go to https://console.firebase.google.com/project/fireacademy1-c8ef2/authentication
2. Click **Get started** if prompted, then open the **Sign-in method** tab.
3. Click **Email/Password** → toggle **Enable** → **Save**.
   (Leave "Email link" OFF.)

## Step 2 — Publish the security rules (≈1 minute)

1. Go to https://console.firebase.google.com/project/fireacademy1-c8ef2/firestore/rules
2. Select **all** the existing text and delete it.
3. Paste the full contents of `firestore.rules` from this repo.
4. Click **Publish**.

> Until these rules are published, the old open rules still apply.
> Publish the rules the same day you start using v2 logins.

## Step 3 — Create the Master Admin (in the app, ≈1 minute)

1. Open https://gpetrone80-lab.github.io/SPC/ — a **FIRST RUN — CREATE MASTER
   ADMIN** form appears under the sign-in box.
2. Email is pre-filled with **gpetrone80@gmail.com**. Choose a password
   (8+ characters), repeat it, tap **CREATE MASTER ADMIN**.
3. You are now signed in as Master Admin. The setup form never appears again.

## Everyday use after setup

- **Add people:** Accounts (Admin) tab → role + name + login ID + temporary
  password → **Create Account**. The app shows the login once — hand it to
  the person.
  - Students sign in with their **Candidate ID** (e.g. `C-101`) + password.
  - Instructors sign in with their **Instructor ID** (e.g. `INST-07`) + password.
  - Creating an account also adds the person to the Roster directories.
- **Remove people:** Roster trash icons (Admin only) remove directory
  entries; Accounts → **Deactivate** blocks a login instantly, **Remove
  login** deletes the login profile. Evaluation history is always kept.
- **Reports:** Reports tab — search + date-from / date-to + PASS/FAIL filters,
  **Export filtered CSV** for the exact view on screen, or the History
  Tracker for one student's full dossier (Word + CSV), filterable by date.
- **Offline:** On the drill ground with no signal, keep grading. The header
  chip shows "Offline — saving on device" and a **Pending upload** badge;
  everything uploads by itself when internet returns. Install the app
  (browser menu → *Add to Home screen*) on each tablet/phone before going
  offline the first time, and open it once while online.

## Notes

- Passwords are stored by Firebase Authentication (hashed) — never in the
  database, never visible to the admin after creation. If someone forgets
  theirs (ID logins use an internal address, so email resets don't apply):
  Firebase Console → Authentication → Users → delete that user, then in the
  app's Accounts tab create the account again with the same ID and a new
  temporary password. Their evaluation history is untouched.
- Student privacy is enforced twice: the app only queries the student's own
  records, and the Firestore rules above refuse any other student's data
  even if the app is tampered with.
