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
    assert.equal(object.imageRights,'CC0');
    assert.match(object.rightsUrl,/^https:\/\/www\.metmuseum\.org\//);
    assert.match(object.url,new RegExp('/'+object.objectId+'$'));
    assert.match(object.imageSource,/^https:\/\/images\.metmuseum\.org\/CRDImages\//);
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
  const sitemap=readFileSync(new URL('../src/pages/sitemap.xml.js',import.meta.url),'utf8');
  assert.match(sitemap,/objects\.map/);
});
