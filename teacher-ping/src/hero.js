/* ================================================================
   主視覺：深夜的書桌（檯燈、聯絡簿、紅筆、冷掉的咖啡、亮起來的手機）
   ================================================================ */
var DESK_SVG =
'<svg class="desk" viewBox="20 30 580 490" role="img" aria-label="深夜的書桌上，檯燈亮著，手機跳出家長的訊息">'+
'<defs>'+
  '<radialGradient id="dkPool" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffbf6e" stop-opacity=".55"/><stop offset=".6" stop-color="#ffa64d" stop-opacity=".18"/><stop offset="1" stop-color="#ffa64d" stop-opacity="0"/></radialGradient>'+
  '<linearGradient id="dkCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd59a" stop-opacity=".62"/><stop offset="1" stop-color="#ffd59a" stop-opacity="0"/></linearGradient>'+
  '<linearGradient id="dkWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d5239"/><stop offset="1" stop-color="#4a2f20"/></linearGradient>'+
  '<radialGradient id="dkScr" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="#fffaf1"/><stop offset="1" stop-color="#ffe3bd"/></radialGradient>'+
  '<radialGradient id="dkHalo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd69e" stop-opacity=".75"/><stop offset="1" stop-color="#ffd69e" stop-opacity="0"/></radialGradient>'+
'<radialGradient id="dkFadeG" cx="50%" cy="55%" r="62%"><stop offset=".68" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient><mask id="dkFade" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="520"><rect x="0" y="0" width="600" height="520" fill="url(#dkFadeG)"/></mask>'+
'</defs><g mask="url(#dkFade)">'+
/* 牆上：時鐘、便利貼 */
'<g class="dk-clock" transform="translate(468 92)"><circle r="34" fill="#f3e3cc" stroke="#2a1b12" stroke-width="5"/><circle r="2.6" fill="#2a1b12"/><path d="M0 0 L-17 0" stroke="#2a1b12" stroke-width="4" stroke-linecap="round"/><path d="M0 0 L2 -24" stroke="#2a1b12" stroke-width="2.6" stroke-linecap="round"/></g>'+
'<g transform="translate(338 74) rotate(5)"><rect width="112" height="98" rx="3" fill="#ffd98a"/><rect width="112" height="14" fill="#f4c66a"/><circle cx="56" cy="5" r="5" fill="#c8473a"/>'+
  '<text x="14" y="42" font-size="17" fill="#6b4a2a" font-family="LXGW WenKai TC,Kaiti TC,serif">學習紀錄</text><text x="14" y="68" font-size="17" fill="#c8473a" font-family="LXGW WenKai TC,Kaiti TC,serif">週五交！</text></g>'+
