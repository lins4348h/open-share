// 範例劇本：走廊聊影集、圖書館外的走廊（出自《交朋友的 15 堂課》第 2 課「維持交談」）
const { LOOK, stage } = require('../engine/stage');

// ---------- 第一節：開放式問句與四個地雷（走廊，下課） ----------
const A = stage({ zhe: ['小哲', LOOK.zhe, 560, 'l'], yu: ['小瑜', LOOK.yu, 1040, 'r'] });
const both = A.spot('zhe', 'yu');
const talkNG = {
  set: 'hallway', cast: A.cast,
  beats: [
    { cap: '下課，小哲在走廊遇到同班的小瑜。' },
    { spot: both, say: A.say('zhe', '你有看那部推理影集嗎？') },
    { say: A.say('yu', '有。') },
    { clear: true, say: A.say('zhe', '好看嗎？') },
    { say: A.say('yu', '還不錯。'), cap: '對話停住了，兩個人都不知道要說什麼。' },
    { clear: true, expr: { yu: 'happy' }, say: A.say('yu', '我覺得第一季最好看！') },
    { expr: { yu: 'surprised' }, say: A.say('zhe', '拜託，大家都知道第三季才是神作。') },
    { clear: true, expr: { yu: 'neutral' }, say: A.say('yu', '……我新買了耳機，追劇超爽。') },
    { expr: { zhe: 'excited', yu: 'annoyed' }, say: A.say('zhe', '那款很普通啦，我的是旗艦款，貴兩倍。') },
    { clear: true, expr: { yu: 'tired' }, say: A.say('yu', '昨天我跟我哥去看了電影版。') },
    { say: A.say('zhe', '都幾歲了還跟哥哥出去喔？') },
    { clear: true, spot: A.spot('zhe', 1420), pos: { yu: [1420, 690] }, expr: { zhe: 'neutral', yu: 'annoyed' }, say: A.say('yu', '……我先去上廁所。', 1420), cap: '小瑜找理由走開了。' },
    // 倒帶
    { clear: true, spot: 'all', pos: { yu: [1040, 690] }, expr: { zhe: 'neutral', yu: 'neutral' }, cap: '倒帶！剛剛哪裡出問題？' },
    { spot: both, say: A.say('zhe', '你有看那部推理影集嗎？'), ng: '錯誤①', cap: '只問「有沒有」「好不好」：封閉式問句' },
    { clear: true, expr: { yu: 'surprised' }, say: A.say('zhe', '拜託，大家都知道第三季才是神作。'), ng: '錯誤②', cap: '對方說自己的看法，馬上反駁：好辯' },
    { clear: true, expr: { zhe: 'excited', yu: 'annoyed' }, say: A.say('zhe', '那款很普通啦，我的是旗艦款，貴兩倍。'), ng: '錯誤③', cap: '把話題搶回自己身上：自誇' },
    { clear: true, expr: { zhe: 'neutral', yu: 'tired' }, say: A.say('zhe', '都幾歲了還跟哥哥出去喔？'), ng: '錯誤④', cap: '拿對方的事開玩笑：挖苦' },
    { clear: true, spot: 'all', cap: '四個錯誤：對方不想再聊下去。' },
  ],
};
const talkOK = {
  set: 'hallway', cast: A.cast,
  beats: [
    { cap: '同一個下課，小哲再試一次。' },
    { spot: both, say: A.say('zhe', '你最近在追哪一部影集？'), ok: '開放式問句', cap: '問「哪一部」「怎麼樣」，對方可以多說幾句' },
    { expr: { yu: 'happy' }, say: A.say('yu', '一部推理劇，主角超聰明！而且配樂超好聽。') },
    { clear: true, say: A.say('zhe', '配樂？你平常也會聽劇裡的歌嗎？'), ok: '抓關鍵字', cap: '從對方的話裡抓一個新詞「配樂」，開下一個話題' },
    { expr: { yu: 'excited' }, say: A.say('yu', '會啊！我的歌單都是配樂。我覺得第一季的最好聽。') },
    { clear: true, expr: { zhe: 'happy' }, say: A.say('zhe', '我比較喜歡第三季耶。第一季哪一首最好聽？'), ok: '不好辯', cap: '說自己的看法，也問對方的看法' },
    { say: A.say('yu', '片頭曲！我傳給你聽。') },
    { clear: true, spot: 'all', ok: '找到共同話題', cap: '兩個人都喜歡推理劇和配樂' },
  ],
};

