"""Export an explicit public allowlist; never copy the private project wholesale."""
from pathlib import Path
import re,json,base64,hashlib,shutil,zipfile,subprocess
SITE=Path(__file__).resolve().parents[1];ROOT=SITE.parent;PUB=SITE/'public';GUIDE=ROOT/'docs/build-guide'
for scene in ['hip','right','left','body','full']:
 for ext in ['png','svg']:
  shutil.copy2(GUIDE/'img'/f'{scene}-exploded-cad.{ext}',PUB/'downloads'/f'{scene}-exploded-cad.{ext}')
for ver,stem in [('v1','preview'),('v2','filled')]:
 d=ROOT/'designs'/f'right-shin-unibody-{ver}'
 shutil.copy2(d/f'right-shin-unibody-{stem}.stl',PUB/'downloads'/f'right-shin-{ver}.stl')
 shutil.copy2(d/f'right-shin-unibody-{stem}.png',PUB/'assets'/f'shin-{ver}.png')
 shutil.copy2(d/'geometry-check.json',PUB/'downloads'/f'shin-{ver}-geometry.json')
shutil.copy2(ROOT/'Open_Duck_Mini/LICENSE',PUB/'downloads/LICENSE-Open-Duck-Mini.txt')
shutil.copy2(GUIDE/'vendor/three-0.160.1.min.js',PUB/'assets/three.min.js')
# Extract embedded reference images to public image files, keeping source imagery attribution.
s=(GUIDE/'leg-assembly.html').read_text()
def extract(m):
 raw=base64.b64decode(m[2]);ext={'png':'png','jpeg':'jpg','webp':'webp'}[m[1]]
 name=hashlib.sha256(raw).hexdigest()[:16]+'.'+ext
 (PUB/'assets/assembly'/name).write_bytes(raw)
 return '/assets/assembly/'+name
s=re.sub(r'data:image/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)',extract,s)
# Keep CAD data inline so the assembled guide also survives network module failures.
s=s.replace('href="duck-checklist.html"','href="/checklist.html"').replace('href="battery-wiring.html"','href="/guide/#power"')
s=s.replace('href="img/','href="/downloads/').replace('src="img/','src="/downloads/')
s=s.replace('OPEN DUCK MINI V2</','<a href="/">小鴨製造所 / 回首頁</a></')
s=s.replace('David','建造者')
s=s.replace('</footer>','<p><a href="/sources/">資料來源與授權</a> · 本圖是 CAD 零位，實物狀態請見建造日誌。</p></footer>')
s=s.replace('</head>','<link rel="canonical" href="https://microduck.intemotech.com/assembly"/><meta name="robots" content="index,follow,max-image-preview:large"/></head>',1)
(PUB/'assembly.html').write_text(s)
# Create a reader-owned checklist. Original builder progress is never inherited.
s=(GUIDE/'duck-checklist.html').read_text()
s=s.replace('leg-assembly.html','/assembly.html').replace('battery-wiring.html','/guide/#power').replace('servo-acceptance-log.md','/downloads/servo-acceptance-log.md').replace('batch0-holes.html','/guide/#printing')
# Checklist embeds its baseline in a JSON script; sanitize it before publishing.
pattern=r'(<script[^>]*type="application/json"[^>]*>)(.*?)(</script>)'
found=re.search(pattern,s,re.S)
if not found:
 pattern=r'(<script[^>]*id="[^"]+"[^>]*>)(\{.*?\})(</script>)';found=re.search(pattern,s,re.S)
assert found,'Find embedded checklist data before publishing'
data=json.loads((SITE/'scripts/reader-checklist.json').read_text())
for section in data['sections']:
 for item in section['items']:
  item['status']='todo';item['evidence']='參考本站重現指南與官方文件；請記錄自己的實測'
  item['title']=item['title'].replace('装','裝');item['detail']=item['detail'].replace('安装','安裝')
