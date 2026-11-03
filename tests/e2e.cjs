const { chromium } = require('playwright');
const fs = require('fs');
const FB = __dirname + '/node_modules/firebase/';
const SRC = __dirname + '/../';
const SHOTS = __dirname + '/shots/'; fs.mkdirSync(SHOTS, { recursive: true });
let html = fs.readFileSync(SRC + 'index.html', 'utf8');
const inj = (a, b) => { if (!html.includes(a)) throw new Error('inject anchor missing: ' + a); html = html.split(a).join(b); };
inj('import { getAuth, onAuthStateChanged,', 'import { connectAuthEmulator, getAuth, onAuthStateChanged,');
inj('import { getFirestore, initializeFirestore,', 'import { connectFirestoreEmulator, getFirestore, initializeFirestore,');
inj('window.state.auth = getAuth(app);', 'window.state.auth = getAuth(app); connectAuthEmulator(window.state.auth, "http://127.0.0.1:9099", { disableWarnings: true });');
inj("const DATA = ['artifacts', appId, 'public', 'data'];", "connectFirestoreEmulator(window.state.db, '127.0.0.1', 8080);\n        const DATA = ['artifacts', appId, 'public', 'data'];");
inj('const secAuth = getAuth(secApp);', 'const secAuth = getAuth(secApp); connectAuthEmulator(secAuth, "http://127.0.0.1:9099", { disableWarnings: true });');

