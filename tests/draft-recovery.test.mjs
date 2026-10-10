import test from 'node:test';
import assert from 'node:assert/strict';
import {mountDraftRecovery} from '../src/lib/draft-recovery.js';
import {createDeskSession,blankDraft,witnesses,storageKey,exportDraft,importDraft} from '../src/lib/transcription.js';

test('storage events pause a live editor; recovery previews, exports, and restores without losing either draft',()=>{
  const elements=[],events={},downloads=[],values=new Map();
  const document={createElement(tag){const e={tag,children:[],handlers:{},append(...children){this.children.push(...children);},replaceChildren(){this.children=[];},addEventListener(event,fn){this.handlers[event]=fn;}};elements.push(e);return e;}};
  const window={addEventListener(event,fn){events[event]=fn;}};
  const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),get length(){return values.size;},key:i=>[...values.keys()][i]};
  const id=witnesses[0].id,a=createDeskSession(storage),b=createDeskSession(storage);a.load(id);b.load(id);
  let visible=blankDraft();visible.fields.notes='Still on this page';b.save(id,visible);
  // A deliberately starts with a current shared version before its new edit.
  const other=createDeskSession(storage),their=other.load(id);their.fields.notes='Changed in another tab';other.save(id,their);
  const status={insertAdjacentElement(_,panel){this.panel=panel;}};
  const recovery=mountDraftRecovery({document,window,status,session:b,identity:()=>id,read:()=>visible,fill:clean=>{visible=clean;},exportRaw:(id,d)=>JSON.stringify(exportDraft(id,d)),download:(name,raw)=>downloads.push({name,raw})});
  events.storage();
  assert.match(status.textContent,/Autosave is paused/);assert.equal(status.panel.open,true);
  assert.equal(visible.fields.notes,'Still on this page');
  const copies=status.panel.children[3].children;
  const otherCopy=copies.find(copy=>copy.children.some(node=>node.tag==='pre'&&node.textContent.includes('Changed in another tab')));
  otherCopy.children.find(node=>node.textContent==='Download this draft').handlers.click();
  assert.equal(importDraft(downloads[0].raw).draft.fields.notes,'Changed in another tab');
  otherCopy.children.find(node=>node.textContent==='Continue from this draft').handlers.click();
  assert.equal(visible.fields.notes,'Changed in another tab');
  assert.equal(JSON.parse(values.get(storageKey(id))).fields.notes,'Changed in another tab');
  assert.ok(createDeskSession(storage).recoveries(id).some(copy=>copy.draft.fields.notes==='Still on this page'));
  assert.match(status.textContent,/Selected draft loaded and saved/);
});

test('an unreadable original can be downloaded verbatim and only replaced through an explicit recovery action',()=>{
  const nodes=[],handlers={},data=new Map(),id=witnesses[0].id,original='{broken, original manuscript text';data.set(storageKey(id),original);
  const document={createElement(tag){const node={tag,children:[],append(...children){this.children.push(...children);},replaceChildren(){this.children=[];},addEventListener(event,fn){this[event]=fn;}};nodes.push(node);return node;}};
  const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),get length(){return data.size;},key:i=>[...data.keys()][i]},session=createDeskSession(storage),draft=blankDraft(),downloads=[];
  session.load(id);draft.fields.diplomatic='New working reading';
  const status={};const recovery=mountDraftRecovery({document,window:{addEventListener(e,fn){handlers[e]=fn;}},status,session,identity:()=>id,read:()=>draft,fill(){},exportRaw:(_,d)=>JSON.stringify(d),download:(_,raw)=>downloads.push(raw)});
  recovery.refresh();assert.match(status.textContent,/left intact/);
  nodes.find(node=>node.textContent==='Download original record').click();assert.equal(downloads[0],original);
  nodes.find(node=>node.textContent==='Keep this page’s draft').click();
  assert.equal(JSON.parse(data.get(storageKey(id))).fields.diplomatic,'New working reading');
  assert.ok(createDeskSession(storage).recoveries(id).some(copy=>copy.raw===original));
});
