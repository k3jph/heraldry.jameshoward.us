import test from 'node:test';
import assert from 'node:assert/strict';
import {mountDraftRecovery,recoveryFilename} from '../src/lib/draft-recovery.js';
import {draftPreview} from '../src/lib/draft-preview.js';
import {blankComparison} from '../src/lib/collation.js';
import {comparisonNotes,exportObjectRecovery} from '../src/lib/object-comparison.js';
import {objectStudies} from '../src/lib/objects.js';
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

function recoveryUI(){
  const values=new Map(),events={},downloads=[];
  const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k),get length(){return values.size;},key:i=>[...values.keys()][i]};
  const document={activeElement:null,createElement(tag){return {tag,children:[],handlers:{},append(...children){for(const child of children){child.parent=this;this.children.push(child);}},replaceChildren(){this.children=[];},addEventListener(e,fn){this.handlers[e]=fn;},focus(){document.activeElement=this;},contains(node){return node===this||this.children.some(child=>child.contains(node));},remove(){this.parent.children=this.parent.children.filter(child=>child!==this);}};}};
  const id=witnesses[0].id,prior=createDeskSession(storage),original=blankDraft();original.fields.diplomatic='Older transcription';prior.save(id,original);
  const session=createDeskSession(storage);let visible=session.load(id);
  const status={insertAdjacentElement(_,panel){this.panel=panel;}};
  const recovery=mountDraftRecovery({document,window:{addEventListener:(e,fn)=>events[e]=fn},status,session,identity:()=>id,read:()=>visible,fill:value=>visible=value,exportRaw:(id,d)=>JSON.stringify(exportDraft(id,d)),previewDraft:draftPreview,download:(name,raw)=>downloads.push({name,raw})});
  status.panel.open=true;recovery.refresh();
  return {values,storage,events,downloads,document,id,session,status,recovery,get visible(){return visible;},set visible(value){visible=value;},copies:()=>status.panel.children[3].children};
}
const button=(copy,text)=>copy.children.find(child=>child.textContent===text);

test('own saves refresh an open recovery panel and choosing an older copy preserves the latest entered text without a false conflict',()=>{
  const ui=recoveryUI(),older=ui.copies().find(copy=>copy.children[0].textContent.startsWith('Recovery copy'));
  ui.visible.fields.diplomatic='New transcription';ui.session.save(ui.id,ui.visible);
  assert.match(ui.copies()[0].children[1].textContent,/New transcription/);
  button(older,'Continue from this draft').handlers.click();
  assert.equal(ui.visible.fields.diplomatic,'Older transcription');assert.match(ui.status.textContent,/Selected draft loaded and saved/);
  assert.ok(createDeskSession(ui.storage).recoveries(ui.id).some(copy=>copy.draft?.fields.diplomatic==='New transcription'));
});

test('relevant storage events preserve recovery node identity, keyboard focus and open previews; unrelated records are ignored',()=>{
  const ui=recoveryUI(),shared=ui.copies()[0],load=button(shared,'Continue from this draft');shared.open=true;load.focus();
  ui.status.textContent='Untouched';ui.events.storage({key:'unrelated-record'});assert.equal(ui.status.textContent,'Untouched');
  const other=createDeskSession(ui.storage),draft=other.load(ui.id);draft.fields.diplomatic='Another tab';other.save(ui.id,draft);
  ui.events.storage({key:storageKey(ui.id)});
  assert.equal(ui.copies()[0],shared);assert.equal(shared.open,true);assert.equal(ui.document.activeElement,load);
  assert.match(shared.children[1].textContent,/Another tab/);assert.equal(ui.visible.fields.diplomatic,'Older transcription');
});