const results = []; let fails = 0; const blocked = []; const errors = [];
const check = (name, cond, extra='') => { results.push((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '  [' + extra + ']' : '')); if (!cond) fails++; };

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--disable-features=LocalNetworkAccessChecks,PrivateNetworkAccessChecks,BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessSendPreflights'] });
  async function newPage(tag) {
    const ctx = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 1280, height: 900 } });
    await ctx.route(u => !u.href.startsWith('http://127.0.0.1:'), async (route) => {
      const u = route.request().url();
      if (u.startsWith('http://localhost:5055/')) {
        const p = new URL(u).pathname.replace(/^\/SPC\//, '').replace(/^\//, '') || 'index.html';
        if (p === 'index.html') return route.fulfill({ status: 200, contentType: 'text/html', body: html });
        if (fs.existsSync(SRC + p)) return route.fulfill({ path: SRC + p });
        return route.fulfill({ status: 404, body: '' });
      }
      const m = u.match(/^https:\/\/www\.gstatic\.com\/firebasejs\/11\.6\.1\/(firebase-[a-z]+\.js)$/);
      if (m) return route.fulfill({ path: FB + m[1], contentType: 'application/javascript' });
      if (u.startsWith('http://127.0.0.1:')) return route.continue();
      if (!/fonts\./.test(u) && /googleapis\.com|firebaseapp\.com|firebaseio\.com/.test(u)) blocked.push(u);
      return route.abort();
    });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(tag + ': ' + e.message));
    page.on('console', m => { if (process.env.DBG) console.log('[c]', m.type(), m.text().slice(0,300)); if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED|font/i.test(m.text())) errors.push(tag + ' console: ' + m.text().slice(0, 600)); });
    page.on('dialog', d => d.accept());
    await page.goto('http://localhost:5055/SPC/index.html');
    return { ctx, page };
  }
  const sheetText = (page) => page.evaluate(() => { const d = document.querySelector('[role=dialog] p'); return d ? d.textContent : null; });
  const okSheet = async (page) => { const b = page.locator('[role=dialog] button').last(); await b.waitFor({ timeout: 8000 }); await b.click(); };
  const visible = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); return !!e && e.offsetParent !== null; }, sel);
  async function login(page, id, pw) {
    await page.fill('#login-id', id); await page.fill('#login-pass', pw); await page.click('#login-btn');
    await page.waitForFunction(() => document.getElementById('auth-overlay').style.display === 'none' || /failed|no SPC|deactivated/i.test(document.getElementById('login-msg').innerText), null, { timeout: 15000 });
    await page.waitForTimeout(1500);
    return page.evaluate(() => document.getElementById('auth-overlay').style.display === 'none' ? 'IN' : document.getElementById('login-msg').innerText);
  }
  async function logout(page) { await page.evaluate(() => window.spcLogout()); await page.waitForSelector('#login-id', { state: 'visible', timeout: 15000 }); }

  // ---------- 1. First run → Master Admin ----------
  let { page } = await newPage('admin');
  try { await page.waitForSelector('#setup-form', { state: 'visible', timeout: 15000 }); } catch (e) { await page.screenshot({path: SHOTS+'dbg.png'}); throw e; }
  check('first run: setup form shown', await visible(page, '#setup-form'));
  await page.fill('#setup-pass', 'AdminPass123'); await page.fill('#setup-pass2', 'AdminPass123');
  await page.click('#setup-btn');
  await page.waitForFunction(() => document.getElementById('auth-overlay').style.display === 'none', null, { timeout: 15000 });
  await page.waitForTimeout(2500);
  check('first run: Master Admin signed in', /Master Admin/i.test(await page.textContent('#user-role')));
  await page.screenshot({ path: SHOTS + '01-admin-dashboard.png' });
  // Known first-run race: listeners can start before the new admin profile reaches the server,
  // so the roster listener may be refused once. Only affects the one-time setup; a reload fixes it.
  await page.reload(); await page.waitForFunction(() => document.getElementById('auth-overlay').style.display === 'none', null, { timeout: 15000 }); await page.waitForTimeout(1500);

  // ---------- 2. Admin creates instructor + student ----------
  async function createAcct(role, name, pid, cls, pw) {
    await page.evaluate(() => window.switchTab('accounts'));
    await page.waitForSelector('#acct-create-btn', { state: 'visible', timeout: 8000 });
    await page.selectOption('#acct-role', role); await page.fill('#acct-name', name); await page.fill('#acct-personid', pid);
    await page.fill('#acct-class', cls); await page.fill('#acct-pass', pw);
    await page.evaluate(() => document.getElementById('acct-result').innerText = '');
    await page.click('#acct-create-btn');
    try { await page.waitForFunction(() => document.getElementById('acct-result').innerText.trim().length > 0, null, { timeout: 20000 }); }
    catch (e) { console.log('acct-result stuck:', JSON.stringify(await page.innerText('#acct-result')), 'btn:', await page.innerText('#acct-create-btn'), errors.slice(-3)); throw e; }
    return page.innerText('#acct-result');
  }
  check('admin: create instructor INST-07', /Account created/.test(await createAcct('instructor', 'Pat Rivera', 'INST-07', '', 'InstPass123')));
  check('admin: create student C-999', /Account created/.test(await createAcct('student', 'Test Student', 'C-999', 'Class 42', 'StuPass123')));
  check('admin: create student C-101', /Account created/.test(await createAcct('student', 'Other Student', 'C-101', 'Class 42', 'OtherPass123')));
  await page.waitForTimeout(800);
  const acctText = await page.innerText('#accounts-list');
  check('admin: accounts list shows all 4', ['Master Admin','Pat Rivera','Test Student','Other Student'].every(n => acctText.includes(n)));
  check('admin: still signed in as Master Admin after creating accounts', /Master Admin/i.test(await page.textContent('#user-role')));
  await page.screenshot({ path: SHOTS + '02-admin-accounts.png', fullPage: true });
  await page.evaluate(() => window.switchTab('roster')); await page.waitForTimeout(500);
  const rosterTxt = await page.innerText('#tab-roster');
  check('admin: roster auto-populated', rosterTxt.includes('Test Student') && rosterTxt.includes('Pat Rivera'));
  await page.screenshot({ path: SHOTS + '03-admin-roster.png', fullPage: true });
  await logout(page);

  // ---------- 3. Instructor ----------
  check('instructor: sign in', (await login(page, 'INST-07', 'InstPass123')) === 'IN');
  check('instructor: role label', /instructor/i.test(await page.textContent('#user-role')));
  check('instructor: sidebar has no Accounts link', !(await visible(page, '#nav-accounts')) && await visible(page, '#nav-evaluation') && await visible(page, '#nav-roster'));
  check('instructor: Accounts nav hidden', !(await page.evaluate(() => [...document.querySelectorAll('.admin-only')].some(e => e.offsetParent !== null))));
  async function addEval(name, id, pass) {
    await page.evaluate(() => window.prepareNewEvaluation());
    await page.waitForSelector('#eval-name', { state: 'visible' });
    await page.evaluate(([n, i, p]) => {
      const set = (id, v) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); };
      set('eval-name', n); set('eval-id', i); set('eval-class', 'Class 42');
      if (p) window.state.current.tasks.forEach(t => t.manualStatus = 'PASS');
    }, [name, id, pass]);
    await page.click('#save-btn'); await okSheet(page);
  }
  await addEval('Test Student', 'C-999', true);
  await addEval('Test Student', 'C-999', false);
  await addEval('Other Student', 'C-101', true);
  await page.waitForTimeout(800);
  check('instructor: sees all 3 evaluations', (await page.evaluate(() => window.state.evals.length)) === 3);
  await page.screenshot({ path: SHOTS + '04-instructor-dashboard.png', fullPage: true });
  await page.evaluate(() => window.switchTab('database')); await page.waitForTimeout(400);
  await page.screenshot({ path: SHOTS + '05-instructor-reports.png', fullPage: true });
  await page.evaluate(() => window.switchTab('roster')); await page.waitForTimeout(400);
  check('instructor: roster visible', (await page.innerText('#tab-roster')).includes('Test Student'));
  check('instructor: no roster delete buttons visible', !(await page.evaluate(() => [...document.querySelectorAll('#tab-roster button')].some(b => b.offsetParent !== null && /trash/.test(b.innerHTML)))));
  await logout(page);

  // ---------- 4. Student C-999 ----------
  check('student: sign in', (await login(page, 'C-999', 'StuPass123')) === 'IN');
  await page.waitForTimeout(800);
  const se = await page.evaluate(() => window.state.evals.map(e => e.id));
  check('student: sees only own 2 records', se.length === 2 && se.every(i => i === 'C-999'), JSON.stringify(se));
  check('student: sidebar shows only History Tracker + My Reports', JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('.sidebar-link')].filter(e => e.offsetParent !== null).map(e => e.id))) === '["nav-tracker","nav-database"]');
  check('student: Accounts/Roster hidden', !(await page.evaluate(() => [...document.querySelectorAll('.admin-only, .staff-only')].some(e => e.offsetParent !== null))));
  await page.screenshot({ path: SHOTS + '06-student-progress.png', fullPage: true });
  await logout(page);

  // ---------- 5. Password reset (twice) ----------
  async function reset(pid, pw) {
    check('admin: sign in for reset', (await login(page, 'gpetrone80@gmail.com', 'AdminPass123')) === 'IN');
    await page.evaluate(() => window.switchTab('accounts')); await page.waitForTimeout(600);
    const uid = await page.evaluate(p => window.state.accounts.find(a => a.personId === p).uid, pid);
    await page.evaluate(u => window.openPwReset(u), uid);
    await page.fill('#pw-new', pw); await page.click('#pw-go');
    await okSheet(page); // confirm
    await page.waitForFunction(() => /Password changed|failed|Could not/i.test(document.querySelector('[role=dialog] p')?.textContent || ''), null, { timeout: 15000 });
    const t = await sheetText(page); await okSheet(page);
    await page.waitForTimeout(600);
    const accts = await page.evaluate(p => window.state.accounts.filter(a => a.personId === p).map(a => a.loginEmail), pid);
    await logout(page);
    return { t, accts };
  }
  let r = await reset('C-999', 'NewPass456');
  check('reset #1: success message', /Password changed/.test(r.t), r.t?.split('\n')[0]);
  check('reset #1: exactly one profile for C-999, moved to c-999.2@spc.local', r.accts.length === 1 && r.accts[0] === 'c-999.2@spc.local', JSON.stringify(r.accts));
  check('reset #1: OLD password refused', (await login(page, 'C-999', 'StuPass123')) !== 'IN');
  check('reset #1: NEW password works', (await login(page, 'C-999', 'NewPass456')) === 'IN');
  await page.waitForTimeout(800);
  check('reset #1: student still sees own 2 records', (await page.evaluate(() => window.state.evals.filter(e => e.id === 'C-999').length)) === 2);
  await logout(page);
  check('reset #1: lowercase "c-999" sign-in works', (await login(page, 'c-999', 'NewPass456')) === 'IN'); await logout(page);
  r = await reset('C-999', 'Third789x');
  check('reset #2: moved to c-999.3@spc.local', r.accts.length === 1 && r.accts[0] === 'c-999.3@spc.local', JSON.stringify(r.accts));
  check('reset #2: previous password refused', (await login(page, 'C-999', 'NewPass456')) !== 'IN');
  check('reset #2: new password works', (await login(page, 'C-999', 'Third789x')) === 'IN'); await logout(page);
  r = await reset('INST-07', 'InstNew999');
  check('reset instructor: works', /Password changed/.test(r.t) && (await login(page, 'INST-07', 'InstNew999')) === 'IN'); await logout(page);

  // ---------- 6. Old Auth account signs in directly (bypassing directory) ----------
  const oldDirect = await login(page, 'c-999@spc.local', 'StuPass123');
  check('old login (original email+password) has no access', oldDirect !== 'IN', oldDirect);

  // ---------- 7. Deactivate ----------
  check('admin: sign in', (await login(page, 'gpetrone80@gmail.com', 'AdminPass123')) === 'IN');
  await page.evaluate(() => window.switchTab('accounts')); await page.waitForTimeout(500);
  await page.evaluate(() => window.toggleAccount(window.state.accounts.find(a => a.personId === 'C-101').uid, true)); await page.waitForTimeout(500);
  await logout(page);
  const off = await login(page, 'C-101', 'OtherPass123');
  check('deactivated student blocked', /deactivated/i.test(off), off);

  await browser.close();
  console.log(results.join('\n'));
  console.log('\nBlocked live-Firebase requests: ' + blocked.length + (blocked.length ? '\n  ' + [...new Set(blocked)].slice(0,5).join('\n  ') : ''));
  const other = errors.filter(e => !/shutting down/i.test(e)); console.log('Non-shutdown errors: ' + other.length + (other.length ? '\n  ' + [...new Set(other)].join('\n  ') : '')); console.log('Page errors: ' + errors.length + (errors.length ? '\n  ' + [...new Set(errors)].slice(0, 10).join('\n  ') : ''));
  const p = results.filter(x => x.startsWith('PASS')).length;
  console.log(`\n${p} passed, ${fails} failed`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.log(results.join('\n')); console.error('CRASH', e); process.exit(2); });
