// 產生分享用封面圖：node docs/cover.js → docs/cover.png（1200×900，4:3）
// 重點都放在中間 16:9 的範圍（上下各留 112px），電腦版裁成 16:9 也不會切到字
const fs = require('fs');
const path = require('path');
const { renderScene, SCENE_CSS } = require('../engine/scene');
const { talkNG } = require('../examples/hallway');
// 倒帶定格那一步（錯誤②），字幕縮短，縮圖才看得清楚
const sc = { ...talkNG, beats: talkNG.beats.map((b, j) => (j === 14 ? { ...b, cap: '馬上反駁：好辯' } : b)) };
const frame = renderScene(sc, [14, 14], 'print');
const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:900px;overflow:hidden;font-family:"Noto Sans TC",sans-serif;color:#22302c;position:relative;
 background:linear-gradient(135deg,#dbeae4 0%,#e9f1ed 50%,#eef3f0 100%)}
.shot{position:absolute;left:584px;top:360px;width:552px;height:405px;border-radius:22px;overflow:hidden;box-shadow:0 18px 40px rgba(25,40,35,.28);background:#140d07}
.shot .scn-wrap{position:absolute;top:0;left:-174px;width:900px}
.shot .scn{border-radius:0;font-size:30px}
.shot .scn-say,.shot .scn-think{display:none}
.shot .scn-cap{top:6%;white-space:nowrap;max-width:none;font-size:24px}
.shot .scn-tag span{font-size:17px}
${SCENE_CSS}
.wrap{position:absolute;left:84px;top:140px}
.badge{display:flex;align-items:center;gap:26px;font-weight:900;font-size:46px;color:#2b6f63;letter-spacing:.04em}
.badge i{width:96px;height:96px;border-radius:24px;background:#3f8577;display:grid;place-items:center}
.sub{margin-top:56px;font-size:34px;font-weight:700;letter-spacing:.16em;color:#2b6f63}
.wrap h1{margin-top:60px;font-size:90px;font-weight:900;line-height:1.14;letter-spacing:.03em;color:#1f2a26}
h1 em{font-style:normal;color:#df8a4f}
</style></head><body>
<div class="shot">${frame}</div>
<div class="wrap">
<div class="badge"><i><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5v2.5M5.8 5.3l1.7 1.7M18.2 5.3l-1.7 1.7"/><path d="M8 21l4-11 4 11"/><path d="M6.5 21h11"/></svg></i>劇情聚光燈</div>
<p class="sub">社交技巧示範 ・ 錯誤劇本 × 正確劇本</p>
<h1>演錯一次，<br><em>再演對</em>一次</h1>
</div>
</body></html>`;
const out = path.join(__dirname, 'cover.html');
fs.writeFileSync(out, html);
(async () => {
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
  await p.goto('file://' + out);
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(__dirname, 'cover.png') });
  // 檢查：電腦版 16:9 裁切後的樣子
  await p.screenshot({ path: path.join(__dirname, '..', '..', 'cover-169-check.png'), clip: { x: 0, y: 112, width: 1200, height: 675 } });
  await b.close();
  fs.unlinkSync(out);
  console.log('docs/cover.png 完成');
})();
