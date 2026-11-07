// 劇情聚光燈自動接入：scenes/Lx.js 匯出 PAIRS 時，建置時把每一組「錯誤劇本＋正確劇本」放進教材
//   網頁：錯誤劇本放在策略段落的開頭，正確劇本放在段落最後
//   教學流程：在指定階段之前插入「錯誤劇本」，在指定階段之後插入「正確劇本」，時間從指定階段挪出來
//   簡報：在對應的位置插入劇本頁和「換位思考」頁，頁碼標記（st）自動重排
//   學習單：找錯表由 templates/inclass.js 放進該節（用 ng.ws）；教師手冊 Part 3 自動列出劇本
//
// PAIRS 每一項：
//   id, part（第幾節，0 起算）, before（錯誤劇本插在這個階段之前，用原本的階段順序）, after（正確劇本插在這個階段之後）
//   min: [錯誤劇本分鐘, 正確劇本分鐘], take: { 原本階段順序: 挪出的分鐘 }（每節加起來仍是 50 分）
//   pt: [錯誤劇本放的段落, 正確劇本放的段落]（lessons 的 points 順序）
//   ng, ok：場景；replay：錯誤劇本「倒帶」從第幾步開始
//   label：劇本名稱（例：午休聊天）；titleNG、titleOK：網頁標題；skill：這一組在教的策略（例：開放式問句）
//   unit：綠色標籤指的是「規則」還是「步驟」；who：主角；ask：換位思考三問（可省略）
const fs = require('fs');
const path = require('path');

const PART = ['第一節', '第二節', '第三節'];
const UNIT = { 規則: ['條規則', '規則或地雷'], 步驟: ['個步驟', '第幾個步驟'], 技巧: ['個技巧', '該用哪個技巧'] };
const defaultAsk = p => [`${p.other}覺得怎麼樣？`, `${p.pron || '他'}覺得${p.who}是個怎樣的人？`, `${p.pron || '他'}還想${p.again || `跟${p.who}聊天`}嗎？`];

