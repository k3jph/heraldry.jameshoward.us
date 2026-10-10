// Keep a separate branch for each open page before touching the shared draft.
// localStorage has no compare-and-swap: the branch also preserves both writers
// if two processes interleave the check and write. Storage events surface that
// race; recovery copies remain accessible after either page closes.
const token=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
export function createDraftSession(storage,{key,validate,blank}){
  const entries=new Map(),owner=token();let storageWorks=true;
  const entry=id=>{
    const name=key(id);
    if(!entries.has(name)){
      const item={name,expected:null,working:blank(),kind:'ready',observed:null};
      try{
        item.expected=storage.getItem(name);item.observed=item.expected;
        if(item.expected!==null)try{item.working=validate(JSON.parse(item.expected));}catch{item.kind='unreadable';storageWorks=false;}
      }catch{item.kind='unavailable';storageWorks=false;}
      entries.set(name,item);
    }
    return entries.get(name);
  };
  const archive=(item,raw)=>{
    if(raw!==null)storage.setItem(item.name+':recovery:'+token(),JSON.stringify({raw,savedAt:new Date().toISOString()}));
  };
  const inspect=id=>{
    const item=entry(id);
    try{
      item.observed=storage.getItem(item.name);
      if(item.observed!==item.expected){item.kind='conflict';storageWorks=false;}
    }catch{item.kind='unavailable';storageWorks=false;}
    return {...item,working:structuredClone(item.working)};
  };
  const conflict=item=>{storageWorks=false;throw new Error(item.kind==='unreadable'?'The saved draft could not be read. It has been left intact. Open Draft recovery before replacing it.':'Another saved version exists. Autosave is paused; open Draft recovery to compare and choose a version.');};
  const write=(id,draft,replace=false,observedRaw=null)=>{
    const clean=validate(draft),item=entry(id),previous=structuredClone(item.working);
    if(!replace)item.working=structuredClone(clean);
    const raw=JSON.stringify(clean);
    try{
      if(replace){
        const current=storage.getItem(item.name);item.observed=current;
        if(current!==observedRaw){item.kind='conflict';return conflict(item);}
        archive(item,current); // Includes unreadable originals, byte for byte.
        if(previous!==null)archive(item,JSON.stringify(previous));
      }
      // Failure here must never be followed by a write to the shared record.
      storage.setItem(item.name+':branch:'+owner,JSON.stringify({raw,savedAt:new Date().toISOString()}));
      const current=storage.getItem(item.name);item.observed=current;
      if(replace){
        if(current!==observedRaw){item.kind='conflict';return conflict(item);}
      }else if(item.kind==='unreadable'||current!==item.expected){
        if(item.kind!=='unreadable')item.kind='conflict';
        return conflict(item);
      }
      storage.setItem(item.name,raw);item.expected=raw;
      item.observed=storage.getItem(item.name);
      if(item.observed!==raw){item.kind='conflict';return conflict(item);}
      item.working=structuredClone(clean);item.kind='saved';storageWorks=true;
    }catch(error){
      if(item.kind==='conflict'||item.kind==='unreadable')throw error;
      item.kind='unavailable';storageWorks=false;
    }
    return structuredClone(clean);
  };
  return {
    get storageWorks(){return storageWorks;},
    load:id=>structuredClone(inspect(id).working),
    save:(id,draft)=>write(id,draft),
    inspect,
    recoveries(id){
      const item=inspect(id),found=new Map();
      if(item.observed!==null)found.set(item.observed,{raw:item.observed,label:'Shared saved version'});
      try{
        for(let i=0;i<storage.length;i++){
          const name=storage.key(i);
          if(!name?.startsWith(item.name+':branch:')&&!name?.startsWith(item.name+':recovery:'))continue;
          const stored=storage.getItem(name);if(stored===null)continue;
          let saved;try{saved=JSON.parse(stored);}catch{saved={raw:stored,savedAt:'unreadable recovery record'};}
          if(typeof saved?.raw==='string'&&!found.has(saved.raw))found.set(saved.raw,{raw:saved.raw,label:'Recovery copy · '+(saved.savedAt||'date unavailable')});
        }
      }catch{storageWorks=false;}
      return [...found.values()].map(saved=>{
        let draft=null;try{draft=validate(JSON.parse(saved.raw));}catch{/* Offer the original download even if it cannot be parsed. */}
        return {...saved,draft};
      });
    },
    replace:(id,draft,observedRaw)=>write(id,draft,true,observedRaw),
  };
}

export const browserDraftStorage=window=>({
  getItem:key=>window.localStorage.getItem(key),
  setItem:(key,value)=>window.localStorage.setItem(key,value),
  get length(){return window.localStorage.length;},
  key:index=>window.localStorage.key(index),
});
