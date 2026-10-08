import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {TINCTURES,DEFAULT_DESIGN,normalizeDesign,armsSVG,blazon,assessDesign} from '../src/lib/heraldry.js';
import {parseBlazon} from '../src/lib/blazon-parser.js';
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
