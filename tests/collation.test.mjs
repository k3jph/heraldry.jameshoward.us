import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {witnesses,blankDraft,exportDraft,storageKey} from '../src/lib/transcription.js';
import {blankComparison,selectWitnessPair,pairContext,compareText,validateComparison,exportComparison,importComparison,reverseComparison,comparisonReport,comparisonKey,createComparisonSession,COMPARISON_FIELDS,READING_FIELDS} from '../src/lib/collation.js';
import {mountComparison} from '../src/lib/collation-controller.js';

const pair=selectWitnessPair('simon-de-varie-2','simon-de-varie-2v');
const alignment=()=>({leftLocus:'Lower scroll',rightLocus:'Collar',leftReading:'A?',rightReading:'A',category:'lettering',status:'provisional',note:'Proposed from a parallel; not independent confirmation.'});
const apparatus=()=>({locus:'Fold',observed:'joined strokes',proposed:'A?',status:'unresolved',basis:'Higher-resolution check needed.'});

test('new photograph preserves exact leaf identity, same-book relationship, and separate rights',()=>{
  const w=pair[1];assert.equal(w.locator,'Ms. 7 (85.ML.27), fol. 2v; folio accession 85.ML.27.2v');
  assert.ok(existsSync(new URL('../public'+w.image,import.meta.url)));assert.equal(w.sourceImageSha1,'2e643716232eb7f2861df2fbd5e45dc71e977b2d');
  assert.match(w.rights,/Public Domain Mark/);assert.match(w.rights,/PD-Art/);assert.ok(!w.rights.startsWith('CC0'));
  assert.match(pairContext(pair),/not independent/);assert.match(pairContext([pair[0],witnesses[1]]),/Different works/);
  assert.deepEqual(selectWitnessPair('unknown','unknown'),pair);assert.notEqual(...selectWitnessPair(pair[0].id,pair[0].id).map(w=>w.id));
});

test('exact comparison reconstructs both inputs with Unicode, whitespace, punctuation, and repeated words intact',()=>{
  for(const [left,right] of [['VIE · A?\nÍndia 家紋','VIE  A\r\nÍndia 家紋'],['à','a\u0300'],['one one two','one two one'],['',''],['','alpha'],['alpha',''],['<script>','<img>']]){
    const result=compareText(left,right);assert.equal(result.limited,false);
    assert.equal(result.operations.filter(p=>p.type!=='right').map(p=>p.text).join(''),left);
    assert.equal(result.operations.filter(p=>p.type!=='left').map(p=>p.text).join(''),right);
  }
  assert.ok(compareText('à','a\u0300').operations.some(p=>p.type!=='equal'));
  assert.deepEqual(compareText('same\ntext','same\ntext').operations,[{type:'equal',text:'same\ntext'}]);
  assert.equal(compareText(Array(301).fill('x').join(' '),'x').limited,true);
  assert.equal(compareText(Array(300).fill('x').join(' '),'x').limited,false);
});

test('comparison round trip keeps original apparatus and provenance while rejecting imported source substitutions',()=>{
  const draft=blankComparison();draft.fields.question='Which occurrence?';draft.readings.left.draft.fields.diplomatic='A?\n家紋 <script>';
  draft.readings.left.draft.fields.editor='Reader';draft.readings.left.draft.fields.notes='An earlier uncertainty';draft.readings.left.draft.apparatus=[apparatus()];
  draft.readings.left.origin='desk';draft.readings.left.loadedAt='2026-10-09T20:00:00Z';draft.readings.left.edited=true;draft.alignments=[alignment()];
  const exported=exportComparison(pair,draft);exported.sources[0].url='https://example.com/forged';exported.relationship='Independent manuscripts';
  const loaded=importComparison(JSON.stringify(exported));assert.deepEqual(loaded.draft,draft);assert.deepEqual(loaded.pair,pair);
  const report=comparisonReport(loaded.pair,loaded.draft);assert.ok(report.includes('An earlier uncertainty'));assert.ok(report.includes('Higher-resolution check needed.'));
  assert.ok(report.includes(draft.readings.left.loadedAt));assert.ok(report.includes(pair[0].url));assert.ok(!report.includes('forged'));
  assert.match(report,/not independent/);assert.match(report,/no institutional or specialist approval/);
  assert.equal(exportComparison([{...pair[0],url:'https://example.com/forged'},pair[1]],draft).sources[0].url,pair[0].url);
});

