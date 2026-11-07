// 角色外觀、站位與泡泡位置的小工具（畫面元件見 engine/scene.js）
const UNI = { top: '#f4f6fa', bottom: '#2f3a5a' };
const LOOK = {
  // 制服（上學時）
  zhe: { ...UNI, hair: 'short', hairColor: '#2a2018', skin: '#f2c9a5' },
  an: { ...UNI, hair: 'bob', hairColor: '#3a2a20', skin: '#f4cfae' },
  kai: { ...UNI, hair: 'side', hairColor: '#1f1a17', skin: '#eec39e' },
  yu: { ...UNI, hair: 'pony', hairColor: '#2a2018', skin: '#f2c9a5' },
  ting: { ...UNI, hair: 'bun', hairColor: '#4a3426', skin: '#efc4a0' },
  hao: { ...UNI, hair: 'short', hairColor: '#4a3426', skin: '#e6b892', glasses: true },
  wei: { ...UNI, hair: 'side', hairColor: '#2a2018', skin: '#f4cfae' },
  qiang: { ...UNI, hair: 'cap', hairColor: '#3b4a5c', skin: '#e6b892' },   // 阿強：霸凌單元裡嘲笑人的角色
  teacher: { top: '#e9eef4', bottom: '#3b3f4a', vest: '#5b6876', hair: 'short', hairColor: '#4a4644', glasses: true, skin: '#eec39e' },
  // 便服（放學後、假日）
  zheC: { top: '#5b9338', bottom: '#3b3f4a', hair: 'short', hairColor: '#2a2018', skin: '#f2c9a5' },
  anC: { top: '#c45d7a', bottom: '#3b3f4a', hair: 'bob', hairColor: '#3a2a20', skin: '#f4cfae' },
  kaiC: { top: '#3b7fb8', bottom: '#2f3540', hair: 'side', hairColor: '#1f1a17', skin: '#eec39e' },
  yuC: { top: '#e8894a', bottom: '#3f4a5c', hair: 'pony', hairColor: '#2a2018', skin: '#f2c9a5' },
  tingC: { top: '#7160b0', bottom: '#3b3f4a', hair: 'bun', hairColor: '#4a3426', skin: '#efc4a0' },
  haoC: { top: '#f2c94c', bottom: '#2f3540', hair: 'short', hairColor: '#4a3426', skin: '#e6b892', glasses: true },
};
const BY = 262;   // 泡泡底部的高度（剛好在頭頂上方）

// 建一組角色：def = { key: [名字, 外觀, x, 泡泡方向 'l'|'r'|'up', 其他設定] }
// 方向 l：人在左邊，泡泡往左長；r：人在右邊，泡泡往右長
function stage(def) {
  const cast = {};
  const side = {};
  Object.entries(def).forEach(([k, [name, look, x, sd, extra]]) => {
    cast[k] = { name, x, y: 690, s: 0.92, look, ...(extra || {}) };
    side[k] = sd || 'up';
  });
  const at = (k, x) => {
    const cx = x != null ? x : cast[k].x;
    // 太靠右邊的人，泡泡改往左長；太靠左邊的人，泡泡改往右長，才不會超出畫面
    const sd = side[k] === 'r' && cx > 1150 ? 'l' : side[k] === 'l' && cx < 450 ? 'r' : side[k];
    return sd === 'l' ? ['ur', [cx + 60, BY]] : sd === 'r' ? ['ul', [cx - 60, BY]] : ['up', [cx, BY - 10]];
  };
  return {
    cast,
    say: (k, text, x) => { const [pl, pos] = at(k, x); return [k, text, pl, pos]; },
    think: (k, text, x) => { const [pl, pos] = at(k, x); return [k, text, pl, pos]; },
    // 聚光燈：照到指定的人（也可以給 x 座標）
    spot: (...ks) => {
      const xs = ks.map(k => (typeof k === 'number' ? k : cast[k].x));
      const lo = Math.min(...xs), hi = Math.max(...xs);
      return [(lo + hi) / 2, 400, (hi - lo) / 2 + 220, 340];
    },
  };
}

module.exports = { LOOK, stage, BY };
