import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {objectStudies,objectCitation} from '../src/lib/objects.js';
import {makeBibtex} from '../src/lib/bibliography.js';

test('historical objects retain traceable image rights and accession records',()=>{
  const ids=new Set();
  const accessions=new Set();
  for(const object of objectStudies){
    assert.ok(!ids.has(object.id));ids.add(object.id);
    assert.ok(!accessions.has(object.accession));accessions.add(object.accession);
    const record=new URL(object.url);
    const image=new URL(object.imageSource);
    assert.equal(record.protocol,'https:');assert.equal(image.protocol,'https:');
    if(object.imageRights==='CC0'){
      const host=record.hostname.replace(/^www\./,'');
      assert.ok(['metmuseum.org','clevelandart.org','getty.edu'].includes(host));
      assert.equal(record.pathname.split('/').at(-1),String(host==='clevelandart.org'?object.accession:object.objectId));
      assert.equal(new URL(object.rightsUrl).hostname.replace(/^www\./,''),host);
      if(host==='metmuseum.org')assert.equal(image.hostname,'images.metmuseum.org');
      else if(host==='getty.edu')assert.equal(image.hostname,'media.getty.edu');
      else{assert.equal(image.hostname,'www.clevelandart.org');assert.equal(new URL(image.searchParams.get('url')).hostname,'piction.clevelandart.org');}
    }else{
      assert.ok(['Public domain','CC BY-SA 3.0'].includes(object.imageRights));
      assert.equal(image.hostname,'upload.wikimedia.org');
      assert.equal(new URL(object.imageRecordUrl).hostname,'commons.wikimedia.org');
      assert.ok(object.imageAttribution&&object.imageRightsNote);
      assert.match(object.date,/Photograph/);
      if(object.imageRights==='CC BY-SA 3.0')assert.equal(object.rightsUrl,'https://creativecommons.org/licenses/by-sa/3.0/');
    }
    assert.ok(existsSync(new URL('../public'+object.image,import.meta.url)));
    assert.ok(object.width>0&&object.height>0&&object.alt.length>30);
    assert.ok(existsSync(new URL('../src/content/foundation/'+object.lesson+'.md',import.meta.url)));
  }
});

test('object studies keep attribution limits and cite modern records without inventing publication dates',()=>{
  for(const object of objectStudies){
    const citation=makeBibtex(objectCitation(object));
    assert.ok(citation.includes(object.accession));
    assert.ok(citation.includes(object.url));
    assert.ok(citation.includes(object.accessed));
    assert.doesNotMatch(citation,/\byear\s*=/);
    assert.ok(object.claims.some(row=>/not|no |needs|reported|alternative|proposed/i.test(row.limit)));
  }
  assert.match(objectStudies.find(o=>o.id==='franconian-targe').catalogue,/either.*Gottsmann.*Türriegel/);
  assert.match(objectStudies.find(o=>o.id==='halewyn-ghistele-enamel').catalogue,/not certain/);
  assert.match(objectStudies.find(o=>o.id==='vitelleschi-maiolica').creator,/^Circle of /);
  assert.match(objectStudies.find(o=>o.id==='cary-bookplate').date,/1766–1821/);
  const wax=objectStudies.find(o=>o.id==='lowlands-wax-seal');
  assert.equal(wax.date,'12th–16th century');
  assert.equal(wax.culture,'Netherlandish or South Lowlands (?)');
  const matrix=objectStudies.find(o=>o.id==='ghent-style-matrix');
  assert.equal(matrix.date,'19th or 20th century (13th century style)');
  assert.match(matrix.studyType,/no arms identified/);
  assert.match(matrix.imageNote,/no separate date or material/);
  const sitemap=readFileSync(new URL('../src/pages/sitemap.xml.js',import.meta.url),'utf8');
  assert.match(sitemap,/objects\.map/);
  assert.ok(sitemap.includes('/objects/compare/'));
  assert.ok(sitemap.includes('/objects/seals/'));
});

import {createHash} from 'node:crypto';
import {featuredObjectStudies,relatedObjectStudies} from '../src/lib/objects.js';
import {matchesObjectStudy} from '../src/lib/object-filters.js';
test('new image reproductions match their recorded rights evidence and checksums',()=>{
  const ledger=JSON.parse(readFileSync(new URL('../docs/object-image-rights.json',import.meta.url)));
  const additions=objectStudies.filter(object=>!['franconian-targe','heraldic-glass','halewyn-ghistele-enamel','vitelleschi-maiolica','cary-bookplate','lowlands-wax-seal','ghent-style-matrix','simon-de-varie'].includes(object.id));
  for(const object of additions){
    const evidence=ledger.images.find(image=>image.id===object.id);
    assert.ok(evidence,object.id);assert.equal(evidence.imageRights,object.imageRights);
    assert.equal(evidence.localImage,object.image);
    assert.equal(createHash('sha256').update(readFileSync(new URL('../public'+object.image,import.meta.url))).digest('hex'),evidence.sha256);
    assert.ok(evidence.evidence.length>40);assert.equal(new URL(evidence.evidenceUrl).protocol,'https:');
    assert.ok(object.periods.length>0);
  }
  assert.ok(featuredObjectStudies.length>=2&&featuredObjectStudies.length<=3);
  assert.ok(featuredObjectStudies.every(object=>objectStudies.includes(object)));
  for(const object of objectStudies){const related=relatedObjectStudies(object);assert.equal(related.length,3);assert.ok(related.every(other=>other.id!==object.id));}
});
test('collection search combines accent-insensitive words, material, and overlapping periods',()=>{
  const zurich=objectStudies.find(object=>object.id==='zurich-civic-roundel');
  assert.equal(matchesObjectStudy(zurich,{query:'ZURICH shield',material:zurich.material,period:'Early modern'}),true);
  assert.equal(matchesObjectStudy(zurich,{query:'zurich',period:'Modern'}),false);
  assert.equal(matchesObjectStudy(zurich,{query:'zurich',material:'Armour'}),false);
  assert.equal(matchesObjectStudy(zurich,{query:'not-a-real-word'}),false);
  const cary=objectStudies.find(object=>object.id==='cary-bookplate');
  assert.equal(matchesObjectStudy(cary,{period:'Early modern'}),true);
  assert.equal(matchesObjectStudy(cary,{period:'Modern'}),true);
  assert.equal(objectStudies.filter(object=>matchesObjectStudy(object,{})).length,objectStudies.length);
});
