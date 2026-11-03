"""
SPC Fire College — Big Two Tracker · User Manual builder

Source of truth for manual.pdf (and a Markdown copy, manual.md).
Edit the CONTENT below, run `python build_manual.py`, then commit manual.pdf
with the release. Requires ReportLab (`pip install reportlab`).

Rebuilt in v2.12.1 from the published v2.9 manual.pdf (the original script
was lost) and brought up to date with v2.10 – v2.12.1.
"""
import os
import sys

from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (HRFlowable, Image, KeepTogether, Paragraph,
                                SimpleDocTemplate, Spacer, Table, TableStyle)

VERSION = "2.13.1"
DATE = "November 2026"
SITE = "https://gpetrone80-lab.github.io/SPC/"
HERE = os.path.dirname(os.path.abspath(__file__))

NAVY = HexColor("#0b2340")
GOLD = HexColor("#c9a227")
GREY = HexColor("#64748b")
NOTE_BG = HexColor("#fef9e7")
ROW_BG = HexColor("#eef2f7")
GRID = HexColor("#cbd5e1")

# ── Content ────────────────────────────────────────────────────────────────
# Each section is (title, [blocks]). Block kinds:
#   ("h", text)        sub-heading            ("p", text)     paragraph
#   ("steps", [..])    numbered list          ("bullets", [..]) gold bullets
#   ("sub", text)      small bold label       ("note", text)  yellow note box
#   ("table", [(left, right), ..])
# Numbered lists continue their numbering until the next ("h", ...) heading,
# matching the original layout (the three report types run 1–8).

INTRO = "This manual has one section per role. Find your role and follow it — every task is a short numbered list."

