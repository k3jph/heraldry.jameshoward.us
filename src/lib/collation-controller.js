import {witnesses,importDraft,createDeskSession,MAX_FILE_BYTES} from './transcription.js';
import {installImageFallback} from './object-images.js';
import {browserDraftStorage} from './draft-storage.js';
import {mountDraftRecovery} from './draft-recovery.js';
import {COMPARISON_FIELDS,READING_FIELDS,ALIGNMENT_FIELDS,CATEGORIES,REVIEW_STATES,MAX_ALIGNMENTS,selectWitnessPair,pairContext,blankComparison,validateComparison,createComparisonSession,reverseComparison,compareText,exportComparison,importComparison,comparisonReport} from './collation.js';

export function mountComparison(document,window){
  const find=id=>document.getElementById(id),say=text=>{find('comparison-status').textContent=text;};
  const storage=browserDraftStorage(window);
  const session=createComparisonSession(storage),params=new URLSearchParams(window.location.search);
  let pair=selectWitnessPair(params.get('left'),params.get('right')),draft=blankComparison(),pending=null,sequence=0;
  const download=(name,content,type)=>{const url=window.URL.createObjectURL(new window.Blob([content],{type})),link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();window.setTimeout(()=>window.URL.revokeObjectURL(url),1500);};
  const jsonDownload=(p,value,suffix='')=>download('heraldry-compare-'+p.map(w=>w.id).join('-')+suffix+'.json',JSON.stringify(exportComparison(p,value),null,2)+'\n','application/json;charset=utf-8');
  const save=()=>{try{session.save(pair,draft);say(session.storageWorks?'Comparison saved in this browser for this ordered pair. Export a portable copy.':'Browser storage is unavailable. Keep this page open and export before closing.');return true;}catch(error){recovery.refresh();say(error.message+' Your entered text remains on this page.');return false;}};
  const stale=()=>{find('text-difference').replaceChildren();find('difference-status').textContent='Readings or layer changed. Run the text comparison again.';};
  const provenance=side=>{
    const reading=draft.readings[side];find('reading-meta-'+side).textContent='Origin: '+reading.origin+(reading.loadedAt?' · loaded '+reading.loadedAt:'')+' · '+(reading.edited?'edited':'no subsequent edit recorded')+' · '+reading.draft.apparatus.length+' original apparatus entries retained in exports.';
    const lines=['Editor: '+(reading.draft.fields.editor||'[Not entered]'),'','Original notes:',reading.draft.fields.notes||'[No notes retained]','','Original apparatus:'];
    reading.draft.apparatus.forEach((row,i)=>{lines.push('\nEntry '+(i+1));for(const [key,value] of Object.entries(row))lines.push(key+': '+(value||'[Not entered]'));});
    if(!reading.draft.apparatus.length)lines.push('[No entries retained]');find('reading-context-'+side).textContent=lines.join('\n');
  };
  const renderAlignments=()=>{
    const container=find('alignment-rows');container.replaceChildren();
    const labels={leftLocus:'Left location',rightLocus:'Right location',leftReading:'Left reading / feature',rightReading:'Right reading / feature',category:'Difference category',status:'Review status',note:'Basis, alternatives, and explanation'};
    draft.alignments.forEach((row,index)=>{
      const group=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent='Located comparison '+(index+1);group.append(legend);
      ALIGNMENT_FIELDS.forEach(key=>{
        const label=document.createElement('label'),name=document.createElement('span');name.textContent=labels[key];label.append(name);const options=key==='category'?CATEGORIES:key==='status'?REVIEW_STATES:null;
        const input=document.createElement(options?'select':'textarea');input.id='alignment-'+index+'-'+key;label.htmlFor=input.id;
        if(options)options.forEach(value=>{const option=document.createElement('option');option.value=value;option.textContent=value;input.append(option);});else{input.rows=key==='note'?3:2;input.maxLength=50000;}
        input.value=row[key];input.addEventListener(options?'change':'input',()=>{row[key]=input.value;save();});label.append(input);group.append(label);
      });
      const remove=document.createElement('button');remove.type='button';remove.className='chip';remove.textContent='Remove comparison '+(index+1);remove.addEventListener('click',()=>{draft.alignments.splice(index,1);renderAlignments();save();find('add-alignment').focus();});group.append(remove);container.append(group);
    });
    find('alignment-count').textContent=draft.alignments.length+' / '+MAX_ALIGNMENTS+' located comparisons';find('add-alignment').disabled=draft.alignments.length>=MAX_ALIGNMENTS;
  };
  const fill=()=>{
    COMPARISON_FIELDS.forEach(f=>{find('comparison-'+f.id).value=draft.fields[f.id];});
    ['left','right'].forEach(side=>{READING_FIELDS.forEach(key=>{find('reading-'+side+'-'+key).value=draft.readings[side].draft.fields[key];});provenance(side);});
    find('comparison-layer').value=draft.layer;renderAlignments();stale();
  };
  const renderSources=()=>{
    ['left','right'].forEach((side,i)=>{
      const witness=pair[i],select=find('witness-'+side);select.value=witness.id;Array.from(select.options).forEach(option=>{option.disabled=option.value===pair[1-i].id;});
      const card=find('source-'+side);
      for(const key of ['title','locator','repository','date','scope','rights','credit'])card.querySelector('[data-'+key+']').textContent=witness[key];
      card.querySelector('[data-record]').href=witness.url;card.querySelector('[data-rights-link]').href=witness.rightsUrl;card.querySelector('[data-desk-link]').href='/transcription-desk/?witness='+witness.id;
      const plinth=card.querySelector('[data-picture]'),external=card.querySelector('[data-external]'),full=card.querySelector('[data-full]');plinth.replaceChildren();plinth.hidden=!witness.image;external.hidden=!!witness.image;external.href=witness.url;full.hidden=!witness.image;full.href=witness.imageSource||witness.url;
      if(witness.image){const image=document.createElement('img');image.alt=witness.alt;image.width=witness.width;image.height=witness.height;image.decoding='async';image.dataset.sourceImage=witness.imageSource;image.src=witness.image;plinth.append(image);installImageFallback(image);}
      const zoom=find('zoom-'+side);zoom.value='100';zoom.disabled=!witness.image;find('zoom-value-'+side).textContent='100%';
    });
    find('pair-context').textContent=pairContext(pair);
    const url=new URL(window.location.href);url.search='';url.hash='';url.searchParams.set('left',pair[0].id);url.searchParams.set('right',pair[1].id);window.history.replaceState(null,'',url);
  };
  const recovery=mountDraftRecovery({document,window,status:find('comparison-status'),session,identity:()=>pair,read:()=>draft,fill:value=>{draft=value;fill();},exportRaw:(p,value)=>JSON.stringify(exportComparison(p,value),null,2)+'\n',previewDraft:comparisonReport,download});
  const restore=()=>{draft=session.load(pair)||blankComparison();fill();say(session.storageWorks?'This pair’s comparison is ready. Enter readings or load saved desk drafts.':'Saved comparisons could not be read. You can still work and export in this page.');recovery.refresh();};
  const dismiss=()=>{pending=null;sequence++;find('comparison-import-review').hidden=true;for(const id of ['comparison-file','reading-file-left','reading-file-right'])find(id).value='';};
  const stage=value=>{
    pending=value;find('comparison-import-review').hidden=false;
    if(value.kind==='reading'){
      const side=value.side,i=side==='left'?0:1;find('comparison-import-summary').textContent='Replace only the '+side+' reading for '+pair[i].locator+'. The single-witness desk draft stays unchanged. Export this comparison first if you need its current reading.';find('comparison-import-preview').textContent=value.reading.draft.fields.diplomatic.slice(0,1500)||'[No diplomatic transcription entered]';
    }else{find('comparison-import-summary').textContent='Restore '+value.pair.map(w=>w.locator).join(' / ')+'. Loading replaces the saved comparison for that ordered pair. Export the destination comparison first if you need it.';find('comparison-import-preview').textContent=value.draft.fields.question.slice(0,1500)||'[No research question entered]';}
    say('Review the proposed reading or comparison before loading.');
  };
  ['left','right'].forEach(side=>{
    find('witness-'+side).addEventListener('change',()=>{if(!save()){find('witness-'+side).value=pair[side==='left'?0:1].id;return;}pair=selectWitnessPair(find('witness-left').value,find('witness-right').value);dismiss();renderSources();restore();});
    READING_FIELDS.forEach(key=>find('reading-'+side+'-'+key).addEventListener('input',()=>{draft.readings[side].draft.fields[key]=find('reading-'+side+'-'+key).value;draft.readings[side].edited=true;provenance(side);stale();save();}));
    find('use-desk-'+side).addEventListener('click',()=>{
      dismiss();const source=createDeskSession(storage).load(pair[side==='left'?0:1].id);
      if(!Object.values(source.fields).some(Boolean)&&!source.apparatus.length){say('No readable, nonempty desk draft is available for this witness in this browser. Open the desk or import its JSON export.');return;}
      stage({kind:'reading',side,reading:{draft:source,origin:'desk',loadedAt:new Date().toISOString(),edited:false}});
    });
    find('reading-file-'+side).addEventListener('change',async()=>{
      const file=find('reading-file-'+side).files?.[0],current=++sequence;pending=null;find('comparison-import-review').hidden=true;if(!file)return;
      try{if(file.size>MAX_FILE_BYTES)throw new Error('Choose a file no larger than 1 MB.');const loaded=importDraft(await file.text());if(current!==sequence)return;if(loaded.witnessId!==pair[side==='left'?0:1].id)throw new Error('Choose that witness in the '+side+' column before importing its desk draft.');stage({kind:'reading',side,reading:{draft:loaded.draft,origin:'file',loadedAt:new Date().toISOString(),edited:false}});}catch(error){if(current===sequence)say('Reading import failed: '+error.message+' Current readings are unchanged.');}
    });
    find('zoom-'+side).addEventListener('input',()=>{const image=find('source-'+side).querySelector('[data-picture] img');if(image)image.style.width=find('zoom-'+side).value+'%';find('zoom-value-'+side).textContent=find('zoom-'+side).value+'%';});
    find('fit-'+side).addEventListener('click',()=>{find('zoom-'+side).value='100';const picture=find('source-'+side).querySelector('[data-picture]');const image=picture.querySelector('img');if(image)image.style.width='100%';picture.scrollTop=0;picture.scrollLeft=0;find('zoom-value-'+side).textContent='100%';});
  });
  COMPARISON_FIELDS.forEach(f=>find('comparison-'+f.id).addEventListener('input',()=>{draft.fields[f.id]=find('comparison-'+f.id).value;save();}));
  find('comparison-form').addEventListener('submit',event=>event.preventDefault());
  find('swap-witnesses').addEventListener('click',()=>{if(!save())return;const reversed=reverseComparison(draft);pair=[pair[1],pair[0]];dismiss();renderSources();const saved=session.load(pair);draft=saved||reversed;fill();if(!saved)save();say(saved?'Restored the previously saved reverse-pair comparison.':'Readings and located entries swapped. Review directional wording in your argument.');recovery.refresh();});
  find('add-alignment').addEventListener('click',()=>{if(draft.alignments.length>=MAX_ALIGNMENTS)return;draft.alignments.push({leftLocus:'',rightLocus:'',leftReading:'',rightReading:'',category:'unclassified',status:'unresolved',note:''});renderAlignments();save();find('alignment-'+(draft.alignments.length-1)+'-leftLocus').focus();});
  find('comparison-layer').addEventListener('change',()=>{draft.layer=find('comparison-layer').value;stale();save();});
  find('run-comparison').addEventListener('click',()=>{
    const left=draft.readings.left.draft.fields[draft.layer],right=draft.readings.right.draft.fields[draft.layer],area=find('text-difference');area.replaceChildren();
    if(!left||!right){find('difference-status').textContent='Enter both readings in the chosen layer before comparing.';return;}
    const result=compareText(left,right);if(result.limited){find('difference-status').textContent='This preview supports up to 600 tokens per side, counting words and whitespace runs separately. Use shorter excerpts; your complete readings remain saved and exported.';return;}
    result.operations.forEach(part=>{const node=document.createElement(part.type==='left'?'del':part.type==='right'?'ins':'span');node.textContent=part.text;area.append(node);});
    const leftCount=result.operations.filter(p=>p.type==='left').length,rightCount=result.operations.filter(p=>p.type==='right').length;find('difference-status').textContent=leftCount+' left-only and '+rightCount+' right-only segments. Case, accents, punctuation, and whitespace are compared exactly. This does not compare handwriting or establish historical descent.';
  });
  find('comparison-markdown').addEventListener('click',()=>{try{download('heraldry-witness-comparison.md',comparisonReport(pair,draft),'text/markdown;charset=utf-8');say('Comparison exported with both sources, reading provenance, original apparatus, and located differences.');}catch(error){say('Export failed: '+error.message);}});
  find('comparison-json').addEventListener('click',()=>{try{jsonDownload(pair,draft);say('Portable comparison exported. Both witness readings and apparatus are preserved.');}catch(error){say('Export failed: '+error.message);}});
  find('comparison-link').addEventListener('click',async()=>{try{await window.navigator.clipboard.writeText(window.location.href);say('Pair link copied. No readings or notes are included.');}catch{say('Copy the address-bar URL to share this pair.');}});
  find('comparison-file').addEventListener('change',async()=>{
    const file=find('comparison-file').files?.[0],current=++sequence;pending=null;find('comparison-import-review').hidden=true;if(!file)return;
    try{if(file.size>MAX_FILE_BYTES)throw new Error('Choose a file no larger than 1 MB.');const loaded=importComparison(await file.text());if(current!==sequence)return;stage({kind:'bundle',...loaded});}catch(error){if(current===sequence)say('Comparison import failed: '+error.message+' The current comparison is unchanged.');}
  });
  find('comparison-cancel').addEventListener('click',()=>{dismiss();say('Import cancelled. Your comparison is unchanged.');});
  find('comparison-backup').addEventListener('click',()=>{if(!pending)return;try{const destination=pending.kind==='bundle'?pending.pair:pair;const current=destination.every((w,i)=>w.id===pair[i].id)?draft:session.load(destination)||blankComparison();jsonDownload(destination,current,'-before-import');say('Destination comparison exported before replacement.');}catch(error){say('Backup export failed: '+error.message);}});
  find('comparison-load').addEventListener('click',()=>{
    if(!pending||!save())return;
    try{
      if(pending.kind==='reading'){
        const candidate=structuredClone(draft);candidate.readings[pending.side]=structuredClone(pending.reading);
        draft=validateComparison(candidate);
      }else{const candidate=validateComparison(pending.draft);pair=pending.pair;draft=candidate;}
    }catch(error){say('Load failed: '+error.message+' Your comparison is unchanged.');return;}
    dismiss();renderSources();fill();save();
  });
  renderSources();restore();
  return {session,read:()=>validateComparison(draft),pair:()=>pair};
}
