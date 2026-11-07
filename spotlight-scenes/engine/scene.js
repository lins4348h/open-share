// 場景播放元件（劇情聚光燈）：扁平插畫角色＋聚光燈＋對話泡泡＋字幕。改寫自職場 SEL 課程的同名元件。
// 社會技巧課用來取代老師真人示範：錯誤劇本（ng 標籤，學生找錯）與正確劇本（ok 標籤，對照策略步驟）。
// 簡報裡由翻頁的「一步步出現」帶動；網頁上有自己的「上一步／下一步」按鈕。
// 場景資料（角色、台詞、每一步的聚光燈）寫在 scenes/*.js。
const W = 1600, H = 720;

// ---------- 角色 ----------
const INK = '#2b231c';
const FACES = {
  neutral: `<circle cx="-17" cy="-372" r="5"/><circle cx="17" cy="-372" r="5"/><path class="ln" d="M-27 -389 L-9 -390 M27 -389 L9 -390"/><path class="ln" d="M-11 -346 Q0 -340 11 -346"/>`,
  happy: `<path class="ln" d="M-24 -369 Q-17 -379 -10 -369 M24 -369 Q17 -379 10 -369"/><path class="ln" d="M-27 -392 Q-18 -397 -9 -393 M27 -392 Q18 -397 9 -393"/><path d="M-15 -350 Q0 -330 15 -350 Z" fill="#8c3b2e"/>`,
  excited: `<path class="ln" d="M-24 -369 Q-17 -379 -10 -369 M24 -369 Q17 -379 10 -369"/><path class="ln" d="M-27 -394 Q-18 -400 -9 -395 M27 -394 Q18 -400 9 -395"/><path d="M-17 -352 Q0 -326 17 -352 Z" fill="#8c3b2e"/><circle cx="-30" cy="-352" r="7" fill="#f2a08a" opacity=".6"/><circle cx="30" cy="-352" r="7" fill="#f2a08a" opacity=".6"/>`,
  angry: `<circle cx="-17" cy="-371" r="5"/><circle cx="17" cy="-371" r="5"/><path class="ln th" d="M-29 -394 L-8 -383 M29 -394 L8 -383"/><ellipse cx="0" cy="-343" rx="13" ry="9" fill="#6b2a20"/><path d="M-9 -347 L9 -347" stroke="#fff" stroke-width="3"/><path d="M33 -412 l8 -8 M39 -406 l8 -8 M33 -406 l14 0" stroke="#c4523b" stroke-width="4" stroke-linecap="round"/>`,
  worried: `<circle cx="-17" cy="-371" r="5"/><circle cx="17" cy="-371" r="5"/><path class="ln" d="M-27 -385 L-9 -393 M27 -385 L9 -393"/><path class="ln" d="M-12 -344 q4 -5 8 0 q4 5 8 0"/><path d="M44 -392 q-7 12 0 16 q7 -4 0 -16z" fill="#8fc3e6"/>`,
  tense: `<circle cx="-17" cy="-371" r="5"/><circle cx="17" cy="-371" r="5"/><path class="ln" d="M-27 -386 L-9 -393 M27 -386 L9 -393"/><rect x="-14" y="-352" width="28" height="11" rx="4" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M-14 -346.5 H14 M-5 -352 V-341 M5 -352 V-341" stroke="${INK}" stroke-width="2"/><path d="M-44 -392 q-7 12 0 16 q7 -4 0 -16z" fill="#8fc3e6"/>`,
  tired: `<path class="ln" d="M-24 -370 L-10 -370 M24 -370 L10 -370"/><path d="M-25 -364 Q-17 -358 -9 -364 M25 -364 Q17 -358 9 -364" stroke="#9b88b5" stroke-width="3" fill="none" stroke-linecap="round"/><path class="ln" d="M-27 -384 L-9 -388 M27 -384 L9 -388"/><path class="ln" d="M-9 -344 L9 -344"/>`,
  annoyed: `<path class="ln" d="M-24 -371 L-10 -371 M24 -371 L10 -371"/><circle cx="-14" cy="-368" r="3.5"/><circle cx="20" cy="-368" r="3.5"/><path class="ln th" d="M-28 -390 L-9 -386 M28 -390 L9 -386"/><path class="ln" d="M-10 -343 Q0 -349 10 -343"/>`,
  calm: `<path class="ln" d="M-25 -370 Q-17 -363 -9 -370 M25 -370 Q17 -363 9 -370"/><path class="ln" d="M-26 -389 L-9 -391 M26 -389 L9 -391"/><path class="ln" d="M-9 -346 Q0 -340 9 -346"/>`,
  surprised: `<circle cx="-17" cy="-372" r="6"/><circle cx="17" cy="-372" r="6"/><path class="ln" d="M-27 -395 Q-18 -401 -9 -396 M27 -395 Q18 -401 9 -396"/><ellipse cx="0" cy="-345" rx="7" ry="9" fill="#6b2a20"/>`,
  crying: `<path class="ln" d="M-14 -370 Q-9 -376 -4 -370 M14 -370 Q9 -376 4 -370"/><ellipse cx="0" cy="-354" rx="7" ry="6" fill="#6b2a20"/><path d="M-12 -366 q-3 9 0 12 q3 -3 0 -12z M12 -366 q-3 9 0 12 q3 -3 0 -12z" fill="#8fc3e6"/>`,
};

const HAIR = {
  short: c => `<path d="M-53 -366 Q-58 -432 0 -430 Q58 -432 53 -366 Q46 -402 0 -404 Q-46 -402 -53 -366Z" fill="${c}"/>`,
  side: c => `<path d="M-54 -362 Q-60 -434 6 -430 Q60 -428 54 -366 Q40 -412 -6 -398 Q-30 -392 -54 -362Z" fill="${c}"/>`,
  bob: c => `<path d="M-58 -330 Q-66 -436 0 -432 Q66 -436 58 -330 L44 -330 Q48 -396 8 -404 Q-30 -392 -44 -330Z" fill="${c}"/>`,
  pony: c => `<path d="M-54 -364 Q-58 -432 0 -430 Q58 -432 54 -364 Q44 -404 0 -404 Q-44 -404 -54 -364Z" fill="${c}"/><path d="M44 -410 Q92 -400 78 -330 Q70 -366 46 -380Z" fill="${c}"/>`,
  bun: c => `<circle cx="0" cy="-432" r="22" fill="${c}"/><path d="M-54 -360 Q-58 -432 0 -430 Q58 -432 54 -360 Q46 -404 0 -404 Q-46 -404 -54 -360Z" fill="${c}"/>`,
  cap: c => `<path d="M-53 -366 Q-58 -420 0 -418 Q58 -420 53 -366 Q46 -398 0 -400 Q-46 -398 -53 -366Z" fill="#3b2a1e"/><path d="M-54 -392 Q-52 -440 0 -440 Q52 -440 54 -392Z" fill="${c}"/><path d="M-4 -396 Q40 -400 82 -388 Q60 -380 -4 -384Z" fill="${c}"/>`,
};

