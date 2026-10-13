import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {TINCTURES,DEFAULT_DESIGN,normalizeDesign,armsSVG,chargeSVG,chargePlacements,blazon,assessDesign} from '../src/lib/heraldry.js';
import {parseBlazon} from '../src/lib/blazon-parser.js';
import {makeBibtex,makeRIS,makeCSL,citationKey} from '../src/lib/bibliography.js';
const dir=dirname(fileURLToPath(import.meta.url));
const read=(name)=>JSON.parse(readFileSync(resolve(dir,'../src/data/'+name+'.json'),'utf8'));

test('the seven main tinctures have meaningful categories',()=>{
  assert.equal(Object.keys(TINCTURES).length,7);
  assert.equal(TINCTURES.or.kind,'metal');
  assert.equal(TINCTURES.argent.kind,'metal');
  assert.equal(TINCTURES.gules.kind,'colour');
});

test('ordinary blazons have predictable grammar',()=>{
  assert.equal(blazon(DEFAULT_DESIGN),'Azure, on a fess Or three mullets Gules.');
  assert.equal(blazon({field:'or',secondary:'azure',division:'per-pale',ordinary:'none',charge:'none'}),'Per pale Or and Azure.');
  assert.match(blazon({ordinary:'none',charge:'martlet',count:1}),/a martlet/);
  assert.match(blazon({ordinary:'none',charge:'martlet',count:3}),/three martlets/);
});

test('malicious query parameters never become SVG instructions',()=>{
  const d=normalizeDesign({field:'<script>',ordinary:'"><svg onload=alert(1)>',charge:'strange',count:999});
  assert.equal(d.field,DEFAULT_DESIGN.field);
  assert.equal(d.ordinary,DEFAULT_DESIGN.ordinary);
  assert.equal(d.charge,DEFAULT_DESIGN.charge);
  assert.equal(d.count,3);
  assert.doesNotMatch(armsSVG(d,'safe'),/<script|onload=/i);
});

test('generated SVG is namespace-qualified and its clip ID is unique',()=>{
  const a=armsSVG(DEFAULT_DESIGN,'specimen-a');
  const b=armsSVG(DEFAULT_DESIGN,'specimen-b');
  assert.match(a,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(a,/id="clip-specimen-a"/);
  assert.match(b,/id="clip-specimen-b"/);
  assert.match(a,/<\/svg>$/);
});

test('martlets face viewer left and an Argent martlet has a visible eye',()=>{
  const image=chargeSVG('martlet','argent',50,50);
  assert.ok(image.includes('transform="scale(-1 1)"'));
  assert.ok(image.includes('fill="#1b2d32" stroke="none"'));
});

const polygonPoints=svg=>[...svg.matchAll(/<polygon points="([^"]+)"/g)].map(match=>match[1].split(' ').map(pair=>pair.split(',').map(Number)));

test('mullet visible bounds are centered on the requested placement',()=>{
  const svg=chargeSVG('mullet','gules',75,25,26);
  const points=polygonPoints(svg)[0];
  const offset=Number(svg.match(/<g transform="translate\(0 ([^)]+)\)"/)[1]);
  const scale=Number(svg.match(/scale\(([^)]+)\)/)[1]);
  const ys=points.map(point=>point[1]);
  assert.ok(Math.abs((Math.min(...ys)+Math.max(...ys))/2+offset)<.001,'The star silhouette must not sit above its anchor');
  assert.ok((Math.max(...ys)-Math.min(...ys)+1.1)*scale<=26.001,'Outlined artwork must fit its specified size');
});

