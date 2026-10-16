#!/usr/bin/env node
/*
 * Loads every built page in a real browser and asserts the things a
 * screenshot cannot tell you.
 *
 * Why not a pixel diff: the sky and starfield are position:fixed, and Chrome's
 * fullPage screenshot does not paint fixed layers below the first viewport. A
 * pixel diff therefore CANNOT see the starfield on most of the page — it passed
 * clean while all three star layers were 404ing. This checks the network and the
 * computed style instead, which is where that failure actually shows up.
 *
 *   node tools/check_pages.js [baseURL]      exit 0 = all good, 1 = failures
 */
const puppeteer = require('puppeteer-core');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.argv[2] || 'http://127.0.0.1:8777';
const PAGES = ['index.html', 'rules.html', 'judges.html'];

const fails = [];
const fail = (page, msg) => fails.push(`${page}: ${msg}`);

(async () => {
  const b = await puppeteer.launch({
    executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars'],
  });

  for (const page of PAGES) {
    const p = await b.newPage();
    const bad = [];
    p.on('requestfailed', r => bad.push(`requestfailed ${r.url()}`));
    p.on('response', r => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
    await p.setViewport({ width: 1440, height: 900 });
    await p.goto(`${BASE}/${page}`, { waitUntil: 'networkidle0', timeout: 60000 });
    await p.evaluate(() => {
      document.querySelectorAll('img').forEach(i => (i.loading = 'eager'));
    });
    await new Promise(r => setTimeout(r, 2500));

    const m = await p.evaluate(() => {
      const im = [...document.querySelectorAll('img')];
      const layers = [...document.querySelectorAll('.stars i')].map(
        el => getComputedStyle(el).backgroundImage);
      return {
        title: document.title,
        imgs: im.length,
        brokenImgs: im.filter(i => !i.complete || !i.naturalWidth).map(i => i.getAttribute('src')),
        imgsNoAlt: im.filter(i => !i.hasAttribute('alt')).length,
        starLayers: layers,
        hasSky: !!document.querySelector('.sky'),
        navItems: document.querySelectorAll('.menu > li').length,
        currentNav: document.querySelectorAll('[aria-current="page"]').length,
        ribbons: document.querySelectorAll('.ribbon').length,
        h1s: document.querySelectorAll('h1').length,
        emptyLinks: [...document.querySelectorAll('a[href=""], a:not([href])')].length,
      };
    });

    // every asset the page asks for must arrive
    bad.forEach(x => fail(page, x));
    m.brokenImgs.forEach(s => fail(page, `image did not decode: ${s}`));
    if (m.imgsNoAlt) fail(page, `${m.imgsNoAlt} image(s) without alt`);

    // the fixed decorative layers must actually resolve to a real file.
    // A 404 leaves backgroundImage set to the url() string, so check the
    // network above AND that the declaration is present at all.
    if (!m.hasSky) fail(page, 'no .sky layer');
    if (m.starLayers.length !== 3) fail(page, `expected 3 star layers, found ${m.starLayers.length}`);
    m.starLayers.forEach((bg, i) => {
      if (!/stars-\d\.svg/.test(bg)) fail(page, `star layer ${i + 1} has no star image: ${bg}`);
      if (/assets\/assets/.test(bg)) fail(page, `star layer ${i + 1} double-prefixed: ${bg}`);
    });

    // shared chrome must be the same everywhere
    if (m.navItems !== 7) fail(page, `nav has ${m.navItems} items, expected 7`);
    if (m.currentNav !== 1) fail(page, `${m.currentNav} items marked aria-current, expected 1`);
    if (m.ribbons < 1) fail(page, 'no ribbon');
    if (m.h1s !== 1) fail(page, `${m.h1s} <h1> elements, expected 1`);
    if (m.emptyLinks) fail(page, `${m.emptyLinks} link(s) with no href`);
    if (!m.title || m.title.length < 10) fail(page, `weak <title>: ${m.title}`);

    console.log(`${page.padEnd(13)} imgs ${String(m.imgs).padStart(2)}  stars ${m.starLayers.length}  nav ${m.navItems}  current "${m.currentNav}"  net ${bad.length ? bad.length + ' BAD' : 'clean'}`);
    await p.close();
  }

  await b.close();
  if (fails.length) {
    console.log(`\n${fails.length} FAILURE(S):`);
    fails.forEach(f => console.log('  ✗ ' + f));
    process.exit(1);
  }
  console.log('\nall pages clean');
})();
