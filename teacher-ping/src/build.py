# 把 src/ 組成單一 HTML：python3 build.py
#   ../dist/index.html     → 拖到 Netlify 的上線檔（完整 HTML）
#   ../dist/artifact.html  → Claude 預覽用（不含 doctype/head/body 外框）
import os
here = os.path.dirname(os.path.abspath(__file__))
r = lambda p: open(os.path.join(here, p), encoding='utf-8').read()
js = "var SCEN = {};\n" + "\n".join(r(f) for f in ['data_parent.js', 'data_boss.js', 'data_col.js', 'avatars.js', 'hero.js', 'app.js'])
css = r('style.css')
head = '''<title>老師，在嗎？</title>
<meta name="description" content="引路人・教師職場情境遊戲。下班了，手機還在響：選一個人，走完 6 回合，每則回覆只有 20 秒。顧對方、顧自己、守原則，每種回法都有代價。玩完看八面玲瓏範本。">
<meta property="og:title" content="老師，在嗎？｜引路人教師職場情境遊戲">
<meta property="og:description" content="下班了，手機還在響。6 回合、每則 20 秒，你會怎麼回？">
<meta name="theme-color" content="#2a1d16">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC:wght@400;700&family=Noto+Sans+TC:wght@400;500;700;900&family=DM+Mono:wght@400;500&display=swap">
'''
body = '<div id="site"></div>\n<div id="stage"></div>\n<div class="toast" id="toast" role="status" aria-live="polite"></div>\n<script>\n' + js + '\n</script>\n'
full = ('<!doctype html>\n<html lang="zh-Hant">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        + head + '<style>\n' + css + '\n</style>\n</head>\n<body>\n' + body + '</body>\n</html>\n')
art = head + '<style>\n' + css + '\n</style>\n' + body
dist = os.path.join(here, '..', 'dist')
os.makedirs(dist, exist_ok=True)
open(os.path.join(dist, 'index.html'), 'w', encoding='utf-8').write(full)
open(os.path.join(dist, 'artifact.html'), 'w', encoding='utf-8').write(art)
print('dist/index.html', len(full) // 1024, 'KB')
