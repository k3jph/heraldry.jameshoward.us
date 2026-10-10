// Shared, source-aware recovery controls. No imported HTML is rendered.
export function recoveryFilename(id,saved){
  const record=(Array.isArray(id)?id.map(item=>item.id).join('-'):String(id)).replace(/[^a-z0-9_-]/gi,'-');
  const stamp=(saved.savedAt||new Date().toISOString()).replace(/[^a-z0-9_-]/gi,'-');
  const copy=(saved.key||'shared').split(':').pop().replace(/[^a-z0-9_-]/gi,'-');
  return 'heraldry-'+record+'-recovery-'+stamp+'-'+copy+'.json';
}

export function mountDraftRecovery({document,window,status,session,identity,read,fill,exportRaw,download,previewDraft}){
  const panel=document.createElement('details');panel.className='draft-recovery';
  const heading=document.createElement('summary');heading.textContent='Draft recovery';
  const message=document.createElement('p'),keep=document.createElement('button'),list=document.createElement('div');
  keep.type='button';keep.className='btn btn-line';keep.textContent='Keep this page’s draft';
  panel.append(heading,message,keep,list);status.insertAdjacentElement?.('afterend',panel);
  const problem=state=>['conflict','unreadable'].includes(state.kind);
  const views=new Map();
  let displayedRaw=null,displayedId=null;
  const refresh=()=>{
    const id=identity(),state=session.inspect(id);displayedRaw=state.observed;keep.hidden=!problem(state);
    const idKey=JSON.stringify(id);
    if(displayedId!==idKey){list.replaceChildren();views.clear();displayedId=idKey;}
    message.textContent=problem(state)?
      'Autosave is paused. Your entered text remains here. Preview and download versions before choosing. Choosing a version keeps a recovery copy of the previous saved record.':
      'Recovery copies use browser storage. Download copies you want to keep, then delete old copies to free space. Close other editing tabs before deleting their copies. The shared draft and this page’s safety copy are protected. Do not clear site data to make room.';
    if(problem(state)){
      panel.open=true;
      status.textContent=state.kind==='unreadable'?
        'The saved record could not be read and has been left intact. Use Draft recovery or export your current text.':
        'Another saved version exists. Autosave is paused. Use Draft recovery or export your current text.';
    }
    const present=new Set();
    for(const saved of session.recoveries(id)){
      const itemKey=saved.key;present.add(itemKey);
      let view=views.get(itemKey);
      if(!view){
        const section=document.createElement('details'),label=document.createElement('summary'),preview=document.createElement('pre');
        const exportButton=document.createElement('button'),load=document.createElement('button'),remove=document.createElement('button');
        exportButton.type=load.type=remove.type='button';exportButton.className=load.className=remove.className='chip';
        load.textContent='Continue from this draft';remove.textContent='Delete this copy';remove.disabled=true;
        view={section,label,preview,exportButton,load,remove,saved,observed:state.observed,downloaded:false,confirm:false};
        views.set(itemKey,view);
        section.append(label,preview,exportButton,load,remove);list.append(section);
        exportButton.addEventListener('click',()=>{
          try{
            const copy=view.saved;
            download(recoveryFilename(id,copy),copy.draft?exportRaw(id,copy.draft):copy.raw,'application/json;charset=utf-8');
            view.downloaded=true;remove.disabled=false;
            status.textContent='Copy downloaded. Check the file before deleting this browser copy.';
          }catch(error){status.textContent='Download failed: '+error.message;}
        });
        load.addEventListener('click',()=>{
          try{
            const current=session.inspect(id);
            // Own saves may advance the shared record after the preview. A
            // different writer's unseen change must still pause replacement.
            if(current.observed!==view.observed&&current.observed!==current.expected)
              throw new Error('The shared draft changed after this preview. Review the updated versions before continuing.');
            const chosen=view.saved.draft;
            try{session.save(id,read());}catch(error){if(error.name!=='DraftConflictError')throw error;}
            const after=session.inspect(id);
            if(after.kind==='unavailable')throw new Error(session.unavailable);
            if(after.observed!==current.observed&&after.observed!==after.expected)
              throw new Error('The shared draft changed after this preview. Review the updated versions before continuing.');
            const clean=session.replace(id,chosen,after.observed);
            fill(clean);refresh();status.textContent='Selected draft loaded and saved. The previous version remains in Draft recovery.';
          }catch(error){refresh();status.textContent=error.message;}
        });
        remove.addEventListener('click',()=>{
          if(!view.downloaded)return;
          if(!view.confirm){
            view.confirm=true;remove.textContent='Confirm delete downloaded copy';
            status.textContent='Delete only if the downloaded file contains the work you want to keep. Other versions will stay in this browser.';
            return;
          }
          try{
            session.deleteRecovery(id,view.saved);refresh();heading.focus?.();
            status.textContent='Downloaded recovery copy deleted. Other drafts remain intact. You can resume editing to save again.';
          }catch(error){refresh();status.textContent=error.message;}
        });
      }
      if(view.saved.raw!==saved.raw||view.saved.stored!==saved.stored){
        view.downloaded=false;view.confirm=false;view.remove.disabled=true;view.remove.textContent='Delete this copy';
      }
      view.saved=saved;view.observed=state.observed;
      view.label.textContent=saved.label+(saved.draft?'':' · unreadable record');
      view.preview.textContent=saved.draft?
        (previewDraft?.(id,saved.draft)||JSON.stringify(saved.draft,null,2).slice(0,5000)):saved.raw.slice(0,5000);
      view.exportButton.textContent=saved.draft?'Download this draft':'Download original record';
      view.load.hidden=!saved.draft;view.remove.hidden=!saved.deletable;
    }
    for(const [itemKey,view] of views){
      if(present.has(itemKey))continue;
      const focused=view.section.contains?.(document.activeElement);
      view.section.remove?.();views.delete(itemKey);
      if(focused)heading.focus?.();
    }
  };
  keep.addEventListener('click',()=>{
    const id=identity();
    try{
      session.replace(id,read(),displayedRaw);refresh();
      status.textContent='This page’s draft is saved. The previous record remains in Draft recovery.';
    }catch(error){refresh();status.textContent=error.message;}
  });
  window.addEventListener?.('storage',event=>{
    if(!event||session.relevantKey(identity(),event.key))refresh();
  });
  session.subscribe(name=>{
    if(panel.open&&session.relevantKey(identity(),name))refresh();
  });
  panel.addEventListener('toggle',()=>{if(panel.open)refresh();});
  return {refresh};
}
