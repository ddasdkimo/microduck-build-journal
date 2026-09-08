from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,re,hashlib
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'dist/client'
class Links(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=set()
 def handle_starttag(self,t,a):
  d=dict(a)
  if 'id' in d:self.ids.add(d['id'])
  for k in ['href','src']:
   if k in d:self.links.append(d[k])
errors=[]
for f in OUT.rglob('*.html'):
 s=f.read_text();p=Links();p.feed(s)
 for link in p.links:
  u=urlsplit(link)
  if u.scheme or u.netloc or not u.path or u.path.startswith('data:'):continue
  loc=OUT/u.path.lstrip('/') if u.path.startswith('/') else f.parent/u.path
  candidates=[loc,loc.with_suffix('.html'),loc/'index.html']
  if not any(x.is_file() for x in candidates):errors.append((str(f.relative_to(OUT)),link))
 for banned in ['/Users/','192.168.','rai.mobile','ssh macstudio','BEGIN PRIVATE KEY','cf_api_token']:
  if banned in s:errors.append((str(f),banned))
for f in OUT.rglob('*'):
 if f.is_file() and f.stat().st_size>25*1024*1024:errors.append((str(f),'over 25 MiB'))
s=(OUT/'checklist.html').read_text();m=re.search(r'<script[^>]*id="statusData"[^>]*>(.*?)</script>',s,re.S);assert m
b=json.loads(m[1]);items=[i for sec in b['sections'] for i in sec['items']]
assert len(items)==len({i['id'] for i in items}) and all(i['status']=='todo' for i in items)
assert '已有證據的項目預先完成' not in s
for name,meta in json.loads((OUT/'downloads/manifest.json').read_text()).items():
 p=OUT/'downloads'/name;assert hashlib.sha256(p.read_bytes()).hexdigest()==meta['sha256']
assert not errors,errors
print(f'All static links and asset sizes pass. {len(items)} reader checklist items start empty. Download hashes pass.')