SECTIONS = [
    ("GETTING STARTED (EVERYONE)", [
        ("h", "Sign in"),
        ("steps", [
            "Open the website above on your phone, tablet, or computer.",
            "Type your Login ID and your personal password. Tap SHOW next to the password box to check what you typed.",
            "Tap SIGN IN. You only ever see what your role allows.",
        ]),
        ("bullets", [
            "Admin: your email address. Instructor: your Instructor ID (example INST-07). Student: your Candidate ID (example C-101).",
            "Lost? Tap MORE → MANUAL at the top of the app (or the manual link under the sign-in box) — it opens this manual.",
        ]),
        ("h", "Sign out"),
        ("p", "Tap MORE → SIGN OUT at the top of the screen, or SIGN OUT at the right end of the bottom bar on a phone. Always sign out on a shared tablet — signing out also clears the records saved on that device, so the next person cannot see them."),
        ("note", "If anything is still “Pending upload”, sign-out keeps it on the device so nothing is lost. Reconnect to the internet, let it upload, then sign out again to clear the device."),
        ("h", "Install it like an app (recommended)"),
        ("steps", [
            "Open the site once while you have internet.",
            "Easiest: tap the gold INSTALL THE APP button on the sign-in screen (or MORE → INSTALL APP once you are signed in) and confirm (Android / Chrome). On iPhone or iPad: tap Share → Add to Home Screen. Either way, the SPC icon lands on your home screen and the app opens full-screen, like a regular app — no browser bars.",
        ]),
        ("bullets", [
            "Open the site in Chrome or Safari directly — links opened inside another app (email, chat, Facebook) run in a stripped-down browser that cannot install apps.",
            "Already installed? Long-press the SPC icon for shortcuts straight to New Evaluation, Reports, or History.",
        ]),
        ("h", "Working with no internet"),
        ("p", "The app keeps working offline. Anything you save is stored on the device first; the header shows “Pending upload” and everything uploads by itself when internet returns. Do not clear the browser/app data while records are pending."),
        ("note", "Wrong password? You get “Sign-in failed — check your ID and password.” After a few tries, see the Master Admin — only the admin can reset a password."),
    ]),
    ("SECTION 1 — MASTER ADMIN", [
        ("p", "The Master Admin owns all accounts. Only the admin can add or remove instructors and students and manage logins."),
        ("h", "Add an instructor or student login"),
        ("steps", [
            "Sign in as Admin → open the Accounts (Admin) tab.",
            "Pick the Role: Instructor or Student.",
            "Type the person's full Name and Login ID — Candidate ID for a student (C-101), Instructor ID for an instructor (INST-07).",
            "For a student, type the Class (example 2026-02).",
            "Type a Temporary Password (8+ characters, easy to say out loud, example Spartan-4821).",
            "Tap Create Account. The app shows the login once — write it down and hand it to the person. It is not stored anywhere you can look it up later.",
        ]),
        ("note", "Creating the login also adds the person to the Roster and to the pick-lists in the evaluation form. One step — nothing else to set up."),
        ("h", "Block or remove a login"),
        ("bullets", [
            "Accounts tab → Deactivate: blocks sign-in instantly. Records are kept. Reactivate undoes it.",
            "Accounts tab → Remove login: deletes the login profile. The person's evaluation history stays in the reports.",
            "Roster tab → trash icon: removes the person from the directories/pick-lists. This does not delete their login or their history.",
        ]),
        ("h", "Change a student's or instructor's password"),
        ("steps", [
            "Open the Accounts tab and find the person in Existing Accounts.",
            "Tap Password.",
            "Type the new temporary password (8+ characters) and tap SET NEW PASSWORD.",
            "Give the person their Login ID + the new password once — it is shown on screen and is not stored anywhere you can look it up later.",
        ]),
        ("note", "The old password stops working the moment you save. The person's ID, name, and every evaluation record stay exactly the same — only the password changes. Your own Master Admin password is different: it uses your real email, so change it in the Firebase Console (Authentication → your user) or with the email password-reset."),
        ("h", "End of academy — back up, reset, start fresh"),
        ("p", "When a class graduates: save everything, wipe the site, add the next class. All three tools are in the Accounts tab, in the red Academy Data card."),
        ("steps", [
            "Download Full Backup. One .json file saves: every evaluation, every archived day, and the full roster. Store it somewhere safe (email it to yourself, Drive, a USB stick).",
            "Tap Reset Site — Start Fresh.",
            "In the window: Step 1 downloads a backup again (skip if you just did it), tick the Step 2 box confirming you saved a backup, then type RESET in Step 3.",
            "Tap ERASE EVERYTHING and confirm once more. Done: all evaluations, archives, rosters, and student/instructor logins are erased. Your Master Admin login is kept.",
            "Add the new class: create logins in Accounts (each new login also builds the roster), and you are ready for day one.",
        ]),
        ("note", "Passwords are never inside a backup file — backups restore records and rosters, not logins. After any reset or restore, people sign in with new accounts you create."),
        ("bullets", [
            "Reused Candidate IDs are fine: if the new class uses an ID the old class had (example C-101), just create the account — the app automatically gives the new student a fresh login under that ID.",
        ]),
        ("h", "Restore a backup"),
        ("steps", [
            "Accounts tab → Academy Data card → Restore from Backup → pick the .json backup file.",
            "Read the confirmation counts (evaluations, archived days, roster) and tap OK.",
            "Records come back with their original IDs. Anything on the site with the same ID is overwritten; everything else is kept. Lists refresh by themselves.",
            "If people need to sign in again, recreate their logins in Accounts — logins are not part of a backup.",
        ]),
        ("h", "Reports and totals (also covered in the Instructor section)"),
        ("p", "As Admin you can do everything an instructor can: grade, run reports, use End-of-Day, and correct records. See Section 2."),
    ]),
    ("SECTION 2 — INSTRUCTOR", [
        ("h", "Record an evaluation (New Entry)"),
        ("steps", [
            "Tap New Evaluation (+ Eval on a phone).",
            "Pick the instructor and the candidate from the pick-lists (or type name, ID #, class, date by hand).",
            "For each task: tap START to run the big timer — no timer starts by itself, not even Task 1. PAUSE stops it. Tick the checklist items as the student performs them.",
            "Tap PASS or FAIL for the task and type any feedback note. PASS or FAIL also stops that task's timer and keeps the recorded time.",
            "Want to lock in your progress before uploading? Tap SAVE TO DEVICE (DEVICE on the phone bar). Everything on the form stays on this phone or tablet, even if the app closes, and “Saved on device ✓” shows the time. It also downloads a CSV copy of the evaluation (one row per task: time, limit, grade, checklist count, feedback) named SPC_Eval_ID_Name_Date.csv. On Android it goes to Downloads; on iPhone/iPad tap Share → Save to Files.",
            "At the bottom, tap SAVE TO CLOUD. “Saved ✓” means it is on the device; if you are offline it uploads automatically later (watch for the “Pending upload” badge to clear). The device copy is removed once it is saved to the cloud.",
        ]),
        ("note", "Over the time limit = automatic FAIL. The task shows a red OVER LIMIT · AUTO FAIL badge and PASS is locked. The timer keeps running so the student's full time is recorded — tap PAUSE when they finish."),
        ("bullets", [
            "On a phone, a navy bar stays pinned at the bottom of this screen with the current task's timer, PASS / FAIL, DEVICE, and SAVE — you never scroll to save mid-drill.",
            "The 5 tasks: 1) PPE – SCBA – Hose Pull Pattern (limit 4:40) · 2) Rope and Knots (2:00) · 3) Ladder Raise & Search (4:40) · 4–5) Custom Drills (5:00 — you can rename these two in the form).",
            "Closed the form by accident? The draft is saved on the device and offered back when you return (“Resumed from Memory”). A running timer saves itself every 5 seconds. Timers come back paused — tap START to continue.",
            "Clear Form or New Evaluation asks “Discard this evaluation?” before erasing a form that has work on it. Tap Cancel to keep it.",
        ]),
        ("h", "Find one student's full history"),
        ("steps", [
            "Open History Tracker.",
            "Search by name, ID #, or class. Add a From / To date to narrow it.",
            "Performance Dossier downloads that student's Word report + CSV. The pencil icon reloads a record into the form to edit it.",
        ]),
        ("h", "Generate reports"),
        ("p", "Three report types — student, instructor, and class/date. All download as files you can save, print, or email."),
        ("bullets", [
            "On a phone, Reports shows one card per record instead of the table — same filters, same exports.",
        ]),
        ("sub", "Student report — one student's complete record:"),
        ("steps", [
            "Open History Tracker and search the student's name or ID #. Add From / To dates if you only want part of their history.",
            "On the student's card, tap Performance Dossier. Two files download: a Word dossier (every attempt with task times, the grading instructor, and notes — the file you hand to the student or file in their record) and a CSV log of the same history.",
            "Spreadsheet instead? Open Reports, type the student's name in Search, set any dates, and tap Export filtered CSV — one row per task.",
        ]),
        ("sub", "Instructor report — everything one instructor graded:"),
        ("steps", [
            "Open Reports.",
            "In the Instructor dropdown, pick the instructor's name. Add From / To dates to limit it (example: this month, or one class cycle). The list now shows only evaluations that instructor graded, with the count and PASS/FAIL split at the top.",
            "Tap Export filtered CSV. That file is the instructor report: date, student, ID #, class, task, time, grade, and feedback notes for every evaluation they ran.",
        ]),
        ("sub", "Class / date report:"),
        ("steps", [
            "Open Reports, set the From / To dates (leave blank for all dates). Use the PASS / FAIL filter if needed.",
            "Tap Export filtered CSV. The file includes a Class column, so you can split or total it by class in Excel or Google Sheets. DOWNLOAD ALL CSV exports every record with no filters.",
        ]),
        ("note", "For one single day, the Dashboard's End of Day Wrap-up (below) is faster — it produces that day's CSV + Word dossier in one tap."),
        ("h", "Fix a record logged to the WRONG student (Correct Student)"),
        ("steps", [
            "Find the record in History Tracker or Reports.",
            "Tap the amber Correct Student button.",
            "Pick the correct student from the roster list (name, ID #, and class fill in — or type them).",
            "Tap MOVE RECORD TO THIS STUDENT and confirm.",
        ]),
        ("note", "Only the name, ID #, and class change. Times, checklists, notes, and the grade stay exactly as recorded, so pass rates and reports stay correct — the wrong student loses the record, the right student gains it. The record is stamped “Corrected: was …” with your name and the time."),
        ("h", "End of Day (Dashboard)"),
        ("steps", [
            "On the Dashboard, set the date in End of Day Wrap-up.",
            "Reports: downloads that day's CSV + Word dossier.",
            "Cloud Archive: moves that day's records out of the active lists into the archive (they are not deleted). Archive only after you have run the reports.",
        ]),
    ]),
    ("SECTION 3 — STUDENT", [
        ("p", "You see only your own performance — from your first evaluation to graduation. You cannot see, change, or delete anything, and you cannot see other students."),
        ("h", "See your progress"),
        ("steps", [
            "Sign in with your Candidate ID and your password.",
            "My Progress opens automatically: every attempt, newest first, with the date, task, your time against the limit, PASS/FAIL, and your instructor's notes.",
            "Use the From / To dates or the search box (your name or ID) to find a specific day or task.",
        ]),
        ("h", "Your reports"),
        ("bullets", [
            "My Reports shows the same records in a list. Filter by date or by PASS / FAIL.",
            "Performance Dossier (in My Progress) downloads your full history as a Word document + CSV — your record to keep or print.",
        ]),
        ("h", "Generate your student report"),
        ("steps", [
            "Open My Progress and tap Performance Dossier on your card — your complete history downloads as a Word document plus a CSV file.",
            "For just part of your history (example: one month): open My Reports, set the From / To dates, and tap Export filtered CSV.",
        ]),
        ("note", "Your exports only ever contain your own records — the same ones you see on screen."),
        ("h", "Problems signing in"),
        ("p", "Check the ID (it is your Candidate ID, example C-101) and the password exactly as given — passwords are case-sensitive. Still stuck? Ask your instructor or the Master Admin to reset it; only they can."),
    ]),
    ("WHO CAN DO WHAT", [
        ("table", [
            ("Sign in and view own records", "Student ✓ · Instructor ✓ · Admin ✓"),
            ("Record / edit evaluations", "Student — · Instructor ✓ · Admin ✓"),
            ("Correct Student (move a record)", "Student — · Instructor ✓ · Admin ✓"),
            ("Reports for any student / class / dates", "Student (own only) · Instructor ✓ · Admin ✓"),
            ("End-of-Day reports + archive", "Student — · Instructor ✓ · Admin ✓"),
            ("Add / remove instructors & students", "Student — · Instructor — · Admin ✓"),
            ("Create, deactivate, remove logins & reset passwords", "Student — · Instructor — · Admin ✓"),
            ("Back up / restore / reset the whole site", "Student — · Instructor — · Admin ✓"),
        ]),
        ("p", "Questions or problems with the app: contact the Master Admin (the person who gave you your login)."),
    ]),
]

