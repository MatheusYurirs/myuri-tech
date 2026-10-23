import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const base = 'http://127.0.0.1:8765/';
const failures = [];
const results = [];
mkdirSync('artifacts/qa', { recursive: true });
const html = readFileSync('index.html', 'utf8');
function check(name, callback) {
  try { callback(); results.push('PASS '+name); }
  catch (error) { failures.push(name+': '+error.message); results.push('FAIL '+name+': '+error.message); }
}
check('SEO homepage', () => {
  assert.match(html, /content="index, follow" name="robots"/);
  assert.match(html, /rel="canonical" href="https:\/\/matheusyurirs\.github\.io\/myuri-tech\/"/);
});
check('Document language', () => assert.match(html, /<html lang="pt-BR"/));
check('Privacy link present', () => assert.match(html, /href="\.\/privacidade\.html"/));
check('No fake client testimonials', () => assert.doesNotMatch(html, /Depoimentos fictícios/i));
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
check('Unique element IDs', () => assert.equal(new Set(ids).size, ids.length));
check('Valid internal anchors', () => {
  for (const [,target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), 'Missing #'+target);
});
check('All img elements have alt', () => {
  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) assert.match(img, /\balt="/);
});
const browser = await chromium.launch({ headless:true, args:['--no-sandbox'] });
try {
  for (const v of [
    { name:'desktop', width:1440, height:900, mobile:false },
    { name:'mobile', width:390, height:844, mobile:true },
    { name:'narrow', width:320, height:720, mobile:true }
  ]) {
    const ctx = await browser.newContext({viewport:{width:v.width,height:v.height},deviceScaleFactor:1,colorScheme:'light',reducedMotion:'reduce'});
    const page = await ctx.newPage();
    const pageErrors=[];
    page.on('pageerror', err=>pageErrors.push(err.message));
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.locator('#theme-toggle').waitFor();
    const initial = await page.locator('.site-header').boundingBox();
    await page.locator('#theme-toggle').click();
    await page.waitForTimeout(100);
    const state = await page.evaluate(() => document.documentElement.dataset.theme);
    if (state !== 'dark') failures.push(v.name+': theme did not become dark: '+state);
    const darkHeader=await page.locator('.site-header').boundingBox();
    if (Math.abs(initial.x-darkHeader.x)>2 || Math.abs(initial.width-darkHeader.width)>2)
      failures.push(v.name+': header shifted on theme change');
    const darkLogoVisible=await page.locator('.logo-on-dark').isVisible();
    if (!darkLogoVisible) failures.push(v.name+': dark logo hidden');
    const overflow = await page.evaluate(() => ({ doc:document.documentElement.scrollWidth, viewport:window.innerWidth }));
    if(overflow.doc>overflow.viewport+2) failures.push(v.name+': horizontal overflow '+JSON.stringify(overflow));
    await page.reload({waitUntil:'domcontentloaded'});
    if(await page.evaluate(()=>document.documentElement.dataset.theme)!=='dark') failures.push(v.name+': persisted theme lost on reload');
    await page.locator('#theme-toggle').click();
    if(await page.evaluate(()=>document.documentElement.dataset.theme)!=='light') failures.push(v.name+': theme did not return to light');
    if(v.mobile){
      const menu=page.locator('#menu-btn');
      await menu.click();
      if(await menu.getAttribute('aria-expanded')!=='true' || !(await page.locator('#nav-mobile').isVisible()))
        failures.push(v.name+': mobile menu did not open');
      await page.locator('#nav-mobile a[href="#servicos"]').click();
      if(await menu.getAttribute('aria-expanded')!=='false' || await page.locator('#nav-mobile').isVisible())
        failures.push(v.name+': mobile menu did not close on link click');
    }
    await page.screenshot({path:'artifacts/qa/'+v.name+'-light.png',fullPage:true});
    if(pageErrors.length) failures.push(v.name+': uncaught JS '+pageErrors.join('; '));
    await ctx.close();
  }
  const ctx=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
  const page=await ctx.newPage();
  await page.route('https://formspree.io/**',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('#contact-form button[type="submit"]').click();
  const invalid=await page.locator('#nome').getAttribute('aria-invalid');
  if(invalid!=='true') failures.push('form: empty validation missing');
  await page.locator('#nome').fill('Pessoa de Teste');
  await page.locator('#email').fill('teste@example.com');
  await page.locator('#servico').selectOption('sites');
  await page.locator('#mensagem').fill('Quero conhecer o desenvolvimento de sites.');
  await page.locator('#contact-form button[type="submit"]').click();
  await page.waitForTimeout(200);
  const feedback=await page.locator('#form-feedback').getAttribute('data-state');
  if(feedback!=='success') failures.push('form: mocked success feedback was '+feedback);
  const privacy=await ctx.request.get(base+'privacidade.html');
  if(!privacy.ok()) failures.push('privacy page: HTTP '+privacy.status());
  await ctx.close();
} finally { await browser.close(); }
for(const line of results) console.log(line);
if(failures.length){ console.error('QA failed:\n'+failures.join('\n'));process.exitCode=1; }
else console.log('QA PASSED: static, desktop/mobile themes, layout, menu, mocked form and privacy.');