test('bend and bend sinister are mirror images with charges centered inside their bands',()=>{
  const bend=polygonPoints(armsSVG({ordinary:'bend',charge:'none'}))[0];
  const sinister=polygonPoints(armsSVG({ordinary:'bend-sinister',charge:'none'}))[0];
  for(let i=0;i<bend.length;i++){
    assert.ok(Math.abs(bend[i][0]+sinister[i][0]-150)<.001);
    assert.equal(bend[i][1],sinister[i][1]);
  }
  for(const ordinary of ['bend','bend-sinister'])for(const count of [1,3]){
    const polygon=ordinary==='bend'?bend:sinister;
    const top=(polygon[0][0]+polygon[1][0])/2;
    const bottom=(polygon[2][0]+polygon[3][0])/2;
    const halfWidth=Math.abs(polygon[1][0]-polygon[0][0])/2;
    const slope=(bottom-top)/174;
    for(const [x,y,size] of chargePlacements({ordinary,count})){
      assert.ok(Math.abs(x-(top+slope*y))<.001,'Charge center must follow the actual diagonal');
      for(const dx of [-size/2,size/2])for(const dy of [-size/2,size/2]){
        assert.ok(Math.abs(x+dx-(top+slope*(y+dy)))<halfWidth-1,'The entire charge box must have clearance from the band edges');
      }
    }
  }
});

test('saltire bands share their intersection with the central charge',()=>{
  const [a,b]=polygonPoints(armsSVG({ordinary:'saltire',charge:'none'}));
  const line=p=>({start:(p[0][0]+p[1][0])/2,slope:((p[2][0]+p[3][0])-(p[0][0]+p[1][0]))/(2*174)});
  const la=line(a),lb=line(b);
  const y=(lb.start-la.start)/(la.slope-lb.slope),x=la.start+la.slope*y;
  for(const count of [1,3]){
    const placements=chargePlacements({ordinary:'saltire',count});
    const center=placements[Math.floor(placements.length/2)];
    assert.ok(Math.abs(center[0]-x)<.001 && Math.abs(center[1]-y)<.001,'The middle charge must sit on the actual intersection');
  }
});

test('chevron charges fit the lowered chevron with a lower middle star',()=>{
  const points=polygonPoints(armsSVG({ordinary:'chevron',charge:'none'}))[0];
  const apex=points[2],inner=points[5],shoulder=points[3];
  const middle=(apex[1]+inner[1])/2;
  const slope=(shoulder[1]-apex[1])/(shoulder[0]-apex[0]);
  assert.ok(apex[1]>40,'The chevron should leave space above its apex');
  for(const count of [1,3])for(const [x,y,size] of chargePlacements({ordinary:'chevron',count})){
    const line=middle+Math.abs(x-apex[0])*slope;
    if(x===apex[0])assert.ok(y>line,'The middle star should sit slightly lower at the apex');
    else assert.ok(Math.abs(y-line)<.001,'The shoulder stars should stay centered on the arms');
    const star=chargeSVG('mullet','gules',x,y,size);
    const scale=Number(star.match(/scale\(([^)]+)\)/)[1]);
    const offset=Number(star.match(/<g transform="translate\(0 ([^)]+)\)"/)[1]);
    for(const [px,py] of polygonPoints(star)[0]){
      const vx=x+px*scale,vy=y+(py+offset)*scale;
      const rise=Math.abs(vx-apex[0])*slope;
      assert.ok(vy>apex[1]+rise && vy<inner[1]+rise,'The lowered star must remain within the chevron');
    }
  }
});

test('canonical URLs use heraldryproject.org',()=>{
  const config=readFileSync(resolve(dir,'../astro.config.mjs'),'utf8');
  assert.ok(config.includes('https://heraldryproject.org'));
});

test('contrast checker catches two basic violations',()=>{
  const good=assessDesign({field:'azure',ordinary:'fess',ordinaryTincture:'or',charge:'none'});
  const bad=assessDesign({field:'argent',ordinary:'fess',ordinaryTincture:'or',charge:'mullet',chargeTincture:'azure'});
  assert.equal(good.level,'good');
  assert.equal(bad.level,'caution');
  assert.match(bad.messages[0],/metal on metal/);
});

