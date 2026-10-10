// Shared, source-aware recovery controls. No imported HTML is rendered.
export function mountDraftRecovery({document,window,status,session,identity,read,fill,exportRaw,download,previewDraft}){
  const panel=document.createElement('details');panel.className='draft-recovery';
  const heading=document.createElement('summary');heading.textContent='Draft recovery';
  const message=document.createElement('p'),keep=document.createElement('button'),list=document.createElement('div');
  keep.type='button';keep.className='btn btn-line';keep.textContent='Keep this page’s draft';
  panel.append(heading,message,keep,list);status.insertAdjacentElement?.('afterend',panel);
  const problem=state=>['conflict','unreadable'].includes(state.kind);
  let displayedRaw=null;
  const refresh=()=>{
    const id=identity(),state=session.inspect(id);displayedRaw=state.observed;list.replaceChildren();keep.hidden=!problem(state);
    message.textContent=problem(state)?'Autosave is paused. Your entered text remains here. Preview and download the other versions before choosing which draft to continue. Choosing a version keeps a recovery copy of the previous saved record.':'Recovery copies are kept separately for each open page. Export your work for a copy you can keep outside this browser.';
    if(problem(state)){panel.open=true;status.textContent=state.kind==='unreadable'?'The saved record could not be read and has been left intact. Use Draft recovery or export your current text.':'Another saved version exists. Autosave is paused. Use Draft recovery or export your current text.';}
    for(const saved of session.recoveries(id)){
      const section=document.createElement('details'),label=document.createElement('summary'),preview=document.createElement('pre'),exportButton=document.createElement('button');
      label.textContent=saved.label+(saved.draft?'':' · unreadable record');
      preview.textContent=(saved.draft?(previewDraft?.(id,saved.draft)||JSON.stringify(saved.draft,null,2)):saved.raw).slice(0,1800);
      exportButton.type='button';exportButton.className='chip';exportButton.textContent=saved.draft?'Download this draft':'Download original record';
      exportButton.addEventListener('click',()=>download('heraldry-draft-recovery.json',saved.draft?exportRaw(id,saved.draft):saved.raw,'application/json;charset=utf-8'));
      section.append(label,preview,exportButton);
      if(saved.draft){
        const load=document.createElement('button');load.type='button';load.className='chip';load.textContent='Continue from this draft';
        load.addEventListener('click',()=>{
          try{
            // Preserve even an unsaved current page before loading another copy.
            try{session.save(id,read());}catch{/* Conflict keeps a separate branch. */}
            const clean=session.replace(id,saved.draft,state.observed);
            if(!session.storageWorks)throw new Error('Browser storage is unavailable. Export this page’s draft before changing versions.');
            fill(clean);refresh();status.textContent='Selected draft loaded and saved. The previous version remains in Draft recovery.';
          }catch(error){status.textContent=error.message;refresh();}
        });
        section.append(load);
      }
      list.append(section);
    }
  };
  keep.addEventListener('click',()=>{
    const id=identity();
    try{session.replace(id,read(),displayedRaw);refresh();status.textContent=session.storageWorks?'This page’s draft is saved. The previous record remains in Draft recovery.':'Browser storage is unavailable. Export your draft before closing.';}catch(error){refresh();status.textContent=error.message;}
  });
  window.addEventListener?.('storage',refresh);
  panel.addEventListener('toggle',()=>{if(panel.open)refresh();});
  return {refresh};
}
