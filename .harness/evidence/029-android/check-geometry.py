"""Validate frozen native UI measurements from the synthetic task 029 fixture."""
import xml.etree.ElementTree as E
import re,json
from pathlib import Path
root=Path('.harness/evidence/029-android')
result={}
for file in ['today-before','today-after','insights-before','insights-after','year-before','year-after','today-large-after']:
 cells=[]
 for n in E.parse(root/(file+'.xml')).iter('node'):
  a=n.attrib;desc=a.get('content-desc','');rid=a.get('resource-id','')
  if file.startswith('today'):
   keep=bool(re.search(r'\d\d/\d\d/\d{4}:',desc)) and ('Little reading' in desc or 'Read one page' in desc or 'quiet moment' in desc)
  elif file.startswith('insights'):
   keep=rid.startswith('insights-day-')
  else:keep=rid.startswith('day-2026-10-')
  if keep:
   x1,y1,x2,y2=map(int,re.findall(r'\d+',a['bounds']));cells.append({'label':desc,'bounds':a['bounds'],'width':x2-x1,'height':y2-y1})
 sizes=sorted(set((c['width'],c['height']) for c in cells));result[file]={'count':len(cells),'sizes':sizes,'today':[c for c in cells if ', today' in c['label'] or ', hoje' in c['label']], 'cells':cells}
 if file in ['today-after','today-large-after']:assert len(cells)==14
 if file=='today-large-after':assert any(', com nota' in c['label'] for c in cells)
 if file.endswith('after'):
  assert cells
  assert all(abs(c['width']-c['height'])<=1 for c in cells),(file,sizes)
  assert max(c['width'] for c in cells)-min(c['width'] for c in cells)<=1,(file,sizes)
  assert max(c['height'] for c in cells)-min(c['height'] for c in cells)<=1,(file,sizes)
 print(file,len(cells),sizes)
(root/'geometry.json').write_text(json.dumps(result,indent=2)+'\n')
