# SPC Fire College — Big Two Tracker · User Manual

Website: https://gpetrone80-lab.github.io/SPC/ · Version 2.13 — November 2026

This manual has one section per role. Find your role and follow it — every task is a short numbered list.

## GETTING STARTED (EVERYONE)

### Sign in

1. Open the website above on your phone, tablet, or computer.
2. Type your Login ID and your personal password. Tap SHOW next to the password box to check what you typed.
3. Tap SIGN IN. You only ever see what your role allows.

- Admin: your email address. Instructor: your Instructor ID (example INST-07). Student: your Candidate ID (example C-101).
- Lost? Tap MORE → MANUAL at the top of the app (or the manual link under the sign-in box) — it opens this manual.

### Sign out

Tap MORE → SIGN OUT at the top of the screen, or SIGN OUT at the right end of the bottom bar on a phone. Always sign out on a shared tablet — signing out also clears the records saved on that device, so the next person cannot see them.

> **Note:** If anything is still “Pending upload”, sign-out keeps it on the device so nothing is lost. Reconnect to the internet, let it upload, then sign out again to clear the device.

### Install it like an app (recommended)

1. Open the site once while you have internet.
2. Easiest: tap the gold INSTALL THE APP button on the sign-in screen (or MORE → INSTALL APP once you are signed in) and confirm (Android / Chrome). On iPhone or iPad: tap Share → Add to Home Screen. Either way, the SPC icon lands on your home screen and the app opens full-screen, like a regular app — no browser bars.

- Open the site in Chrome or Safari directly — links opened inside another app (email, chat, Facebook) run in a stripped-down browser that cannot install apps.
- Already installed? Long-press the SPC icon for shortcuts straight to New Evaluation, Reports, or History.

### Working with no internet

The app keeps working offline. Anything you save is stored on the device first; the header shows “Pending upload” and everything uploads by itself when internet returns. Do not clear the browser/app data while records are pending.

> **Note:** Wrong password? You get “Sign-in failed — check your ID and password.” After a few tries, see the Master Admin — only the admin can reset a password.

## SECTION 1 — MASTER ADMIN

The Master Admin owns all accounts. Only the admin can add or remove instructors and students and manage logins.

### Add an instructor or student login

1. Sign in as Admin → open the Accounts (Admin) tab.
2. Pick the Role: Instructor or Student.
3. Type the person's full Name and Login ID — Candidate ID for a student (C-101), Instructor ID for an instructor (INST-07).
4. For a student, type the Class (example 2026-02).
5. Type a Temporary Password (8+ characters, easy to say out loud, example Spartan-4821).
6. Tap Create Account. The app shows the login once — write it down and hand it to the person. It is not stored anywhere you can look it up later.

> **Note:** Creating the login also adds the person to the Roster and to the pick-lists in the evaluation form. One step — nothing else to set up.

### Block or remove a login

- Accounts tab → Deactivate: blocks sign-in instantly. Records are kept. Reactivate undoes it.
- Accounts tab → Remove login: deletes the login profile. The person's evaluation history stays in the reports.
- Roster tab → trash icon: removes the person from the directories/pick-lists. This does not delete their login or their history.

### Change a student's or instructor's password

1. Open the Accounts tab and find the person in Existing Accounts.
2. Tap Password.
3. Type the new temporary password (8+ characters) and tap SET NEW PASSWORD.
4. Give the person their Login ID + the new password once — it is shown on screen and is not stored anywhere you can look it up later.

> **Note:** The old password stops working the moment you save. The person's ID, name, and every evaluation record stay exactly the same — only the password changes. Your own Master Admin password is different: it uses your real email, so change it in the Firebase Console (Authentication → your user) or with the email password-reset.

### End of academy — back up, reset, start fresh

When a class graduates: save everything, wipe the site, add the next class. All three tools are in the Accounts tab, in the red Academy Data card.