'<g transform="translate(262 108) rotate(-6)"><rect width="74" height="64" rx="3" fill="#f6c3b3"/><text x="10" y="36" font-size="14" fill="#7a3f30" font-family="LXGW WenKai TC,Kaiti TC,serif">家長日</text><text x="10" y="54" font-size="12" fill="#7a3f30" font-family="LXGW WenKai TC,Kaiti TC,serif">下週三</text></g>'+
/* 燈光 */
'<ellipse class="dk-pool" cx="270" cy="395" rx="290" ry="135" fill="url(#dkPool)"/>'+
'<path class="dk-cone" d="M196 196 L304 220 L470 430 L40 430 Z" fill="url(#dkCone)"/>'+
/* 桌子 */
'<path d="M0 334 H600 V520 H0 Z" fill="url(#dkWood)"/><rect y="326" width="600" height="12" rx="3" fill="#9a6a4b"/>'+
'<ellipse cx="260" cy="408" rx="230" ry="62" fill="#ffc47a" opacity=".18"/>'+
/* 檯燈 */
'<ellipse cx="108" cy="356" rx="54" ry="13" fill="#24170f"/><rect x="72" y="340" width="72" height="16" rx="8" fill="#3a271b"/>'+
'<path d="M108 344 L150 214 L226 152" stroke="#3a271b" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="150" cy="214" r="8" fill="#5a3d2a"/>'+
'<path d="M216 126 L262 140 L306 216 Q252 230 194 196 Z" fill="#d9772a"/><path d="M216 126 L262 140 L270 154 Q240 150 212 142 Z" fill="#b85f1c"/>'+
'<ellipse class="dk-bulb" cx="250" cy="207" rx="50" ry="13" fill="#fff4d8" transform="rotate(16 250 207)"/>'+
/* 冷掉的咖啡 */
'<ellipse cx="490" cy="352" rx="40" ry="9" fill="#2a1b12" opacity=".35"/><path d="M458 296 H522 V344 Q522 356 490 356 Q458 356 458 344 Z" fill="#efe1cf"/><ellipse cx="490" cy="296" rx="32" ry="8" fill="#e2cfb8"/><ellipse cx="490" cy="297" rx="27" ry="5.5" fill="#5b3a26"/>'+
'<path d="M522 306 Q542 308 540 324 Q538 338 522 336" stroke="#efe1cf" stroke-width="7" fill="none"/><path d="M466 318 H514" stroke="#d9776b" stroke-width="5" opacity=".7"/>'+
/* 聯絡簿 */
'<g transform="translate(118 372) rotate(-5)"><rect x="-8" y="-6" width="292" height="108" rx="6" fill="#3f6d80"/>'+
  '<path d="M0 0 H136 V96 H0 Z" fill="#fdf6e8"/><path d="M140 0 H276 V96 H140 Z" fill="#fffaf1"/><path d="M138 -2 V98" stroke="#d9c6aa" stroke-width="3"/>'+
  '<g stroke="#e3d0b4" stroke-width="1.6"><path d="M12 22 H124"/><path d="M12 40 H124"/><path d="M12 58 H124"/><path d="M12 76 H124"/><path d="M152 22 H264"/><path d="M152 40 H264"/><path d="M152 58 H264"/><path d="M152 76 H264"/></g>'+
  '<text x="14" y="18" font-size="12" fill="#6b4a2a" font-family="LXGW WenKai TC,Kaiti TC,serif">今天下午擦傷，已擦藥</text>'+
  '<path d="M160 34 l6 6 l12 -14" stroke="#c8473a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M160 70 l6 6 l12 -14" stroke="#c8473a" stroke-width="3" fill="none" stroke-linecap="round"/>'+
  '<text x="190" y="54" font-size="12" fill="#c8473a" font-family="LXGW WenKai TC,Kaiti TC,serif">家長簽名</text></g>'+
/* 紅筆 */
'<g transform="translate(230 474) rotate(-22)"><rect width="128" height="10" rx="5" fill="#c8473a"/><rect x="96" width="32" height="10" rx="5" fill="#8f2d24"/><path d="M0 0 L-14 5 L0 10 Z" fill="#f3e3cc"/></g>'+
/* 手機（亮起來、震動） */
'<ellipse class="dk-halo" cx="452" cy="420" rx="120" ry="96" fill="url(#dkHalo)"/>'+
'<g class="dk-phone"><g transform="translate(452 420) rotate(-12)">'+
  '<rect x="-56" y="-96" width="112" height="192" rx="18" fill="#1b120c"/><rect x="-49" y="-88" width="98" height="176" rx="13" fill="url(#dkScr)"/>'+
  '<text x="0" y="-52" text-anchor="middle" font-size="26" font-weight="500" fill="#4a3326" font-family="DM Mono,monospace">21:02</text>'+
  '<rect x="-43" y="-30" width="86" height="48" rx="10" fill="#3b2a20"/><circle cx="-29" cy="-6" r="9" fill="#f6cdbd"/>'+
  '<text x="-16" y="-10" font-size="9.5" font-weight="700" fill="#ffcf94" font-family="Noto Sans TC,sans-serif">宇振媽媽</text><text x="-16" y="5" font-size="8.5" fill="#fff3e3" font-family="Noto Sans TC,sans-serif">老師您好，不好…</text>'+
  '<rect x="-43" y="24" width="86" height="30" rx="9" fill="#3b2a20" opacity=".55"/><text x="-34" y="43" font-size="8.5" fill="#fff3e3" font-family="Noto Sans TC,sans-serif">＋4 則新訊息</text>'+
'</g></g>'+
'<g class="dk-wave" stroke="#ffd59a" stroke-width="4" stroke-linecap="round" fill="none"><path d="M548 352 q12 14 4 30"/><path d="M566 340 q18 22 6 48"/><path d="M362 448 q-12 -14 -4 -30"/><path d="M344 460 q-18 -22 -6 -48"/></g>'+
'</g></svg>';
