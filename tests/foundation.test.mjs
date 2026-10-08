import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {chapterWordCount} from '../src/lib/foundation.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const lessons = JSON.parse(readFileSync(root+'src/data/course.json','utf8'));
const folder = root+'src/content/foundation/';

test('each course route has exactly one corresponding expanded chapter',()=>{
  const files = readdirSync(folder).filter(file=>file.endsWith('.md'));
  assert.deepEqual(files.sort(),lessons.map(lesson=>lesson.slug+'.md').sort());
  for(const lesson of lessons){
    const chapter = readFileSync(folder+lesson.slug+'.md','utf8');
    assert.match(chapter,new RegExp('^unit: '+lesson.number+'$','m'),lesson.slug);
    assert.ok(chapterWordCount(chapter)>1000,lesson.slug+' lost its expanded reading');
    assert.match(chapter,/specialist review pending/);
  }
});

test('chapter footnotes resolve and documentary links do not conceal missing citations',()=>{
  for(const lesson of lessons){
    const chapter = readFileSync(folder+lesson.slug+'.md','utf8');
    const definitions = [...chapter.matchAll(/^\[\^([^\]]+)\]: (.+)$/gm)];
    assert.ok(definitions.length>0,lesson.slug);
    const names=definitions.map(match=>match[1]);
    assert.equal(names.length,new Set(names).size,lesson.slug+' has duplicate notes');
    const references=[...chapter.matchAll(/\[\^([^\]]+)\](?!:)/g)].map(match=>match[1]);
    for(const ref of references)assert.ok(names.includes(ref),lesson.slug+': missing '+ref);
    for(const ref of names)assert.ok(references.includes(ref),lesson.slug+': orphan '+ref);
    assert.ok(definitions.some(match=>/https:\/\//.test(match[2])),lesson.slug);
  }
});