// 角色外觀：o = { skin, hair, hairColor, top, bottom, apron, prop, glasses, scale }
function person(o, face) {
  const skin = o.skin || '#f2c9a5', top = o.top || '#7a8aa0', bottom = o.bottom || '#3b3f4a';
  const arms = ['baby', 'papers', 'bowl'].includes(o.prop) ? (o.prop === 'baby' ? `<rect x="-70" y="-262" width="140" height="30" rx="15" fill="${top}"/>` : '')
    : o.prop === 'baby'
    ? `<rect x="-70" y="-262" width="140" height="30" rx="15" fill="${top}"/>`
    : o.prop === 'phoneEar'
      ? `<rect x="-84" y="-296" width="24" height="132" rx="12" fill="${top}"/><circle cx="-72" cy="-162" r="13" fill="${skin}"/><rect x="52" y="-300" width="24" height="76" rx="12" fill="${top}" transform="rotate(-158 64 -292)"/>`
    : o.prop === 'phoneUp'
      ? `<rect x="-84" y="-296" width="24" height="132" rx="12" fill="${top}"/><rect x="50" y="-300" width="26" height="92" rx="13" fill="${top}" transform="rotate(-28 63 -300)"/><circle cx="-72" cy="-162" r="13" fill="${skin}"/>`
      : `<rect x="-84" y="-296" width="24" height="132" rx="12" fill="${top}"/><rect x="60" y="-296" width="24" height="132" rx="12" fill="${top}"/><circle cx="-72" cy="-162" r="13" fill="${skin}"/><circle cx="72" cy="-162" r="13" fill="${skin}"/>`;
  const props = {
    laptop: `<rect x="-128" y="-262" width="66" height="88" rx="6" fill="#9aa3ad" transform="rotate(-8 -95 -218)"/><rect x="-122" y="-256" width="54" height="76" rx="4" fill="#c5ccd3" transform="rotate(-8 -95 -218)"/>`,
    bag: `<path d="M64 -196 Q74 -232 86 -196" stroke="#cdbfa8" stroke-width="5" fill="none"/><rect x="50" y="-200" width="66" height="78" rx="8" fill="#efe7d9" stroke="#cdbfa8" stroke-width="3"/><path d="M83 -176 v26 M70 -163 h26" stroke="#d1574a" stroke-width="7" stroke-linecap="round"/>`,
    baby: `<ellipse cx="0" cy="-262" rx="58" ry="40" fill="#f6d77a"/><circle cx="-14" cy="-300" r="26" fill="${skin}"/><path d="M-36 -312 Q-14 -336 8 -314" fill="#5a3b28"/><g class="baby-face"><path d="M-22 -302 q4 -4 8 0 M-8 -302 q4 -4 8 0" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="-11" cy="-290" rx="5" ry="4" fill="#6b2a20"/><path d="M-26 -298 q-2 7 0 9 q2 -2 0 -9z M4 -298 q-2 7 0 9 q2 -2 0 -9z" fill="#8fc3e6"/></g>`,
    phoneUp: `<rect x="86" y="-392" width="36" height="62" rx="6" fill="#2b2f36"/><rect x="90" y="-386" width="28" height="48" rx="3" fill="#7fb3d8"/><circle cx="112" cy="-380" r="5" fill="#e0453a" class="rec"/><circle cx="96" cy="-332" r="13" fill="${skin}"/>`,
    phoneEar: `<rect x="48" y="-404" width="22" height="52" rx="6" fill="#2b2f36"/><circle cx="66" cy="-366" r="13" fill="${skin}"/>`,
    phone: `<rect x="62" y="-196" width="26" height="44" rx="5" fill="#2b2f36"/><rect x="65" y="-192" width="20" height="34" rx="3" fill="#9ec7e6"/>`,
    papers: `<rect x="-70" y="-262" width="140" height="30" rx="15" fill="${top}"/><g transform="rotate(-6 0 -250)"><rect x="-58" y="-292" width="116" height="78" rx="4" fill="#fffdf7" stroke="#c9bfae" stroke-width="3"/><rect x="-52" y="-300" width="116" height="78" rx="4" fill="#fffdf7" stroke="#c9bfae" stroke-width="3"/><path d="M-40 -282 h80 M-40 -268 h64 M-40 -254 h72 M-40 -240 h50" stroke="#b9ae9c" stroke-width="4" stroke-linecap="round"/></g>`,
    charmbag: `<path d="M-50 -296 L-30 -170 M50 -296 L30 -170" stroke="#3d4f7a" stroke-width="9"/><rect x="-78" y="-252" width="34" height="76" rx="7" fill="#4a5f8f"/><path d="M-61 -176 v26" stroke="#8c7a6a" stroke-width="3"/><rect x="-76" y="-152" width="30" height="20" rx="9" fill="#f2b84b" stroke="#c98a1f" stroke-width="3"/><circle cx="-68" cy="-142" r="3" fill="#2b231c"/><path d="M-56 -145 h6 M-53 -148 v6" stroke="#2b231c" stroke-width="2.5" stroke-linecap="round"/>`,
    bookbag: `<path d="M-50 -296 L-30 -170 M50 -296 L30 -170" stroke="#6b4a2e" stroke-width="9"/><rect x="-74" y="-250" width="30" height="70" rx="6" fill="#8c5a32"/>`,
    ladle: `<path d="M74 -166 L104 -300" stroke="#8c6b4a" stroke-width="8" stroke-linecap="round"/><ellipse cx="74" cy="-160" rx="16" ry="10" fill="#8c6b4a"/>`,
    bowl: `<rect x="-70" y="-252" width="140" height="28" rx="14" fill="${top}"/><path d="M-36 -262 h72 q-4 34 -36 34 q-32 0 -36 -34z" fill="#f4efe6" stroke="#c9b7a0" stroke-width="3"/>`,
    cup: `<path d="M58 -206 h34 l-5 54 h-24z" fill="#fff" stroke="#d9cbb5" stroke-width="3"/><rect x="58" y="-212" width="34" height="8" rx="3" fill="#cfa36c"/><rect x="73" y="-236" width="4" height="26" fill="#e05a4a"/>`,
  };
  const apron = o.apron ? `<path d="M-48 -262 h96 v150 q0 12 -12 12 h-72 q-12 0 -12 -12z" fill="${o.apron}"/><path d="M-30 -262 Q0 -300 30 -262" stroke="${o.apron}" stroke-width="7" fill="none"/><rect x="18" y="-236" width="26" height="12" rx="3" fill="#fff" opacity=".9"/>` : '';
  const vest = o.vest ? `<path d="M-58 -296 L-22 -296 L0 -250 L22 -296 L58 -296 Q64 -220 58 -150 L-58 -150 Q-64 -220 -58 -296Z" fill="${o.vest}"/>` : '';
  const badge = o.badge ? `<path d="M-16 -300 L0 -236 L16 -300" stroke="${o.badge}" stroke-width="5" fill="none"/><rect x="-14" y="-238" width="28" height="36" rx="4" fill="#fff" stroke="${o.badge}" stroke-width="3"/><rect x="-8" y="-230" width="16" height="12" fill="${o.badge}" opacity=".5"/>` : '';
  const glasses = o.glasses ? `<g fill="none" stroke="${INK}" stroke-width="3"><circle cx="-17" cy="-371" r="13"/><circle cx="17" cy="-371" r="13"/><path d="M-4 -372 h8"/></g>` : '';
  const faces = face ? `<g fill="${INK}">${FACES[face]}</g>`.replace(/class="ln( th)?"/g, (m, t) => `fill="none" stroke="${INK}" stroke-width="${t ? 6 : 4}" stroke-linecap="round"`)
    : Object.entries(FACES).map(([k, v]) => `<g class="fx fx-${k}" fill="${INK}">${v}</g>`).join('');
  return `<g class="body">
    <rect x="-38" y="-160" width="32" height="150" rx="14" fill="${bottom}"/><rect x="6" y="-160" width="32" height="150" rx="14" fill="${bottom}"/>
    <ellipse cx="-24" cy="-8" rx="24" ry="11" fill="#2f2722"/><ellipse cx="24" cy="-8" rx="24" ry="11" fill="#2f2722"/>
    <rect x="-64" y="-306" width="128" height="166" rx="44" fill="${top}"/>
    ${apron}${vest}${badge}
    <rect x="-13" y="-328" width="26" height="28" fill="${skin}"/>
    ${arms}${props[o.prop] || ''}
    <circle cx="0" cy="-372" r="52" fill="${skin}"/>
    <circle cx="-52" cy="-366" r="9" fill="${skin}"/><circle cx="52" cy="-366" r="9" fill="${skin}"/>
    ${(HAIR[o.hair] || HAIR.short)(o.hairColor || '#3a2a20')}
    ${faces}${glasses}
  </g>`;
}

