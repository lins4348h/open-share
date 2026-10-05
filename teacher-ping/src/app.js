/* ================================================================
   《老師，在嗎？》引擎 v4：固定 6 回合、傾向計分、7 種結局、八面玲瓏範本頁
   ================================================================ */
var STATS_URL = 'https://script.google.com/macros/s/AKfycbyT-H4JFUabemVr5Cz_4YwJMaFE67m9Tn9QjtO__li1pm7-606TgjDrBRtybRoEtqDP/exec';
var TOOL_NAME = '老師，在嗎？';
var SITE_URL = 'https://education-writing-ai.netlify.app/';
var IG_URL = 'https://www.instagram.com/education_writing/';
var IG_HANDLE = '@education_writing';
var CFG = { reply:20, chase:10, ring:3 };
var ORDER = ['parent','boss','col'];
var DIR = { o:'顧對方', s:'顧自己', p:'守原則' };
var TPL_INTRO = '下面的「八面玲瓏回法」，是冷靜下來、有時間慢慢想才寫得出來的。晚上九點、手機一直震、20 秒內要回，做不到很正常。我們都是人，都有情緒。這份範本不是要你每次都完美，而是讓你下次多一個選項。';
var TPL_OUTRO = '覺得「哪有可能每次都這樣回」？沒關係，沒有人做得到。能在顧對方、顧自己、守原則之間多停一秒，就已經很好了。照顧好孩子之前，也記得照顧好自己。';

/* ---------------- 使用統計（沿用引路人其他遊戲的計數） ---------------- */
(function trackVisit(){
  if (!STATS_URL || STATS_URL.indexOf('http') !== 0) return;
  var url = STATS_URL + '?tool=' + encodeURIComponent(TOOL_NAME);
  try { if (navigator.sendBeacon && navigator.sendBeacon(url)) return; } catch(e){}
  try { fetch(url, { method:'GET', mode:'no-cors', keepalive:true }).catch(function(){}); }
  catch(e){ try { new Image().src = url + '&t=' + Date.now(); } catch(e2){} }
})();

/* ---------------- 圖示 ---------------- */
var ICONS = {
  chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  speaker:'<path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
  mute:'<path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  back:'<path d="m15 18-6-6 6-6"/>',
  send:'<path d="M5 12h13"/><path d="m12 5 7 7-7 7"/>',
  phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  missed:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/><path d="m15 3 6 6M21 3l-6 6"/>',
  signal:'<path d="M4 18v-2M9 18v-5M14 18v-8M19 18V6"/>',
  wifi:'<path d="M2 9a15 15 0 0 1 20 0"/><path d="M5.5 12.5a10 10 0 0 1 13 0"/><path d="M9 16a5 5 0 0 1 6 0"/><path d="M12 19.5h.01"/>',
  battery:'<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2"/><path d="M5 10h9v4H5z" fill="currentColor"/>',
  arrow:'<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  down:'<path d="M12 5v14"/><path d="m6 13 6 6 6-6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/>'
};
function ico(n, cls){ return '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'+(cls?' class="'+cls+'"':'')+'>'+(ICONS[n]||'')+'</svg>'; }