s=s[:found.start(2)]+json.dumps(data,ensure_ascii=False)+s[found.end(2):]
s=s.replace('接著把右腿組起來。','你的建造 checklist。').replace('今天先做','開始之前')
s=re.sub(r'<section class="today">.*?</section>','<div class="today"><strong>從自己的實測開始</strong><p>這份清單初始全部未完成。勾選與備註只保存在此瀏覽器；換裝置請先匯出 JSON。</p></div>',s,flags=re.S)
s=re.sub(r'<p class="intro">.*?</p>','<p class="intro">為重現者準備的建造清單。所有項目初始未完成，依自己的實測勾選並保留備註。</p>',s,flags=re.S)
s=s.replace('同資料夾的 build-checklist.md','重現指南 /guide/').replace('OPEN DUCK MINI V2</div>','<a href="/">小鴨製造所 / 回首頁</a></div>')
s=s.replace('2026-09-07-codex-v1' ,'public-reader-v1-2026-09-08').replace('David','建造者')
s=s.replace('handoff-codex-2026-09-07.md','/sources').replace('build-checklist.md','/downloads/reader-checklist.md').replace('build-status.json','/downloads/reader-baseline.json')
s=s.replace('</head>','<link rel="canonical" href="https://microduck.intemotech.com/checklist"/><meta name="robots" content="index,follow,max-image-preview:large"/></head>',1)
(PUB/'checklist.html').write_text(s)
(PUB/'downloads/reader-baseline.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
lines=['# 你的 Open Duck Mini v2 建造清單','所有項目從未完成開始，請依自己的實測填寫。','']
for sec in data['sections']:
 lines.extend(['## '+sec['title'],sec['note'],''])
 for item in sec['items']:lines.extend(['- [ ] '+item['title'],'  '+item['detail'],''])
(PUB/'downloads/reader-checklist.md').write_text('\n'.join(lines))
log=(GUIDE/'servo-acceptance-log.md').read_text().replace('David','建造者').replace('腳本 `sim/servo/servo_check.py`(Pi `~/duck_tools/`)。','本次建造的舵機驗收紀錄；量測為個別實測值。')
(PUB/'downloads/servo-acceptance-log.md').write_text(log)
# Reproducible modification bundle: only the three required source meshes and scripts.
source=ROOT/'Open_Duck_Mini/mini_bdx/robots/open_duck_mini_v2'
readme='''# 小腿一體件重現包

上游：apirrone/Open_Duck_Mini，commit b23317a485b3cec7d8417f352478778b3475173c。
本包僅含右小腿所需三個 CAD 網格、URDF、重建程式與 Apache-2.0 授權。CAD 網格單位為公尺，腳本依 URDF 裝配後轉為毫米；不可再額外乘 1000。

修改日期 2026-09-08：v1 合併兩片薄板＋spacer，spacer 兩端各延伸 0.25mm；v2 補滿中央固定孔與沉孔。兩版均未完成實物裝入與列印驗證。

## 重建（Python 3.11）

```sh
python3.11 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python sim/print/build_shin_unibody.py
.venv/bin/python sim/print/build_shin_unibody_filled.py
```

輸出位於 designs/right-shin-unibody-v1 與 v2。STL、PNG 與 geometry-check.json 一起生成。圖形字型只影響圖片外觀，不影響 STL。

build_assembly_data.py 在本包中僅提供 tf、ROOT、SOURCE，不能單独執行完整全機生成（其餘全機網格請從上游取得）。
'''
req=subprocess.check_output([str(ROOT/'Open_Duck_Playground/.venv/bin/python'),'-c','import importlib.metadata as m;print("\\n".join(n+"=="+m.version(n) for n in ["numpy","scipy","trimesh","matplotlib","rtree"]))'],text=True)
with zipfile.ZipFile(PUB/'downloads/shin-reproduction.zip','w',zipfile.ZIP_DEFLATED) as z:
 for f in ['build_assembly_data.py','build_shin_unibody.py','build_shin_unibody_filled.py']:
  z.write(ROOT/'sim/print'/f,'sim/print/'+f)
 for f in ['robot.urdf','leg_spacer.stl','left_knee_to_ankle_left_sheet.stl','left_knee_to_ankle_right_sheet.stl']:
  z.write(source/f,'Open_Duck_Mini/mini_bdx/robots/open_duck_mini_v2/'+f)
 z.write(ROOT/'Open_Duck_Mini/LICENSE','LICENSE')
 z.writestr('README.md',readme.replace('单独','單獨'));z.writestr('requirements.txt',req+'manifold3d==3.5.3\n')
(PUB/'downloads/shin-reproduction-README.md').write_text(readme.replace('单独','單獨'))
manifest={p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in (PUB/'downloads').iterdir() if p.is_file() and p.name!='manifest.json'}
(PUB/'downloads/manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False))
print('Public assets prepared. Assembly HTML bytes:',(PUB/'assembly.html').stat().st_size)
