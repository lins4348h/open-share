// 產生分享用封面圖：node docs/cover.js → docs/cover.png（1200×900）
const fs = require('fs');
const path = require('path');
const { renderScene, SCENE_CSS } = require('../engine/scene');
const { talkNG, talkOK } = require('../examples/hallway');
// 封面字幕縮短，縮圖才看得清楚
const short = (sc, i, cap) => ({ ...sc, beats: sc.beats.map((b, j) => (j === i ? { ...b, cap } : b)) });
const ng = renderScene(short(talkNG, 14, '馬上反駁：好辯'), [14, 14], 'print');
const ok = renderScene(short(talkOK, 3, '接住「配樂」聊下去'), [3, 3], 'print');
const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:900px;overflow:hidden;font-family:"Noto Sans TC",sans-serif;color:#22302c;
 background:radial-gradient(120% 90% at 0% 0%,#dfeee8 0%,#eef4f0 55%,#f6f2ea 100%)}
.wrap{padding:60px 64px}
.badge{display:flex;align-items:center;gap:16px;font-weight:900;font-size:30px;color:#22302c;letter-spacing:.04em}
.badge i{width:56px;height:56px;border-radius:14px;background:#2b7a6e;display:grid;place-items:center}
.sub{margin-top:30px;font-size:25px;font-weight:700;letter-spacing:.14em;color:#2b7a6e}
h1{margin-top:8px;font-size:96px;font-weight:900;line-height:1.08;letter-spacing:.02em}
h1 em{font-style:normal;color:#d9773e}
.frames{position:absolute;left:64px;right:64px;bottom:60px;display:grid;grid-template-columns:1fr 1fr;gap:40px}
.f{position:relative}
.f .scn{border-radius:18px;box-shadow:0 14px 30px rgba(30,40,35,.22);font-size:3.3cqw}
.f .scn-say,.f .scn-think{display:none}
.f .scn-cap{top:6%;padding:.3em .8em;white-space:nowrap;max-width:none}
.f .lab{display:inline-block;margin-bottom:12px;font-weight:900;font-size:24px;color:#fff;padding:4px 18px;border-radius:999px}
.f.n .lab{background:#c4523b}.f.o .lab{background:#2b8a7e}
.arrow{position:absolute;left:50%;bottom:${60 + 105}px;transform:translateX(-50%);z-index:3;width:54px;height:54px;border-radius:50%;background:#fff;display:grid;place-items:center;font-size:28px;font-weight:900;color:#22302c;box-shadow:0 6px 16px rgba(0,0,0,.18)}
${SCENE_CSS}
</style></head><body><div class="wrap">
<div class="badge"><i><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M5.6 5.6l2.1 2.1M18.4 5.6l-2.1 2.1"/><path d="M8 21l4-11 4 11"/><path d="M7 21h10"/></svg></i>劇情聚光燈</div>
<p class="sub">社交技巧示範 ・ 用動畫劇本取代真人示範</p>
<h1>演錯一次，<br><em>再演對</em>一次</h1>
</div>
<div class="frames"><div class="f n"><span class="lab">錯誤劇本・倒帶定格</span>${ng}</div><div class="f o"><span class="lab">正確劇本・同場景重演</span>${ok}</div></div>
<div class="arrow">→</div>
</body></html>`;
const out = path.join(__dirname, 'cover.html');
fs.writeFileSync(out, html);
(async () => {
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
  await p.goto('file://' + out);
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(__dirname, 'cover.png') });
  await b.close();
  fs.unlinkSync(out);
  console.log('docs/cover.png 完成');
})();