// ---------- 場景背景（前景另外畫，用來擋住角色下半身） ----------
const SETS = {
  cafe: {
    back: `<rect width="${W}" height="560" fill="#f4e7d3"/><rect y="560" width="${W}" height="160" fill="#e3cba8"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${i * 220} 560 L${i * 220 - 60} 720" stroke="#d6bb94" stroke-width="3"/>`).join('')}
      <rect x="40" y="70" width="380" height="270" rx="10" fill="#cfe6ef" stroke="#a87a4e" stroke-width="14"/><path d="M230 70 V340 M40 205 H420" stroke="#a87a4e" stroke-width="10"/>
      <path d="M70 100 L150 100 L90 190 Z M260 100 L340 100 L280 190 Z" fill="#fff" opacity=".45"/>
      <g class="outlet"><circle cx="335" cy="420" r="40" fill="#f6c25b" opacity=".35"/><rect x="317" y="394" width="36" height="52" rx="7" fill="#fffaf2" stroke="#c9b7a0" stroke-width="3"/><path d="M329 410 v10 M341 410 v10 M329 430 v8 M341 430 v8" stroke="#8d7b66" stroke-width="4" stroke-linecap="round"/></g>
      <path d="M380 0 V60 M900 0 V60 M1280 0 V60" stroke="#8c6b4a" stroke-width="3"/>
      ${[380, 900, 1280].map(x => `<path d="M${x - 38} 96 Q${x} 50 ${x + 38} 96Z" fill="#c8822e"/><ellipse cx="${x}" cy="98" rx="20" ry="6" fill="#ffe7a8"/>`).join('')}
      <rect x="1080" y="140" width="300" height="160" rx="8" fill="#3b3029" stroke="#8c6b4a" stroke-width="8"/>
      <text x="1230" y="196" text-anchor="middle" font-size="34" font-weight="700" fill="#f4e7d3">今日咖啡</text>
      <path d="M1120 230 H1250 M1120 262 H1210 M1280 230 H1340 M1280 262 H1340" stroke="#d9cbb5" stroke-width="5" stroke-linecap="round" opacity=".7"/>
      <rect x="1340" y="400" width="260" height="190" fill="#b8865a"/><rect x="1330" y="384" width="280" height="22" rx="6" fill="#8c5a32"/>
      <rect x="1430" y="300" width="90" height="84" rx="10" fill="#5d6670"/><rect x="1446" y="318" width="58" height="22" rx="4" fill="#9fb6c4"/><rect x="1466" y="350" width="18" height="26" fill="#2f3338"/>
      <path d="M1560 520 q-30 -60 0 -110 q30 50 0 110z M1560 520 q-56 -30 -50 -88 q42 26 50 88z" fill="#6d9a5a"/><rect x="1536" y="510" width="48" height="60" rx="8" fill="#c8822e"/>`,
    front: `<ellipse cx="335" cy="566" rx="96" ry="18" fill="#b8865a"/><rect x="325" y="566" width="20" height="104" fill="#8c5a32"/><ellipse cx="335" cy="672" rx="50" ry="10" fill="#8c5a32"/>
      <path d="M300 548 h26 l-4 18 h-18z" fill="#fff"/><rect x="350" y="530" width="44" height="34" rx="5" fill="#7a5a44"/>
      <ellipse cx="1110" cy="600" rx="110" ry="20" fill="#b8865a"/><rect x="1100" y="600" width="20" height="96" fill="#8c5a32"/>
      <path d="M1150 582 h26 l-4 18 h-18z" fill="#fff"/>`,
  },
  drinks: {
    back: `<rect width="${W}" height="${H}" fill="#fbf1de"/>
      <rect x="480" y="92" width="540" height="148" rx="14" fill="#2f3338"/><text x="750" y="140" text-anchor="middle" font-size="32" font-weight="700" fill="#ffe7a8">訂單　待做 23 杯</text>
      ${[0, 1, 2].map(i => `<rect x="${506 + i * 168}" y="160" width="152" height="62" rx="8" fill="#3d444c"/><path d="M${524 + i * 168} 182 h100 M${524 + i * 168} 204 h66" stroke="#9fb6c4" stroke-width="7" stroke-linecap="round"/>`).join('')}
      <rect x="40" y="40" width="260" height="130" rx="12" fill="#5f8a3e"/><text x="170" y="102" text-anchor="middle" font-size="36" font-weight="900" fill="#fff">青茶好茶</text><text x="170" y="144" text-anchor="middle" font-size="24" fill="#ebf3e2">現點現做</text>
      <rect x="1380" y="60" width="190" height="200" rx="12" fill="#fff" stroke="#e3cba8" stroke-width="4"/>${[0, 1, 2, 3].map(i => `<path d="M1406 ${104 + i * 40} h${130 - i * 20}" stroke="#d9cbb5" stroke-width="8" stroke-linecap="round"/>`).join('')}`,
    front: `<rect x="0" y="548" width="${W}" height="172" fill="#8fb06e"/><rect x="0" y="534" width="${W}" height="24" rx="6" fill="#5f8a3e"/>
      ${[0, 1, 2, 3].map(i => `<path d="M${430 + i * 54} 534 h38 l-5 -66 h-28z" fill="#fff" stroke="#d9cbb5" stroke-width="3"/><rect x="${431 + i * 54}" y="482" width="36" height="38" fill="${['#d9a066', '#f3e2c4', '#9c6b3e', '#e8b48c'][i]}" opacity=".8"/>`).join('')}
      ${[0, 1].map(i => `<path d="M${960 + i * 54} 534 h38 l-5 -66 h-28z" fill="#fff" stroke="#d9cbb5" stroke-width="3"/><rect x="${961 + i * 54}" y="482" width="36" height="38" fill="${['#f3e2c4', '#d9a066'][i]}" opacity=".8"/>`).join('')}
      <rect x="1380" y="458" width="110" height="76" rx="10" fill="#5d6670"/><path d="M1410 458 C1410 400 1450 410 1440 350" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round"/>`,
  },
  room: {
    back: `<rect width="${W}" height="${H}" fill="#e3e0ee"/><rect y="600" width="${W}" height="120" fill="#c9c3d6"/>
      <rect x="1120" y="70" width="320" height="250" rx="10" fill="#2f3a5a" stroke="#f4efe6" stroke-width="12"/><circle cx="1360" cy="140" r="34" fill="#fbe8a6"/><circle cx="1374" cy="130" r="30" fill="#2f3a5a"/>
      ${[[1180, 120], [1230, 250], [1300, 210], [1410, 270]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`).join('')}
      <g class="cal"><rect x="120" y="80" width="300" height="260" rx="10" fill="#fff" stroke="#c9c3d6" stroke-width="4"/><rect x="120" y="80" width="300" height="56" rx="10" fill="#c45d7a"/><text x="270" y="120" text-anchor="middle" font-size="28" font-weight="700" fill="#fff">這一週</text>
      ${['一', '二', '三', '四', '五', '六', '日'].map((d, i) => `<text x="${150 + i * 40}" y="176" text-anchor="middle" font-size="22" fill="#6b5f7a">${d}</text>`).join('')}
      ${[3, 4, 5].map(i => `<circle cx="${150 + i * 40}" cy="226" r="18" fill="none" stroke="#c4523b" stroke-width="4"/><text x="${150 + i * 40}" y="234" text-anchor="middle" font-size="20" font-weight="700" fill="#c4523b">班</text>`).join('')}</g>
      <rect x="560" y="120" width="10" height="200" fill="#8c7a6a"/><path d="M520 120 Q565 60 610 120Z" fill="#f6d77a"/><ellipse cx="565" cy="122" rx="40" ry="10" fill="#ffefb8" opacity=".8"/>
      <circle cx="1000" cy="150" r="46" fill="#fff" stroke="#8c7a6a" stroke-width="6"/><path d="M1000 150 V120 M1000 150 L1022 160" stroke="#2b231c" stroke-width="5" stroke-linecap="round"/><text x="1000" y="230" text-anchor="middle" font-size="24" font-weight="700" fill="#6b5f7a">23:40</text>`,
    front: `<rect x="520" y="470" width="560" height="140" rx="30" fill="#7c86b0"/><rect x="480" y="440" width="70" height="200" rx="28" fill="#6b759e"/><rect x="1050" y="440" width="70" height="200" rx="28" fill="#6b759e"/><rect x="540" y="560" width="520" height="80" rx="20" fill="#8e98c0"/>`,
  },
  // 社會技巧：走廊（置物櫃、公布欄）
  hallway: {
    back: `<rect width="${W}" height="${H}" fill="#eef1f4"/><rect y="600" width="${W}" height="120" fill="#cdd4dc"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => `<path d="M${i * 160} 600 V720" stroke="#bcc4ce" stroke-width="3"/>`).join('')}
      ${Array.from({ length: 8 }, (_, i) => `<rect x="${60 + i * 88}" y="150" width="82" height="450" rx="4" fill="${i % 2 ? '#7fa9d6' : '#6b95c4'}"/><path d="M${80 + i * 88} 190 h42 M${80 + i * 88} 202 h42 M${80 + i * 88} 214 h42" stroke="#4f78a8" stroke-width="4"/><rect x="${126 + i * 88}" y="360" width="8" height="34" rx="3" fill="#dfe8f2"/>`).join('')}
      <rect x="980" y="110" width="360" height="220" rx="8" fill="#d9b57e" stroke="#a07850" stroke-width="10"/>
      <rect x="1010" y="135" width="110" height="80" fill="#fff" transform="rotate(-3 1065 175)"/><rect x="1140" y="140" width="90" height="120" fill="#fdf0e5"/><rect x="1240" y="150" width="76" height="70" fill="#e4f2ef" transform="rotate(4 1278 185)"/>
      <circle cx="1065" cy="140" r="6" fill="#c4523b"/><circle cx="1185" cy="146" r="6" fill="#2b8a7e"/><circle cx="1278" cy="156" r="6" fill="#e8894a"/>
      <rect x="1400" y="90" width="170" height="260" rx="8" fill="#cfe6ef" stroke="#f4f1ea" stroke-width="12"/><path d="M1485 90 V350" stroke="#f4f1ea" stroke-width="8"/>`,
    front: '',
  },
  // 社會技巧：社團教室（桌遊社）
  club: {
    back: `<rect width="${W}" height="${H}" fill="#f3ead9"/><rect y="590" width="${W}" height="130" fill="#d9c4a2"/>
      <rect x="90" y="70" width="260" height="90" rx="14" fill="#7160b0"/><text x="220" y="128" text-anchor="middle" font-size="40" font-weight="900" fill="#fff" letter-spacing="6">桌遊社</text>
      <rect x="90" y="200" width="300" height="14" rx="4" fill="#b5844f"/><rect x="90" y="330" width="300" height="14" rx="4" fill="#b5844f"/>
      ${[0, 1, 2, 3].map(i => `<rect x="${104 + i * 70}" y="${140}" width="58" height="60" rx="6" fill="${['#e8894a', '#3b7fb8', '#5b9338', '#c45d7a'][i]}"/><rect x="${104 + i * 70}" y="${272}" width="58" height="58" rx="6" fill="${['#f2c94c', '#9b88b5', '#e05a4a', '#2b8a7e'][i]}"/>`).join('')}
      <rect x="1180" y="80" width="300" height="200" rx="10" fill="#fff" stroke="#d9cbb5" stroke-width="6"/><text x="1330" y="140" text-anchor="middle" font-size="30" font-weight="700" fill="#7160b0">本週新遊戲</text><path d="M1220 180 h220 M1220 214 h160 M1220 248 h190" stroke="#d9cbb5" stroke-width="8" stroke-linecap="round"/>`,
    front: `<rect x="300" y="540" width="1000" height="26" rx="8" fill="#c99a66"/><rect x="320" y="566" width="960" height="100" fill="#b5844f"/>
      <rect x="560" y="522" width="120" height="22" rx="4" fill="#e8894a"/><rect x="740" y="516" width="70" height="28" rx="4" fill="#fff" transform="rotate(-8 775 530)"/><rect x="830" y="518" width="70" height="26" rx="4" fill="#f2c94c" transform="rotate(6 865 531)"/><circle cx="960" cy="532" r="12" fill="#c45d7a"/><circle cx="990" cy="534" r="12" fill="#3b7fb8"/>`,
  },
  // 社會技巧：客廳（朋友聚會）
  home: {
    back: `<rect width="${W}" height="${H}" fill="#f6ead8"/><rect y="600" width="${W}" height="120" fill="#d6b48a"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<path d="M${i * 200} 600 L${i * 200 - 60} 720" stroke="#c39d70" stroke-width="3"/>`).join('')}
      <rect x="70" y="150" width="200" height="450" rx="6" fill="#a87a4e"/><rect x="88" y="168" width="164" height="414" rx="4" fill="#b98a5c"/><circle cx="230" cy="390" r="10" fill="#f2c94c"/>
      <rect x="560" y="90" width="420" height="250" rx="10" fill="#cfe6ef" stroke="#fff" stroke-width="14"/><path d="M770 90 V340" stroke="#fff" stroke-width="10"/>
      <path d="M520 80 h500" stroke="#c8822e" stroke-width="10" stroke-linecap="round"/><path d="M530 84 q30 140 0 270 M1010 84 q-30 140 0 270" stroke="#e8894a" stroke-width="30" fill="none" opacity=".55"/>
      <rect x="1120" y="380" width="420" height="140" rx="40" fill="#7fa9d6"/><rect x="1100" y="440" width="460" height="130" rx="30" fill="#6b95c4"/><rect x="1150" y="400" width="120" height="70" rx="20" fill="#f2c94c" opacity=".9"/>
      <rect x="1300" y="150" width="160" height="110" rx="8" fill="#fff" stroke="#a87a4e" stroke-width="8"/><path d="M1320 230 l40 -40 30 25 25 -20 25 35z" fill="#86bf7f"/>`,
    front: `<rect x="590" y="610" width="420" height="22" rx="8" fill="#a87a4e"/><rect x="610" y="632" width="18" height="70" fill="#8c5a32"/><rect x="972" y="632" width="18" height="70" fill="#8c5a32"/>
      <ellipse cx="700" cy="604" rx="44" ry="12" fill="#f4efe6"/><circle cx="690" cy="598" r="9" fill="#e8894a"/><circle cx="708" cy="596" r="8" fill="#f2c94c"/><rect x="820" y="572" width="30" height="40" rx="6" fill="#e05a4a"/><rect x="880" y="576" width="30" height="36" rx="6" fill="#3b7fb8"/>`,
  },
  // 社會技巧：兩個房間（講電話、傳訊息）
  phones: {
    back: `<rect width="800" height="${H}" fill="#e6edf6"/><rect x="800" width="800" height="${H}" fill="#f6e9e0"/>
      <rect y="600" width="800" height="120" fill="#c9d3df"/><rect x="800" y="600" width="800" height="120" fill="#dfcbb8"/>
      <rect x="90" y="100" width="240" height="190" rx="8" fill="#2f3a5a" stroke="#fff" stroke-width="10"/><circle cx="270" cy="150" r="24" fill="#fbe8a6"/>
      <rect x="560" y="420" width="200" height="16" rx="5" fill="#a87a4e"/><rect x="600" y="300" width="12" height="120" fill="#8c7a6a"/><path d="M570 300 Q606 250 642 300Z" fill="#f2c94c"/>
      <rect x="1270" y="100" width="240" height="190" rx="8" fill="#cfe6ef" stroke="#fff" stroke-width="10"/><path d="M1390 100 V290" stroke="#fff" stroke-width="8"/>
      <rect x="850" y="140" width="150" height="200" rx="8" fill="#fff" stroke="#d9cbb5" stroke-width="6"/><path d="M870 190 h110 M870 220 h80 M870 250 h100" stroke="#e8894a" stroke-width="7" stroke-linecap="round" opacity=".6"/>
      <rect x="794" y="0" width="12" height="${H}" fill="#fff"/>`,
    front: '',
  },
  // 社會技巧：公園（放學後）
  park: {
    back: `<rect width="${W}" height="${H}" fill="#dcefee"/><rect y="520" width="${W}" height="200" fill="#b7d59a"/><path d="M640 720 Q760 600 720 520 L880 520 Q860 600 980 720Z" fill="#e9dcc2"/>
      <circle cx="180" cy="300" r="150" fill="#86bf7f"/><circle cx="300" cy="230" r="120" fill="#7ab274"/><rect x="220" y="360" width="34" height="170" fill="#8c6b4a"/>
      <circle cx="1400" cy="280" r="160" fill="#86bf7f"/><circle cx="1290" cy="220" r="110" fill="#7ab274"/><rect x="1380" y="380" width="36" height="150" fill="#8c6b4a"/>
      <circle cx="1060" cy="110" r="46" fill="#fbe8a6" opacity=".9"/>`,
    front: `<rect x="460" y="560" width="680" height="22" rx="8" fill="#c8822e"/><rect x="480" y="582" width="20" height="90" fill="#8c5a32"/><rect x="1100" y="582" width="20" height="90" fill="#8c5a32"/>`,
  },
  // 社會技巧：教室（午休）
  classroom: {
    back: `<rect width="${W}" height="${H}" fill="#e4eee9"/><rect y="590" width="${W}" height="130" fill="#d9c4a2"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<path d="M${i * 200} 590 L${i * 200 - 70} 720" stroke="#c8ae86" stroke-width="3"/>`).join('')}
      <rect x="170" y="70" width="780" height="300" rx="8" fill="#2f5a4c" stroke="#a07850" stroke-width="14"/><rect x="160" y="370" width="800" height="14" rx="4" fill="#a07850"/>
      <text x="210" y="130" font-size="34" fill="#e8f1ec" opacity=".85" font-weight="700">午休</text><text x="210" y="178" font-size="26" fill="#e8f1ec" opacity=".6">值日生：12 號</text>
      <path d="M640 140 q40 -30 80 0 t80 0" stroke="#e8f1ec" stroke-width="4" fill="none" opacity=".35"/><rect x="820" y="360" width="40" height="10" rx="3" fill="#fff" opacity=".8"/>
      <circle cx="1045" cy="120" r="44" fill="#fff" stroke="#8c7a6a" stroke-width="6"/><path d="M1045 120 V92 M1045 120 L1066 128" stroke="#2b231c" stroke-width="5" stroke-linecap="round"/>
      <rect x="1140" y="80" width="360" height="270" rx="10" fill="#cfe6ef" stroke="#f4f1ea" stroke-width="14"/><path d="M1320 80 V350 M1140 215 H1500" stroke="#f4f1ea" stroke-width="10"/>
      <path d="M1170 110 L1240 110 L1190 190 Z M1350 110 L1420 110 L1370 190 Z" fill="#fff" opacity=".5"/>`,
    front: [[420, 280], [900, 280]].map(([x, w]) => `<rect x="${x}" y="540" width="${w}" height="26" rx="6" fill="#c99a66"/><rect x="${x + 14}" y="566" width="${w - 28}" height="110" fill="#b5844f"/><rect x="${x + 14}" y="566" width="${w - 28}" height="10" fill="#9c6f40"/><rect x="${x + 22}" y="676" width="16" height="44" fill="#7a7f88"/><rect x="${x + w - 38}" y="676" width="16" height="44" fill="#7a7f88"/>`).join(''),
  },
  // 社會技巧：福利社（排隊）
  shop: {
    back: `<rect width="${W}" height="${H}" fill="#fbf1de"/><rect y="600" width="${W}" height="120" fill="#e9d6b6"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => `<path d="M${i * 160} 600 V720" stroke="#dcc6a2" stroke-width="3"/>`).join('')}
      <rect x="90" y="40" width="300" height="78" rx="14" fill="#2b8a7e"/><text x="240" y="93" text-anchor="middle" font-size="40" font-weight="900" fill="#fff" letter-spacing="8">福利社</text>
      ${[0, 1, 2].map(r => `<rect x="90" y="${160 + r * 140}" width="${r === 2 ? 640 : 700}" height="14" rx="4" fill="#b5844f"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${104 + i * 74}" y="${100 + r * 140}" width="56" height="60" rx="8" fill="${['#e8894a', '#7fa9d6', '#f2c94c', '#86bf7f', '#c45d7a', '#9b88b5', '#f4a261', '#5b9338', '#3b7fb8'][(i + r * 4) % 9]}" opacity=".85"/>`).join('')}`).join('')}
      <rect x="1180" y="90" width="340" height="510" rx="18" fill="#dfe8ee" stroke="#9aa9b5" stroke-width="10"/><path d="M1350 90 V600" stroke="#9aa9b5" stroke-width="8"/>
      ${[0, 1, 2, 3].map(r => `<rect x="1196" y="${190 + r * 110}" width="310" height="8" fill="#9aa9b5"/>${Array.from({ length: 7 }, (_, i) => `<rect x="${1208 + i * 44}" y="${130 + r * 110}" width="26" height="58" rx="8" fill="${['#e05a4a', '#3b7fb8', '#f2c94c', '#86bf7f'][(i + r) % 4]}" opacity=".8"/>`).join('')}`).join('')}`,
    front: '',
  },
  counter: {
    back: `<rect width="${W}" height="${H}" fill="#fbf1de"/>${[0, 1, 2].map(i => `<rect x="${i * 533 + 10}" y="10" width="513" height="700" rx="20" fill="${['#fbf0c9', '#e6ecf3', '#fbe2dc'][i]}"/>`).join('')}`,
    front: [0, 1, 2].map(i => `<rect x="${i * 533 + 10}" y="520" width="513" height="190" fill="#c8a07a"/><rect x="${i * 533 + 10}" y="506" width="513" height="20" fill="#8c5a32"/>`).join(''),
  },
};


