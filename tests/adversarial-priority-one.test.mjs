import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {parseBlazon} from '../src/lib/blazon-parser.js';
import {blazon,chargeSVG} from '../src/lib/heraldry.js';

const read = path => readFileSync(new URL('../'+path,import.meta.url),'utf8');
const sources=JSON.parse(read('src/data/world-sources.json'));
const course=JSON.parse(read('src/data/course.json'));
const objects=JSON.parse(read('src/data/objects.json'));

test('CR-001: Oni section and its glossary identify legally specified ram horns',()=>{
  const ge=read('src/content/traditions/georgia.md');
  assert.match(ge,/No\. 19 of 23 July 2015/);
  assert.match(ge,/ram.s horns/);
  assert.doesNotMatch(ge,/modern use of a tur.s head/);
  assert.ok(sources.find(x=>x.id==='ge-history-2023')?.glossary.some(x=>x.term==='ვერძის რქები'));
});

test('CR-002: capstone lecture, page exercise, and quiz agree on two routes',()=>{
  const lesson=course.find(x=>x.slug==='reading-the-evidence');
  assert.match(lesson.exercise.prompt,/either a documented armorial witness or an original teaching design/);
  assert.match(lesson.exercise.prompt,/1,200–1,800/);
  assert.doesNotMatch(JSON.stringify(lesson),/300–500/);
  assert.match(lesson.sections.map(x=>x.paragraphs.join(' ')).join(' '),/Both routes/);
  const quiz=lesson.quiz[2];
  assert.match(quiz.choices[quiz.correct],/witness inventory/i);
  assert.match(lesson.exercise.prompt,/claim ledger/i);
  assert.doesNotMatch(quiz.choices[quiz.correct],/new shield/);
});

test('CR-003: operative 2026 Vatican law appears with correct replacement chronology',()=>{
  const chapter=read('src/content/traditions/catholic-heraldry.md');
  assert.match(chapter,/Fundamental Law of 31 July 2026/);
  assert.match(chapter,/article \*\*24\*\*/);
  assert.match(chapter,/Article \*\*25\*\*/);
  assert.ok(sources.some(x=>x.id==='cath-vatican-law-2026'));
  assert.match(sources.find(x=>x.id==='cath-vatican-law-2023').englishSynopsis,/superseded/);
});

test('CR-004 to CR-008: corrected historical attributions and shape',()=>{
  const pt=read('src/content/traditions/portugal.md');
  const lu=read('src/content/traditions/luxembourg.md');
  const br=read('src/content/traditions/brazil.md');
  const ro=read('src/content/traditions/romania.md');
  const ma=read('src/content/foundation/marshalling.md');
  assert.match(pt,/Arryet/);
  assert.match(pt,/D\. Carlos/);
  assert.doesNotMatch(pt,/named artist João do Cró/);
  assert.match(lu,/\*\*introduce\*\* a Bourbon-Parma inescutcheon/);
  assert.match(br,/eight towers, of which only five are visible/);
  assert.match(br,/1987/);
  assert.match(ro,/On the large blue shield stands a golden eagle/);
  assert.match(ro,/hatching conventions/);
  assert.match(ma,/lozenge with a small inescutcheon/);
  const halewyn=objects.find(x=>x.id==='halewyn-ghistele-enamel');
  assert.match(halewyn.alt,/lozenge/);
  assert.match(halewyn.alt,/inescutcheon/);
});

test('CR-009: Stowe description preserves armorial bearings rather than asserting quarterings',()=>{
  const stowe=objects.find(x=>x.id==='stowe-armorial');
  assert.match(stowe.title,/726 armorial bearings/);
  assert.doesNotMatch(stowe.summary,/726 quarterings/);
});

test('CR-011: cross crosslet SVG contains distinctive crossbars near four ends',()=>{
  const svg=chargeSVG('crosslet','gules',0,0,40);
  assert.match(svg,/M15 -22L6 -22L6 -26/);
  assert.match(svg,/L-22 -15L-22 -6/);
  assert.match(svg,/L-15 22L-6 22/);
  assert.match(svg,/L22 15L22 6/);
});

test('CR-012: ordinary divided field charges do not acquire fictitious overall placement',()=>{
  const design={field:'or',secondary:'gules',division:'quarterly',ordinary:'none',charge:'rose',chargeTincture:'argent',count:3};
  assert.equal(blazon(design),'Quarterly Or and Gules, three roses Argent.');
  const parsed=parseBlazon('Quarterly Or and Gules, three roses Argent.');
  assert.equal(parsed.ok,true,parsed.error);
  assert.equal(parsed.canonical,'Quarterly Or and Gules, three roses Argent.');
  const between=parseBlazon('Argent, a bend Azure between three mullets Gules.');
  assert.equal(between.ok,false);
  assert.match(between.error,/“Between” places charges beside an ordinary/);
  assert.doesNotMatch(between.error,/use.*on a/i);
  const overall=parseBlazon('Quarterly Or and Gules, overall three roses Argent.');
  assert.equal(overall.ok,false);
  assert.match(overall.error,/superimposition/);
});
