import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {objectStudies} from '../src/lib/objects.js';
import * as comparison from '../src/lib/object-comparison.js';
import {installImageFallback} from '../src/lib/object-images.js';
import {browserDraftStorage} from '../src/lib/draft-storage.js';
import {mountDraftRecovery} from '../src/lib/draft-recovery.js';

// Exercise the page's client script against a small DOM adapter. This checks
// notebook persistence and storage failure; it is not a visual browser test.
function notebook({search='',blocked=false,stored=new Map()}={}){
  const control=(value='')=>({value,handlers:{},children:[],addEventListener(event,handler){this.handlers[event]=handler;},append(...children){this.children.push(...children);},setAttribute(){},replaceChildren(){this.children=[];}});
  const controls=new Map();
  for(const id of ['choose-left','choose-right','notes-status','swap-objects','export-notes','copy-notes','copy-comparison'])controls.set('#'+id,control());
  const left=controls.get('#choose-left'),right=controls.get('#choose-right');
  left.value=objectStudies[0].id;right.value='cary-bookplate';
  for(const select of [left,right])select.options=objectStudies.map(object=>({value:object.id}));
  const inputs=new Map(comparison.NOTE_FIELDS.map(field=>[field.id,control()]));
  const form=control();form.elements={namedItem:id=>inputs.get(id)};controls.set('#comparison-notes',form);
  const cards=[new Map(),new Map()];
  for(const [i,side] of ['left','right'].entries())controls.set('[data-side="'+side+'"]',{querySelector(selector){if(!cards[i].has(selector))cards[i].set(selector,control());return cards[i].get(selector);}});
  const location={href:'https://heraldryproject.org/objects/compare/'+search,search};
  const context={...comparison,objectStudies,installImageFallback,browserDraftStorage,mountDraftRecovery,URL,URLSearchParams,Map,JSON,Image:class{dataset={};complete=false;naturalWidth=0;addEventListener(){}getAttribute(){return this.src;}},FormData:class{constructor(){return new Map([...inputs].map(([id,input])=>[id,input.value]));}},document:{querySelector:selector=>controls.get(selector),createElement:()=>control()},location,history:{replaceState(_,__,url){location.href=url.href;}},localStorage:{getItem(key){if(blocked)throw Error('blocked');return stored.get(key)??null;},setItem(key,value){if(blocked)throw Error('blocked');stored.set(key,value);}}};
  context.window=context;
  const page=readFileSync(new URL('../src/pages/objects/compare.astro',import.meta.url),'utf8');
  const script=page.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^\s*import .*;$/gm,'');
  vm.runInNewContext(ts.transpileModule(script,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText,context);
  return {controls,inputs,form,cards,stored,location,left,right};
}

test('changing pairs saves current notes and restores previous pair notes',()=>{
  const ui=notebook();
  ui.inputs.get('question').value='First pair';ui.form.handlers.input();
  ui.left.value='vitelleschi-maiolica';ui.left.handlers.change();
  assert.equal(ui.inputs.get('question').value,'');
  assert.equal(ui.cards[0].get('[data-accession]').textContent,'1950.155');
  assert.equal(ui.cards[0].get('[data-creator]').textContent,'Circle of Maestro Giorgio Andreoli');
  ui.inputs.get('question').value='Second pair';ui.form.handlers.input();
  ui.left.value='franconian-targe';ui.left.handlers.change();
  assert.equal(ui.inputs.get('question').value,'First pair');
  const reload=notebook({stored:ui.stored});
  assert.equal(reload.inputs.get('question').value,'First pair');
});

test('swapping moves observations and preserves an already saved reverse notebook',()=>{
  const ui=notebook();
  ui.inputs.get('left').value='Targe observation';ui.inputs.get('right').value='Print observation';
  ui.controls.get('#swap-objects').handlers.click();
  assert.equal(ui.inputs.get('left').value,'Print observation');
  assert.equal(ui.inputs.get('right').value,'Targe observation');
  ui.inputs.get('question').value='Independent reversed-pair question';ui.form.handlers.input();
  ui.controls.get('#swap-objects').handlers.click();
  assert.equal(ui.inputs.get('question').value,'');
  ui.controls.get('#swap-objects').handlers.click();
  assert.equal(ui.inputs.get('question').value,'Independent reversed-pair question');
});

test('blocked persistent storage still keeps pair notes for the current page',()=>{
  const ui=notebook({blocked:true,search:'?left=missing&right=missing'});
  assert.notEqual(ui.left.value,ui.right.value);
  ui.inputs.get('question').value='Session note';ui.form.handlers.input();
  assert.match(ui.controls.get('#notes-status').textContent,/storage is unavailable/);
  const original=ui.left.value;
  ui.left.value='vitelleschi-maiolica';ui.left.handlers.change();
  ui.left.value=original;ui.left.handlers.change();
  assert.equal(ui.inputs.get('question').value,'Session note');
  assert.ok(!ui.location.href.includes('Session'));
});

test('seal comparison links render photograph qualifications and clear them for other pairs',()=>{
  const ui=notebook({search:'?left=lowlands-wax-seal&right=ghent-style-matrix'});
  assert.equal(ui.cards[0].get('[data-culture]').textContent,'Netherlandish or South Lowlands (?)');
  assert.equal(ui.cards[1].get('[data-date]').textContent,'19th or 20th century (13th century style)');
  assert.match(ui.cards[1].get('[data-study-scope]').textContent,/no arms identified/);
  assert.match(ui.cards[1].get('[data-image-note]').textContent,/no separate date or material/);
  ui.right.value='cary-bookplate';ui.right.handlers.change();
  assert.equal(ui.cards[1].get('[data-image-note]').textContent,'');
  assert.equal(ui.cards[1].get('[data-study-scope]').textContent,'');
});