# ── Fonts ──────────────────────────────────────────────────────────────────
# Arial (Windows) or Liberation/DejaVu (Linux) so “→ ✓ —” render; ✓ comes from
# a symbol font when the body font lacks it.
FONT_DIRS = [r"C:\Windows\Fonts", "/usr/share/fonts/truetype/liberation",
             "/usr/share/fonts/truetype/dejavu", "/Library/Fonts"]
FONT_SETS = [
    ("arial.ttf", "arialbd.ttf", "ariali.ttf", "arialbi.ttf"),
    ("LiberationSans-Regular.ttf", "LiberationSans-Bold.ttf", "LiberationSans-Italic.ttf", "LiberationSans-BoldItalic.ttf"),
    ("DejaVuSans.ttf", "DejaVuSans-Bold.ttf", "DejaVuSans-Oblique.ttf", "DejaVuSans-BoldOblique.ttf"),
]
SYMBOL_FONTS = ["seguisym.ttf", "DejaVuSans.ttf"]


def find_font(name):
    for d in FONT_DIRS:
        p = os.path.join(d, name)
        if os.path.exists(p):
            return p
    return None


def register_fonts():
    for fs in FONT_SETS:
        paths = [find_font(n) for n in fs]
        if all(paths):
            for alias, p in zip(("Body", "Body-Bold", "Body-Italic", "Body-BoldItalic"), paths):
                pdfmetrics.registerFont(TTFont(alias, p))
            pdfmetrics.registerFontFamily("Body", normal="Body", bold="Body-Bold",
                                          italic="Body-Italic", boldItalic="Body-BoldItalic")
            break
    else:
        sys.exit("No usable TTF font found (need Arial, Liberation Sans, or DejaVu Sans).")
    for n in SYMBOL_FONTS:
        p = find_font(n)
        if p:
            pdfmetrics.registerFont(TTFont("Sym", p))
            return True
    return False


