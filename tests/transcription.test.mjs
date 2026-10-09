import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {witnesses,blankDraft,createDeskSession,exportDraft,importDraft,draftReport,validateDraft,storageKey} from '../src/lib/transcription.js';
import {mountDesk} from '../src/lib/transcription-controller.js';

test('witness records retain actual folio locations, image scope, and separate rights',()=>{
  const french=witnesses.find(w=>w.id==='simon-de-varie-2'),portuguese=witnesses.find(w=>w.id==='armeiro-mor-87');
  assert.match(french.locator,/fol\. 2/);assert.match(french.scope,/overpainting/);
  assert.equal(new URL(french.imageSource).hostname,'media.getty.edu');
  assert.ok(existsSync(new URL('../public'+french.image,import.meta.url)));
  assert.match(french.rights,/CC0.*CC BY 4\.0/);
  assert.match(portuguese.locator,/liv\. 19, f\. 87.*page 23/);
  assert.equal(portuguese.image,undefined);assert.match(portuguese.referenceLabel,/Modern archive caption/);
});

test('JSON round trip preserves Unicode, newlines, and apparatus alternatives without trusting source metadata',()=>{
  const draft=blankDraft();draft.fields.diplomatic='VIE · [A?]\nÍndia 家紋 <script>';draft.fields.normalized='Vie à mon désir';
  draft.apparatus=[{locus:'Upper scroll',observed:'joined strokes',proposed:'A + M?',status:'provisional',basis:'Compare the separate folio 1; not yet inspected.'}];
  const exported=exportDraft(witnesses[0].id,draft);exported.source.url='https://example.com/untrusted';
  const restored=importDraft(JSON.stringify(exported));assert.deepEqual(restored,{witnessId:witnesses[0].id,draft});
  const report=draftReport(restored.witnessId,restored.draft);
  assert.ok(report.includes(draft.fields.diplomatic));assert.ok(report.includes('provisional'));
  assert.ok(report.includes(witnesses[0].url));assert.ok(!report.includes('untrusted'));
  assert.match(report,/not a supplied diplomatic transcription/);
});

test('imports reject malformed, oversized, unsupported, unknown-witness, and invalid apparatus data',()=>{
  const valid=exportDraft(witnesses[0].id,blankDraft());
  const bad=[null,[],{...valid,version:999},{...valid,witnessId:'made-up'},{...valid,fields:{...valid.fields,diplomatic:4}},{...valid,apparatus:Array(101).fill({})},{...valid,apparatus:[{locus:'x',observed:'x',proposed:'x',status:'approved',basis:'x'}]}];
  for(const value of bad)assert.throws(()=>importDraft(JSON.stringify(value)));
  assert.throws(()=>importDraft('{broken'));assert.throws(()=>importDraft(' '.repeat(1024*1024+1)));
  const large=blankDraft();large.apparatus=Array.from({length:100},()=>({locus:'x',observed:'x'.repeat(50000),proposed:'',status:'unresolved',basis:''}));assert.throws(()=>validateDraft(large),/too large/);
});

test('per-witness storage survives reload and blocked or corrupt storage keeps session work',()=>{
  const values=new Map(),storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
  const s=createDeskSession(storage),draft=blankDraft();draft.fields.notes='First witness';s.save(witnesses[0].id,draft);
  assert.equal(s.load(witnesses[1].id).fields.notes,'');assert.equal(createDeskSession(storage).load(witnesses[0].id).fields.notes,'First witness');
  const blocked=createDeskSession({getItem(){throw Error();},setItem(){throw Error();}});blocked.save(witnesses[0].id,draft);assert.equal(blocked.storageWorks,false);assert.equal(blocked.load(witnesses[0].id).fields.notes,'First witness');
  values.set(storageKey(witnesses[1].id),'{broken');assert.deepEqual(s.load(witnesses[1].id),blankDraft());assert.equal(s.storageWorks,false);
});

// Exercise the actual client controller with a small DOM adapter. This checks
// state and data handling; it is not desktop/mobile visual browser QA.
function desk({blocked=false,search='?witness=unknown'}={}){
  const downloads=[],clipboard=[],storage=new Map(),elements=[];
  class Element{
    constructor(tag='div'){this.tag=tag;this.children=[];this.handlers={};this.value='';this.dataset={};this.style={};this.hidden=false;elements.push(this);}
    addEventListener(event,fn){this.handlers[event]=fn;}
    append(...children){this.children.push(...children);}
    replaceChildren(...children){this.children=children;}
    focus(){this.focused=true;}
    remove(){}
    click(){downloads.push({href:this.href,name:this.download});}
  }
  const ids=['desk-witness','desk-form','apparatus-rows','desk-status','add-entry','apparatus-count','export-markdown','export-json','copy-draft','copy-witness','import-file','import-review','import-summary','import-preview','cancel-import','backup-import','load-import',...Object.keys(blankDraft().fields).map(id=>'draft-'+id)];
  const controls=new Map(ids.map(id=>{const e=new Element();e.id=id;return[id,e];}));
  const cards=witnesses.map(w=>{const card=new Element();card.dataset.witness=w.id;return card;});
  const location={href:'https://heraldryproject.org/transcription-desk/'+search,search};
  const blobs=new Map();class BlobURL extends URL{static createObjectURL(blob){const key='blob:'+blobs.size;blobs.set(key,blob);return key;}static revokeObjectURL(){}}
  const window={location,history:{replaceState(_,__,url){location.href=url.href;}},localStorage:{getItem(k){if(blocked)throw Error('blocked');return storage.get(k)??null;},setItem(k,v){if(blocked)throw Error('blocked');storage.set(k,v);}},navigator:{clipboard:{async writeText(text){clipboard.push(text);}}},URL:BlobURL,Blob,setTimeout(){}};
  const document={getElementById:id=>controls.get(id)||elements.find(e=>e.id===id),querySelectorAll:selector=>selector==='[data-witness]'?cards:[],createElement:tag=>new Element(tag),body:new Element('body')};
  const controller=mountDesk(document,window);
  return{controls,document,cards,location,storage,downloads,clipboard,blobs,controller,async chooseFile(text){controls.get('import-file').files=[{size:new TextEncoder().encode(text).length,async text(){return text;}}];await controls.get('import-file').handlers.change();}};
}

