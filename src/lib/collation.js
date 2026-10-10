import {witnesses,blankDraft,validateDraft,draftReport,MAX_FILE_BYTES} from './transcription.js';
import {createDraftSession} from './draft-storage.js';

export const COLLATION_FORMAT='heraldry-witness-comparison';
export const COLLATION_VERSION=1;
export const MAX_ALIGNMENTS=100;
export const COMPARISON_FIELDS=[
  {id:'question',label:'Research question',prompt:'Name the passage, feature, or editorial decision you are comparing.'},
  {id:'policy',label:'Comparison policy',prompt:'Which text layer and notation rules? Record any normalization before interpreting a difference.'},
  {id:'argument',label:'Interpretation and limits',prompt:'Separate observed differences from claims about copying, chronology, identity, or entitlement.'},
  {id:'nextCheck',label:'Next check',prompt:'Name a located source or review step that could change your conclusion.'},
];
export const READING_FIELDS=['scope','diplomatic','normalized','translation'];
export const ALIGNMENT_FIELDS=['leftLocus','rightLocus','leftReading','rightReading','category','status','note'];
export const CATEGORIES=['unclassified','lettering','spacing or punctuation','normalization','translation','visual arrangement','material change'];
export const REVIEW_STATES=['unresolved','provisional','checked'];
export const LAYERS=['diplomatic','normalized','translation'];
export const blankReading=()=>({draft:blankDraft(),origin:'manual',loadedAt:'',edited:false});
export const blankComparison=()=>({fields:Object.fromEntries(COMPARISON_FIELDS.map(f=>[f.id,''])),readings:{left:blankReading(),right:blankReading()},alignments:[],layer:'diplomatic'});
const record=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const string=x=>{if(typeof x!=='string'||x.length>50000)throw new Error('Comparison text must be a string of at most 50,000 characters.');return x;};
export function selectWitnessPair(leftId,rightId){
  const left=witnesses.find(w=>w.id===leftId)||witnesses[0];
  const right=witnesses.find(w=>w.id===rightId&&w.id!==left.id)||witnesses.find(w=>w.id==='simon-de-varie-2v'&&w.id!==left.id)||witnesses.find(w=>w.id!==left.id);
  return [left,right];
}
export const comparisonKey=pair=>'heraldry-witness-comparison-v1:'+pair.map(w=>w.id).join(':');
export function pairContext(pair){
  return pair[0].workId&&pair[0].workId===pair[1].workId?
    'Two openings in the same manuscript. Compare their inscriptions and arrangement; agreement is not independent confirmation from a second book.':
    'Different works. This is a comparative study of sources and editorial method; do not treat their wording as variant copies of one text.';
}
export function validateComparison(value){
  if(!record(value)||!record(value.fields)||!record(value.readings)||!Array.isArray(value.alignments)||value.alignments.length>MAX_ALIGNMENTS||!LAYERS.includes(value.layer))throw new Error('Invalid comparison structure, text layer, or alignment count.');
  const fields=Object.fromEntries(COMPARISON_FIELDS.map(f=>[f.id,string(value.fields[f.id])]));
  const readings=Object.fromEntries(['left','right'].map(side=>{
    const reading=value.readings[side];
    if(!record(reading)||!['manual','desk','file'].includes(reading.origin)||typeof reading.edited!=='boolean')throw new Error('Invalid reading provenance.');
    return [side,{draft:validateDraft(reading.draft),origin:reading.origin,loadedAt:string(reading.loadedAt),edited:reading.edited}];
  }));
  const alignments=value.alignments.map(row=>{
    if(!record(row)||!CATEGORIES.includes(row.category)||!REVIEW_STATES.includes(row.status))throw new Error('Invalid alignment category or review status.');
    return Object.fromEntries(ALIGNMENT_FIELDS.map(key=>[key,string(row[key])]));
  });
  const clean={fields,readings,alignments,layer:value.layer};
  if(new TextEncoder().encode(JSON.stringify(clean)).length>900000)throw new Error('The comparison is too large for a portable file. Shorten the working excerpts and keep full texts separately.');
  return clean;
}
export const sourceRecord=w=>({id:w.id,title:w.title,repository:w.repository,locator:w.locator,date:w.date,url:w.url,rights:w.rights,credit:w.credit,accessed:w.accessed,scope:w.scope});
export function exportComparison(pair,value){
  if(pair.length!==2||pair[0].id===pair[1].id||pair.some(w=>!witnesses.some(known=>known.id===w.id)))throw new Error('Choose two distinct known witnesses.');
  const trusted=pair.map(w=>witnesses.find(known=>known.id===w.id));
  return {format:COLLATION_FORMAT,version:COLLATION_VERSION,witnessIds:trusted.map(w=>w.id),exportedAt:new Date().toISOString(),review:'Student working comparison; specialist review not implied',relationship:pairContext(trusted),sources:trusted.map(sourceRecord),...validateComparison(value)};
}
export function importComparison(text){
  if(new TextEncoder().encode(text).length>MAX_FILE_BYTES)throw new Error('Choose a file no larger than 1 MB.');
  let value;try{value=JSON.parse(text);}catch{throw new Error('This file is not valid JSON.');}
  if(!record(value)||value.format!==COLLATION_FORMAT||value.version!==COLLATION_VERSION||!Array.isArray(value.witnessIds)||value.witnessIds.length!==2||value.witnessIds[0]===value.witnessIds[1]||value.witnessIds.some(id=>!witnesses.some(w=>w.id===id)))throw new Error('This is not a supported comparison of two known witnesses.');
  // Use the local verified records, never imported URLs, rights, or relationship claims.
  return {pair:value.witnessIds.map(id=>witnesses.find(w=>w.id===id)),draft:validateComparison(value)};
}
export function reverseComparison(value){
  const clean=validateComparison(value);
  return {...clean,readings:{left:clean.readings.right,right:clean.readings.left},alignments:clean.alignments.map(row=>({...row,leftLocus:row.rightLocus,rightLocus:row.leftLocus,leftReading:row.rightReading,rightReading:row.leftReading}))};
}
export function comparisonReport(pair,value){
  const clean=validateComparison(value),bundle=exportComparison(pair,clean);
  const lines=['# Manuscript witness comparison','',bundle.review,'',bundle.relationship,'','**Automatic text comparison layer:** '+clean.layer,'**Comparison rule:** exact supplied tokens, including case, accents, punctuation, and whitespace; no automatic normalization.',''];
  for(const f of COMPARISON_FIELDS)lines.push('## '+f.label,'',clean.fields[f.id]||'[Not entered]','');
  lines.push('## Located comparisons','');
  if(!clean.alignments.length)lines.push('[No alignment entries]','');
  clean.alignments.forEach((row,i)=>{lines.push('### Alignment '+(i+1),'');for(const key of ALIGNMENT_FIELDS)lines.push('**'+key+':**',row[key]||'[Not entered]','');});
  ['left','right'].forEach((side,i)=>{
    const reading=clean.readings[side];lines.push('## '+(i===0?'Left':'Right')+' witness reading','',`**Reading origin:** ${reading.origin}${reading.loadedAt?' · loaded '+reading.loadedAt:''}; ${reading.edited?'edited since loading or initial entry':'no subsequent edit recorded'}`,'',draftReport(pair[i].id,reading.draft));
  });
  return lines.join('\n')+'\n';
}
export function createComparisonSession(storage){
  return createDraftSession(storage,{key:comparisonKey,validate:validateComparison,blank:()=>null});
}
// A bounded longest-common-subsequence comparison of the supplied text. It
// highlights strings, not manuscript strokes, copying relationships, or dates.
export function compareText(left,right){
  const a=left.match(/\s+|\S+/gu)||[],b=right.match(/\s+|\S+/gu)||[];
  if(a.length>600||b.length>600)return {limited:true,operations:[]};
  const width=b.length+1,grid=new Uint16Array((a.length+1)*width);
  for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--)grid[i*width+j]=a[i]===b[j]?1+grid[(i+1)*width+j+1]:Math.max(grid[(i+1)*width+j],grid[i*width+j+1]);
  const operations=[];const add=(type,text)=>{const last=operations.at(-1);if(last?.type===type)last.text+=text;else operations.push({type,text});};let i=0,j=0;
  while(i<a.length&&j<b.length){if(a[i]===b[j]){add('equal',a[i]);i++;j++;}else if(grid[(i+1)*width+j]>=grid[i*width+j+1])add('left',a[i++]);else add('right',b[j++]);}
  while(i<a.length)add('left',a[i++]);while(j<b.length)add('right',b[j++]);
  return {limited:false,operations};
}