HAS_SYM = False


def rich(text):
    """Escape for ReportLab markup and route ✓ to the symbol font."""
    t = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    if HAS_SYM:
        t = t.replace("✓", '<font name="Sym">✓</font>')
    return t


# ── Styles ─────────────────────────────────────────────────────────────────
def styles():
    s = {}
    s["title"] = ParagraphStyle("title", fontName="Body-Bold", fontSize=26, leading=30, textColor=NAVY, alignment=TA_CENTER)
    s["subtitle"] = ParagraphStyle("subtitle", fontName="Body-Bold", fontSize=15, leading=19, textColor=GOLD, alignment=TA_CENTER)
    s["meta"] = ParagraphStyle("meta", fontName="Body", fontSize=10, leading=13, textColor=GREY, alignment=TA_CENTER)
    s["body"] = ParagraphStyle("body", fontName="Body", fontSize=10.5, leading=14.5, textColor=NAVY, spaceAfter=4)
    s["section"] = ParagraphStyle("section", fontName="Body-Bold", fontSize=15, leading=19, textColor=white)
    s["h"] = ParagraphStyle("h", fontName="Body-Bold", fontSize=12, leading=15, textColor=NAVY, spaceBefore=8, spaceAfter=4)
    s["sub"] = ParagraphStyle("sub", fontName="Body-Bold", fontSize=10.5, leading=14, textColor=NAVY, spaceBefore=4, spaceAfter=4)
    s["step"] = ParagraphStyle("step", parent=s["body"], leftIndent=18, spaceAfter=3)
    s["bullet"] = ParagraphStyle("bullet", parent=s["body"], leftIndent=18, firstLineIndent=-14, spaceAfter=3)
    s["note"] = ParagraphStyle("note", fontName="Body-Italic", fontSize=10, leading=14, textColor=NAVY)
    s["cell"] = ParagraphStyle("cell", fontName="Body", fontSize=10, leading=13.5, textColor=NAVY)
    s["cellb"] = ParagraphStyle("cellb", parent=s["cell"], fontName="Body-Bold")
    return s