test('comparison import rejects unsupported, malformed, unknown, repeated, oversized, and invalid records',()=>{
  const value=exportComparison(pair,blankComparison());
  for(const bad of [null,[],{...value,version:99},{...value,witnessIds:['made-up',pair[1].id]},{...value,witnessIds:[pair[0].id,pair[0].id]},{...value,layer:'invented'},{...value,fields:{...value.fields,question:7}},{...value,readings:{...value.readings,left:{...value.readings.left,edited:'yes'}}},{...value,alignments:Array(101).fill(alignment())},{...value,alignments:[{...alignment(),status:'approved'}]},{...value,alignments:[{...alignment(),category:'descendant'}]}])assert.throws(()=>importComparison(JSON.stringify(bad)));
  assert.throws(()=>importComparison('{broken'));assert.throws(()=>importComparison(' '.repeat(1024*1024+1)));
  const large=blankComparison();large.alignments=Array.from({length:20},()=>({...alignment(),note:'x'.repeat(50000)}));assert.throws(()=>validateComparison(large),/too large/);
});

test('ordered-pair storage survives reload, blocked storage, corruption, and reverse-copy edits without aliasing',()=>{
  const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)},draft=blankComparison();draft.fields.question='Original';draft.alignments=[alignment()];
  const s=createComparisonSession(storage);s.save(pair,draft);draft.fields.question='Unsaved';assert.equal(s.load(pair).fields.question,'Original');
  assert.equal(createComparisonSession(storage).load(pair).fields.question,'Original');assert.equal(s.load([...pair].reverse()),null);
  const reverse=reverseComparison(s.load(pair));assert.equal(reverse.alignments[0].leftLocus,'Collar');assert.equal(reverse.alignments[0].rightReading,'A?');
  reverse.fields.question='Revised';assert.equal(s.load(pair).fields.question,'Original');
  const blocked=createComparisonSession({getItem(){throw Error();},setItem(){throw Error();}});blocked.save(pair,draft);assert.equal(blocked.storageWorks,false);assert.equal(blocked.load(pair).fields.question,'Unsaved');
  data.set(comparisonKey([...pair].reverse()),'{broken');assert.equal(s.load([...pair].reverse()),null);assert.equal(s.storageWorks,false);
});

// Small DOM adapter for the actual client controller, not visual browser QA.
function bench({blocked=false,search='?left=unknown&right=unknown&notes=private#private',saved=new Map()}={}){
  const elements=[],downloads=[],clipboard=[],blobs=new Map(),storage=saved;
  class Element{
    constructor(tag='div'){this.tag=tag;this.children=[];this.handlers={};this.value='';this.dataset={};this.style={};this.hidden=false;elements.push(this);}
    addEventListener(event,handler){this.handlers[event]=handler;}
    append(...children){this.children.push(...children);}
    replaceChildren(...children){this.children=children;}
    focus(){this.focused=true;}
    remove(){}
    click(){downloads.push({href:this.href,name:this.download});}
    getAttribute(key){return this[key];}
    querySelector(selector){
      if(selector==='[data-picture] img')return this.querySelector('[data-picture]').querySelector('img');
      const key=selector.match(/^\[data-([^\]]+)\]$/)?.[1];
      for(const child of this.children){if(key?child.dataset[key]!==undefined:child.tag===selector)return child;const nested=child.querySelector(selector);if(nested)return nested;}
      return null;
    }
  }
  const ids=['comparison-status','alignment-rows','alignment-count','add-alignment','comparison-layer','comparison-form','pair-context','text-difference','difference-status','run-comparison','swap-witnesses','comparison-markdown','comparison-json','comparison-link','comparison-file','comparison-import-review','comparison-import-summary','comparison-import-preview','comparison-cancel','comparison-backup','comparison-load',...COMPARISON_FIELDS.map(f=>'comparison-'+f.id)];
  for(const side of ['left','right'])ids.push('witness-'+side,'source-'+side,'reading-meta-'+side,'reading-context-'+side,'use-desk-'+side,'reading-file-'+side,'zoom-'+side,'zoom-value-'+side,'fit-'+side,...READING_FIELDS.map(key=>'reading-'+side+'-'+key));
  const controls=new Map(ids.map(id=>{const e=new Element();e.id=id;return[id,e];}));
  for(const side of ['left','right']){
    controls.get('witness-'+side).options=witnesses.map(w=>({value:w.id}));
    for(const key of ['title','locator','repository','date','scope','rights','credit','record','rights-link','desk-link','picture','external','full']){const node=new Element();node.dataset[key]='';controls.get('source-'+side).append(node);}
  }
  const location={href:'https://heraldryproject.org/transcription-desk/compare/'+search,search};
  class BlobURL extends URL{static createObjectURL(blob){const key='blob:'+blobs.size;blobs.set(key,blob);return key;}static revokeObjectURL(){}}
  const window={location,history:{replaceState(_,__,url){location.href=url.href;}},localStorage:{getItem(k){if(blocked)throw Error('blocked');return storage.get(k)??null;},setItem(k,v){if(blocked)throw Error('blocked');storage.set(k,v);}},navigator:{clipboard:{async writeText(value){clipboard.push(value);}}},Blob,URL:BlobURL,setTimeout(){}};
  const document={getElementById:id=>controls.get(id)||elements.findLast(e=>e.id===id),createElement:tag=>new Element(tag),body:new Element('body')};
  const controller=mountComparison(document,window);
  const input=(id,value)=>{const node=document.getElementById(id);node.value=value;node.handlers.input();};
  const click=id=>controls.get(id).handlers.click();
  const choose=async(id,text)=>{controls.get(id).files=[{size:new TextEncoder().encode(text).length,async text(){return text;}}];await controls.get(id).handlers.change();};
  return {controls,document,location,storage,downloads,clipboard,blobs,controller,input,click,choose};
}