test('recovery deletion requires a download and confirmation, resets if that copy changes, and retains protected records',()=>{
  const ui=recoveryUI(),copy=ui.copies().find(copy=>copy.children[0].textContent.startsWith('Recovery copy'));
  const remove=button(copy,'Delete this copy');assert.equal(remove.disabled,true);
  button(copy,'Download this draft').handlers.click();assert.equal(remove.disabled,false);
  assert.equal(importDraft(ui.downloads[0].raw).draft.fields.diplomatic,'Older transcription');
  remove.handlers.click();assert.equal(remove.textContent,'Confirm delete downloaded copy');
  const saved=ui.session.recoveries(ui.id).find(saved=>saved.deletable);
  const changed=blankDraft();changed.fields.diplomatic='Changed copy';
  ui.storage.setItem(saved.key,JSON.stringify({raw:JSON.stringify(changed),savedAt:'later'}));ui.events.storage({key:saved.key});
  assert.equal(remove.disabled,true);assert.equal(remove.textContent,'Delete this copy');
  button(copy,'Download this draft').handlers.click();remove.handlers.click();remove.handlers.click();
  assert.equal(ui.storage.getItem(saved.key),null);assert.equal(JSON.parse(ui.storage.getItem(storageKey(ui.id))).fields.diplomatic,'Older transcription');
  assert.ok(ui.status.panel.children[0]===ui.document.activeElement);
  assert.ok(ui.copies().every(copy=>button(copy,'Delete this copy').hidden));
});

test('an unseen external change blocks recovery selection and storage failures during a conflict give export advice',()=>{
  const ui=recoveryUI(),load=button(ui.copies()[0],'Continue from this draft');
  const other=createDeskSession(ui.storage),draft=other.load(ui.id);draft.fields.diplomatic='Unseen new version';other.save(ui.id,draft);
  load.handlers.click();assert.match(ui.status.textContent,/changed after this preview/);
  assert.equal(JSON.parse(ui.storage.getItem(storageKey(ui.id))).fields.diplomatic,'Unseen new version');
  ui.storage.setItem=()=>{throw Object.assign(new Error('Raw technical browser exception'),{name:'QuotaExceededError'});};
  ui.status.panel.children[2].handlers.click();assert.match(ui.status.textContent,/Browser storage is unavailable.*Export/);
  button(ui.copies()[0],'Continue from this draft').handlers.click();assert.match(ui.status.textContent,/Browser storage is unavailable.*Export/);
  assert.equal(ui.visible.fields.diplomatic,'Older transcription');
});

test('previews show both entered witness readings and notes before source metadata, with bounded excerpts',()=>{
  const draft=blankComparison();draft.readings.left.draft.fields.scope='x'.repeat(50000);draft.readings.left.draft.fields.diplomatic='LEFT TEXT';draft.readings.right.draft.fields.diplomatic='RIGHT TEXT';draft.fields.question='QUESTION';
  const preview=draftPreview(null,draft);assert.match(preview,/LEFT TEXT/);assert.match(preview,/RIGHT TEXT/);assert.match(preview,/QUESTION/);assert.ok(preview.length<6000);
});

test('object recovery downloads retain ordered identifiers, accession numbers, source links and notes with distinct filenames',()=>{
  const pair=objectStudies.slice(0,2),notes=comparisonNotes({question:'Object context'}),saved={key:'draft:branch:copy-a',savedAt:'2026-10-10T12:00:00Z'};
  const bundle=exportObjectRecovery(pair,notes);assert.deepEqual(bundle.objectIds,pair.map(object=>object.id));
  assert.equal(bundle.notes.question,'Object context');
  pair.forEach((object,i)=>{assert.equal(bundle.sources[i].accession,object.accession);assert.equal(bundle.sources[i].url,object.url);assert.ok(bundle.report.includes(object.url));});
  const filename=recoveryFilename(pair,saved);assert.ok(filename.includes(pair[0].id));assert.ok(filename.includes(pair[1].id));assert.ok(filename.includes('2026-10-10'));
  assert.notEqual(filename,recoveryFilename([...pair].reverse(),saved));assert.notEqual(filename,recoveryFilename(pair,{...saved,key:'draft:branch:copy-b'}));
});