test('every curriculum unit has structured teaching, assessment and research',()=>{
  const lessons=read('course');
  assert.equal(lessons.length,12);
  const slugs=new Set();
  lessons.forEach((l,i)=>{
    assert.equal(l.number,i+1);
    assert.ok(!slugs.has(l.slug));slugs.add(l.slug);
    assert.ok(l.sections.length>=3 && l.sections.every(s=>s.paragraphs.length>=2));
    assert.ok(l.objectives.length>=3);
    assert.ok(l.exercise.prompt.length>50);
    assert.ok(l.reading.length>=1);
    assert.equal(l.quiz.length,3);
    l.quiz.forEach(q=>{assert.equal(q.choices.length,4);assert.ok(q.correct>=0 && q.correct<4);assert.ok(q.explanation.length>20);});
  });
});

test('the teaching armorial can render its entire collection',()=>{
  const examples=read('showcase');
  assert.ok(examples.length>=16);
  const slugs=new Set();
  examples.forEach((item,i)=>{
    assert.ok(!slugs.has(item.slug));slugs.add(item.slug);
    assert.match(armsSVG(item.design,'case-'+i),/^<svg/);
    assert.ok(!blazon(item.design).includes('undefined'));
  });
});

test('scholarly lexicon retains international and historical coverage',()=>{
  const entries=read('glossary');
  assert.ok(entries.length>=399,'The lexicon must remain more than an introductory glossary');
  const terms=entries.map(entry=>entry.term.normalize('NFKD').toLowerCase());
  assert.equal(new Set(terms).size,entries.length);
  for(const entry of entries){
    assert.ok(entry.term.trim().length>=2);
    assert.ok(entry.definition.trim().length>=20,entry.term);
    assert.ok(entry.category.trim().length>=3);
  }
  for(const category of ['Geometry','Tinctures','Charges','Language','Practice','Institutions','Comparative','Research']){
    assert.ok(entries.filter(x=>x.category===category).length>=10,category);
  }
  for(const term of ['martlet','merlette','fitchy','Wappenbuch','herbarz','kamon','sigillography','palaeography']){
    assert.ok(entries.some(x=>x.term.toLowerCase()===term.toLowerCase()),term);
  }
});

test('study-card route and sitemap support the expanded lexicon',()=>{
  const page=readFileSync(resolve(dir,'../src/pages/lexicon/study/index.astro'),'utf8');
  const sitemap=readFileSync(resolve(dir,'../src/pages/sitemap.xml.js'),'utf8');
  assert.match(page,/Review again/);
  assert.match(page,/heraldry/i);
  assert.match(sitemap,/\/lexicon\/study\//);
});

test('documented lexicon terms link to specific institutional sources with valid locators',()=>{
  const glossary=read('glossary');
  const sources=read('lexicon-sources');
  const attestations=read('lexicon-attestations');
  const terms=new Set(glossary.map(entry=>entry.term));
  const sourceIds=new Set(sources.map(source=>source.id));
  const entryNames=attestations.map(entry=>entry.term);
  assert.ok(glossary.length>=399);
  assert.ok(attestations.length>=100);
  assert.equal(new Set(entryNames).size,entryNames.length);
  assert.equal(sourceIds.size,sources.length);
  const allowed=new Set(['recorded-usage','institutional-context','institutional-explanation']);
  let links=0;
  for(const source of sources){
    assert.ok(source.url.startsWith('https://'),source.id);
    assert.ok(source.title.length>=15 && source.institution.length>=5,source.id);
    assert.ok(source.rightsNote.length>=25,source.id);
  }
  for(const entry of attestations){
    assert.ok(terms.has(entry.term),entry.term+' missing from glossary');
    assert.ok(entry.status.includes('pending'),entry.term+' requires review status');
    assert.ok(entry.links.length>0,entry.term);
    const seenSources=new Set();
    for(const link of entry.links){
      assert.ok(sourceIds.has(link.sourceId),entry.term+' points to missing source '+link.sourceId);
      assert.ok(!seenSources.has(link.sourceId),entry.term+' repeats '+link.sourceId);
      seenSources.add(link.sourceId);
      assert.ok(allowed.has(link.relationship),entry.term);
      assert.ok(link.locator.length>=15,entry.term+' lacks a locator');
      assert.ok(link.note.length>=30,entry.term+' lacks an editorial caveat');
      links++;
    }
    for(const related of entry.relatedTerms||[]){
      assert.ok(terms.has(related),entry.term+' links to undefined term '+related);
      assert.notEqual(related,entry.term);
    }
  }
  assert.ok(links>=160);
  const anchors=glossary.map(entry=>'term-'+entry.term.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''));
  assert.equal(new Set(anchors).size,anchors.length,'Term anchors must survive accent folding without collisions');
});

