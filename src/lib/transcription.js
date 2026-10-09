import witnesses from '../data/manuscripts.json' with {type:'json'};

export {witnesses};
export const DESK_FORMAT='heraldry-transcription';
export const DESK_VERSION=1;
export const MAX_FILE_BYTES=1024*1024;
export const MAX_ROWS=100;
export const FIELDS=[
  {id:'editor',label:'Editor / working name',prompt:'Optional. Identify the person responsible for this draft.',rows:1},
  {id:'scope',label:'Location and transcription policy',prompt:'Which scroll, line, or inscription? Explain spaces, line breaks, joined letters, and uncertainty signs.',rows:3},
  {id:'diplomatic',label:'Diplomatic transcription',prompt:'Record the visible lettering under your stated policy. Keep unreadable or uncertain forms explicit.',rows:6},
  {id:'normalized',label:'Normalized reading',prompt:'Record expansions, modern word spaces, case, or accents here. Explain changes in the apparatus.',rows:4},
  {id:'translation',label:'Working English translation',prompt:'Translate the reading you have established. Preserve ambiguity where it changes the meaning.',rows:4},
  {id:'notes',label:'Evidence, alternatives, and revision notes',prompt:'Distinguish your inspection from catalogue readings. Record consulted sources and changes of mind.',rows:5},
];
export const ROW_FIELDS=['locus','observed','proposed','status','basis'];
export const ROW_STATUSES=['unresolved','provisional','checked'];
export const blankDraft=()=>({fields:Object.fromEntries(FIELDS.map(f=>[f.id,''])),apparatus:[]});
export const storageKey=id=>'heraldry-transcription-v1:'+id;
const isRecord=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const readString=value=>{
  if(typeof value!=='string'||value.length>50000)throw new Error('Each text field must be a string of at most 50,000 characters.');
  return value;
};
export function validateDraft(value){
  if(!isRecord(value)||!isRecord(value.fields)||!Array.isArray(value.apparatus)||value.apparatus.length>MAX_ROWS)throw new Error('This draft has invalid fields or too many apparatus rows.');
  const fields=Object.fromEntries(FIELDS.map(f=>[f.id,readString(value.fields[f.id])]));
  const apparatus=value.apparatus.map(row=>{
    if(!isRecord(row)||!ROW_STATUSES.includes(row.status))throw new Error('An apparatus row has an invalid review status.');
    return Object.fromEntries(ROW_FIELDS.map(key=>[key,readString(row[key])]));
  });
  const clean={fields,apparatus};
  if(new TextEncoder().encode(JSON.stringify(clean)).length>900000)throw new Error('This draft is too large for a portable export. Keep the complete text in a separate document and shorten this working draft.');
  return clean;
}
export function exportDraft(id,draft){
  const witness=witnesses.find(w=>w.id===id);
  if(!witness)throw new Error('Unknown manuscript witness.');
  return {format:DESK_FORMAT,version:DESK_VERSION,witnessId:id,exportedAt:new Date().toISOString(),review:'Student working draft; no institutional or specialist approval implied',source:{title:witness.title,repository:witness.repository,locator:witness.locator,url:witness.url,rights:witness.rights,accessed:witness.accessed},...validateDraft(draft)};
}
export function importDraft(text){
  if(new TextEncoder().encode(text).length>MAX_FILE_BYTES)throw new Error('Choose a JSON file smaller than 1 MB.');
  let value;try{value=JSON.parse(text);}catch{throw new Error('This file is not valid JSON.');}
  if(!isRecord(value)||value.format!==DESK_FORMAT||value.version!==DESK_VERSION)throw new Error('This file is not a supported transcription-desk export.');
  if(!witnesses.some(w=>w.id===value.witnessId))throw new Error('The file refers to an unknown witness.');
  // Imported source metadata is never trusted to change the witness or its URLs.
  return {witnessId:value.witnessId,draft:validateDraft(value)};
}
export function draftReport(id,draft){
  const witness=witnesses.find(w=>w.id===id);
  if(!witness)throw new Error('Unknown manuscript witness.');
  const checked=validateDraft(draft);
  const lines=['# Transcription working draft','', '**Review:** Student working draft; no institutional or specialist approval implied.','',`**Witness:** ${witness.title}`,`**Repository:** ${witness.repository}`,`**Locator:** ${witness.locator}`,`**Catalogue date:** ${witness.date}`,`**Language:** ${witness.language}`,`**Source:** ${witness.url}`,`**Source consulted for this desk:** ${witness.accessed}`,`**Image / text rights:** ${witness.rights}`,`**Credit:** ${witness.credit}`,`**Study limit:** ${witness.scope}`,''];
  for(const field of FIELDS)lines.push('## '+field.label,'',checked.fields[field.id]||'[Not entered]','');
  lines.push('## Critical apparatus','');
  if(!checked.apparatus.length)lines.push('[No apparatus entries]','');
  checked.apparatus.forEach((row,i)=>{lines.push('### Entry '+(i+1),'');for(const key of ROW_FIELDS)lines.push('**'+key[0].toUpperCase()+key.slice(1)+':**',row[key]||'[Not entered]','');});
  lines.push('## Reference supplied by the desk','',witness.referenceLabel+':',witness.reference,'Source: '+witness.referenceUrl,'','Keep this modern reference reading distinct from your own diplomatic transcription.');
  return lines.join('\n')+'\n';
}
export function createDeskSession(storage){
  const memory=new Map();let storageWorks=true;
  return {
    get storageWorks(){return storageWorks;},
    save(id,draft){
      const clean=validateDraft(draft);memory.set(id,clean);
      try{storage.setItem(storageKey(id),JSON.stringify(clean));storageWorks=true;}catch{storageWorks=false;}
      return clean;
    },
    load(id){
      if(memory.has(id))return structuredClone(memory.get(id));
      try{const raw=storage.getItem(storageKey(id));if(raw!==null){const clean=validateDraft(JSON.parse(raw));memory.set(id,clean);return structuredClone(clean);}}catch{storageWorks=false;}
      return blankDraft();
    }
  };
}
