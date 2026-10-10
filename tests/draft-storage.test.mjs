import test from 'node:test';
import assert from 'node:assert/strict';
import {createDeskSession,blankDraft,witnesses,storageKey} from '../src/lib/transcription.js';
import {createComparisonSession,blankComparison,comparisonKey} from '../src/lib/collation.js';
import {createObjectSession,comparisonNotes,comparisonStorageKey} from '../src/lib/object-comparison.js';

const memoryStorage=()=>{
  const values=new Map();
  return {values,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),get length(){return values.size;},key:index=>[...values.keys()][index]??null};
};
const cases=[
  {name:'single witness',create:createDeskSession,id:witnesses[0].id,key:storageKey(witnesses[0].id),blank:blankDraft,edit:(d,text)=>{d.fields.diplomatic=text;},text:d=>d.fields.diplomatic},
  {name:'manuscript comparison',create:createComparisonSession,id:witnesses.slice(0,2),key:comparisonKey(witnesses.slice(0,2)),blank:blankComparison,edit:(d,text)=>{d.fields.question=text;},text:d=>d.fields.question},
  {name:'object notebook',create:createObjectSession,id:[{id:'left'},{id:'right'}],key:comparisonStorageKey({id:'left'},{id:'right'}),blank:()=>comparisonNotes({}),edit:(d,text)=>{d.question=text;},text:d=>d.question},
];
test('a damaged recovery entry does not hide subsequent readable copies',()=>{
  const storage=memoryStorage(),id=witnesses[0].id,key=storageKey(id);
  storage.setItem(key+':branch:broken','{original raw backup');
  const draft=blankDraft();draft.fields.notes='Readable recovery';
  storage.setItem(key+':branch:valid',JSON.stringify({raw:JSON.stringify(draft),savedAt:'2026-10-10T00:00:00Z'}));
  const copies=createDeskSession(storage).recoveries(id);
  assert.ok(copies.some(copy=>copy.raw==='{original raw backup'&&copy.draft===null));
  assert.ok(copies.some(copy=>copy.draft?.fields.notes==='Readable recovery'));
});
for(const c of cases){
  test(c.name+': stale tabs pause while both drafts survive page closure and explicit recovery',()=>{
    const storage=memoryStorage(),a=c.create(storage),b=c.create(storage);a.load(c.id);b.load(c.id);
    const first=c.blank(),second=c.blank();c.edit(first,'A’s research');c.edit(second,'B’s alternatives');
    a.save(c.id,first);assert.throws(()=>b.save(c.id,second),/Another saved version/);
    assert.deepEqual(JSON.parse(storage.getItem(c.key)),first);assert.deepEqual(b.load(c.id),second);
    const fresh=c.create(storage),copies=fresh.recoveries(c.id);
    assert.ok(copies.some(copy=>c.text(copy.draft)==='A’s research'));
    assert.ok(copies.some(copy=>c.text(copy.draft)==='B’s alternatives'));
    b.replace(c.id,second,b.inspect(c.id).observed);
    assert.deepEqual(c.create(storage).load(c.id),second);
    assert.ok(c.create(storage).recoveries(c.id).some(copy=>c.text(copy.draft)==='A’s research'));
  });
  test(c.name+': even interleaved check/write operations keep both writers recoverable',()=>{
    const storage=memoryStorage(),a=c.create(storage),b=c.create(storage);a.load(c.id);b.load(c.id);
    const first=c.blank(),second=c.blank();c.edit(first,'Concurrent A');c.edit(second,'Concurrent B');
    const set=storage.setItem;let interleave=true;
    storage.setItem=(key,raw)=>{
      if(key===c.key&&interleave){interleave=false;b.save(c.id,second);}
      set(key,raw);
    };
    a.save(c.id,first);assert.equal(b.inspect(c.id).kind,'conflict');assert.equal(b.storageWorks,false);
    const texts=c.create(storage).recoveries(c.id).map(copy=>c.text(copy.draft));
    assert.ok(texts.includes('Concurrent A'));assert.ok(texts.includes('Concurrent B'));
  });
  test(c.name+': malformed JSON and invalid-schema originals are never overwritten by typing',()=>{
    for(const original of ['{broken',JSON.stringify({fields:{diplomatic:'Important original text'},unknown:'keep me'})]){
      const storage=memoryStorage();storage.setItem(c.key,original);
      const session=c.create(storage);session.load(c.id);const draft=c.blank();c.edit(draft,'New text');
      assert.throws(()=>session.save(c.id,draft),/could not be read/);
      assert.equal(storage.getItem(c.key),original);
      session.replace(c.id,draft,original);
      const recovered=c.create(storage).recoveries(c.id);
      assert.ok(recovered.some(copy=>copy.raw===original&&copy.draft===null));
      assert.deepEqual(c.create(storage).load(c.id),draft);
    }
  });
  test(c.name+': recovery cannot replace a version changed since its preview',()=>{
    const storage=memoryStorage(),a=c.create(storage),b=c.create(storage);const first=c.blank();c.edit(first,'Previewed');a.save(c.id,first);
    b.load(c.id);const preview=b.inspect(c.id).observed;
    const later=c.blank();c.edit(later,'Changed after preview');a.save(c.id,later);
    assert.throws(()=>b.replace(c.id,first,preview),/Another saved version/);
    assert.deepEqual(JSON.parse(storage.getItem(c.key)),later);
  });
  test(c.name+': quota failures preserve shared data and do not report a successful save',()=>{
    const storage=memoryStorage(),session=c.create(storage),first=c.blank();c.edit(first,'Saved');session.save(c.id,first);
    const changed=c.blank();c.edit(changed,'Still on page');storage.setItem=()=>{throw new Error('Quota exceeded');};
    session.save(c.id,changed);assert.equal(session.storageWorks,false);
    assert.deepEqual(JSON.parse(storage.getItem(c.key)),first);assert.deepEqual(session.load(c.id),changed);
    session.replace(c.id,first,storage.getItem(c.key));assert.equal(session.storageWorks,false);
    assert.deepEqual(session.load(c.id),changed);
  });
}