test('lexicon terms are unique and educationally useful',()=>{
  const glossary=read('glossary');
  assert.ok(glossary.length>=399);
  assert.equal(new Set(glossary.map(e=>e.term.toLowerCase())).size,glossary.length);
  assert.ok(glossary.every(e=>e.definition.length>25));
});

test('reference sources are annotated and use HTTPS',()=>{
  const sources=read('resources');
  assert.ok(sources.length>=10);
  assert.ok(sources.every(r=>r.url.startsWith('https://')&&r.description.length>20));
});

test('introductory blazons decode back to their teaching designs',()=>{
  for(const item of read('showcase')){
    const rendered=blazon(item.design);
    const result=parseBlazon(rendered);
    assert.equal(result.ok,true,rendered+' should be recognized: '+(result.error||''));
    assert.equal(result.canonical,rendered);
  }
});

test('decoder rejects unsupported complex constructions instead of guessing',()=>{
  assert.equal(parseBlazon('Or, a lion rampant Gules.').ok,false);
  assert.equal(parseBlazon('').ok,false);
  assert.equal(parseBlazon('<script>alert(1)</script>').ok,false);
});

test('monochrome SVG preserves armorial identity using traditional hatching patterns',()=>{
  const shield=armsSVG({field:'gules',ordinary:'fess',ordinaryTincture:'or',charge:'mullet',chargeTincture:'sable'},'hatched-specimen',true);
  assert.match(shield,/hatch-hatched-specimen-gules/);
  assert.match(shield,/hatch-hatched-specimen-or/);
  assert.match(shield,/hatch-hatched-specimen-sable/);
  assert.ok(shield.includes('<pattern'));
  assert.match(shield,/aria-label="Gules, on a fess Or/);
});

test('international source atlas has stable identifiers, institutions, provenance and source-language metadata',()=>{
  const sources=read('world-sources');
  assert.ok(sources.length>=22);
  assert.equal(new Set(sources.map(s=>s.id)).size,sources.length);
  assert.ok(new Set(sources.map(s=>s.area)).size>=13);
  assert.ok(new Set(sources.map(s=>s.language)).size>=11);
  sources.forEach(s=>{
    assert.ok(s.id.length>=5);
    assert.ok(s.url.startsWith('https://'));
    assert.ok(s.titleOriginal.length>5);
    assert.ok(s.holding.length>=5);
    assert.ok(s.englishSynopsis.length>160);
    assert.ok(s.reviewStatus.includes('review'));
    assert.ok(Array.isArray(s.glossary),s.id+' glossary must be an array');
    for(const item of s.glossary){assert.ok(typeof item.term==='string'&&item.term.trim()&&typeof item.english==='string'&&item.english.trim(),s.id+' must have meaningful terminology');}
  });
});

test('parallel excerpts are source-linked, limited, and clearly editorial translations',()=>{
  const sources=new Map(read('world-sources').map(s=>[s.id,s]));
  const readings=read('parallel-readings');
  assert.ok(readings.length>=7);
  assert.equal(new Set(readings.map(r=>r.id)).size,readings.length);
  readings.forEach(r=>{
    const source=sources.get(r.sourceId);
    assert.ok(source,r.id+' must cite a source in the atlas');
    assert.equal(r.language,source.language);
    assert.equal(r.url,source.url);
    assert.ok(r.original.length>8&&r.original.length<450);
    assert.ok(r.translation.length>12);
    assert.ok(r.analysis.length>170);
    assert.ok(r.assignment.length>100);
    assert.ok(r.locator.length>20);
    assert.ok(r.review.includes('editorial')||r.review.includes('English'));
  });
});

test('international chapters include original citations and documented advanced work',()=>{
  const sources=new Set(read('world-sources').map(s=>s.id));
  const directory=resolve(dir,'../src/content/traditions');
  const names=readdirSync(directory).filter(f=>f.endsWith('.md'));
  assert.ok(names.length>=13);
  names.forEach(name=>{
    const prose=readFileSync(resolve(directory,name),'utf8');
    const ids=prose.match(/^sourceIds:\s*(\[.*\])\s*$/m);
    assert.ok(ids,'Missing source IDs: '+name);
    JSON.parse(ids[1]).forEach(id=>assert.ok(sources.has(id),name+' refers to unknown source '+id));
    assert.ok(prose.split(/\s+/).length>600,name+' requires a substantive research chapter');
    assert.ok((prose.match(/^## /gm)||[]).length>=4);
    assert.ok((prose.match(/https:\/\//g)||[]).length>=2);
    assert.match(prose,/graduate/i);
  });
});

test('graduate seminar corpus remains sourced and curriculum-length',()=>{
  const sources=new Set(read('world-sources').map(s=>s.id));
  const directory=resolve(dir,'../src/content/seminars');
  const names=readdirSync(directory).filter(f=>f.endsWith('.md'));
  assert.ok(names.length>=6);
  names.forEach(name=>{
    const prose=readFileSync(resolve(directory,name),'utf8');
    const ids=prose.match(/^sourceIds:\s*(\[.*\])\s*$/m);
    assert.ok(ids,'Missing source IDs: '+name);
    JSON.parse(ids[1]).forEach(id=>assert.ok(sources.has(id),name+' refers to unknown source '+id));
    assert.ok(prose.split(/\s+/).length>700,name+' requires more depth');
    assert.ok((prose.match(/^## /gm)||[]).length>=4);
    assert.ok((prose.match(/https:\/\//g)||[]).length>=2);
    assert.match(prose,/(Graduate|graduate)/);
  });
});

test('every original-language source exports a usable individual citation',()=>{
  const sources=read('world-sources');
  sources.forEach(source=>{
    const bib=makeBibtex(source);
    const ris=makeRIS(source);
    const csl=makeCSL(source);
    assert.ok(bib.startsWith((source.recordType==='journal-article'?'@article{':'@misc{')+citationKey(source)+','));
    assert.ok(bib.includes(source.url));
    assert.ok(bib.includes('Accessed '+source.accessed));
    assert.ok(ris.startsWith('TY  - '+(source.recordType==='journal-article'?'JOUR':'GEN')));
    assert.ok(ris.includes('UR  - '+source.url));
    assert.ok(ris.endsWith('ER  - '));
    assert.equal(csl.id,citationKey(source));
    assert.equal(csl.URL,source.url);
    assert.equal(csl.language,source.language);
    assert.ok(csl.accessed['date-parts'][0][0]>=2026);
    if(source.publicationYear){assert.equal(csl.issued?.['date-parts']?.[0]?.[0],source.publicationYear);} else {assert.equal(csl.issued,undefined,'Do not invent publication dates for archival sources.');}
  });
});

test('the full bibliography links to a unique stable identifier for each source',()=>{
  const sources=read('world-sources');
  const bib=source=>makeBibtex(source);
  assert.equal(new Set(sources.map(citationKey)).size,sources.length);
  assert.ok(sources.every(s=>bib(s).includes('howpublished = {\\url{')));
});