def section_bar(title, s, width):
    t = Table([[Paragraph(rich(title), s["section"])]], colWidths=[width])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NAVY),
        ("LEFTPADDING", (0, 0), (-1, -1), 10), ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    return t


def note_box(text, s, width):
    t = Table([[Paragraph(rich("Note: " + text), s["note"])]], colWidths=[width])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NOTE_BG),
        ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return t


def who_table(rows, s, width):
    data = [[Paragraph(rich(a), s["cellb"]), Paragraph(rich(b), s["cell"])] for a, b in rows]
    t = Table(data, colWidths=[width * 0.48, width * 0.52])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), ROW_BG),
        ("GRID", (0, 0), (-1, -1), 0.6, GRID),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8), ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return t


def build_pdf(path):
    s = styles()
    doc = SimpleDocTemplate(path, pagesize=letter, leftMargin=0.85 * inch, rightMargin=0.85 * inch,
                            topMargin=0.7 * inch, bottomMargin=0.85 * inch,
                            title=f"SPC Fire College — Big Two Tracker · User Manual v{VERSION}",
                            author="SPC Fire College")
    w = doc.width
    story = []
    logo = os.path.join(HERE, "spc-logo.jpg")
    if os.path.exists(logo):
        img = Image(logo)
        scale = 1.25 * inch / img.imageHeight
        img.drawHeight, img.drawWidth = img.imageHeight * scale, img.imageWidth * scale
        story += [img, Spacer(1, 6)]
    story += [
        Paragraph("SPC FIRE COLLEGE", s["title"]),
        Paragraph("Big Two Tracker — User Manual", s["subtitle"]),
        Spacer(1, 10), HRFlowable(width="100%", thickness=1.6, color=GOLD, spaceAfter=6),
        Paragraph(rich(f"Website: {SITE} · Version {VERSION} — {DATE}"), s["meta"]),
        Spacer(1, 2), Paragraph(rich(INTRO), s["body"]), Spacer(1, 6),
    ]
    for title, blocks in SECTIONS:
        story += [Spacer(1, 4), section_bar(title, s, w), Spacer(1, 4)]
        n = 0
        for kind, val in blocks:
            if kind == "h":
                n = 0
                story.append(Paragraph(rich(val), s["h"]))
            elif kind == "p":
                story.append(Paragraph(rich(val), s["body"]))
            elif kind == "sub":
                story.append(Paragraph(rich(val), s["sub"]))
            elif kind == "steps":
                for item in val:
                    n += 1
                    story.append(Paragraph(f"<b>{n}.</b> {rich(item)}", s["step"]))
            elif kind == "bullets":
                for item in val:
                    story.append(Paragraph(f'<font color="#c9a227">●</font>&nbsp;&nbsp;{rich(item)}', s["bullet"]))
            elif kind == "note":
                story += [Spacer(1, 2), KeepTogether(note_box(val, s, w)), Spacer(1, 4)]
            elif kind == "table":
                story += [Spacer(1, 2), who_table(val, s, w), Spacer(1, 8)]

    def footer(canvas, d):
        canvas.saveState()
        canvas.setFont("Body", 8.5)
        canvas.setFillColor(GREY)
        canvas.drawCentredString(letter[0] / 2, 0.5 * inch,
                                 f"SPC Fire College — Big Two Tracker · User Manual v{VERSION} · Page {d.page}")
        canvas.restoreState()

    doc.build(story, onFirstPage=footer, onLaterPages=footer)


def build_md(path):
    out = ["# SPC Fire College — Big Two Tracker · User Manual", "",
           f"Website: {SITE} · Version {VERSION} — {DATE}", "", INTRO, ""]
    for title, blocks in SECTIONS:
        out += [f"## {title}", ""]
        n = 0
        for kind, val in blocks:
            if kind == "h":
                n = 0
                out += [f"### {val}", ""]
            elif kind == "p":
                out += [val, ""]
            elif kind == "sub":
                out += [f"**{val}**", ""]
            elif kind == "steps":
                for item in val:
                    n += 1
                    out.append(f"{n}. {item}")
                out.append("")
            elif kind == "bullets":
                out += [f"- {item}" for item in val] + [""]
            elif kind == "note":
                out += [f"> **Note:** {val}", ""]
            elif kind == "table":
                out += ["| Task | Who |", "|---|---|"] + [f"| {a} | {b} |" for a, b in val] + [""]
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(out))


if __name__ == "__main__":
    HAS_SYM = register_fonts()
    build_pdf(os.path.join(HERE, "manual.pdf"))
    build_md(os.path.join(HERE, "manual.md"))
    print(f"Built manual.pdf and manual.md (v{VERSION})")
