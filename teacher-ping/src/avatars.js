/* ================================================================
   插畫頭像（取代 emoji，各裝置長得一樣）
   資料裡的 emoji 會自動對應到這裡的角色
   ================================================================ */
var AV_FACE = '<ellipse cx="32" cy="31" rx="12.5" ry="14" fill="#f5d0b0"/><circle cx="19.6" cy="32.5" r="2.6" fill="#f0c3a0"/><circle cx="44.4" cy="32.5" r="2.6" fill="#f0c3a0"/>';
var AV_NECK = '<rect x="28" y="41" width="8" height="8" fill="#ecc19f"/>';
var AV_EYES = '<circle cx="27" cy="32" r="1.6" fill="#3b2a20"/><circle cx="37" cy="32" r="1.6" fill="#3b2a20"/>';
var AV_CHEEK = '<circle cx="24.3" cy="36.6" r="2.3" fill="#f0a08a" opacity=".45"/><circle cx="39.7" cy="36.6" r="2.3" fill="#f0a08a" opacity=".45"/>';
function avShoulder(c){ return '<path d="M8 64 C10 51 20 47 32 47 C44 47 54 51 56 64 Z" fill="'+c+'"/>'; }
function avBg(c){ return '<circle cx="32" cy="32" r="32" fill="'+c+'"/>'; }
function st(w){ return ' stroke="#3b2a20" stroke-width="'+(w || 1.7)+'" stroke-linecap="round" fill="none"'; }
var ST = st();
var AV = {
  /* 宇振媽媽：及肩髮、擔心的眉毛 */
  mom1: avBg('#f6cdbd')+'<path d="M17 31 C17 17 24 11.5 32 11.5 C40 11.5 47 17 47 31 L48 48 C44 48 42 45 42 41 L22 41 C22 45 20 48 16 48 Z" fill="#4a2e22"/>'+avShoulder('#d9776b')+AV_NECK+AV_FACE+
    '<path d="M19.5 29 C20 20 26 16.5 32 16.5 C38 16.5 44 20 44.5 29 C40 25 36 23 31 23 C27 24 23 26 19.5 29 Z" fill="#4a2e22"/>'+AV_EYES+AV_CHEEK+
    '<path d="M23.5 27.6 L29 26"'+ST+'/><path d="M35 26 L40.5 27.6"'+ST+'/><path d="M28.5 40.2 Q32 38.4 35.5 40.2"'+ST+'/>',
  /* 阿凱媽媽：包頭、不太高興 */
  mom2: avBg('#d8e6cc')+'<circle cx="32" cy="11.5" r="6.2" fill="#2e2420"/>'+avShoulder('#7a9a6a')+AV_NECK+AV_FACE+
    '<path d="M19.5 31 C19 19 25 15 32 15 C39 15 45 19 44.5 31 C42 24 37 21 32 21 C27 21 22 24 19.5 31 Z" fill="#2e2420"/>'+AV_EYES+AV_CHEEK+
    '<path d="M23.5 26.4 L29 27.6"'+ST+'/><path d="M35 27.6 L40.5 26.4"'+ST+'/><path d="M29 40.2 L35 40.2"'+ST+'/><circle cx="19.6" cy="37" r="1.5" fill="#e9b44c"/><circle cx="44.4" cy="37" r="1.5" fill="#e9b44c"/>',
  /* 子芸爸爸：短髮、眼鏡、生氣 */
  dad: avBg('#cfdbe7')+avShoulder('#5a7aa0')+AV_NECK+AV_FACE+
    '<path d="M21 36 C22 44 27 45.5 32 45.5 C37 45.5 42 44 43 36 C41 41.5 37 42.5 32 42.5 C27 42.5 23 41.5 21 36 Z" fill="#3b2a20" opacity=".1"/>'+
    '<path d="M19.5 30 C19 19 25 15.5 32 15.5 C40 15.5 45 19.5 44.5 30 C43 25 41 22 38 21 C34 23 27 23 22 22.5 C21 25 20 27 19.5 30 Z" fill="#2b2420"/>'+AV_EYES+
    '<circle cx="27" cy="32" r="4.3" stroke="#3b2a20" stroke-width="1.3" fill="none"/><circle cx="37" cy="32" r="4.3" stroke="#3b2a20" stroke-width="1.3" fill="none"/><path d="M31.3 32 L32.7 32" stroke="#3b2a20" stroke-width="1.3"/>'+
    '<path d="M23 26.4 L29.2 27.9"'+st(2)+'/><path d="M34.8 27.9 L41 26.4"'+st(2)+'/><path d="M28.5 40.8 Q32 38.6 35.5 40.8"'+ST+'/>',
  /* 陳主任：西裝、領帶、方框眼鏡、嚴肅 */
  boss: avBg('#e4d8c9')+avShoulder('#3f4b5c')+'<path d="M26.5 47 L32 57 L37.5 47 Z" fill="#fff"/><path d="M30.6 48 L33.4 48 L34.3 58.5 L32 61 L29.7 58.5 Z" fill="#c8604f"/>'+AV_NECK.replace('height="8"','height="6"')+AV_FACE+
    '<path d="M19.5 30 C19 18 26 15 33 15 C41 15 45.5 20 44.5 30 C43 24 40 21.5 35 21 C30 21.5 25 22 21.5 25 C20.5 27 20 28.5 19.5 30 Z" fill="#3d3733"/><path d="M35 15.5 C39 16.5 42 18.5 43.5 22" stroke="#9a9590" stroke-width="1.6" fill="none" stroke-linecap="round"/>'+AV_EYES+
    '<rect x="22.6" y="29.2" width="8.6" height="5.8" rx="1.6" stroke="#3b2a20" stroke-width="1.3" fill="none"/><rect x="32.8" y="29.2" width="8.6" height="5.8" rx="1.6" stroke="#3b2a20" stroke-width="1.3" fill="none"/>'+
    '<path d="M23 26.1 L29.6 27.4"'+st(2.1)+'/><path d="M34.4 27.4 L41 26.1"'+st(2.1)+'/><path d="M28.6 40.3 L35.4 40.3"'+ST+'/>',
  /* 王老師：燙捲髮、珍珠耳環、招牌假笑 */
  wang: avBg('#f3d2d8')+
    '<g fill="#5a3426"><circle cx="20" cy="31" r="5"/><circle cx="19" cy="24" r="5"/><circle cx="23" cy="17.5" r="5.5"/><circle cx="30" cy="13.8" r="6"/><circle cx="38" cy="14.2" r="6"/><circle cx="44.2" cy="19" r="5.5"/><circle cx="46" cy="26" r="5"/><circle cx="45" cy="33" r="4.6"/><circle cx="18.8" cy="36.5" r="4"/><circle cx="45.4" cy="38" r="3.8"/></g>'+
    avShoulder('#b85c6e')+AV_NECK+AV_FACE+
    '<g fill="#5a3426"><circle cx="24.5" cy="20.5" r="4.2"/><circle cx="31" cy="18.6" r="4.4"/><circle cx="37.6" cy="19.6" r="4.2"/><circle cx="42" cy="23" r="3.2"/><circle cx="21.6" cy="24" r="3"/></g>'+AV_CHEEK+
    '<path d="M24.4 32 Q27 29.6 29.6 32"'+ST+'/><path d="M34.4 32 Q37 29.6 39.6 32"'+ST+'/><path d="M24 27 Q27 25.4 30 26.8"'+st(1.4)+'/><path d="M34 26.8 Q37 25.4 40 27"'+st(1.4)+'/>'+
    '<path d="M26.4 38.4 Q32 45 37.6 38.4 Q32 40.6 26.4 38.4 Z" fill="#c8473a"/><circle cx="19.6" cy="37.4" r="1.7" fill="#fffaf0" stroke="#d8c2a8" stroke-width=".6"/><circle cx="44.4" cy="37.4" r="1.7" fill="#fffaf0" stroke="#d8c2a8" stroke-width=".6"/>'+
    '<g fill="#fffaf0"><circle cx="27" cy="50.5" r="1.3"/><circle cx="29.5" cy="52" r="1.3"/><circle cx="32" cy="52.5" r="1.3"/><circle cx="34.5" cy="52" r="1.3"/><circle cx="37" cy="50.5" r="1.3"/></g>',
  /* 林老師：馬尾、溫和 */
  lin: avBg('#d4ebe2')+'<path d="M42 21 C51 21 54 32 50.5 43 C48 37 46 32 42.5 29.5 Z" fill="#3b2a20"/>'+avShoulder('#6aa38f')+AV_NECK+AV_FACE+
    '<path d="M19.5 31 C19 19 25 15 32 15 C39 15 45 19 44.5 31 C43 25 39 21.5 33 21 C28 21.5 23 24 19.5 31 Z" fill="#3b2a20"/>'+AV_EYES+AV_CHEEK+
    '<path d="M24 27 Q26.8 25.8 29.4 26.8"'+st(1.4)+'/><path d="M34.6 26.8 Q37.2 25.8 40 27"'+st(1.4)+'/><path d="M28.5 39 Q32 42 35.5 39"'+ST+'/>',
  /* 陳老師：短髮、看熱鬧 */
  chen: avBg('#ecdfc6')+avShoulder('#a88d77')+AV_NECK+AV_FACE+
    '<path d="M19.6 29.5 C19.5 19 25 15.5 32 15.5 C39 15.5 44.6 19 44.4 29.5 C42 23.5 38 21.5 32 21.5 C26 21.5 22 23.5 19.6 29.5 Z" fill="#4a3a2e"/>'+AV_EYES+
    '<path d="M24 27.2 L29.2 27.2"'+st(1.5)+'/><path d="M34.8 27.2 L40 27.2"'+st(1.5)+'/><path d="M29.5 40.3 Q32 41.2 34.5 40.3"'+ST+'/>',
  /* 群組 */
  group: avBg('#f2dcbf')+'<path d="M14 22 Q14 15 21 15 H39 Q46 15 46 22 V31 Q46 38 39 38 H27 L19.5 44 L21 38 Q14 37.5 14 31 Z" fill="#e9862c"/>'+
    '<path d="M30 33 Q30 28 35 28 H46 Q51 28 51 33 V39 Q51 44 46 44 L47 49 L41.5 44 H35 Q30 44 30 39 Z" fill="#fffaf3" stroke="#3b2a20" stroke-width="1.2"/>'+
    '<g fill="#fffaf3"><circle cx="23" cy="26.5" r="1.8"/><circle cx="30" cy="26.5" r="1.8"/><circle cx="37" cy="26.5" r="1.8"/></g>'
};
var AV_EMOJI = { '👩':'mom1', '🧕':'mom2', '👨':'dad', '🧑‍💼':'boss', '👩‍🏫':'wang', '🧑‍🏫':'lin', '👨‍🏫':'chen', '💬':'group' };
function avKey(v){ return AV[v] ? v : AV_EMOJI[v]; }
/* 頁面上用 <use> 引用同一份圖，節省記憶體 */
function avh(v){
  var k = avKey(v);
  if (!k) return esc(v || '');
  return '<svg class="avs" viewBox="0 0 64 64" aria-hidden="true"><use href="#av-'+k+'"/></svg>';
}
function avSvgString(v){ var k = avKey(v); return k ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128">'+AV[k]+'</svg>' : null; }
(function(){
  var s = '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">';
  for (var k in AV) s += '<symbol id="av-'+k+'" viewBox="0 0 64 64">'+AV[k]+'</symbol>';
  document.body.insertAdjacentHTML('afterbegin', s + '</svg>');
})();
