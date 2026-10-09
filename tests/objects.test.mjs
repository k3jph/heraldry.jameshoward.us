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
    const record=new URL(object.url);
    assert.equal(record.pathname.split('/').at(-1),String(object.objectId));
    const institution=record.hostname==='www.metmuseum.org'?'met':'cleveland';
    assert.ok(['www.metmuseum.org','www.clevelandart.org'].includes(record.hostname));
    assert.equal(new URL(object.rightsUrl).hostname,record.hostname);
    const image=new URL(object.imageSource);
    if(institution==='met')assert.equal(image.hostname,'images.metmuseum.org');
    else{
      assert.equal(image.hostname,'www.clevelandart.org');
      assert.equal(new URL(image.searchParams.get('url')).hostname,'piction.clevelandart.org');
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