// ---------- 由資料算出每一步的狀態 ----------
// 每一步（beat）可以有：spot 聚光燈 [cx,cy,rx,ry] 或 'all'、expr 表情、in 聚光燈內的人、show 出場的人、
// say/says 說的話、think 內心話、card/cards 回憶小卡、tl 時間軸、cap 字幕、freeze 定格（出現量表圓點）、clear 清掉泡泡。
// 泡泡位置 [who, text, place, [x,y]]：place = up（正上方）、ul（往右長）、ur（往左長）、r（在右邊）、l（在左邊）
function compile(sc) {
  const st = [];
  let cur = { spot: sc.spot || 'all', expr: {}, in: Object.keys(sc.cast), time: sc.time || '', show: sc.show || Object.keys(sc.cast), v: sc.v || [], pos: {} };
  Object.entries(sc.cast).forEach(([k, c]) => { cur.pos[k] = [c.x, c.y || 650]; });
  Object.entries(sc.cast).forEach(([k, c]) => { cur.expr[k] = c.expr || 'neutral'; });
  const items = [];   // { b: 開始的步, u: 結束的步(不含), html, kind }
  const open = { talk: [], card: [], cap: [] };
  const close = (kind, i) => { open[kind].forEach(x => { if (x.u == null) x.u = i; }); open[kind] = []; };
  sc.beats.forEach((b, i) => {
    cur = { ...cur, expr: { ...cur.expr, ...(b.expr || {}) }, pos: { ...cur.pos, ...(b.pos || {}) } };
    if (b.v) cur.v = b.v;
    if (b.spot) cur.spot = b.spot;
    if (b.in) cur.in = b.in;
    if (b.time != null) cur.time = b.time;
    if (b.show) cur.show = b.show;
    st.push(JSON.parse(JSON.stringify(cur)));
    if (b.clear) close('talk', i);
    if (b.clearCards) close('card', i);
    const add = (kind, html, extra) => { const x = { b: i, u: null, html, ...extra }; items.push(x); if (open[kind]) open[kind].push(x); return x; };
    (b.say ? [b.say] : []).concat(b.says || []).forEach(a => add('talk', bubble('say', a, sc)));
    (b.think ? [b.think] : []).concat(b.thinks || []).forEach(a => add('talk', bubble('think', a, sc)));
    (b.card ? [b.card] : []).concat(b.cards || []).forEach(a => add('card', memo(a, sc)));
    (b.tl || []).forEach(([t, text, now]) => add('tl', `<li class="${now ? 'now' : ''}"><b>${t}</b><span>${text}</span></li>`, { kind: 'tl', t }));
    // 字幕標籤：freeze 定格（深色）、ng 錯誤（紅）、ok 做對了（綠）
    const mark = b.freeze ? ['freeze', b.freeze === true ? '定格' : b.freeze] : b.ng ? ['ng', b.ng] : b.ok ? ['ok', b.ok] : null;
    if (b.cap) { close('cap', i); const x = add('cap', `<p class="scn-cap${mark ? ' ' + mark[0] : ''}">${mark ? `<b>${mark[1]}</b>` : ''}${b.cap}</p>`); if (!b.capHold) x.u = i + 1; }
    if (b.freeze && b.dots !== false) add('talk', '', { kind: 'dots' });
  });
  return { st, items };
}