/* ---------------- 小工具 ---------------- */
var T = { cd:null, ring:null, clock:null, speech:null, banner:null, nudge:null };
var AUDIO = { ctx:null, on:true };
var LAST = {};   /* 這次開網頁後的遊玩紀錄，給範本頁對照「你剛剛的回法」 */
function $(id){ return document.getElementById(id); }
function wait(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
function alive(tok){ return G && tok === G.tok; }
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); }
function rm(el){ if (el && el.parentNode) el.parentNode.removeChild(el); }
function toast(msg){ var t = $('toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(function(){ t.classList.remove('on'); }, 1900); }
function shuffle(a){ for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function addMin(t, m){ if (!m || !/^\d\d:\d\d$/.test(t)) return t; var p = t.split(':'), v = (+p[0] * 60 + +p[1] + m) % 1440; return ('0' + Math.floor(v / 60)).slice(-2) + ':' + ('0' + v % 60).slice(-2); }
function splitSentences(s){
  var out = [], buf = '';
  for (var i = 0; i < s.length; i++){ buf += s[i]; if ('，。？！…'.indexOf(s[i]) >= 0 && buf.length > 6){ out.push(buf); buf = ''; } }
  if (buf.trim()) out.push(buf);
  return out;
}
/* 中文斷句：把文字按標點切成一句一句，換行只發生在句與句之間，避免單字落單或從句子中間斷開 */
var PUNCT = '，。、？！；：…～」』）)》,.!?';
function ph(text){
  var s = String(text), out = [], buf = '';
  for (var i = 0; i < s.length; i++){
    buf += s[i];
    if (PUNCT.indexOf(s[i]) >= 0 && PUNCT.indexOf(s[i + 1] || '') < 0){ out.push(buf); buf = ''; }
  }
  if (buf) out.push(buf);
  if (out.length > 1 && out[out.length - 1].length <= 2){ var tail = out.pop(); out[out.length - 1] += tail; }
  return out.map(function(c){ return c.length > 16 ? pp(c) : '<span class="ph">' + esc(c) + '</span>'; }).join('');
}
/* 長段落：正常排滿，只把最後一小段黏在一起，避免最後一行只剩一兩個字 */
function pp(text){
  var t = String(text), P = '，。、？！；：';
  /* 找最後一個句中標點，最後一句 10 字內就整句黏住；太長就只黏最後 3 個字 */
  var end = t.length; while (end > 0 && PUNCT.indexOf(t[end - 1]) >= 0) end--;
  var i = end - 1; while (i >= 0 && P.indexOf(t[i]) < 0) i--;
  var cut = (t.length - (i + 1) <= 11 && i > 0) ? i + 1 : Math.max(0, end - 3);
  return esc(t.slice(0, cut)) + '<span class="nw">' + esc(t.slice(cut)) + '</span>';
}
function itemText(it){ if (typeof it === 'string') return it; return it.text || it.unsend || (it.voice ? '🎤 語音訊息' : ''); }

/* ---------------- 音效與語音 ---------------- */
function audioUnlock(){
  try {
    if (!AUDIO.ctx){ var C = window.AudioContext || window.webkitAudioContext; if (C) AUDIO.ctx = new C(); }
    if (AUDIO.ctx && AUDIO.ctx.state === 'suspended') AUDIO.ctx.resume();
  } catch(e){}
  try { if (window.speechSynthesis){ speechSynthesis.getVoices(); var u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } } catch(e){}
}
function beep(f, d, t0, g, type){
  var c = AUDIO.ctx; if (!c || !AUDIO.on) return;
  try {
    var o = c.createOscillator(), v = c.createGain(), t = c.currentTime + (t0 || 0), gg = g || 0.08;
    o.type = type || 'sine'; o.frequency.value = f;
    v.gain.setValueAtTime(0, t); v.gain.linearRampToValueAtTime(gg, t + 0.015); v.gain.setValueAtTime(gg, t + Math.max(0.02, d - 0.03)); v.gain.linearRampToValueAtTime(0, t + d);
    o.connect(v); v.connect(c.destination); o.start(t); o.stop(t + d + 0.03);
  } catch(e){}
}
function sndKey(){ beep(988, 0.07, 0, 0.05); beep(1318, 0.09, 0.08, 0.05); }
function sndSend(){ beep(520, 0.06, 0, 0.04); beep(880, 0.08, 0.05, 0.04); }
function sndRing(){ for (var i = 0; i < 10; i++) beep(i % 2 ? 640 : 860, 0.07, i * 0.08, 0.08); }
function sndHang(){ for (var i = 0; i < 3; i++) beep(480, 0.2, i * 0.36, 0.07); }
function vibrate(p){ try { if (navigator.vibrate) navigator.vibrate(p); } catch(e){} }
function buzz(){ var p = $('phone'); if (!p) return; p.classList.remove('buzz'); void p.offsetWidth; p.classList.add('buzz'); }
function zhVoices(){ try { return speechSynthesis.getVoices().filter(function(v){ return /^(zh|cmn)/i.test(v.lang) || /Chinese|中文|國語|普通話/.test(v.name); }); } catch(e){ return []; } }
function isNatural(v){ return !!v && /Natural|Neural|Online|Premium|Enhanced|加強|優化/i.test(v.name); }
function isMale(v){ return !!v && /YunJhe|雲哲|Zhiwei|志偉|Male|男/i.test(v.name); }
function scoreVoice(v, g){
  var n = v.name + ' ' + v.lang, s = 0;
  if (/TW|Taiwan|臺灣|台灣/i.test(n)) s += 50; else if (/HK|Hong|粵|yue/i.test(n)) s -= 40;
  if (isNatural(v)) s += 30;
  if (/Google/i.test(n)) s += 8;
  if (/美佳|Meijia|HsiaoChen|HsiaoYu|曉臻|曉雨|Yating|雅婷|Female|女/i.test(n)) s += g === 'm' ? -12 : 12;
  if (isMale(v)) s += g === 'm' ? 25 : -20;
  return s;
}
function pickVoice(g){
  var vs = zhVoices(); if (!vs.length) return null;
  vs.sort(function(a, b){ return scoreVoice(b, g) - scoreVoice(a, g); });
  return vs[0];
}
/* 逐句朗讀＋字幕；沒有語音或語音失敗時，自動改成字幕節奏 */
function speakLines(lines, opt, onLine, onDone){
  var i = 0, stopped = false, wd = null;
  var useVoice = AUDIO.on && ('speechSynthesis' in window);
  var voice = useVoice ? pickVoice(opt.g) : null;
  try { if (useVoice) speechSynthesis.cancel(); } catch(e){}
  function textTime(s){ return s.length * 190 + 700; }
  function next(){
    clearTimeout(wd); if (stopped) return;
    if (i >= lines.length){ stopped = true; onDone(); return; }
    var line = lines[i++]; onLine(line, i - 1);
    if (!useVoice || /^（.*）/.test(line) && line.length < 9){ wd = setTimeout(next, textTime(line)); return; }
    try {
      var u = new SpeechSynthesisUtterance(line.replace(/（[^）]*）/g, '').replace(/[()]/g, '')), started = false, fin = false, t0 = Date.now();
      u.lang = (voice && voice.lang) || 'zh-TW'; if (voice) u.voice = voice;
      /* 自然語音本來就比較有語氣，速度放慢、音高不要亂調；男性角色找不到男聲時才壓低音高 */
      var nat = isNatural(voice);
      u.rate = nat ? Math.min(1.25, (opt.rate || 1.3) - 0.15) : (opt.rate || 1.35);
      u.pitch = opt.g === 'm' ? (isMale(voice) ? 1 : 0.72) : (nat ? 1 : (opt.pitch || 1.05));
      u.onstart = function(){ started = true; };
      u.onend = u.onerror = function(){
        if (fin) return; fin = true; clearTimeout(wd);
        var spent = Date.now() - t0;
        if (!started || spent < line.length * 60){ useVoice = false; wd = setTimeout(next, Math.max(300, textTime(line) - spent)); }
        else wd = setTimeout(next, 120);
      };
      speechSynthesis.speak(u);
      wd = setTimeout(function(){
        if (fin) return;
        if (!started){ useVoice = false; try { speechSynthesis.cancel(); } catch(e){} fin = true; wd = setTimeout(next, Math.max(300, textTime(line) - 1600)); }
        else { wd = setTimeout(function(){ if (!fin){ fin = true; next(); } }, line.length * 260 + 1500); }
      }, 1600);
    } catch(e){ useVoice = false; wd = setTimeout(next, textTime(line)); }
  }
  next();
  return { stop:function(){ stopped = true; clearTimeout(wd); try { speechSynthesis.cancel(); } catch(e){} } };
}
function stopAll(){
  clearInterval(T.cd); T.cd = null; clearInterval(T.ring); T.ring = null; clearInterval(T.clock); T.clock = null; clearInterval(T.nudge); T.nudge = null;
  if (T.speech){ T.speech.stop(); T.speech = null; }
  try { speechSynthesis.cancel(); } catch(e){}
  vibrate(0);
}

/* ================================================================
   首頁／選人／八面玲瓏範本（分頁）
   ================================================================ */
var VIEW = { name:'home', id:null, page:0 };
function topbar(){ return '<header class="topbar"><div class="shell"><button class="logo" data-act="home" aria-label="回首頁"><i>'+ico('chat')+'</i>老師，在嗎？</button></div></header>'; }
function footer(){ return '<footer class="foot"><div class="shell"><span><b>老師，在嗎？</b>　引路人・教師職場情境遊戲</span><span><a href="'+SITE_URL+'" target="_blank" rel="noopener">引路人網站</a>　·　<a href="'+IG_URL+'" target="_blank" rel="noopener">Instagram</a></span></div></footer>'; }
function vHome(){
  return topbar()+
    '<main><section class="hero dark"><div class="shell hero-grid"><div>'+
      '<span class="eyebrow">引路人・教師職場情境遊戲</span>'+
      '<h1>老師，<span>在嗎？</span></h1>'+
      '<p class="lead">'+ph('下班了，手機還在響。選一個人，把這件事處理完。')+'</p>'+
      '<div class="how"><span class="how-t">怎麼玩</span><ol class="steps">'+
        '<li><b>選一個人</b><p>'+ph('家長、主任、同事，各有一件棘手的事，一次只處理一件。')+'</p></li>'+
        '<li><b>走完 6 回合</b><p>'+ph('每則回覆 '+CFG.reply+' 秒，超時就是已讀不回。每次有三種回法，都有代價：')+'</p><div class="dirs"><span class="dchip o">顧對方</span><span class="dchip s">顧自己</span><span class="dchip p">守原則</span></div></li>'+
        '<li><b>看結局，再看範本</b><p>'+ph('你的選擇傾向決定結局。玩完看「八面玲瓏」：雙方的內心戲，和比較周全的回法。')+'</p></li>'+
      '</ol></div>'+
      '<div class="hero-cta"><button class="btn btn-pri big" data-act="pickView">今晚，你要回誰？'+ico('arrow')+'</button></div>'+
      '<div class="sound-hint">'+ico('speaker')+'<span>會有人打電話來，建議開聲音或戴耳機</span></div>'+
    '</div><div class="desk-wrap">'+DESK_SVG+'</div></section></main>'+footer();
}
function vPick(){
  var cards = ORDER.map(function(id){
    var S0 = SCEN[id], wip = !!S0.wip;
    return '<article class="who'+(wip ? ' wip' : '')+'">'+(wip ? '<span class="wip-tag">製作中</span>' : '')+
      '<div class="top"><span class="av">'+avh(S0.av)+'</span><span><span class="role">'+S0.role+'</span><b class="nm">'+S0.name+'</b></span><span class="time">'+(S0.previewTime || '')+'</span></div>'+
      '<h3>'+S0.title+'</h3><span class="bubble">'+ph(S0.preview)+'</span><p class="teaser">'+ph(S0.teaser)+'</p>'+
      '<div class="acts">'+(wip
        ? '<button class="btn btn-sec" disabled>製作中，敬請期待</button>'
        : '<button class="btn btn-pri" data-act="play" data-id="'+id+'">'+ico('phone')+'接起來</button><button class="btn-text" data-act="tpl" data-id="'+id+'">看八面玲瓏範本'+ico('arrow')+'</button>')+
      '</div></article>';
  }).join('');
  return topbar()+'<main><section class="sec pick"><div class="shell"><button class="btn-text back-link" data-act="home">'+ico('back')+'回首頁</button>'+
    '<div class="sec-head"><span class="eyebrow">CHOOSE ONE</span><h2>今晚，你要回誰？</h2><p>'+ph('三個人、三件事，各自獨立。每段大約 5 分鐘，結局看你這 6 回合比較常顧誰。')+'</p></div>'+
    '<div class="cards">'+cards+'</div></div></section></main>'+footer();
}
function render(name, id, page){
  VIEW = { name:name, id:id || null, page:page || 0 };
  $('site').innerHTML = name === 'pick' ? vPick() : name === 'tpl' ? vTpl(id, VIEW.page) : vHome();
  window.scrollTo(0, 0);
}
function showHome(){ render('home'); }
function showPick(){ render('pick'); }
function showTpl(id, page){ render('tpl', id, page); }

function waveBars(){ var s = ''; for (var i = 0; i < 18; i++) s += '<i style="height:'+(30 + ((i * 37) % 70))+'%"></i>'; return s; }
function tplBubble(it){
  if (typeof it === 'object' && it.voice) return '<div class="voice"><span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 5v14l12-7z"/></svg></span><span class="wave">'+waveBars()+'</span><span class="d">'+it.voice.d+'</span></div><div class="vtext">'+pp(it.voice.text)+'</div>';
  if (typeof it === 'object' && it.unsend) return ph(it.unsend) + '<br><small style="color:var(--ink3)">（傳出後馬上收回）</small>';
  return ph(itemText(it));
}
function tplRound(S0, i, pk){
  var R = S0.rounds[i], info = S0.threads[R.th], T0 = R.tpl;
  var items = (R.items || []).filter(function(it){ return !(typeof it === 'object' && (it.when || it.typing || it.wait || it.div || it.sys)); });
  var lastName = null;
  var chat = items.map(function(it){
    var nm = (typeof it === 'object' && it.from) || info.name, av = (typeof it === 'object' && it.av) || info.av, cont = nm === lastName; lastName = nm;
    return '<div class="m'+(cont ? ' cont' : '')+'" style="animation:none"><span class="mav">'+avh(av)+'</span><div class="mb">'+(info.group && !cont ? '<span class="snd">'+esc(nm)+'</span>' : '')+'<div class="row"><div class="b">'+tplBubble(it)+'</div></div></div></div>';
  }).join('');
  if (R.call) chat += '<div class="tcall"><div class="h">'+ico('phone')+info.name+' 打電話來</div>'+R.call.p1.filter(function(l){ return typeof l === 'string'; }).map(function(l){ return '<p>'+ph('「'+l+'」')+'</p>'; }).join('')+'</div>';
  var yours = pk ? '<div class="say yours"><small>你剛剛的回法 <span class="dchip '+pk.d+'">'+DIR[pk.d]+'</span></small><p>'+pp(pk.t)+'</p></div>' : '';
  return '<section class="tr"><div class="tr-head"><span class="rn">第 '+(i + 1)+' 回合</span><span class="rt">'+R.t+'</span><span class="rw"><span class="rav">'+avh(info.av)+'</span>'+info.name+'</span>'+
      (R.call ? '<span class="tag">來電・插話一次</span>' : '')+(!R.call && i > 0 && R.th !== S0.rounds[i - 1].th ? '<span class="tag">從另一個視窗跳出來</span>' : '')+'</div>'+
    '<div class="tchat">'+chat+'</div>'+
    '<div class="lbl">內心戲</div>'+
    '<div class="thk them"><small>'+esc(T0.who || info.name)+'心裡想</small>'+pp(T0.inner)+'</div>'+
    '<div class="thk me"><small>老師的真心話</small>'+pp(T0.feel)+'</div>'+
    '<div class="lbl">'+(R.call ? '插話時可以這樣說' : '可以這樣回')+'</div>'+
    '<div class="cmp'+(pk ? ' two' : '')+'">'+yours+'<div class="say best"><small>八面玲瓏回法</small><p>'+pp(T0.best)+'</p></div></div>'+
    '<div class="why">'+['o','p','s'].map(function(d){ return '<div><span class="dchip '+d+'">'+DIR[d]+'</span><span>'+pp(T0.why[d])+'</span></div>'; }).join('')+'</div>'+
  '</section>';
}
function vTpl(id, page){
  var S0 = SCEN[id], rec = LAST[id], n = S0.rounds.length, last = n + 1;
  page = Math.max(0, Math.min(last, page || 0));
  var steps = '<nav class="tsteps" aria-label="範本頁碼">'+
    '<button class="ts wide'+(page === 0 ? ' on' : '')+'" data-act="tpage" data-p="0">開頭</button>'+
    S0.rounds.map(function(R, i){ var pk = rec && rec.picks[i]; return '<button class="ts'+(page === i + 1 ? ' on' : '')+(pk ? ' d-' + pk.d : '')+'" data-act="tpage" data-p="'+(i + 1)+'" aria-label="第 '+(i + 1)+' 回合">'+(i + 1)+'</button>'; }).join('')+
    '<button class="ts wide'+(page === last ? ' on' : '')+'" data-act="tpage" data-p="'+last+'">最後</button></nav>';
  var body, nav;
  if (page === 0){
    var mine = '';
    if (rec){
      var E0 = S0.endings[rec.ending];
      mine = '<div class="mine"><span class="t">你剛剛的結局</span><h3>'+esc(E0.n)+'</h3><div class="dirs">'+
        ['o','s','p'].map(function(d){ return '<span class="dchip '+d+'">'+DIR[d]+' '+rec.counts[d]+'</span>'; }).join('')+
        '</div><p class="note2">每一回合都附上「你剛剛的回法」，可以跟八面玲瓏回法對照。上方頁碼的顏色，是你那回合選的方向。</p></div>';
    }
    body = '<div class="remind strong"><span class="ic">🪔</span><div><b>先說在前面：做不到很正常</b><p>'+pp(TPL_INTRO)+'</p></div></div>'+mine+
      '<div class="howread"><b>每一回合一頁，依序是：</b><ol><li>對方傳來的訊息</li><li>對方心裡想的，和老師的真心話</li><li>八面玲瓏回法，以及它怎麼同時顧到三個方向</li></ol></div>';
    nav = '<div class="tnav one"><button class="btn btn-pri" data-act="tpage" data-p="1">從第 1 回合開始'+ico('arrow')+'</button></div>';
  } else if (page === last){
    body = '<div class="remind strong"><span class="ic">🫶</span><div><b>哪有可能每次都這樣回？</b><p>'+pp(TPL_OUTRO)+'</p></div></div>';
    nav = '<div class="tnav"><button class="btn btn-sec" data-act="home">回首頁</button><button class="btn btn-pri" data-act="play" data-id="'+id+'">'+ico('phone')+(rec ? '再玩一次' : '接起來玩玩看')+'</button></div>'+
      '<div class="tnav-more"><button class="btn-text" data-act="tpage" data-p="'+n+'">'+ico('back')+'回到第 '+n+' 回合</button><button class="btn-text" data-act="pickView">換一個人</button></div>';
  } else {
    body = tplRound(S0, page - 1, rec && rec.picks[page - 1]);
    nav = '<div class="tnav"><button class="btn btn-sec" data-act="tpage" data-p="'+(page - 1)+'">'+ico('back')+(page === 1 ? '開頭' : '上一回合')+'</button>'+
      '<button class="btn btn-pri" data-act="tpage" data-p="'+(page + 1)+'">'+(page === n ? '最後' : '下一回合')+ico('arrow')+'</button></div>';
  }
  return topbar()+
    '<main class="tpl-main"><div class="tpl-top"><div class="shell tpl-wrap"><div class="tpl-ttl"><button class="btn-text back-link" data-act="home">'+ico('back')+'回首頁</button>'+
      '<div><span class="eyebrow">八面玲瓏範本</span><h1>'+esc(S0.title)+'</h1></div></div>'+steps+'</div></div>'+
    '<section class="tpl-body"><div class="shell tpl-wrap" id="tplBody">'+body+nav+'</div></section></main>'+footer();
}
function tplGo(p){
  if (VIEW.name !== 'tpl') return;
  var last = SCEN[VIEW.id].rounds.length + 1;
  if (p < 0 || p > last) return;
  render('tpl', VIEW.id, p);
}

/* ================================================================
   遊戲
   ================================================================ */
var G = null;

function startGame(id){
  audioUnlock();
  try { var de = document.documentElement; if (de.requestFullscreen && !document.fullscreenElement && matchMedia('(max-width:900px)').matches) de.requestFullscreen().catch(function(){}); } catch(e){}
  var tok = G ? G.tok + 1 : 1;
  stopAll(); rm($('endov')); rm($('modal'));
  G = { id:id, sc:SCEN[id], tok:tok, active:null, last:{}, unread:{}, prev:{}, prevT:{}, r:0, picks:[], counts:{ o:0, s:0, p:0 },
        choice:null, call:null, voices:[], offset:0, paused:false, lastReply:'', time:'' };
  document.body.classList.add('playing');
  var S0 = G.sc, n = S0.bg.length, k = 0, html = '';
  S0.bg.forEach(function(l, i){
    if (l === ''){ html += '<span class="gap"></span>'; return; }
    html += '<p class="'+(i === n - 1 ? 'last' : '')+'" style="animation-delay:'+(0.3 + k * 0.85)+'s">'+ph(l)+'</p>'; k++;
  });
  var d = 0.5 + k * 0.85;
  $('stage').innerHTML = '<div class="bgcard"><div class="bg-in"><span class="when">'+S0.role+'・'+S0.title+'</span>'+html+
    '<div class="rule" style="animation-delay:'+d+'s"><span>'+ico('layers')+'固定 6 回合</span><span>'+ico('clock')+'每則 '+CFG.reply+' 秒，超時＝已讀不回</span><span>'+ico('speaker')+'會有來電，請開聲音</span></div>'+
    '<button class="btn btn-pri go" data-act="bgGo" style="animation-delay:'+(d + 0.4)+'s">'+ico('phone')+'拿起手機</button></div></div>';
}
function buildPhone(){
  var S0 = G.sc, feeds = Object.keys(S0.threads).map(function(k){ return '<div class="feed" id="f-'+k+'" hidden aria-live="polite"></div>'; }).join('');
  var dots = S0.rounds.map(function(){ return '<i></i>'; }).join('');
  $('stage').innerHTML =
    '<div class="hud"><button class="hbtn" data-act="exit" aria-label="離開">'+ico('x')+'<span class="t">離開</span></button>'+
      '<div class="rounds"><span class="rdots" id="rdots">'+dots+'</span><span class="rtxt" id="rtxt"></span></div>'+
      '<button class="hbtn icon" data-act="snd" id="sndBtn" aria-label="切換聲音">'+ico(AUDIO.on ? 'speaker' : 'mute')+'</button></div>'+
    '<div class="phone" id="phone"><div class="screen" id="screen">'+
      '<div class="sbar"><span id="clk">--:--</span><span class="ic">'+ico('signal')+ico('wifi')+ico('battery')+'</span></div>'+
      '<div class="chead"><button class="back" data-act="back" aria-label="所有對話">'+ico('back')+'<b class="bdot" id="bdot" hidden></b></button><span class="av" id="hav"></span>'+
        '<span class="nm"><b id="hnm"></b><small id="hsub"></small></span></div>'+
      '<div class="feeds" id="feeds">'+feeds+'</div>'+
      '<div class="comp"><div class="tmr" id="tmr" hidden><span class="tb"><i id="tbi"></i></span><b id="tnum">'+CFG.reply+'</b></div>'+
        '<div class="opts" id="opts" hidden></div>'+
        '<div class="inbar"><div class="inbox" id="inbox"><span class="ph">輸入訊息</span></div><span class="send" id="sendBtn">'+ico('send')+'</span></div></div>'+
      '<div class="clist" id="clist" hidden></div>'+
    '</div></div>';
  setThread('main');
  updateHud();
}
function updateHud(){
  var n = G.sc.rounds.length, r = Math.min(G.r, n - 1);
  var ds = $('rdots'); if (ds) Array.prototype.forEach.call(ds.children, function(d, i){ d.className = i < G.r ? 'done' : (i === G.r && !G.done ? 'cur' : ''); if (G.done) d.className = 'done'; });
  var t = $('rtxt'); if (t) t.textContent = G.done ? '6 回合結束' : '第 ' + (r + 1) + '／' + n + ' 回合';
}
function setThread(th){
  var S0 = G.sc, info = S0.threads[th];
  G.active = th; G.unread[th] = 0;
  Object.keys(S0.threads).forEach(function(k){ var f = $('f-' + k); if (f) f.hidden = k !== th; });
  $('hav').innerHTML = avh(info.av); $('hnm').textContent = info.name; $('hsub').textContent = info.sub;
  var b = document.querySelector('.banner'); if (b && b.getAttribute('data-th') === th) rm(b);
  var cl = $('clist'); if (cl) cl.hidden = true;
  updateUnread(); renderChoice();
  var f = $('f-' + th); if (f) f.scrollTop = f.scrollHeight;
}
function updateUnread(){
  var n = 0; Object.keys(G.unread).forEach(function(k){ if (k !== G.active) n += G.unread[k] || 0; });
  var b = $('bdot'); if (b){ b.hidden = !n; b.textContent = n ? String(n) : ''; }
}
function setClock(t, raw){ var v = raw ? t : addMin(t, G.offset); var c = $('clk'); if (c && v) c.textContent = v; G.time = v; }
function push(th, html, preview){
  var f = $('f-' + th); if (!f) return null;
  f.insertAdjacentHTML('beforeend', html);
  var el = f.lastElementChild;
  if (preview){ G.prev[th] = preview; G.prevT[th] = G.time; }
  if (th === G.active) f.scrollTop = f.scrollHeight;
  else if (preview){ G.unread[th] = (G.unread[th] || 0) + 1; updateUnread(); }
  return el;
}
function senderOf(th, it){
  var info = G.sc.threads[th];
  if (it && typeof it === 'object' && it.from) return { name:it.from, av:it.av || '💬', label:true };
  return { name:info.name, av:info.av, label:false };
}
function inHTML(th, text, it){
  var s0 = senderOf(th, it), cont = G.last[th] === s0.name;
  G.last[th] = s0.name;
  return '<div class="m'+(cont ? ' cont' : '')+'"><span class="mav">'+avh(s0.av)+'</span><div class="mb">'+(s0.label && !cont ? '<span class="snd">'+esc(s0.name)+'</span>' : '')+
    '<div class="row"><div class="b">'+text+'</div><span class="tm">'+(G.time || '')+'</span></div></div></div>';
}
function outHTML(text){
  return '<div class="m out"><div class="mb"><div class="row"><div class="b">'+ph(text)+'</div><span class="tm">'+(G.time || '')+'</span></div><div class="read" hidden>已讀</div></div></div>';
}
function showBanner(th, text, sticky){
  var sc = $('feeds'); if (!sc) return;
  var info = G.sc.threads[th];
  rm(sc.querySelector('.banner')); clearTimeout(T.banner);
  sc.insertAdjacentHTML('beforeend', '<button class="banner'+(sticky ? ' sticky' : '')+'" data-act="openTh" data-th="'+th+'"><span class="av">'+avh(info.av)+'</span><span class="tx"><b>'+esc(info.name)+'</b><span>'+esc(text)+'</span></span><span class="open">點開</span></button>');
  if (!sticky){ var b = sc.querySelector('.banner'); T.banner = setTimeout(function(){ if (b && b.parentNode && !b.classList.contains('sticky')) rm(b); }, 2600); }
  sndKey(); buzz(); vibrate(120);
}
function typingOn(th, it){
  var s0 = senderOf(th, it);
  return push(th, '<div class="m tp'+(G.last[th] === s0.name ? ' cont' : '')+'"><span class="mav">'+avh(s0.av)+'</span><div class="mb"><div class="typing"><i></i><i></i><i></i></div></div></div>');
}
function previewOf(it, text){ return (it && typeof it === 'object' && it.from) ? it.from + '：' + text : text; }
function okWhen(it){
  if (!it || typeof it !== 'object' || !it.when) return true;
  var p = G.picks[it.when.r];
  if (!p || p.d !== it.when.d) return false;
  if (it.when.to !== undefined && !!p.to !== it.when.to) return false;
  return true;
}

/* 播放一則對方的訊息；不在目前視窗時，只跳通知＋紅點 */
async function playItem(it, tok, th){
  if (typeof it === 'object' && it.wait){ await wait(it.wait); return alive(tok); }
  var here = th === G.active;
  if (typeof it === 'object' && it.div){ setClock(it.div, true); push(th, '<div class="div">'+esc(it.div)+'</div>'); await wait(800); return alive(tok); }
  if (typeof it === 'object' && it.sys){ push(th, '<div class="sys">'+esc(it.sys)+'</div>'); await wait(900); return alive(tok); }
  if (typeof it === 'object' && it.typing){
    if (!here){ await wait(1800); return alive(tok); }
    var a = typingOn(th, it); await wait(1300); rm(a); if (!alive(tok)) return false;
    await wait(700); var b = typingOn(th, it); await wait(1100); rm(b); await wait(400); return alive(tok);
  }
  if (typeof it === 'object' && it.unsend){
    var t1 = here ? typingOn(th) : null; await wait(1000); rm(t1); if (!alive(tok)) return false;
    var el = push(th, inHTML(th, ph(it.unsend)), it.unsend); sndKey(); buzz();
    if (!here) showBanner(th, it.unsend, false);
    await wait(1600); if (!alive(tok)) return false;
    var bb = el && el.querySelector('.b'); if (bb){ bb.classList.add('unsent'); bb.textContent = G.sc.threads[th].name + ' 收回了一則訊息'; }
    var tm = el && el.querySelector('.tm'); if (tm) tm.textContent = '';
    G.prev[th] = '收回了一則訊息';
    await wait(1100); return alive(tok);
  }
  if (typeof it === 'object' && it.voice){
    var t2 = here ? typingOn(th) : null; await wait(1500); rm(t2); if (!alive(tok)) return false;
    var k = G.voices.length; G.voices.push(it.voice.text);
    push(th, inHTML(th, '<div class="voice" id="vc'+k+'"><button class="play" data-act="voice" data-k="'+k+'" aria-label="播放語音訊息"><svg viewBox="0 0 24 24"><path d="M7 5v14l12-7z"/></svg></button><span class="wave">'+waveBars()+'</span><span class="d">'+it.voice.d+'</span></div><div class="vhint" id="vh'+k+'">點一下播放</div><div class="vtext" id="vt'+k+'" hidden></div>'), '🎤 語音訊息');
    sndKey(); buzz(); if (!here) showBanner(th, '傳來一則語音訊息', false);
    await wait(1700); return alive(tok);
  }
  var text = itemText(it), pv = previewOf(it, text);
  var t3 = here ? typingOn(th, it) : null;
  await wait(Math.min(1700, Math.max(650, 420 + text.length * 32))); rm(t3); if (!alive(tok)) return false;
  push(th, inHTML(th, ph(text), it), pv); sndKey(); buzz();
  if (!here) showBanner(th, pv, false);
  await wait(Math.min(1500, 600 + text.length * 16));
  return alive(tok);
}

/* ---------------- 回合 ---------------- */
async function runRound(i){
  var tok = G.tok; if (!alive(tok)) return;
  G.r = i; updateHud();
  var R = G.sc.rounds[i];
  setClock(R.t);
  var items = (R.items || []).filter(okWhen);
  for (var k = 0; k < items.length; k++){ if (!(await playItem(items[k], tok, R.th))) return; }
  if (!alive(tok)) return;
  if (R.call) return runCall(R, tok);
  beginChoice(R, tok);
}
function beginChoice(R, tok){
  G.choice = { R:R, tok:tok, order:shuffle([0, 1, 2]), started:false };
  if (R.th !== G.active){
    /* 另一個視窗：只跳通知＋紅點，點開才開始倒數；沒點的話每隔一陣子再震一次 */
    showBanner(R.th, G.prev[R.th] || '傳來新訊息', true);
    clearInterval(T.nudge);
    T.nudge = setInterval(function(){
      if (!alive(tok) || !G.choice || G.choice.started){ clearInterval(T.nudge); T.nudge = null; return; }
      if (G.paused || G.active === R.th) return;
      showBanner(R.th, G.prev[R.th] || '傳來新訊息', true);
    }, 8000);
  }
  renderChoice();
}
function startChoiceTimer(){
  var c = G.choice; if (!c || c.started) return;
  c.started = true; clearInterval(T.nudge); T.nudge = null;
  $('tmr').hidden = false;
  startTimer(CFG.reply, { bar:'tbi', num:'tnum', wrap:'tmr' }, function(){ chase(c.R, c.tok); }, function(){ onTimeout(c.tok); });
}
function renderChoice(){
  var box = $('opts'); if (!box) return;
  var c = G.choice;
  if (!c){ box.hidden = true; box.innerHTML = ''; return; }
  var R = c.R;
  if (G.active === R.th){
    box.innerHTML = c.order.map(function(k){ return '<button class="opt" data-act="pick" data-k="'+k+'">'+ph(R.opts[k].t)+'</button>'; }).join('');
    box.hidden = false;
    startChoiceTimer();
  } else {
    var info = G.sc.threads[R.th], n = G.unread[R.th] || 0;
    box.innerHTML = '<button class="waitbar" data-act="openTh" data-th="'+R.th+'"><span class="av">'+avh(info.av)+'</span><span class="wt"><b>'+esc(info.name)+'</b> 傳來'+(n ? ' ' + n + ' 則' : '')+'新訊息</span><span class="open">點開回覆</span></button>';
    box.hidden = false;
  }
  var f = $('f-' + G.active); if (f) f.scrollTop = f.scrollHeight;
}
function startTimer(sec, ids, onChase, onEnd){
  var total = sec * 1000, left = total, chased = false;
  clearInterval(T.cd);
  T.cd = setInterval(function(){
    if (document.hidden || (G && G.paused)) return;
    left -= 100;
    var bar = $(ids.bar), num = $(ids.num), w = $(ids.wrap);
    if (bar) bar.style.transform = 'scaleX(' + Math.max(0, left / total) + ')';
    if (num) num.textContent = Math.max(0, Math.ceil(left / 1000));
    if (w) w.classList.toggle('hot', left <= 5000);
    if (!chased && left <= CFG.chase * 1000){ chased = true; if (onChase) onChase(); }
    if (left <= 0){ clearInterval(T.cd); T.cd = null; onEnd(); }
  }, 100);
}
function stopTimer(){
  clearInterval(T.cd); T.cd = null;
  var tm = $('tmr'); if (tm){ tm.hidden = true; tm.classList.remove('hot'); }
  var bar = $('tbi'); if (bar) bar.style.transform = 'scaleX(1)';
  var num = $('tnum'); if (num) num.textContent = CFG.reply;
}
async function chase(R, tok){
  if (!R.chase || !alive(tok) || !G.choice) return;
  var th = R.th;
  if (typeof R.chase === 'object' && R.chase.typing){
    if (th === G.active){ var a = typingOn(th); await wait(2600); rm(a); }
    else showBanner(th, '正在輸入…', true);
    return;
  }
  var ct = itemText(R.chase), pv = previewOf(R.chase, ct);
  push(th, inHTML(th, ph(ct), R.chase), pv); sndKey(); buzz(); vibrate(80);
  if (th !== G.active){ showBanner(th, pv, true); renderChoice(); }
}
function record(d, text, extra){
  var rec = { d:d, t:text }; if (extra) for (var k in extra) rec[k] = extra[k];
  G.picks[G.r] = rec; G.counts[d]++;
}
async function typeOut(text, tok){
  var box = $('inbox'), send = $('sendBtn'); if (!box) return;
  var per = Math.max(9, Math.min(30, 1300 / text.length)), shown = '';
  send.classList.add('on');
  for (var i = 0; i < text.length; i++){
    shown += text[i];
    if (i % 2 === 0 || i === text.length - 1){ box.innerHTML = esc(shown) + '<span class="caret"></span>'; box.scrollTop = box.scrollHeight; await wait(per * 2); if (!alive(tok)) return; }
  }
  await wait(260);
  box.innerHTML = '<span class="ph">輸入訊息</span>'; send.classList.remove('on'); sndSend();
}
async function pick(k){
  var c = G.choice; if (!c || G.active !== c.R.th) return;
  G.choice = null; stopTimer(); renderChoice();
  var tok = c.tok, R = c.R, o = R.opts[k], th = R.th;
  clearInterval(T.nudge); T.nudge = null; rm(document.querySelector('.banner.sticky'));
  record(o.d, o.t);
  await typeOut(o.t, tok); if (!alive(tok)) return;
  var el = push(th, outHTML(o.t)); G.last[th] = 'me'; G.lastReply = o.t; G.prev[th] = o.t; G.prevT[th] = G.time;
  setTimeout(function(){ var r = el && el.querySelector('.read'); if (r) r.hidden = false; }, 900);
  await wait(1100); if (!alive(tok)) return;
  for (var i = 0; i < o.re.length; i++){ if (!(await playItem(o.re[i], tok, th))) return; }
  await wait(1000); if (!alive(tok)) return;
  nextRound();
}
async function onTimeout(tok){
  var c = G.choice; if (!c || !alive(tok)) return;
  G.choice = null; stopTimer(); renderChoice();
  var R = c.R, th = R.th;
  record('s', '（已讀不回）', { to:true });
  rm(document.querySelector('.banner.sticky'));
  push(G.active, '<div class="sys">'+CFG.reply+' 秒過去了，你沒有回覆'+(th !== G.active ? G.sc.threads[th].name : '')+'</div>');
  await wait(1000); if (!alive(tok)) return;
  for (var i = 0; i < R.timeout.length; i++){ if (!(await playItem(R.timeout[i], tok, th))) return; }
  await wait(1000); if (!alive(tok)) return;
  nextRound();
}
function nextRound(){
  if (!G) return;
  if (G.r + 1 >= G.sc.rounds.length) finish(G.tok);
  else runRound(G.r + 1);
}

/* ---------------- 來電（算一回合） ---------------- */
function runCall(R, tok){
  var c = R.call, sc = $('screen');
  G.call = { R:R, c:c, tok:tok, state:'ring', sec:0, jump:0 };
  rm(sc.querySelector('.banner')); var cl = $('clist'); if (cl) cl.hidden = true;
  sc.insertAdjacentHTML('beforeend', '<div class="callov ringing" id="callov"><div class="cst" id="cst">來電</div>'+
    '<div class="cav">'+avh(c.av)+'</div><div class="cnm">'+esc(c.from)+'</div><div class="csub">行動電話</div>'+
    '<div class="hint">'+ico('speaker')+'有語音也有字幕，沒開聲音也沒關係</div>'+
    '<div class="ringleft" id="ringleft"></div>'+
    '<div class="cap" id="cap"></div><div class="cbox" id="cbox"></div>'+
    '<div class="cbtns one" id="cbtns"><button class="cbtn yes" data-act="callYes"><i>'+ico('phone')+'</i>接聽</button></div></div>');
  sndRing(); vibrate([500, 300, 500, 300, 500]);
  T.ring = setInterval(function(){ if (!G || G.paused) return; sndRing(); vibrate([500, 300, 500]); }, 1500);
  /* 電話一定要接：響越久，提示越明顯 */
  var t = 0, NUDGE = [[4000, '電話一直響個不停……'], [8000, '看來不接是不行了，點「接聽」吧'], [14000, '它還在響。']];
  clearInterval(T.cd);
  T.cd = setInterval(function(){
    if (document.hidden || (G && G.paused)) return;
    t += 100;
    NUDGE.forEach(function(n){ if (t === n[0]){ var rl = $('ringleft'); if (rl){ rl.textContent = n[1]; rl.classList.add('on'); } var ov = $('callov'); if (ov) ov.classList.add('nudge'); } });
  }, 100);
}
function capLine(text, me){
  var cap = $('cap'); if (!cap) return;
  Array.prototype.forEach.call(cap.children, function(p){ p.classList.add('old'); });
  while (cap.children.length > 2) cap.removeChild(cap.firstChild);
  cap.insertAdjacentHTML('beforeend', '<p'+(me ? ' class="me"' : '')+'>'+ph(text)+'</p>');
}
function fmtSec(s){ return ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + s % 60).slice(-2); }
function callTalk(){
  var C = G.call; if (!C) return;
  clearInterval(T.cd); T.cd = null; clearInterval(T.ring); T.ring = null; vibrate(0);
  C.state = 'talk';
  $('callov').classList.remove('ringing');
  rm($('ringleft')); $('cbtns').innerHTML = '';
  $('cst').innerHTML = '通話中 <b>00:00</b>';
  T.clock = setInterval(function(){ C.sec++; var e = $('cst'); if (e && C.state !== 'end') e.innerHTML = '通話中 <b>'+fmtSec(C.sec)+'</b>'; }, 1000);
  T.speech = speakLines(C.c.p1.filter(okWhen).map(function(l){ return typeof l === 'string' ? l : l.text; }), C.c.voice, function(line){ capLine(line); }, function(){ callAsk(); });
}
function callAsk(){
  var C = G.call; if (!C || !alive(C.tok)) return;
  C.state = 'ask'; C.order = shuffle([0, 1, 2]);
  $('cbox').innerHTML = '<div class="tmr" id="ctmr"><span class="lb">插話</span><span class="tb"><i id="ctbi"></i></span><b id="ctnum">'+CFG.reply+'</b></div>'+
    C.order.map(function(k){ return '<button class="copt" data-act="cpick" data-k="'+k+'">'+ph(C.c.opts[k].t)+'</button>'; }).join('');
  startTimer(CFG.reply, { bar:'ctbi', num:'ctnum', wrap:'ctmr' }, null, function(){ callAnswer(-1); });
}
async function callAnswer(k){
  var C = G.call; if (!C || C.state !== 'ask') return;
  C.state = 'reply'; clearInterval(T.cd); T.cd = null;
  var tok = C.tok, p2;
  $('cbox').innerHTML = '';
  if (k < 0){ record('s', '（電話裡沒說話）', { to:true, call:true }); capLine('（你沒有說話）', true); p2 = C.c.to; }
  else {
    var o = C.c.opts[k]; record(o.d, o.t, { call:true });
    capLine('你：' + o.t, true); G.lastReply = o.t; p2 = o.p2;
    if (o.dur) C.jump = o.dur;
  }
  await wait(900); if (!alive(tok)) return;
  T.speech = speakLines(p2, C.c.voice, function(line){
    capLine(line);
    if (C.jump && /^（.+後）/.test(line)){ C.sec = C.jump * 60 + 12; var e = $('cst'); if (e) e.innerHTML = '通話中 <b>'+fmtSec(C.sec)+'</b>'; }
  }, function(){ callEnd(false); });
}
function callEnd(missed){
  var C = G.call; if (!C) return;
  var tok = C.tok, R = C.R; C.state = 'end';
  clearInterval(T.clock); T.clock = null; clearInterval(T.cd); T.cd = null; clearInterval(T.ring); T.ring = null;
  if (T.speech){ T.speech.stop(); T.speech = null; }
  var cst = $('cst'); if (cst) cst.textContent = missed ? (missed === 'rej' ? '已拒接' : '未接來電') : '對方已掛斷';
  var cb = $('cbtns'); if (cb) cb.innerHTML = ''; rm($('ringleft'));
  var ov = $('callov'); if (ov) ov.classList.remove('ringing');
  if (!missed) sndHang();
  setTimeout(function(){
    if (!alive(tok)) return;
    if (ov) ov.classList.add('bye');
    setTimeout(async function(){
      rm(ov); if (!alive(tok)) return;
      G.call = null;
      if (G.active !== R.th) setThread(R.th);
      if (C.jump){ G.offset += C.jump; setClock(R.t); }
      if (missed) push(R.th, '<div class="call-log miss">'+ico('missed')+(missed === 'rej' ? '已拒接・' : '未接來電・')+esc(C.c.from)+'</div>', '📞 未接來電');
      else push(R.th, '<div class="call-log">'+ico('phone')+'語音通話・'+fmtSec(C.sec)+'</div>', '📞 語音通話');
      G.last[R.th] = null;
      await wait(700); if (!alive(tok)) return;
      if (missed){
        var missItems = C.c.miss.filter(okWhen);
        for (var i = 0; i < missItems.length; i++){
          var it = missItems[i];
          if (typeof it === 'object'){ if (!(await playItem(it, tok, R.th))) return; continue; }
          var a = typingOn(R.th); await wait(560); rm(a); if (!alive(tok)) return;
          push(R.th, inHTML(R.th, ph(it)), it); sndKey(); buzz(); vibrate(90);
          await wait(620); if (!alive(tok)) return;
        }
        await wait(800); if (!alive(tok)) return;
      }
      nextRound();
    }, 450);
  }, missed ? 700 : 1000);
}
function callMiss(rejected){
  var C = G.call; if (!C || C.state !== 'ring') return;
  clearInterval(T.cd); T.cd = null; clearInterval(T.ring); T.ring = null; vibrate(0);
  record('s', rejected ? '（拒接電話）' : '（沒接電話）', { to:!rejected, call:true });
  callEnd(rejected ? 'rej' : 'miss');
}

/* ---------------- 結局 ---------------- */
function endKey(c){
  if (c.o === 2 && c.s === 2 && c.p === 2) return 'h';
  var arr = [['o', c.o], ['s', c.s], ['p', c.p]].sort(function(a, b){ return b[1] - a[1]; });
  if (arr[0][1] - arr[1][1] <= 1) return [arr[0][0], arr[1][0]].sort(function(a, b){ return 'osp'.indexOf(a) - 'osp'.indexOf(b); }).join('');
  return arr[0][0];
}
async function finish(tok){
  if (!alive(tok)) return;
  var S0 = G.sc, key = endKey(G.counts), E = S0.endings[key];
  G.ending = key; G.done = true; updateHud();
  LAST[G.id] = { picks:G.picks.slice(), counts:{ o:G.counts.o, s:G.counts.s, p:G.counts.p }, ending:key };
  stopTimer(); renderChoice();
  await wait(900); if (!alive(tok)) return;
  if (E.items && E.items.length){
    var eth = (typeof E.items[0] === 'object' && E.items[0].th) || 'main';
    if (G.active !== eth) setThread(eth);
    for (var i = 0; i < E.items.length; i++){ var it = E.items[i]; if (!(await playItem(it, tok, (typeof it === 'object' && it.th) || 'main'))) return; }
  }
  await wait(1600); if (!alive(tok)) return;
  showEnd();
}
function showEnd(){
  var S0 = G.sc, E = S0.endings[G.ending], c = G.counts;
  var rows = ['o','s','p'].map(function(d){ return '<div class="trow '+d+'"><span>'+DIR[d]+'</span><span class="bar"><i style="width:'+(c[d] / 6 * 100)+'%"></i></span><em>'+c[d]+'</em></div>'; }).join('');
  document.body.insertAdjacentHTML('beforeend', '<div class="endov" id="endov" role="dialog" aria-label="結局"><div class="endcard">'+
    (E.hidden ? '<span class="ek hid">隱藏結局・三向平衡</span>' : '<span class="ek">'+S0.role+'・'+S0.title+'</span>')+
    '<h2>'+esc(E.n)+'</h2><p class="epi">'+pp(E.t)+'</p>'+
    '<div class="tend"><h4>你這 6 回合的選擇</h4>'+rows+'</div>'+
    '<div class="end-acts"><button class="btn btn-pri" data-act="tplEnd">看八面玲瓏範本'+ico('arrow')+'</button>'+
      '<div class="row2"><button class="btn btn-sec" data-act="card">產生結局圖卡</button><button class="btn btn-sec" data-act="again">再玩一次</button></div>'+
      '<button class="btn-text" data-act="leave">換一個人</button></div></div></div>');
}

/* ---------------- 結局圖卡 ---------------- */
function wrapText(ctx, text, maxW){
  var lines = [], line = '';
  for (var i = 0; i < text.length; i++){
    var test = line + text[i];
    if (ctx.measureText(test).width > maxW && line && '，。、！？」』）…：；'.indexOf(text[i]) < 0){ lines.push(line); line = text[i]; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}
function rrect(ctx, x, y, w, h, r){ ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function loadImg(svg){
  return new Promise(function(res){
    if (!svg) return res(null);
    var im = new Image(); im.onload = function(){ res(im); }; im.onerror = function(){ res(null); };
    im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    setTimeout(function(){ res(null); }, 1500);
  });
}
async function makeCard(){
  var S0 = G.sc, E = S0.endings[G.ending], c = G.counts;
  try {
    await Promise.race([Promise.all([
      document.fonts.load('700 80px "LXGW WenKai TC"'), document.fonts.load('400 40px "Noto Sans TC"'),
      document.fonts.load('700 40px "Noto Sans TC"'), document.fonts.load('500 30px "DM Mono"')]), wait(2500)]);
  } catch(e){}
  var W = 1080, H = 1920, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  var x = cv.getContext('2d');
  var disp = '"LXGW WenKai TC","Kaiti TC",serif', sans = '"Noto Sans TC","PingFang TC",sans-serif', mono = '"DM Mono",monospace';
  x.fillStyle = '#f7eee2'; x.fillRect(0, 0, W, H);
  var g = x.createRadialGradient(200, 60, 40, 200, 60, 900); g.addColorStop(0, 'rgba(255,184,104,.75)'); g.addColorStop(1, 'rgba(255,184,104,0)');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.textBaseline = 'alphabetic';
  x.fillStyle = '#c96d18'; x.font = '500 30px ' + mono; x.fillText('引路人・教師職場情境遊戲', 90, 150);
  x.fillStyle = '#4a3326'; x.font = '700 100px ' + disp; x.fillText('老師，在嗎？', 84, 268);
  x.fillStyle = '#7a5d49'; x.font = '400 38px ' + sans; x.fillText(S0.role + '｜' + S0.title, 90, 336);
  /* 對話片段（高度依內容） */
  var py = 396;
  x.font = '400 38px ' + sans;
  var q = wrapText(x, S0.cardQuote, 620), qh = q.length * 56 + 44, qy = py + 104;
  var reply = (G.lastReply || '（已讀不回）');
  if (reply.length > 54) reply = reply.slice(0, 52) + '……';
  var r = wrapText(x, reply, 600).slice(0, 3), rh = r.length * 56 + 44, ry = qy + qh + 36;
  var pb = ry + rh + 48;
  rrect(x, 70, py, 940, pb - py, 48); x.fillStyle = '#f0e1cd'; x.fill();
  x.fillStyle = '#a88d77'; x.font = '500 28px ' + mono; x.fillText(S0.rounds[0].t + '　' + S0.name, 120, py + 66);
  var avImg = await loadImg(avSvgString(S0.av));
  if (avImg){ try { x.save(); x.beginPath(); x.arc(144, qy + 38, 38, 0, Math.PI * 2); x.clip(); x.drawImage(avImg, 106, qy, 76, 76); x.restore(); } catch(e){} }
  else { x.font = '60px ' + sans; x.fillText(S0.av, 108, qy + 62); }
  rrect(x, 196, qy, 690, qh, 36); x.fillStyle = '#fffaf3'; x.fill();
  x.fillStyle = '#4a3326'; x.font = '400 38px ' + sans; q.forEach(function(l, i){ x.fillText(l, 228, qy + 64 + i * 56); });
  var rw = Math.min(680, Math.max.apply(null, r.map(function(l){ return x.measureText(l).width; })) + 64);
  rrect(x, 970 - rw, ry, rw, rh, 36); x.fillStyle = '#ffdcb0'; x.fill();
  x.fillStyle = '#4a3326'; r.forEach(function(l, i){ x.fillText(l, 970 - rw + 32, ry + 64 + i * 56); });
  /* 結局 */
  var ey = pb + 110;
  x.fillStyle = '#c96d18'; x.font = '700 32px ' + sans; x.fillText(E.hidden ? '隱藏結局・三向平衡' : '我的結局', 90, ey);
  x.fillStyle = '#4a3326'; x.font = '700 90px ' + disp;
  var nl = wrapText(x, E.n, 900); nl.forEach(function(l, i){ x.fillText(l, 86, ey + 104 + i * 104); });
  var ty = ey + 104 + (nl.length - 1) * 104 + 78;
  x.fillStyle = '#7a5d49'; x.font = '400 36px ' + sans;
  var el = wrapText(x, E.t, 900), maxL = Math.max(3, Math.floor((1560 - ty) / 58));
  if (el.length > maxL){ el = el.slice(0, maxL); el[maxL - 1] = el[maxL - 1].slice(0, -1) + '…'; }
  el.forEach(function(l, i){ x.fillText(l, 90, ty + i * 58); });
  /* 傾向 */
  var by = ty + el.length * 58 + 34, cols = { o:'#c8604f', s:'#5f8a55', p:'#4f72a0' };
  ['o','s','p'].forEach(function(d, i){
    var bx = 90 + i * 306;
    rrect(x, bx, by, 282, 74, 37); x.fillStyle = '#fffaf3'; x.fill();
    x.fillStyle = cols[d]; x.beginPath(); x.arc(bx + 40, by + 37, 10, 0, Math.PI * 2); x.fill();
    x.font = '700 32px ' + sans; x.fillText(DIR[d], bx + 62, by + 49);
    x.fillStyle = '#4a3326'; x.font = '500 36px ' + mono; x.textAlign = 'right'; x.fillText(String(c[d]), bx + 252, by + 50); x.textAlign = 'left';
  });
  /* 頁尾 */
  x.strokeStyle = '#e2cdb3'; x.lineWidth = 2; x.beginPath(); x.moveTo(90, 1730); x.lineTo(990, 1730); x.stroke();
  x.fillStyle = '#4a3326'; x.font = '700 40px ' + sans; x.fillText('你會怎麼回？', 90, 1806);
  x.fillStyle = '#c96d18'; x.font = '500 34px ' + mono; x.textAlign = 'right'; x.fillText(IG_HANDLE, 990, 1806); x.textAlign = 'left';
  x.fillStyle = '#a88d77'; x.font = '400 28px ' + sans; x.fillText('引路人', 90, 1856);
  return cv.toDataURL('image/png');
}
async function showCard(){
  toast('圖卡產生中…');
  var url = await makeCard();
  $('toast').classList.remove('on');
  document.body.insertAdjacentHTML('beforeend', '<div class="cardov" id="cardov"><img src="'+url+'" alt="結局圖卡"><p>長按（或按右鍵）圖片就能儲存，分享到 IG 限動。</p>'+
    '<div class="row2"><button class="btn btn-sec" data-act="closeCard">關閉</button><a class="btn btn-pri" href="'+url+'" download="老師在嗎-結局.png">下載圖片</a></div></div>');
}

/* ---------------- 離開 ---------------- */
function leaveGame(){
  if (G) G.tok++;
  stopAll();
  try { if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function(){}); } catch(e){}
  document.body.classList.remove('playing');
  rm($('endov')); rm($('modal')); rm($('cardov'));
  $('stage').innerHTML = '';
  G = null;
}
function confirmExit(){
  if (!G) return;
  G.paused = true;
  document.body.insertAdjacentHTML('beforeend', '<div class="modal" id="modal" role="dialog" aria-label="要離開這段對話嗎"><div class="box"><h3>要離開這段對話嗎？</h3>'+
    '<p>離開後，這次的回合不會保留。對方……應該還會繼續傳。</p>'+
    '<div class="row2"><button class="btn btn-sec" data-act="exitYes">離開</button><button class="btn btn-pri" data-act="exitNo">繼續回訊息</button></div></div></div>');
}
function openList(){
  if (!G) return;
  var cl = $('clist'); if (!cl) return;
  if (!cl.hidden){ cl.hidden = true; return; }
  var S0 = G.sc;
  var rows = Object.keys(S0.threads).filter(function(k){ return G.prev[k] || k === G.active; }).map(function(k){
    var info = S0.threads[k], n = k === G.active ? 0 : (G.unread[k] || 0);
    return '<button class="crow" data-act="openTh" data-th="'+k+'"><span class="av">'+avh(info.av)+'</span><span class="tx"><b>'+esc(info.name)+'</b><span>'+esc(G.prev[k] || '')+'</span></span><span class="rt">'+(G.prevT[k] || '')+(n ? '<i>'+n+'</i>' : '')+'</span></button>';
  }).join('');
  cl.innerHTML = '<div class="ch"><b>聊天</b><button class="hbtn icon x" data-act="back" aria-label="關閉" style="background:var(--cream2);color:var(--ink);border-color:var(--line)">'+ico('x')+'</button></div>'+rows;
  cl.hidden = false;
}

/* ================================================================
   事件
   ================================================================ */
document.addEventListener('click', function(ev){
  var b = ev.target.closest('[data-act]'); if (!b) return;
  var act = b.getAttribute('data-act'), k = +b.getAttribute('data-k');
  if (b.classList.contains('btn')){ b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
  switch (act){
    case 'top': window.scrollTo({ top:0, behavior:'smooth' }); break;
    case 'home': showHome(); break;
    case 'pickView': showPick(); break;
    case 'tpage': tplGo(+b.getAttribute('data-p')); break;
    case 'closeModal': rm($('modal')); break;
    case 'play': if (!SCEN[b.getAttribute('data-id')].wip) startGame(b.getAttribute('data-id')); break;
    case 'tpl': showTpl(b.getAttribute('data-id'), 0); break;
    case 'bgGo': if (!G || $('phone')) return; buildPhone(); runRound(0); break;
    case 'pick': pick(k); break;
    case 'openTh': if (G && G.sc.threads[b.getAttribute('data-th')]){ setThread(b.getAttribute('data-th')); } break;
    case 'back': openList(); break;
    case 'callYes': if (G && G.call && G.call.state === 'ring'){ audioUnlock(); callTalk(); } break;
    
    case 'cpick': callAnswer(k); break;
    case 'voice':
      var text = G && G.voices[k]; if (!text) return;
      var vc = $('vc' + k), vt = $('vt' + k); rm($('vh' + k));
      if (vc) vc.classList.add('playing'); if (vt){ vt.hidden = false; vt.textContent = ''; }
      if (T.speech) T.speech.stop();
      audioUnlock();
      T.speech = speakLines(splitSentences(text), { rate:1.35, pitch:1.05 }, function(line){ if (vt) vt.textContent += line; var f = $('f-' + G.active); if (f) f.scrollTop = f.scrollHeight; }, function(){ if (vc) vc.classList.remove('playing'); });
      break;
    case 'snd':
      AUDIO.on = !AUDIO.on; if (AUDIO.on) audioUnlock(); else { try { speechSynthesis.cancel(); } catch(e){} }
      b.innerHTML = ico(AUDIO.on ? 'speaker' : 'mute'); toast(AUDIO.on ? '聲音已開啟' : '已改成只看字幕'); break;
    case 'exit': confirmExit(); break;
    case 'exitNo': rm($('modal')); if (G) G.paused = false; break;
    case 'exitYes': leaveGame(); showPick(); break;
    case 'card': if (G && G.ending) showCard(); break;
    case 'closeCard': rm($('cardov')); break;
    case 'again': if (G) startGame(G.id); break;
    case 'tplEnd': if (G){ var id = G.id; leaveGame(); showTpl(id, 0); } break;
    case 'leave': leaveGame(); showPick(); break;
  }
});
document.addEventListener('keydown', function(ev){
  if (VIEW.name === 'tpl' && !G && !$('modal')){
    if (ev.key === 'ArrowRight'){ tplGo(VIEW.page + 1); return; }
    if (ev.key === 'ArrowLeft'){ tplGo(VIEW.page - 1); return; }
  }
  if (ev.key === 'Escape'){
    if ($('modal')){ var no = document.querySelector('[data-act="exitNo"],[data-act="closeModal"]'); if (no) no.click(); }
    else if ($('cardov')) rm($('cardov'));
  }
});
try { if (window.speechSynthesis){ speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = function(){ speechSynthesis.getVoices(); }; } } catch(e){}
/* 範本頁：左右滑動換頁 */
(function(){
  var sx = 0, sy = 0, on = false;
  document.addEventListener('touchstart', function(e){ if (VIEW.name !== 'tpl' || G || e.touches.length !== 1) return; on = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive:true });
  document.addEventListener('touchend', function(e){
    if (!on) return; on = false;
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 50) tplGo(VIEW.page + (dx < 0 ? 1 : -1));
  }, { passive:true });
})();
showHome();
