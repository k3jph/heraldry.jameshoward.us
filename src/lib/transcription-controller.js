import {witnesses,FIELDS,ROW_FIELDS,ROW_STATUSES,MAX_ROWS,MAX_FILE_BYTES,blankDraft,createDeskSession,exportDraft,importDraft,draftReport} from './transcription.js';

export function mountDesk(document,window){
  const find=id=>document.getElementById(id);
  const choice=find('desk-witness'),form=find('desk-form'),rows=find('apparatus-rows'),status=find('desk-status');
  const session=createDeskSession({getItem:key=>window.localStorage.getItem(key),setItem:(key,value)=>window.localStorage.setItem(key,value)});
  let id=witnesses.some(w=>w.id===new URLSearchParams(window.location.search).get('witness'))?new URLSearchParams(window.location.search).get('witness'):witnesses[0].id;
  let apparatus=[],pending=null,importSequence=0;
  const say=text=>{status.textContent=text;};
  const read=()=>({fields:Object.fromEntries(FIELDS.map(f=>[f.id,find('draft-'+f.id).value])),apparatus});
  const save=()=>{
    try{session.save(id,read());}catch(error){say(error.message+' Your entered text is still on this page.');return false;}
    say(session.storageWorks?'Draft saved in this browser for this witness. Export JSON to keep a portable copy.':'Browser storage is unavailable. Your draft stays in this open page; export before closing it.');
    return true;
  };
  const download=(name,content,type)=>{
    const url=window.URL.createObjectURL(new window.Blob([content],{type}));
    const link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();window.setTimeout(()=>window.URL.revokeObjectURL(url),1500);
  };
  const jsonDownload=(witnessId,draft,suffix='')=>download('heraldry-'+witnessId+suffix+'.json',JSON.stringify(exportDraft(witnessId,draft),null,2)+'\n','application/json;charset=utf-8');
  const renderRows=()=>{
    rows.replaceChildren();
    apparatus.forEach((row,index)=>{
      const group=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent='Apparatus entry '+(index+1);group.append(legend);
      const labels={locus:'Location / line',observed:'Observed form',proposed:'Proposed reading or expansion',status:'Review status',basis:'Evidence and alternatives'};
      ROW_FIELDS.forEach(key=>{
        const label=document.createElement('label'),name=document.createElement('span');name.textContent=labels[key];label.append(name);
        const input=document.createElement(key==='status'?'select':'textarea');input.id='entry-'+index+'-'+key;label.htmlFor=input.id;
        if(key==='status')ROW_STATUSES.forEach(value=>{const option=document.createElement('option');option.value=value;option.textContent=value[0].toUpperCase()+value.slice(1);input.append(option);});
        else{input.rows=key==='basis'?3:2;input.maxLength=50000;}
        input.value=row[key];input.addEventListener(key==='status'?'change':'input',()=>{row[key]=input.value;save();});label.append(input);group.append(label);
      });
      const remove=document.createElement('button');remove.type='button';remove.className='chip';remove.textContent='Remove entry '+(index+1);remove.addEventListener('click',()=>{apparatus.splice(index,1);renderRows();save();find('add-entry').focus();});group.append(remove);rows.append(group);
    });
    find('add-entry').disabled=apparatus.length>=MAX_ROWS;
    find('apparatus-count').textContent=apparatus.length+' / '+MAX_ROWS+' apparatus entries';
  };
  const fill=draft=>{FIELDS.forEach(f=>{find('draft-'+f.id).value=draft.fields[f.id];});apparatus=structuredClone(draft.apparatus);renderRows();};
  const render=()=>{
    choice.value=id;
    document.querySelectorAll('[data-witness]').forEach(card=>{card.hidden=card.dataset.witness!==id;});
    const url=new URL(window.location.href);url.search='';url.searchParams.set('witness',id);window.history.replaceState(null,'',url);
    fill(session.load(id));
    say(session.storageWorks?'This witness’s draft is ready. Notes stay in this browser until you export or copy them.':'Saved drafts could not be read. You can still write and export; keep a copy before closing.');
  };
  const dismissImport=()=>{pending=null;importSequence++;find('import-review').hidden=true;find('import-file').value='';};
  choice.addEventListener('change',()=>{if(!save()){choice.value=id;return;}id=choice.value;dismissImport();render();});
  form.addEventListener('submit',event=>event.preventDefault());
  form.addEventListener('input',event=>{if(event.target.id?.startsWith('draft-'))save();});
  find('add-entry').addEventListener('click',()=>{
    if(apparatus.length>=MAX_ROWS)return;
    apparatus.push({locus:'',observed:'',proposed:'',status:'unresolved',basis:''});renderRows();save();find('entry-'+(apparatus.length-1)+'-locus').focus();
  });
  find('export-markdown').addEventListener('click',()=>{try{download('heraldry-'+id+'.md',draftReport(id,read()),'text/markdown;charset=utf-8');say('Source-linked Markdown exported, including uncertainty and apparatus entries.');}catch(error){say('Export failed: '+error.message);}});
  find('export-json').addEventListener('click',()=>{try{jsonDownload(id,read());say('Portable JSON draft exported. Import this file to continue on another device.');}catch(error){say('Export failed: '+error.message);}});
  find('copy-draft').addEventListener('click',async()=>{try{await window.navigator.clipboard.writeText(draftReport(id,read()));say('Draft copied with its source and apparatus.');}catch{say('Clipboard access is unavailable. Export Markdown instead.');}});
  find('copy-witness').addEventListener('click',async()=>{try{await window.navigator.clipboard.writeText(window.location.href);say('Witness link copied. Your draft is not included.');}catch{say('Copy the address-bar URL to share this witness.');}});
  find('import-file').addEventListener('change',async()=>{
    const file=find('import-file').files?.[0];pending=null;find('import-review').hidden=true;const sequence=++importSequence;
    if(!file)return;
    try{
      if(file.size>MAX_FILE_BYTES)throw new Error('Choose a JSON file smaller than 1 MB.');
      const parsed=importDraft(await file.text());if(sequence!==importSequence)return;
      pending=parsed;const witness=witnesses.find(w=>w.id===parsed.witnessId);
      find('import-summary').textContent=witness.title+' · '+witness.locator+' · '+parsed.draft.apparatus.length+' apparatus entries. Loading replaces this witness’s local draft. Export that draft first if you need to keep it.';
      find('import-preview').textContent=parsed.draft.fields.diplomatic.slice(0,1200)||'[No diplomatic transcription entered]';find('import-review').hidden=false;say('File checked. Review the witness and transcription before loading.');
    }catch(error){if(sequence===importSequence)say('Import failed: '+error.message+' Your current draft is unchanged.');}
  });
  find('cancel-import').addEventListener('click',()=>{dismissImport();say('Import cancelled. Your draft is unchanged.');});
  find('backup-import').addEventListener('click',()=>{if(!pending)return;const draft=pending.witnessId===id?read():session.load(pending.witnessId);jsonDownload(pending.witnessId,draft,'-before-import');say('Existing draft for the import’s witness exported.');});
  find('load-import').addEventListener('click',()=>{
    if(!pending||!save())return;const incoming=pending;id=incoming.witnessId;session.save(id,incoming.draft);dismissImport();render();say(session.storageWorks?'Imported working draft loaded and saved in this browser.':'Imported draft loaded for this session. Browser storage is unavailable; export before closing.');
  });
  document.querySelectorAll('[data-zoom]').forEach(control=>control.addEventListener('input',()=>{
    const card=control.closest('[data-witness]'),image=card.querySelector('[data-facsimile]');image.style.width=control.value+'%';card.querySelector('[data-zoom-value]').textContent=control.value+'%';
  }));
  document.querySelectorAll('[data-fit]').forEach(button=>button.addEventListener('click',()=>{
    const card=button.closest('[data-witness]');card.querySelector('[data-zoom]').value='100';card.querySelector('[data-facsimile]').style.width='100%';card.querySelector('[data-zoom-value]').textContent='100%';const viewport=card.querySelector('.facsimile-viewport');viewport.scrollTop=0;viewport.scrollLeft=0;
  }));
  render();
  return {session,read};
}
