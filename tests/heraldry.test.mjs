import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {TINCTURES,DEFAULT_DESIGN,normalizeDesign,armsSVG,chargeSVG,blazon,assessDesign} from '../src/lib/heraldry.js';
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
  assert.match(image,/transform="scale\\(-1 1\\)"/);
  assert.match(image,/fill="#1b2d32" stroke="none"/);
});

test('canonical URLs use heraldryproject.org',()=>{
  const config=readFileSync(resolve(dir,'../astro.config.mjs'),'utf8');
  assert.match(config,/https:\\/\\/heraldryproject\\.org/);
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

test('lexicon terms are unique and educationally useful',()=>{
  const glossary=read('glossary');
  assert.ok(glossary.length>=90);
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
    assert.ok(Array.isArray(s.glossary)&&s.glossary.length>=2);
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
    assert.ok(bib.startsWith('@misc{'+citationKey(source)+','));
    assert.ok(bib.includes(source.url));
    assert.ok(bib.includes('Accessed '+source.accessed));
    assert.ok(ris.startsWith('TY  - ELEC'));
    assert.ok(ris.includes('UR  - '+source.url));
    assert.ok(ris.endsWith('ER  - '));
    assert.equal(csl.id,citationKey(source));
    assert.equal(csl.URL,source.url);
    assert.equal(csl.language,source.language);
    assert.ok(csl.accessed['date-parts'][0][0]>=2026);
    assert.equal(csl.issued,undefined,'Do not invent publication dates for archival sources.');
  });
});

test('the full bibliography links to a unique stable identifier for each source',()=>{
  const sources=read('world-sources');
  const bib=source=>makeBibtex(source);
  assert.equal(new Set(sources.map(citationKey)).size,sources.length);
  assert.ok(sources.every(s=>bib(s).includes('howpublished = {\\url{')));
});