test('controller preserves pair notes through selection and reload, including unavailable browser storage',async()=>{
  for(const blocked of [false,true]){
    const ui=bench({blocked});ui.input('comparison-question','Private argument');ui.input('reading-left-diplomatic','Original reading');
    const select=ui.controls.get('witness-right');select.value=witnesses[1].id;select.handlers.change();assert.equal(ui.controller.read().fields.question,'');
    assert.equal(ui.controls.get('source-right').querySelector('[data-picture]').hidden,true);
    select.value=pair[1].id;select.handlers.change();assert.equal(ui.controller.read().fields.question,'Private argument');
    assert.equal(ui.controller.read().readings.left.draft.fields.diplomatic,'Original reading');
    await ui.click('comparison-link');assert.ok(!ui.clipboard[0].includes('private'));assert.equal(new URL(ui.clipboard[0]).hash,'');
    assert.deepEqual([...new URL(ui.clipboard[0]).searchParams.keys()],['left','right']);
    if(!blocked)assert.equal(bench({saved:ui.storage}).controller.read().fields.question,'Private argument');
  }
});

test('controller swap carries readings and loci once, then preserves the saved reverse notebook',()=>{
  const ui=bench();ui.input('reading-left-diplomatic','Left');ui.input('reading-right-diplomatic','Right');ui.click('add-alignment');ui.input('alignment-0-leftLocus','Lower scroll');ui.input('alignment-0-rightLocus','Collar');
  ui.click('swap-witnesses');assert.equal(ui.controller.read().readings.left.draft.fields.diplomatic,'Right');assert.equal(ui.controller.read().alignments[0].leftLocus,'Collar');
  ui.input('comparison-question','Reverse notebook');ui.click('swap-witnesses');ui.input('comparison-question','Forward notebook');ui.click('swap-witnesses');
  assert.equal(ui.controller.read().fields.question,'Reverse notebook');assert.match(ui.controls.get('comparison-status').textContent,/previously saved reverse/);
});

test('desk draft loading is staged, copies current storage, retains apparatus, and never mutates the original',async()=>{
  const ui=bench();ui.input('reading-left-diplomatic','Existing');const source=blankDraft();source.fields.diplomatic='New <script>';source.fields.editor='Reader';source.fields.notes='Original note';source.apparatus=[apparatus()];
  ui.storage.set(storageKey(pair[0].id),JSON.stringify(source));ui.click('use-desk-left');assert.equal(ui.controller.read().readings.left.draft.fields.diplomatic,'Existing');
  assert.equal(ui.controls.get('comparison-import-preview').textContent,'New <script>');ui.click('comparison-backup');
  assert.equal(JSON.parse(await ui.blobs.get(ui.downloads[0].href).text()).readings.left.draft.fields.diplomatic,'Existing');
  ui.click('comparison-cancel');assert.equal(ui.controller.read().readings.left.draft.fields.diplomatic,'Existing');
  source.fields.diplomatic='Fresh draft';ui.storage.set(storageKey(pair[0].id),JSON.stringify(source));ui.click('use-desk-left');ui.click('comparison-load');
  assert.equal(ui.controller.read().readings.left.draft.fields.diplomatic,'Fresh draft');assert.equal(ui.controller.read().readings.left.origin,'desk');
  assert.match(ui.controls.get('reading-context-left').textContent,/Original note/);assert.match(ui.controls.get('reading-context-left').textContent,/Higher-resolution check needed/);
  ui.input('reading-left-diplomatic','Comparison-only edit');assert.equal(JSON.parse(ui.storage.get(storageKey(pair[0].id))).fields.diplomatic,'Fresh draft');
  ui.click('comparison-json');const exported=JSON.parse(await ui.blobs.get(ui.downloads.at(-1).href).text());assert.deepEqual(exported.readings.left.draft.apparatus,source.apparatus);assert.equal(exported.readings.left.edited,true);
  ui.click('comparison-markdown');const report=await ui.blobs.get(ui.downloads.at(-1).href).text();assert.ok(report.includes('Original note'));assert.ok(report.includes('Reader'));assert.ok(report.includes(pair[1].url));
});

