import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const records = JSON.parse(readFileSync(join(root, 'activities.json'), 'utf8'));
assert.equal(records.length, 34, 'Expected 34 activities');
assert.equal(new Set(records.map(a => a.id)).size, 34, 'Activity IDs must be unique');
assert.equal(records.filter(a => a.featured).length, 6, 'Expected 6 featured activities');
for (const a of records) {
  assert.ok(a.name && a.category && a.url.startsWith('https://'), 'Invalid listing ' + a.id);
}
for (const file of ['index.html', 'styles.css', 'app.js', 'data.js', 'favicon.svg', 'good-days-activity-guide.pdf', '.nojekyll']) {
  assert.ok(existsSync(join(root, file)), 'Missing site asset ' + file);
}
const pdf = readFileSync(join(root, 'good-days-activity-guide.pdf'));
assert.ok(pdf.subarray(0, 8).toString() === '%PDF-1.4', 'PDF header invalid');
assert.ok(pdf.includes(Buffer.from('%%EOF')), 'PDF trailer invalid');
console.log('PASS static: 34 records, 6 featured, site assets and PDF');

const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.pdf':'application/pdf'};
const server = createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1/').pathname);
  const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + sep) && file !== root) {res.writeHead(403).end();return}
  try {const bytes=readFileSync(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream'});res.end(bytes)}
  catch {res.writeHead(404).end('Not found')}
});
await new Promise(done => server.listen(8765, '127.0.0.1', done));
let browser;
try {
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:1366,height:900},acceptDownloads:true});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror', e => errors.push(String(e)));
  const response=await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200,'Home page should load');
  await page.waitForSelector('#activityGrid .activity-card');
  assert.equal(await page.locator('#activityGrid .activity-card').count(),34,'All cards rendered');
  assert.equal(await page.locator('#featuredGrid .activity-card').count(),6,'Featured cards rendered');
  assert.equal(await page.locator('#categoryList button').count(),7,'Six category filters plus All');
  await page.locator('[data-category="volunteering"]').click();
  assert.equal(await page.locator('#activityGrid .activity-card').count(),6,'Volunteering filter');
  await page.locator('#clearFilters').click();
  await page.locator('#searchInput').fill('Spanish');
  assert.ok(await page.locator('#activityGrid .activity-card').count()>=6,'Spanish search');
  await page.locator('#searchInput').fill('');
  await page.locator('#activityGrid [data-save]').first().click();
  await page.locator('.nav-link[data-view="shortlist"]').click();
  assert.equal(await page.locator('#interestedGrid .activity-card').count(),1,'Shortlist updates');
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#interestedGrid .activity-card').count(),1,'Shortlist persists reload');
  await page.locator('#interestedGrid [data-open]').first().click();
  assert.ok(await page.locator('#activityDialog').evaluate(el=>el.open),'Details dialog opens');
  await page.locator('#noteInput').fill('Confirm access before visiting');
  await page.locator('#closeDialog').click();
  assert.ok((await page.locator('#interestedGrid .card-note').first().innerText()).includes('Confirm access'),'Notes saved');
  const download = page.waitForEvent('download');
  await page.locator('#downloadCsv').click();
  assert.equal((await download).suggestedFilename(),'good-days-my-shortlist.csv','CSV export');
  assert.deepEqual(errors,[],'No uncaught browser JS errors');
  const remotePdf=await context.request.get('http://127.0.0.1:8765/good-days-activity-guide.pdf');
  assert.equal(remotePdf.status(),200,'PDF loads');
  assert.equal((await remotePdf.body()).subarray(0,4).toString(),'%PDF','PDF begins with correct bytes');
  const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const mp=await mobile.newPage();
  const mobileErrors=[];mp.on('pageerror',e=>mobileErrors.push(String(e)));
  await mp.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
  assert.equal(await mp.locator('#activityGrid .activity-card').count(),34,'Mobile renders all cards');
  const overflow=await mp.evaluate(()=>document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(overflow <= 5,'Unexpected horizontal scrolling on mobile: '+overflow+'px');
  assert.deepEqual(mobileErrors,[],'No mobile JavaScript errors');
  console.log('PASS browser: desktop, search, categories, shortlist, persistence, modal, notes, CSV, PDF and mobile');
} finally {
  if(browser) await browser.close();
  await new Promise(done=>server.close(done));
}
