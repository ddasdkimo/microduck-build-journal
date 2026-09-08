from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET
import json
ROOT=Path(__file__).resolve().parents[1]/'dist/client'
class Tags(HTMLParser):
 def __init__(self):super().__init__();self.meta={};self.links=[];self.ld=[];self.inld=False
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='meta':self.meta[d.get('name',d.get('property',''))]=d.get('content','')
  if t=='link':self.links.append(d)
  if t=='script' and d.get('type')=='application/ld+json':self.inld=True
 def handle_endtag(self,t):
  if t=='script':self.inld=False
 def handle_data(self,d):
  if self.inld:self.ld.append(json.loads(d))
urls=ET.parse(ROOT/'sitemap.xml').findall('{*}url/{*}loc')
assert len(urls)==12
for entry in urls:
 u=entry.text;path=urlsplit(u).path
 f=ROOT/('index.html' if path=='/' else path.lstrip('/')+'.html')
 p=Tags();p.feed(f.read_text())
 canonical=[l['href'] for l in p.links if l.get('rel')=='canonical']
 assert len(canonical)==1 and canonical[0].rstrip('/')==u.rstrip('/'),(u,canonical)
 assert 'noindex' not in p.meta.get('robots','')
 if path not in ['/assembly','/checklist']:
  assert p.meta['description'] and p.meta['og:image'] and p.meta['twitter:card']=='summary_large_image'
 if path.startswith('/articles/'):
  assert any(d.get('@type')=='Article' and d['mainEntityOfPage']==u for d in p.ld)
 if path in ['/downloads','/en/downloads']:
  assert {l.get('hreflang') for l in p.links if l.get('rel')=='alternate'}=={'en','zh-Hant','x-default'}
assert 'Allow: /' in (ROOT/'robots.txt').read_text()
print('PASS: 12 sitemap targets, canonical URLs, previews, article JSON-LD, language alternates and crawl controls.')
