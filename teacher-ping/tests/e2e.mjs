/* 自動把三個情境各玩一輪到結局，並截圖檢查。
   用法（在 games/teacher-ping/ 底下）：
     node tests/e2e.mjs
   需求：playwright（npm i -g playwright）＋ Chromium。
   重點：一定要擋掉 Google Fonts，否則離線環境截圖會卡在等字型，倒數會先跑完，測試就會失準。 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const url = 'file://' + path.join(root, 'dist', 'index.html');
const shots = path.join(root, 'tests', 'shots');
fs.mkdirSync(shots, { recursive: true });

const launch = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
const b = await chromium.launch(launch);
const errs = [];

async function play(id, w, h, seed){
  const p = await b.newPage({ viewport:{ width:w, height:h } });
  await p.route(/fonts\.(googleapis|gstatic)\.com|script\.google\.com/, r => r.abort());
  p.on('pageerror', e => errs.push(id + ': ' + e.message));
  await p.goto(url);
  await p.click('[data-act=pickView]');
  await p.click(`[data-act=play][data-id=${id}]`);
  await p.click('[data-act=bgGo]');
  let rnd = seed; const R = () => { rnd = (rnd * 9301 + 49297) % 233280; return rnd / 233280; };
  const t0 = Date.now();
  while (Date.now() - t0 < 400000){
    if (await p.$('.endcard')) break;
    const st = await p.evaluate(() => ({
      ring: !!document.querySelector('[data-act=callYes]'),
      copt: document.querySelectorAll('.copt').length,
      wait: !!document.querySelector('.waitbar'),
      opt: document.querySelectorAll('#opts .opt').length
    }));
    if (st.ring){ await p.click('[data-act=callYes]'); continue; }                 // 電話一定要接
    if (st.copt){ await p.locator('.copt').nth(Math.floor(R() * 3)).click(); continue; }
    if (st.wait){ await p.click('.waitbar'); continue; }                          // 另一個視窗：點開才開始倒數
    if (st.opt){ await p.locator('#opts .opt').nth(Math.floor(R() * 3)).click(); continue; }
    await p.waitForTimeout(250);
  }
  await p.waitForTimeout(1300);
  await p.screenshot({ path: path.join(shots, `${id}_end.png`) });
  const res = await p.evaluate(() => G.ending + ' ' + JSON.stringify(G.counts));
  await p.click('[data-act=tplEnd]');
  await p.click('.ts[data-p="1"]');
  await p.screenshot({ path: path.join(shots, `${id}_tpl1.png`), fullPage:true });
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  console.log(id, '結局', res, '橫向溢出', overflow);
}

await Promise.all([ play('parent', 390, 844, 3), play('boss', 1280, 860, 5), play('col', 375, 740, 7) ]);
console.log(errs.length ? errs : '沒有 JS 錯誤');
await b.close();
