// 產生示範頁：node build.js → demo/index.html（單一檔案，可直接用瀏覽器打開）
// 換成自己的劇本：把 examples/ 裡的檔案改掉，或在 SHOW 裡加一組。
const fs = require('fs');
const path = require('path');
const { renderScene, SCENE_CSS, SCENE_JS } = require('./engine/scene');
const { PAIRS } = require('./examples/hallway');

// 換位思考三問（沒寫 ask 時的預設）
const askOf = p => p.ask || [`${p.other}覺得怎麼樣？`, `${p.pron || '他'}覺得${p.who}是個怎樣的人？`, `${p.pron || '他'}還想跟${p.who}聊天嗎？`];

const step = (n, kicker, title, how, body) => `
  <section class="step">
    <header><span class="no">${n}</span><div><p class="kicker">${kicker}</p><h3>${title}</h3></div></header>
    ${how ? `<p class="how">${how}</p>` : ''}
    ${body}
  </section>`;

const askBox = (qs, tip) => `<div class="ask"><b>換位思考</b><ol>${qs.map(q => `<li>${q}</li>`).join('')}</ol><p>${tip}</p></div>`;

const pairHtml = (p, i) => {
  const qs = askOf(p);
  const last = p.ng.beats.length - 1;
  return `
<article class="pair" id="${p.id}" ${i ? 'hidden' : ''}>
  ${step(1, '錯誤劇本・完整播一次', p.titleNG, '先不要停，播完請學生寫下「哪裡怪怪的」。點畫面或按「下一步」。', renderScene(p.ng, [0, p.replay - 1], 'web'))}
  ${step(2, '錯誤劇本・倒帶', '剛剛哪裡出問題？', '逐一定格，紅色標籤＝做了什麼：違反哪一條。', renderScene(p.ng, [p.replay, last], 'web'))}
  ${askBox(qs, '一兩句就好，不深談情緒。')}
  <p class="teach">↓ 這裡老師教「${p.skill}」 ↓</p>
  ${step(3, '正確劇本', p.titleOK, '同一個場景、同樣的人重演。每跳出一個綠色標籤，請學生說出是哪一個技巧。', renderScene(p.ok, null, 'web'))}
  ${askBox(qs, '再問一次同樣三個問題，和錯誤劇本比一比。')}
</article>`;
};

const html = `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>劇情聚光燈示範</title>
<meta name="description" content="用動畫劇本取代真人示範：錯誤劇本找錯、倒帶定格、正確劇本對照、換位思考。">
<style>
:root{--bg:#faf6ef;--card:#fff;--ink:#2b231c;--sub:#776a5f;--line:#ecdfcb;--accent:#e8894a;--ng:#c4523b;--ok:#2b8a7e}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;line-height:1.7}
main{max-width:960px;margin:0 auto;padding:32px 16px 64px}
.hero p.kicker{margin:0;color:var(--accent);font-weight:700;letter-spacing:.12em;font-size:14px}
.hero h1{margin:.2em 0 .3em;font-size:clamp(28px,6vw,42px);line-height:1.25}
.hero p{margin:0 0 .6em;color:var(--sub)}
.flow{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:20px 0 28px;padding:0;list-style:none}
.flow li{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 12px;font-size:14px}
.flow b{display:block;font-size:15px}
.flow .n{color:var(--ng)}.flow .o{color:var(--ok)}
.tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.tabs button{font:inherit;font-weight:700;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:6px 16px;cursor:pointer}
.tabs button[aria-selected=true]{background:var(--ink);color:#fff;border-color:var(--ink)}
.step{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px;margin:0 0 14px}
.step header{display:flex;gap:12px;align-items:center;margin-bottom:6px}
.step .no{flex:none;width:32px;height:32px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-weight:700}
.step .kicker{margin:0;font-size:13px;color:var(--accent);font-weight:700}
.step h3{margin:0;font-size:18px;line-height:1.4}
.how{margin:0 0 10px;color:var(--sub);font-size:14px}
.ask{background:#fff8ee;border:1px dashed var(--accent);border-radius:14px;padding:12px 16px;margin:0 0 14px}
.ask b{color:var(--accent)}.ask ol{margin:.3em 0;padding-left:1.4em}.ask p{margin:0;color:var(--sub);font-size:14px}
.teach{text-align:center;font-weight:700;color:var(--ok);margin:18px 0}
footer{margin-top:32px;font-size:13px;color:var(--sub)}
@media(max-width:640px){.flow{grid-template-columns:1fr 1fr}}
${SCENE_CSS}
</style>
</head>
<body>
<main>
  <div class="hero">
    <p class="kicker">SPOTLIGHT SCENES</p>
    <h1>劇情聚光燈：用動畫劇本取代真人示範</h1>
    <p>社交技巧課最難的是「示範」：老師一人分飾兩角很尷尬，找學生上台又怕被笑。這裡把示範做成可以一步步播的動畫劇本，同一個場景演兩次：先演錯的、再演對的。</p>
  </div>
  <ol class="flow">
    <li><b class="n">① 錯誤劇本</b>完整播一次，學生找錯</li>
    <li><b class="n">② 倒帶</b>逐一定格，紅標籤對答案</li>
    <li><b>③ 教策略</b>老師教這節的技巧</li>
    <li><b class="o">④ 正確劇本</b>同場景重演，綠標籤對照</li>
  </ol>
  <div class="tabs" role="tablist">
    ${PAIRS.map((p, i) => `<button role="tab" aria-selected="${!i}" data-t="${p.id}">${p.label}</button>`).join('')}
  </div>
  ${PAIRS.map(pairHtml).join('')}
  <footer>範例出自《交朋友的 15 堂課》第 2 課「維持交談」。課程參考 Elizabeth A. Laugeson《PEERS》（簡意玲 譯）與歐思賢老師的教學分享改寫，並非官方教材。CC BY-NC-SA 4.0。</footer>
</main>
<script>${SCENE_JS}
document.querySelectorAll('.tabs button').forEach(function(b){b.addEventListener('click',function(){
  document.querySelectorAll('.tabs button').forEach(function(x){x.setAttribute('aria-selected',x===b)});
  document.querySelectorAll('.pair').forEach(function(a){a.hidden=a.id!==b.dataset.t});
})});
</script>
</body>
</html>`;

fs.mkdirSync(path.join(__dirname, 'demo'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'demo', 'index.html'), html);
console.log('demo/index.html 完成');