1. Download Full Backup. One .json file saves: every evaluation, every archived day, and the full roster. Store it somewhere safe (email it to yourself, Drive, a USB stick).
2. Tap Reset Site — Start Fresh.
3. In the window: Step 1 downloads a backup again (skip if you just did it), tick the Step 2 box confirming you saved a backup, then type RESET in Step 3.
4. Tap ERASE EVERYTHING and confirm once more. Done: all evaluations, archives, rosters, and student/instructor logins are erased. Your Master Admin login is kept.
5. Add the new class: create logins in Accounts (each new login also builds the roster), and you are ready for day one.

> **Note:** Passwords are never inside a backup file — backups restore records and rosters, not logins. After any reset or restore, people sign in with new accounts you create.

- Reused Candidate IDs are fine: if the new class uses an ID the old class had (example C-101), just create the account — the app automatically gives the new student a fresh login under that ID.

### Restore a backup

1. Accounts tab → Academy Data card → Restore from Backup → pick the .json backup file.
2. Read the confirmation counts (evaluations, archived days, roster) and tap OK.
3. Records come back with their original IDs. Anything on the site with the same ID is overwritten; everything else is kept. Lists refresh by themselves.
4. If people need to sign in again, recreate their logins in Accounts — logins are not part of a backup.

### Reports and totals (also covered in the Instructor section)

As Admin you can do everything an instructor can: grade, run reports, use End-of-Day, and correct records. See Section 2.

## SECTION 2 — INSTRUCTOR

### Record an evaluation (New Entry)

1. Tap New Evaluation (+ Eval on a phone).
2. Pick the instructor and the candidate from the pick-lists (or type name, ID #, class, date by hand).
3. For each task: tap START to run the big timer — no timer starts by itself, not even Task 1. PAUSE stops it. Tick the checklist items as the student performs them.
4. Tap PASS or FAIL for the task and type any feedback note. PASS or FAIL also stops that task's timer and keeps the recorded time.
5. Want to lock in your progress before uploading? Tap SAVE TO DEVICE (DEVICE on the phone bar). Everything on the form stays on this phone or tablet, even if the app closes, and “Saved on device ✓” shows the time.
6. At the bottom, tap SAVE TO CLOUD. “Saved ✓” means it is on the device; if you are offline it uploads automatically later (watch for the “Pending upload” badge to clear). The device copy is removed once it is saved to the cloud.

> **Note:** Over the time limit = automatic FAIL. The task shows a red OVER LIMIT · AUTO FAIL badge and PASS is locked. The timer keeps running so the student's full time is recorded — tap PAUSE when they finish.

- On a phone, a navy bar stays pinned at the bottom of this screen with the current task's timer, PASS / FAIL, DEVICE, and SAVE — you never scroll to save mid-drill.
- The 5 tasks: 1) PPE – SCBA – Hose Pull Pattern (limit 4:40) · 2) Rope and Knots (2:00) · 3) Ladder Raise & Search (4:40) · 4–5) Custom Drills (5:00 — you can rename these two in the form).
- Closed the form by accident? The draft is saved on the device and offered back when you return (“Resumed from Memory”). A running timer saves itself every 5 seconds. Timers come back paused — tap START to continue.
- Clear Form or New Evaluation asks “Discard this evaluation?” before erasing a form that has work on it. Tap Cancel to keep it.

### Find one student's full history

1. Open History Tracker.
2. Search by name, ID #, or class. Add a From / To date to narrow it.
3. Performance Dossier downloads that student's Word report + CSV. The pencil icon reloads a record into the form to edit it.

### Generate reports

Three report types — student, instructor, and class/date. All download as files you can save, print, or email.

- On a phone, Reports shows one card per record instead of the table — same filters, same exports.

**Student report — one student's complete record:**