function applyDramas(L, slides, id) {
  if (!L || L._drama) return;
  id = id || L.no;
  const f = path.join(__dirname, '..', 'scenes', `${id}.js`);
  if (!fs.existsSync(f)) return;
  const { PAIRS } = require(f);
  if (!PAIRS) return;
  L._drama = true;
  L.dramas = [];

  PAIRS.forEach(p => {
    const ask = p.ask || defaultAsk(p);
    const askLine = `看完問學生三個問題：${ask.join('')}`;
    const ng = { id: p.id + 'NG', kind: 'ng', scene: p.ng, part: p.part, stage: '錯誤劇本', pic: p.picNG || 3, replay: p.replay,
      title: p.titleNG, ws: { label: p.label, who: p.who, unit: UNIT[p.unit][1], rows: p.rows }, how: '先完整播一次，學生在學習單寫下怪怪的地方；再播「倒帶」，逐一定格對答案。' };
    const ok = { id: p.id + 'OK', kind: 'ok', scene: p.ok, part: p.part, stage: '正確劇本', pic: p.picOK || 3,
      title: p.titleOK, how: `教完${p.skill}之後播。每出現一個綠色標籤，請學生說出是哪一${UNIT[p.unit][0]}。` };
    L.dramas.push(ng, ok);

    // 網頁：錯誤劇本放段落開頭，正確劇本放段落最後
    L.points[p.pt[0]].body.unshift({ sub: `先看錯誤劇本，再教${p.skill}` }, { drama: ng }, { note: askLine }, { sub: p.skill });
    L.points[p.pt[1]].body.push({ sub: `教完${p.skill}，再看正確劇本` }, { drama: ok }, { note: '再問一次同樣三個問題，和錯誤劇本比一比。' });

    // 教學流程：挪時間、插入兩個階段
    const stages = L.plan[p.part].stages;
    Object.entries(p.take).forEach(([i, n]) => { stages[i].min -= n; });
    const b = p.before, a = p.after + 1;
    stages.splice(b, 0, { min: p.min[0], name: '錯誤劇本', small: `${p.label}：哪裡怪怪的？`, hot: false,
      body: `播放錯誤劇本「${p.label}」，學生在學習單${PART[p.part]}的找錯表寫下怪怪的地方；再播「倒帶」，逐一定格對答案。最後問換位思考三問：${ask.join('')}`,
      prep: '上課簡報（劇情聚光燈）、學習單', eval: '學習單找錯表、口頭發表' });
    stages.splice(a + 1, 0, { min: p.min[1], name: '正確劇本', small: p.titleOK.split('：').pop(),
      body: `教完${p.skill}之後，播放正確劇本：${p.okDesc}。每出現一個綠色標籤，請學生說出是哪一${UNIT[p.unit][0]}。再問一次換位思考三問，和錯誤劇本比一比。`,
      prep: '上課簡報（劇情聚光燈）', eval: '口頭發表' });
    const total = stages.reduce((x, s) => x + s.min, 0);
    if (total !== 50) console.warn(`${id} ${L.plan[p.part].title} 總時間 ${total} 分，不是 50 分`);

    // 簡報
    if (!slides) return;
    const askSlide = (t) => ({ t: 'idea', kicker: '換位思考', title: t, points: ask.map(q => [q, '']), foot: '一兩句話就好，說說你的想法。' });
    const range = () => {
      const s0 = slides.findIndex(s => s.t === 'section' && s.plan === p.part);
      let s1 = slides.findIndex((s, i) => i > s0 && s.t === 'section');
      if (s1 < 0) s1 = slides.findIndex((s, i) => i > s0 && (s.t === 'end'));
      if (s1 < 0) s1 = slides.length;
      return [s0, s1];
    };
    const bump = (from) => { const [s0, s1] = range(); for (let i = s0 + 1; i < s1; i++) if (slides[i].st != null && slides[i].st >= from) slides[i].st += 1; };
    const startOf = (st) => { const [s0, s1] = range(); for (let i = s0 + 1; i < s1; i++) if (slides[i].st === st) return i; throw new Error(`${id} 簡報找不到第 ${p.part + 1} 節第 ${st} 階段的開頭`); };
    // 錯誤劇本：插在原本 before 階段的開頭
    bump(b);
    const iNG = startOf(b + 1);
    const ngSlides = [
      { t: 'scene', kicker: '錯誤劇本', title: `${p.label}：哪裡怪怪的？`, drama: ng.id, range: [0, p.replay - 1] },
      { t: 'scene', kicker: '錯誤劇本・倒帶', title: '剛剛哪裡出問題？', drama: ng.id, range: [p.replay, p.ng.beats.length - 1] },
      askSlide(p.ask ? '想一想' : `如果你是${p.other}……`),
    ];
    ngSlides[0].st = b;
    slides.splice(iNG, 0, ...ngSlides);
    // 正確劇本：插在原本 after 階段之後（現在是 a），也就是下一個階段的開頭之前
    bump(a + 1);
    const iOK = startOf(a + 2);
    slides.splice(iOK, 0, { t: 'scene', st: a + 1, kicker: '正確劇本', title: p.titleOK.split('：').pop(), drama: ok.id }, askSlide(p.ask ? '這一次呢？' : `這一次，${p.other}呢？`));
  });

  // 教師手冊與教學提醒
  L.guide.prep.teacher.unshift('上課簡報（含錯誤劇本、正確劇本）');
  L.guide.notes.push({ q: '用劇場取代真人示範', ps: [
    '這一課的示範不用找人上台演。上課簡報裡的劇情聚光燈先播錯誤劇本，學生找錯，倒帶時一個一個定格對答案；教完策略再播正確劇本，同一個場景、同樣的人，差別一眼就看得出來。',
    '每段劇本看完，問三個換位思考的問題。不用深談情緒，一兩句就好，重點是讓學生從對方的角度看一次。',
  ] });
  L.notes.push(['劇本先別急著講答案', '錯誤劇本第一次播完，先讓學生寫、讓他們說，再播倒帶。學生自己找到的錯誤，比老師講的記得牢。']);
}

module.exports = { applyDramas };