test('controller switches witnesses, restores drafts, and omits notes from shared links',async()=>{
  const ui=desk({blocked:true});const c=ui.controls;
  assert.equal(c.get('desk-witness').value,witnesses[0].id);
  c.get('draft-diplomatic').value='My private reading';c.get('desk-form').handlers.input({target:c.get('draft-diplomatic')});
  c.get('desk-witness').value=witnesses[1].id;c.get('desk-witness').handlers.change();assert.equal(c.get('draft-diplomatic').value,'');
  c.get('desk-witness').value=witnesses[0].id;c.get('desk-witness').handlers.change();assert.equal(c.get('draft-diplomatic').value,'My private reading');
  assert.equal(ui.cards[1].hidden,true);assert.match(c.get('desk-status').textContent,/could not be read/);
  await c.get('copy-witness').handlers.click();assert.ok(!ui.clipboard[0].includes('private'));assert.match(ui.clipboard[0],/witness=simon-de-varie-2/);
});

test('controller apparatus editing and exports retain source-linked doubtful readings',async()=>{
  const ui=desk(),c=ui.controls;c.get('add-entry').handlers.click();
  const input=ui.document.getElementById('entry-0-observed');input.value='A?';input.handlers.input();
  c.get('export-json').handlers.click();const data=JSON.parse(await ui.blobs.get(ui.downloads[0].href).text());assert.equal(data.apparatus[0].observed,'A?');assert.equal(data.apparatus[0].status,'unresolved');
  c.get('export-markdown').handlers.click();const report=await ui.blobs.get(ui.downloads[1].href).text();assert.ok(report.includes(witnesses[0].locator));assert.ok(report.includes('A?'));
  const row=c.get('apparatus-rows').children[0];row.children.at(-1).handlers.click();assert.equal(ui.controller.read().apparatus.length,0);
});

test('controller previews imports without replacement, permits backup and cancellation, then loads the approved draft',async()=>{
  const ui=desk(),c=ui.controls;c.get('draft-diplomatic').value='Existing';c.get('desk-form').handlers.input({target:c.get('draft-diplomatic')});
  const incoming=blankDraft();incoming.fields.diplomatic='<img src=x onerror=alert(1)> Índia';const file=JSON.stringify(exportDraft(witnesses[0].id,incoming));
  await ui.chooseFile(file);assert.equal(c.get('draft-diplomatic').value,'Existing');assert.equal(c.get('import-preview').textContent,incoming.fields.diplomatic);assert.equal(c.get('import-review').hidden,false);
  c.get('backup-import').handlers.click();assert.equal(JSON.parse(await ui.blobs.get(ui.downloads[0].href).text()).fields.diplomatic,'Existing');
  c.get('cancel-import').handlers.click();assert.equal(c.get('draft-diplomatic').value,'Existing');assert.equal(c.get('import-review').hidden,true);
  await ui.chooseFile(file);c.get('load-import').handlers.click();assert.equal(c.get('draft-diplomatic').value,incoming.fields.diplomatic);
  await ui.chooseFile('{broken');assert.match(c.get('desk-status').textContent,/Import failed/);assert.equal(c.get('draft-diplomatic').value,incoming.fields.diplomatic);
});

test('loading another witness’s import preserves the current witness draft and cancels stale file reads',async()=>{
  const ui=desk(),c=ui.controls;c.get('draft-notes').value='Current notes';
  const draft=blankDraft();draft.fields.notes='Other witness';await ui.chooseFile(JSON.stringify(exportDraft(witnesses[1].id,draft)));c.get('load-import').handlers.click();assert.equal(c.get('desk-witness').value,witnesses[1].id);
  c.get('desk-witness').value=witnesses[0].id;c.get('desk-witness').handlers.change();assert.equal(c.get('draft-notes').value,'Current notes');
  let resolve;c.get('import-file').files=[{size:10,text:()=>new Promise(r=>{resolve=r;})}];const reading=c.get('import-file').handlers.change();c.get('cancel-import').handlers.click();resolve(JSON.stringify(exportDraft(witnesses[1].id,draft)));await reading;assert.equal(c.get('import-review').hidden,true);
});