1. Open History Tracker and search the student's name or ID #. Add From / To dates if you only want part of their history.
2. On the student's card, tap Performance Dossier. Two files download: a Word dossier (every attempt with task times, the grading instructor, and notes — the file you hand to the student or file in their record) and a CSV log of the same history.
3. Spreadsheet instead? Open Reports, type the student's name in Search, set any dates, and tap Export filtered CSV — one row per task.

**Instructor report — everything one instructor graded:**

4. Open Reports.
5. In the Instructor dropdown, pick the instructor's name. Add From / To dates to limit it (example: this month, or one class cycle). The list now shows only evaluations that instructor graded, with the count and PASS/FAIL split at the top.
6. Tap Export filtered CSV. That file is the instructor report: date, student, ID #, class, task, time, grade, and feedback notes for every evaluation they ran.

**Class / date report:**

7. Open Reports, set the From / To dates (leave blank for all dates). Use the PASS / FAIL filter if needed.
8. Tap Export filtered CSV. The file includes a Class column, so you can split or total it by class in Excel or Google Sheets. DOWNLOAD ALL CSV exports every record with no filters.

> **Note:** For one single day, the Dashboard's End of Day Wrap-up (below) is faster — it produces that day's CSV + Word dossier in one tap.

### Fix a record logged to the WRONG student (Correct Student)

1. Find the record in History Tracker or Reports.
2. Tap the amber Correct Student button.
3. Pick the correct student from the roster list (name, ID #, and class fill in — or type them).
4. Tap MOVE RECORD TO THIS STUDENT and confirm.

> **Note:** Only the name, ID #, and class change. Times, checklists, notes, and the grade stay exactly as recorded, so pass rates and reports stay correct — the wrong student loses the record, the right student gains it. The record is stamped “Corrected: was …” with your name and the time.

### End of Day (Dashboard)

1. On the Dashboard, set the date in End of Day Wrap-up.
2. Reports: downloads that day's CSV + Word dossier.
3. Cloud Archive: moves that day's records out of the active lists into the archive (they are not deleted). Archive only after you have run the reports.

## SECTION 3 — STUDENT

You see only your own performance — from your first evaluation to graduation. You cannot see, change, or delete anything, and you cannot see other students.

### See your progress

1. Sign in with your Candidate ID and your password.
2. My Progress opens automatically: every attempt, newest first, with the date, task, your time against the limit, PASS/FAIL, and your instructor's notes.
3. Use the From / To dates or the search box (your name or ID) to find a specific day or task.

### Your reports

- My Reports shows the same records in a list. Filter by date or by PASS / FAIL.
- Performance Dossier (in My Progress) downloads your full history as a Word document + CSV — your record to keep or print.

### Generate your student report

1. Open My Progress and tap Performance Dossier on your card — your complete history downloads as a Word document plus a CSV file.
2. For just part of your history (example: one month): open My Reports, set the From / To dates, and tap Export filtered CSV.

> **Note:** Your exports only ever contain your own records — the same ones you see on screen.

### Problems signing in

Check the ID (it is your Candidate ID, example C-101) and the password exactly as given — passwords are case-sensitive. Still stuck? Ask your instructor or the Master Admin to reset it; only they can.

## WHO CAN DO WHAT

| Task | Who |
|---|---|
| Sign in and view own records | Student ✓ · Instructor ✓ · Admin ✓ |
| Record / edit evaluations | Student — · Instructor ✓ · Admin ✓ |
| Correct Student (move a record) | Student — · Instructor ✓ · Admin ✓ |
| Reports for any student / class / dates | Student (own only) · Instructor ✓ · Admin ✓ |
| End-of-Day reports + archive | Student — · Instructor ✓ · Admin ✓ |
| Add / remove instructors & students | Student — · Instructor — · Admin ✓ |
| Create, deactivate, remove logins & reset passwords | Student — · Instructor — · Admin ✓ |
| Back up / restore / reset the whole site | Student — · Instructor — · Admin ✓ |

Questions or problems with the app: contact the Master Admin (the person who gave you your login).