function pct(x, y) { return `left:${(x / W * 100).toFixed(2)}%;top:${(y / H * 100).toFixed(2)}%`; }
function bubble(kind, [who, text, place, pos], sc) {
  const c = sc.cast[who];
  const [x, y] = pos || [c.x, c.by || 230];
  return `<div class="scn-${kind} at-${place || 'up'}" style="${pct(x, y)}"><small>${c.name}</small>${text}</div>`;
}
function memo([who, t, text, pos, cls], sc) {
  const c = sc.cast[who] || { x: 800 };
  const [x, y] = pos || [c.x, 80];
  return `<div class="scn-memo${cls ? ' ' + cls : ''}" style="${pct(x, y)}">${t ? `<b>${t}</b>` : ''}${text}</div>`;
}

let uid = 0;
// 產生場景 HTML。range = [起始步, 結束步]；mode = 'slide'（由簡報翻頁帶動）或 'web'（自己的按鈕）
function renderScene(sc, range, mode) {
  const id = 'scn' + (++uid);
  const { st, items } = compile(sc);
  const [from, to] = range || [0, sc.beats.length - 1];
  const P = mode === 'print' ? st[to] : null;   // 印刷版：直接畫出最後一步的樣子
  const isOn = x => P && x.b <= to && to < (x.u == null ? 999 : x.u);
  const set = SETS[sc.set];
  const S0 = P || st[from];
  const g = ([k, c]) => { const [x, y] = S0.pos[k]; return `<g class="p${!S0.show.includes(k) ? ' out' : ''}" data-k="${k}" data-e="${S0.expr[k]}" style="transform:translate(${x}px,${y}px)"><g transform="scale(${c.flip ? -(c.s || 0.92) : c.s || 0.92} ${c.s || 0.92})">${person(c.look)}</g></g>`; };
  const cast = Object.entries(sc.cast).filter(([, c]) => !c.front).map(g).join('');
  const castFront = Object.entries(sc.cast).filter(([, c]) => c.front).map(g).join('');
  const tags = Object.entries(sc.cast).filter(([, c]) => !c.noTag).map(([k, c]) => `<div class="scn-tag${S0.spot !== 'all' && !S0.in.includes(k) ? ' dark' : ''}" data-k="${k}" style="${pct(S0.pos[k][0], c.tagY || 690)}${S0.show.includes(k) ? '' : ';display:none'}"><span>${c.name}</span></div>`).join('');
  const live = x => (x.u == null ? 999 : x.u) > from && x.b <= to;
  const dotsFor = i => st[i].in.map(k => {
    const c = sc.cast[k];
    return `<div class="scn-dots" data-k="${k}" style="${pct(st[i].pos[k][0], (c.tagY || 690) - 50)}">${['r', 'y', 'b', 'g'].map((z, j) => `<button type="button" class="d-${z}" aria-label="${c.name}：${['紅區', '黃區', '藍區', '綠區'][j]}"></button>`).join('')}</div>`;
  }).join('');
  const attr = x => `data-b="${x.b}" data-u="${x.u == null ? 999 : x.u}"`;
  const layer = items.filter(x => x.kind !== 'tl' && live(x) && !(P && (x.kind === 'dots' || !isOn(x)))).map(x => `<div class="scn-i${x.kind === 'dots' ? ' dots' : ''}${isOn(x) ? ' on' : ''}" ${attr(x)}>${x.kind === 'dots' ? dotsFor(x.b) : x.html}</div>`).join('');
  const tl = items.filter(x => x.kind === 'tl' && live(x)).sort((a, b) => a.t.localeCompare(b.t));
  const tlHtml = tl.length ? `<ol class="scn-tl">${tl.map(x => x.html.replace('<li', `<li ${attr(x)}`).replace('class="', `class="${isOn(x) ? 'on ' : ''}`)).join('')}</ol>` : '';
  const markers = mode === 'slide' ? Array.from({ length: to - from }, () => '<i class="scn-mk" data-step></i>').join('') : '';
  const ctrl = mode === 'web' ? `<div class="scn-ctrl"><button type="button" data-d="-1">‹ 上一步</button><span class="scn-n"></span><button type="button" data-d="1" class="go">下一步 ›</button><button type="button" data-d="0">↺ 重播</button></div>` : '';
  const stJson = JSON.stringify(st.map(s => ({ spot: s.spot, expr: s.expr, in: s.in, time: s.time, show: s.show, v: s.v, pos: s.pos }))).replace(/'/g, '&#39;');
  return `<div class="scn-wrap"><div class="scn m-${mode} set-${sc.set}${S0.spot === 'all' ? ' lit' : ''}" data-v="${S0.v.join(' ')}" id="${id}" data-from="${from}" data-to="${to}" data-st='${stJson}'>
  <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
    <defs><filter id="${id}-b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
    <mask id="${id}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/><ellipse class="spot" ${(S0.spot !== 'all' ? S0.spot : [800, 360, 300, 300]).map((v, j) => `${['cx', 'cy', 'rx', 'ry'][j]}="${v}"`).join(' ')} fill="#000" filter="url(#${id}-b)"/></mask></defs>
    ${set.back}<g class="cast">${cast}</g>${set.front}<g class="cast">${castFront}</g>${set.over || ''}
    <rect class="dim" width="${W}" height="${H}" fill="#140d07" mask="url(#${id}-m)"/>
  </svg>
  <div class="scn-layer"><p class="scn-clock">${S0.time || ''}</p>${sc.note ? `<p class="scn-note">${sc.note}</p>` : ''}${tlHtml}${tags}${layer}</div>
  ${markers}
</div>${ctrl}</div>`;
}

const SCENE_CSS = `
.scn-wrap{container-type:inline-size;width:100%}
.scn{position:relative;width:100%;aspect-ratio:${W}/${H};border-radius:2cqw;overflow:hidden;background:#140d07;font-size:1.6cqw;line-height:1.45;user-select:none;-webkit-user-select:none;cursor:default}
.scn.m-slide{font-size:1.85cqw;cursor:pointer}
.scn svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.scn .ln{fill:none;stroke:#2b231c;stroke-width:4;stroke-linecap:round}.scn .ln.th{stroke-width:6}
.scn .p .fx{display:none}
${Object.keys(FACES).map(k => `.scn .p[data-e=${k}] .fx-${k}`).join(',')}{display:inline}
.scn .p{transition:opacity .5s,transform 1.4s cubic-bezier(.45,.05,.3,1)}.scn .p.out{opacity:0}
.scn-note{position:absolute;right:1.6%;bottom:2.4%;font-size:.62em;color:#fff;background:rgba(43,35,28,.6);padding:.1em .6em;border-radius:.4em;letter-spacing:.1em}
.scn .scn-memo.m-blank{background:rgba(255,250,240,.9);border:.14em dashed #b8612a;color:#8a6a4a}
${Object.values(SETS).map(x => x.css || '').join('\n')}
${[...new Set(Object.values(SETS).flatMap(x => x.tokens || []))].map(t => `.scn .vx-${t}{opacity:0;transition:opacity 1s}.scn[data-v~=${t}] .vx-${t}{opacity:1}.scn .vn-${t}{transition:opacity 1s}.scn[data-v~=${t}] .vn-${t}{opacity:0}`).join('\n')}
.scn .p[data-e=angry] .body{animation:scn-shake .45s ease-in-out 3}
@keyframes scn-shake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.scn .rec{animation:scn-blink 1s steps(2) infinite}@keyframes scn-blink{50%{opacity:0}}
.scn .spot{transition:cx 1s cubic-bezier(.45,.05,.2,1),cy 1s cubic-bezier(.45,.05,.2,1),rx 1s cubic-bezier(.45,.05,.2,1),ry 1s cubic-bezier(.45,.05,.2,1)}
.scn .dim{transition:opacity .8s;opacity:.76}.scn.lit .dim{opacity:0}
.scn-layer{position:absolute;inset:0;pointer-events:none}
.scn-i{position:absolute;inset:0;opacity:0;visibility:hidden;transition:opacity .35s,visibility 0s .35s}.scn-i.on{opacity:1;visibility:visible;transition:opacity .35s}
.scn-say,.scn-think,.scn-memo{position:absolute;width:max-content;max-width:30%;padding:.55em .9em;border-radius:.9em;background:#fff;color:#2b231c;font-weight:700;box-shadow:0 .3em .9em rgba(0,0,0,.2)}
.scn-say small,.scn-think small{display:block;font-size:.66em;font-weight:700;color:#a35a1c;letter-spacing:.05em}
.scn-think small{color:#6b5a8a}
.at-up{transform:translate(-50%,-100%)}.at-ul{transform:translate(-18%,-100%)}.at-ur{transform:translate(-82%,-100%)}
.at-r{transform:translate(0,-50%)}.at-l{transform:translate(-100%,-50%)}
.scn-i.on .scn-say,.scn-i.on .scn-think{animation:scn-pop .4s cubic-bezier(.2,.8,.3,1.25)}
@keyframes scn-pop{from{opacity:0;margin-top:.6em}}
.scn-say::after{content:"";position:absolute;bottom:-.55em;left:50%;margin-left:-.55em;border:.55em solid transparent;border-top-color:#fff;border-bottom:0}
.scn-say.at-ul::after{left:18%}.scn-say.at-ur::after{left:82%}
.scn-say.at-r::after{left:-.5em;top:50%;bottom:auto;margin:-.55em 0 0;border:.55em solid transparent;border-right-color:#fff;border-left:0}
.scn-say.at-l::after{left:auto;right:-.5em;top:50%;bottom:auto;margin:-.55em 0 0;border:.55em solid transparent;border-left-color:#fff;border-right:0}
.scn-think{background:#f4f0fc;border:.12em dashed #9b88b5;font-weight:500}
.scn-think::before,.scn-think::after{content:"";position:absolute;border-radius:50%;background:#f4f0fc;border:.1em dashed #9b88b5}
.scn-think::before{width:.8em;height:.8em;left:calc(50% - .4em);bottom:-1.1em}.scn-think::after{width:.45em;height:.45em;left:calc(50% - .1em);bottom:-1.75em}
.scn-think.at-ul::before{left:12%}.scn-think.at-ul::after{left:9%}.scn-think.at-ur::before{left:80%}.scn-think.at-ur::after{left:84%}
.scn-think.at-r::before{left:-1.1em;top:55%;bottom:auto}.scn-think.at-r::after{left:-1.8em;top:70%;bottom:auto}
.scn-think.at-l::before{left:auto;right:-1.1em;top:55%;bottom:auto}.scn-think.at-l::after{left:auto;right:-1.8em;top:70%;bottom:auto}
.scn-memo{transform:translate(-50%,0) rotate(-1.5deg);background:#fffaf0;border-top:.32em solid #c8822e;font-weight:500;max-width:22%;font-size:.86em;line-height:1.5}
.scn-memo b{display:block;color:#b8612a;font-size:.86em;letter-spacing:.05em}
.scn-i.on .scn-memo{animation:scn-card .5s cubic-bezier(.2,.8,.3,1.2)}
@keyframes scn-card{from{opacity:0;transform:translate(-50%,-.6em) rotate(-6deg)}}
.scn-tag{position:absolute;transform:translate(-50%,-50%);transition:opacity .5s}
.scn-tag span{display:inline-block;white-space:nowrap;background:rgba(43,35,28,.85);color:#fff;font-size:.72em;font-weight:700;padding:.12em .7em;border-radius:999px}
.scn-tag.dark{opacity:.3}
.scn-cap{position:absolute;left:50%;top:3.2%;transform:translateX(-50%);white-space:nowrap;background:rgba(255,250,242,.96);color:#2b231c;font-weight:700;padding:.35em 1.1em;border-radius:999px;box-shadow:0 .3em .9em rgba(0,0,0,.25)}
.scn-cap.freeze{background:#2b231c;color:#fff}
.scn-cap b{display:inline-block;margin-right:.6em;padding:0 .55em;border-radius:.4em;background:#e8894a;color:#fff}
.scn-i.on .scn-cap.freeze{animation:scn-flash .6s}
.scn-cap.ng b{background:#c4523b}.scn-cap.ok b{background:#2b8a7e}
.scn-i.on .scn-cap.ng,.scn-i.on .scn-cap.ok{animation:scn-flash .6s}
.scn-cap{max-width:94%;white-space:normal;text-align:center}
@keyframes scn-flash{0%{box-shadow:0 0 0 1.2em rgba(255,255,255,.5)}}
.scn-dots{position:absolute;transform:translate(-50%,-50%);display:flex;gap:.28em;pointer-events:auto;background:rgba(255,250,242,.94);padding:.22em .32em;border-radius:999px;box-shadow:0 .2em .6em rgba(0,0,0,.25)}
.scn-dots button{width:1.15em;height:1.15em;border-radius:50%;border:.12em solid rgba(0,0,0,.12);cursor:pointer;padding:0;transition:transform .15s,opacity .15s}
.scn-dots button:hover{transform:scale(1.18)}
.scn-dots .d-r{background:#e8836f}.scn-dots .d-y{background:#f1cf55}.scn-dots .d-b{background:#7fa9d6}.scn-dots .d-g{background:#86bf7f}
.scn-dots.picked button:not(.sel){opacity:.22;transform:scale(.75)}
.scn-dots button.sel{transform:scale(1.4);border-color:#2b231c}
.scn-clock{position:absolute;right:2%;top:3.2%;background:rgba(43,35,28,.86);color:#fff;font-weight:700;padding:.2em .8em;border-radius:.5em;font-size:.8em}
.scn-clock:empty{display:none}
.scn-tl{position:absolute;right:2%;top:13%;display:flex;flex-direction:column;gap:.35em;list-style:none;font-size:.8em;width:27%}
.scn-tl li{display:flex;gap:.6em;background:rgba(255,250,242,.95);border-radius:.5em;padding:.3em .8em;opacity:0;transform:translateX(1em);transition:opacity .45s,transform .45s;box-shadow:0 .2em .6em rgba(0,0,0,.2)}
.scn-tl li.on{opacity:1;transform:none}
.scn-tl li b{color:#b8612a;font-variant-numeric:tabular-nums}
.scn-tl li.now{background:#e8894a;color:#fff}.scn-tl li.now b{color:#fff}
.scn-mk{display:none}
.scn-ctrl{display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap}
.scn-ctrl button{font:inherit;font-size:14px;font-weight:700;border:1px solid #ecdfcb;background:#fff;color:#4b4037;border-radius:999px;padding:6px 14px;cursor:pointer}
.scn-ctrl button.go{background:#e8894a;border-color:#e8894a;color:#fff}
.scn-ctrl button:disabled{opacity:.4;cursor:default}
.scn-n{font-size:13px;color:#776a5f;min-width:4.5em;text-align:center;font-variant-numeric:tabular-nums}
@media(max-width:700px){.scn.m-web{font-size:2.6cqw;border-radius:3cqw}.m-web .scn-say,.m-web .scn-think{max-width:40%;padding:.45em .7em}.m-web .scn-cap{font-size:.95em}}

.scn.m-print{border-radius:3mm;break-inside:avoid}.scn.m-print *{animation:none!important;transition:none!important}
@media(prefers-reduced-motion:reduce){.scn *{animation:none!important;transition:none!important}}
`;

const SCENE_JS = `
(function(){
  function init(el){
    var st=JSON.parse(el.dataset.st),from=+el.dataset.from,to=+el.dataset.to,cur=from;
    var spot=el.querySelector('.spot'),items=[].slice.call(el.querySelectorAll('[data-b]'));
    var ps=el.querySelectorAll('.p'),tags=el.querySelectorAll('.scn-tag'),clock=el.querySelector('.scn-clock');
    var ctrl=el.parentNode.querySelector('.scn-ctrl');
    function set(n){
      cur=Math.max(from,Math.min(to,n));var s=st[cur];
      if(s.spot==='all'){el.classList.add('lit')}else{el.classList.remove('lit');
        ['cx','cy','rx','ry'].forEach(function(a,j){spot.style[a]=s.spot[j]+'px';spot.setAttribute(a,s.spot[j])})}
      [].forEach.call(ps,function(p){var k=p.dataset.k;if(s.expr[k]&&p.dataset.e!==s.expr[k])p.dataset.e=s.expr[k];p.classList.toggle('out',s.show.indexOf(k)<0)});
      [].forEach.call(tags,function(t){var k=t.dataset.k;t.classList.toggle('dark',s.spot!=='all'&&s.in.indexOf(k)<0);t.style.display=s.show.indexOf(k)<0?'none':''});
      items.forEach(function(i){i.classList.toggle('on',cur>=+i.dataset.b&&cur<+i.dataset.u)});
      if(clock)clock.textContent=s.time||'';
      el.dataset.v=(s.v||[]).join(' ');
      [].forEach.call(ps,function(p){var q=s.pos[p.dataset.k];if(q)p.style.transform='translate('+q[0]+'px,'+q[1]+'px)'});
      [].forEach.call(tags,function(t){var q=s.pos[t.dataset.k];if(q)t.style.left=(q[0]/${W}*100)+'%'});
      if(ctrl){ctrl.querySelector('.scn-n').textContent=(cur-from+1)+' / '+(to-from+1);ctrl.querySelector('[data-d="-1"]').disabled=cur<=from;ctrl.querySelector('[data-d="1"]').disabled=cur>=to}
    }
    el.addEventListener('click',function(e){var b=e.target.closest('.scn-dots button');if(!b)return;e.stopPropagation();var g=b.parentNode,on=b.classList.contains('sel');[].forEach.call(g.children,function(x){x.classList.remove('sel')});if(!on)b.classList.add('sel');g.classList.toggle('picked',!on)});
    var mk=[].slice.call(el.querySelectorAll('.scn-mk'));
    if(mk.length){
      var sync=function(){set(from+mk.filter(function(m){return m.classList.contains('on')}).length)};
      var mo=new MutationObserver(sync);mk.forEach(function(m){mo.observe(m,{attributes:true,attributeFilter:['class']})});sync();
    }else{
      if(ctrl)ctrl.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var d=+b.dataset.d;set(d===0?from:cur+d)});
      el.addEventListener('click',function(e){if(!e.target.closest('.scn-dots'))set(cur+1)});
      set(from);
    }
  }
  [].forEach.call(document.querySelectorAll('.scn'),init);
})();
`;

// 學習單用的角色小頭像（只畫頭和肩膀）
const avatar = (look, size = 30) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="-82 -466 164 164"><defs><clipPath id="avc"><circle cx="0" cy="-384" r="82"/></clipPath></defs><g clip-path="url(#avc)"><circle cx="0" cy="-384" r="82" fill="#f3ece0"/>${person(look, 'neutral')}</g></svg>`;

// 劇本文字版（教師手冊用）：依步數列出字幕、台詞、內心話與錯誤／做對了的標籤
// marksFrom：從這一步開始只列字幕與標籤（錯誤劇本的「倒帶」不再重複台詞）
function scriptText(sc, range, marksFrom = Infinity) {
  const [from, to] = range || [0, sc.beats.length - 1];
  const out = [];
  sc.beats.slice(from, to + 1).forEach((b, n) => {
    const quiet = from + n >= marksFrom;
    const mark = b.ng ? ['ng', b.ng] : b.ok ? ['ok', b.ok] : null;
    if (!quiet) (b.say ? [b.say] : []).concat(b.says || []).forEach(([who, text]) => out.push({ kind: 'say', who: sc.cast[who].name, text }));
    if (!quiet) (b.think ? [b.think] : []).concat(b.thinks || []).forEach(([who, text]) => out.push({ kind: 'think', who: sc.cast[who].name, text }));
    if (b.cap) out.push({ kind: mark ? mark[0] : 'cap', label: mark && mark[1], text: b.cap });
  });
  return out;
}

module.exports = { renderScene, scriptText, SCENE_CSS, SCENE_JS, person, avatar, W, H };
