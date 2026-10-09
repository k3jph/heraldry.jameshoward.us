import test from 'node:test';
import assert from 'node:assert/strict';
import {objectStudies} from '../src/lib/objects.js';
import {NOTE_FIELDS,selectObjectPair,comparisonNotes,comparisonStorageKey,comparisonReport} from '../src/lib/object-comparison.js';
import {installImageFallback} from '../src/lib/object-images.js';

test('comparison links normalize unknown and repeated objects to distinct real records',()=>{
  const ids=[...objectStudies.map(object=>object.id),'missing',null];
  for(const left of ids)for(const right of ids){
    const pair=selectObjectPair(objectStudies,left,right);
    assert.ok(pair.every(object=>objectStudies.includes(object)));
    assert.notEqual(pair[0].id,pair[1].id);
    if(left===objectStudies[0].id&&right===objectStudies.at(-1).id)assert.equal(pair[1],objectStudies.at(-1));
  }
});

test('saved notebooks isolate ordered pairs and tolerate malformed stored values',()=>{
  const [left,right]=objectStudies;
  assert.notEqual(comparisonStorageKey(left,right),comparisonStorageKey(right,left));
  for(const value of [null,42,'text',{question:[],left:{},unknown:'discard'}]){
    const notes=comparisonNotes(value);
    assert.deepEqual(Object.keys(notes),NOTE_FIELDS.map(field=>field.id));
    assert.ok(Object.values(notes).every(value=>value===''));
  }
  assert.equal(comparisonNotes({question:'Working hypothesis'}).question,'Working hypothesis');
});

test('exported notes retain both sources, catalogue ranges, and the student’s own text',()=>{
  const left=objectStudies.find(object=>object.id==='vitelleschi-maiolica');
  const right=objectStudies.find(object=>object.id==='cary-bookplate');
  const question='Whose evidence?\nA second line.';
  const report=comparisonReport(left,right,{question});
  for(const object of [left,right])for(const value of [object.accession,object.url,object.imageSource,object.rightsUrl,object.date,object.accessed,object.creator])assert.ok(report.includes(value));
  assert.ok(report.includes(question));
  assert.ok(report.includes('[No note entered.]'));
  assert.doesNotMatch(report,/year\s*=/);
});

test('local image failure retries the museum once, including failures before installation',()=>{
  for(const alreadyFailed of [true,false]){
    const handlers=[];
    const image={src:'/local.jpg',complete:alreadyFailed,naturalWidth:0,dataset:{sourceImage:'https://museum.example/image.jpg'},getAttribute:()=>'/local.jpg',addEventListener:(_,handler,options)=>{assert.equal(options.once,true);handlers.push(handler);}};
    installImageFallback(image);
    if(!alreadyFailed)handlers[0]();
    assert.equal(image.src,'https://museum.example/image.jpg');
    assert.equal(image.dataset.sourceImage,undefined);
    handlers[0]();
    assert.equal(image.src,'https://museum.example/image.jpg');
  }
});