test('wrong-witness and malformed imports leave readings unchanged; correct imports require review',async()=>{
  const ui=bench();ui.input('reading-left-diplomatic','Existing');const source=blankDraft();source.fields.diplomatic='Imported';source.apparatus=[apparatus()];
  await ui.choose('reading-file-left',JSON.stringify(exportDraft(pair[1].id,source)));assert.match(ui.controls.get('comparison-status').textContent,/Choose that witness/);assert.equal(ui.controls.get('comparison-import-review').hidden,true);
  await ui.choose('reading-file-left','{broken');assert.equal(ui.controller.read().readings.left.draft.fields.diplomatic,'Existing');
  await ui.choose('reading-file-left',JSON.stringify(exportDraft(pair[0].id,source)));assert.equal(ui.controller.read().readings.left.draft.fields.diplomatic,'Existing');ui.click('comparison-load');
  assert.equal(ui.controller.read().readings.left.origin,'file');assert.deepEqual(ui.controller.read().readings.left.draft.apparatus,source.apparatus);
});

test('complete imports back up their destination pair and leave the current notebook saved',async()=>{
  const destination=[pair[0],witnesses[1]],prior=blankComparison();prior.fields.question='Destination prior';const storage=new Map([[comparisonKey(destination),JSON.stringify(prior)]]);
  const ui=bench({saved:storage});ui.input('comparison-question','Current prior');const incoming=blankComparison();incoming.fields.question='Incoming';
  await ui.choose('comparison-file',JSON.stringify(exportComparison(destination,incoming)));assert.equal(ui.controller.read().fields.question,'Current prior');ui.click('comparison-backup');
  const backup=JSON.parse(await ui.blobs.get(ui.downloads[0].href).text());assert.deepEqual(backup.witnessIds,destination.map(w=>w.id));assert.equal(backup.fields.question,'Destination prior');
  ui.click('comparison-load');assert.equal(ui.controller.read().fields.question,'Incoming');assert.deepEqual(ui.controller.pair(),destination);
  assert.equal(JSON.parse(storage.get(comparisonKey(pair))).fields.question,'Current prior');
});

test('asynchronous imports cannot reopen review after cancellation or pair switching',async()=>{
  for(const action of ['comparison-cancel','swap-witnesses']){
    const ui=bench();let resolve;ui.controls.get('comparison-file').files=[{size:10,text:()=>new Promise(r=>{resolve=r;})}];
    const reading=ui.controls.get('comparison-file').handlers.change();ui.click(action);resolve(JSON.stringify(exportComparison(pair,blankComparison())));await reading;
    assert.equal(ui.controls.get('comparison-import-review').hidden,true);
  }
});

test('exact-text preview uses text nodes, refuses oversize previews, and clears after editing',()=>{
  const ui=bench();ui.input('reading-left-diplomatic','<script>\nA');ui.input('reading-right-diplomatic','<img>  A');ui.click('run-comparison');
  const area=ui.controls.get('text-difference');assert.ok(area.children.some(e=>e.tag==='del'));assert.ok(area.children.some(e=>e.tag==='ins'));assert.ok(area.children.some(e=>e.textContent.includes('<script>')));assert.ok(area.children.every(e=>e.innerHTML===undefined));
  ui.input('reading-left-diplomatic',Array(301).fill('x').join(' '));assert.equal(area.children.length,0);ui.click('run-comparison');assert.match(ui.controls.get('difference-status').textContent,/600 tokens/);assert.ok(ui.controller.read().readings.left.draft.fields.diplomatic.length>500);
});

test('an oversized combined reading import is rejected before replacing either reading',async()=>{
  const ui=bench(),large=blankDraft();large.apparatus=Array.from({length:10},()=>({...apparatus(),basis:'x'.repeat(50000)}));
  await ui.choose('reading-file-right',JSON.stringify(exportDraft(pair[1].id,large)));ui.click('comparison-load');
  await ui.choose('reading-file-left',JSON.stringify(exportDraft(pair[0].id,large)));ui.click('comparison-load');
  assert.match(ui.controls.get('comparison-status').textContent,/Load failed.*too large/);assert.equal(ui.controller.read().readings.left.origin,'manual');assert.equal(ui.controller.read().readings.right.draft.apparatus.length,10);
});

test('new workshop and comparison routes are connected and included in the sitemap',()=>{
  const root=new URL('../',import.meta.url),sitemap=readFileSync(new URL('src/pages/sitemap.xml.js',root),'utf8');
  for(const route of ['compare','collation']){assert.ok(existsSync(new URL('src/pages/transcription-desk/'+route+'.astro',root)));assert.ok(sitemap.includes('/transcription-desk/'+route+'/'));}
  assert.ok(readFileSync(new URL('src/content/foundation/reading-the-evidence.md',root),'utf8').includes('/transcription-desk/collation/'));
});