// ---------- 第二節：自己控制的三件事＋四步循環（圖書館外的走廊） ----------
const B = stage({ zhe: ['小哲', LOOK.zhe, 560, 'l'], ting: ['婷婷', LOOK.ting, 1040, 'r'] });
const both2 = B.spot('zhe', 'ting');
const NEAR = 880;
const quietNG = {
  set: 'hallway', cast: B.cast,
  beats: [
    { cap: '圖書館外的走廊，大家都很安靜。小哲遇到同學婷婷。' },
    { spot: both2, expr: { zhe: 'excited', ting: 'surprised' }, say: B.say('zhe', '婷婷！！妳也來借書喔！！（很大聲）') },
    { clear: true, pos: { zhe: [NEAR, 690] }, spot: B.spot(NEAR, 'ting'), expr: { ting: 'worried' }, say: B.say('zhe', '妳借什麼書？給我看！', NEAR - 120) },
    { say: B.say('ting', '呃……一本小說。') },
    { clear: true, expr: { ting: 'tense' }, think: B.think('ting', '他好近……好想往後退。'), cap: '小哲一直盯著婷婷，眼睛都不眨。' },
    { clear: true, expr: { zhe: 'excited', ting: 'tired' }, say: B.say('zhe', '小說喔！我跟妳說我最近看的那本，主角一開始……', NEAR - 120) },
    { clear: true, spot: B.spot(NEAR, 1420), pos: { ting: [1420, 690] }, expr: { zhe: 'neutral', ting: 'annoyed' }, say: B.say('ting', '我、我要進去還書了。', 1420), cap: '婷婷趕快走進圖書館。' },
    // 倒帶
    { clear: true, spot: 'all', pos: { zhe: [560, 690], ting: [1040, 690] }, expr: { zhe: 'neutral', ting: 'neutral' }, cap: '倒帶！剛剛哪裡出問題？' },
    { spot: both2, expr: { zhe: 'excited', ting: 'surprised' }, say: B.say('zhe', '婷婷！！妳也來借書喔！！（很大聲）'), ng: '錯誤①', cap: '在安靜的地方大聲說話：音量沒控制好' },
    { clear: true, pos: { zhe: [NEAR, 690] }, spot: B.spot(NEAR, 'ting'), expr: { zhe: 'neutral', ting: 'worried' }, ng: '錯誤②', cap: '一下子靠到肩膀旁邊：距離太近' },
    { expr: { ting: 'tense' }, ng: '錯誤③', cap: '一直盯著看，眼睛都不眨：眼神太用力' },
    { expr: { zhe: 'excited', ting: 'tired' }, say: B.say('zhe', '我跟妳說我最近看的那本……', NEAR - 120), ng: '錯誤④', cap: '沒聽對方說、也沒問問題：四步循環斷掉了' },
    { clear: true, spot: 'all', pos: { zhe: [560, 690] }, expr: { zhe: 'neutral' }, cap: '四個錯誤：對方只想趕快走。' },
  ],
};
const quietOK = {
  set: 'hallway', cast: B.cast,
  beats: [
    { cap: '同一個走廊，小哲再試一次。' },
    { spot: both2, say: B.say('zhe', '嗨，妳也來借書？（小小聲）'), ok: '音量', cap: '在安靜的地方，放低音量' },
    { ok: '距離', cap: '站在大約一個手臂遠的地方' },
    { expr: { ting: 'happy' }, say: B.say('ting', '對啊，我在找推理小說。') },
    { clear: true, say: B.say('zhe', '推理小說？妳最喜歡哪一本？'), ok: '聆聽＋問', cap: '聽到「推理」，問一個開放式問句' },
    { say: B.say('ting', '一本偵探小說，結局超意外！') },
    { clear: true, expr: { zhe: 'happy' }, say: B.say('zhe', '我也喜歡結局大反轉的！上週看的電影也是。'), ok: '分享＋眼神', cap: '分享自己的經驗，眼神自然地看著對方' },
    { expr: { ting: 'excited' }, say: B.say('ting', '哪一部？我也想看！'), ok: '延伸', cap: '對方接著問，對話自然轉下去' },
  ],
};

const PAIRS = [
  { id: 'talk', part: 0, before: 1, after: 2, min: [5, 4], take: { 1: 2, 2: 3, 3: 4 }, pt: [1, 2],
    ng: talkNG, ok: talkOK, replay: 12, picNG: 6, picOK: 3,
    label: '走廊聊影集', titleNG: '走廊聊影集：小哲一直踩地雷', titleOK: '走廊聊影集：小哲再試一次',
    skill: '開放式問句和四個地雷', unit: '技巧', who: '小哲', other: '小瑜', pron: '她',
    okDesc: '同一個下課，小哲用開放式問句、抓關鍵字，也不踩地雷' },
  { id: 'quiet', part: 1, before: 1, after: 2, min: [5, 4], take: { 1: 2, 2: 1, 3: 6 }, pt: [3, 4],
    ng: quietNG, ok: quietOK, replay: 7, picNG: 2, picOK: 4,
    label: '圖書館外的走廊', titleNG: '圖書館外的走廊：太大聲、太近、一直盯著看', titleOK: '圖書館外的走廊：小哲再試一次',
    skill: '音量、距離、眼神和四步循環', unit: '技巧', who: '小哲', other: '婷婷', pron: '她',
    okDesc: '同一個走廊，小哲控制音量、距離、眼神，並且聆聽、問、分享、延伸' },
];

module.exports = { talkNG, talkOK, quietNG, quietOK, PAIRS };
