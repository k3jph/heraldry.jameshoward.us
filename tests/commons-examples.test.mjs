import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const items=JSON.parse(read('src/data/commons-examples.json'));
const allowedStudyIds=new Set(['what-is-an-achievement','crests-and-helms','mantling-and-wreaths','supporters-and-compartments','mottos-and-slogans','badges-banners-and-standards','rank-office-and-insignia','seals-and-material-evidence']);
const allowedRegionIds=new Set(['germany','spain','portugal','scotland','canada']);
const licenses=new Map([['CC BY-SA 3.0','https://creativecommons.org/licenses/by-sa/3.0/'],['CC BY-SA 4.0','https://creativecommons.org/licenses/by-sa/4.0/'],['Public domain (PDM)','https://creativecommons.org/publicdomain/mark/1.0/']]);

test('Wikimedia Commons gallery has uniquely identified, correctly attributed files',()=>{
  assert.ok(items.length>=12);
  assert.equal(new Set(items.map(i=>i.id)).size,items.length,'Each Commons record has unique identity');
  assert.equal(new Set(items.map(i=>i.file)).size,items.length,'Each Commons file appears only once');
  for(const item of items){
    for(const key of ['id','file','title','artist','date','source','license','licenseUrl','sourcePage','imageUrl','visualKind','explanation','alt','rightsNote','changes','reviewed']){
      assert.ok(typeof item[key]==='string'&&item[key].trim(),item.id+' missing '+key);
    }
    assert.ok(item.alt.length>=45,item.id+' image needs genuine alt text');
    assert.ok(item.explanation.length>95,item.id+' must teach a specific point');
    assert.ok(item.rightsNote.length>=45,item.id+' needs an editorial rights note');
    assert.equal(item.licenseUrl,licenses.get(item.license),item.id+' licence must be explicitly whitelisted');
    assert.equal(item.sourcePage,'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(item.file));
    assert.equal(item.imageUrl,'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(item.file)+'?width=750');
    assert.ok(/\.svg$|\.png$|\.jpg$/i.test(item.file),item.id+' file type must be an image');
    assert.match(item.changes,/Unaltered/);
    assert.match(item.reviewed,/^20\d{2}-\d{2}-\d{2}$/);
    assert.ok(Array.isArray(item.studies)&&item.studies.length>0);
    assert.ok(Array.isArray(item.regions)&&item.regions.length>0);
    for(const id of item.studies)assert.ok(allowedStudyIds.has(id),item.id+' references unknown course chapter '+id);
    for(const id of item.regions)assert.ok(allowedRegionIds.has(id),item.id+' references unexpected regional chapter '+id);
  }
});

test('Each Beyond the Shield chapter has an available Commons illustration',()=>{
  for(const chapter of allowedStudyIds){
    assert.ok(items.some(item=>item.studies.includes(chapter)),chapter+' needs a documented pictured example');
  }
});

test('Examples retain conspicuous authorship, source and licence links in a shared component',()=>{
  const comp=read('src/components/CommonsExamples.astro');
  const index=read('src/pages/achievement/gallery.astro');
  const course=read('src/pages/achievement/[slug].astro');
  const regions=read('src/pages/traditions/[slug].astro');
  for(const token of ['example.artist','example.licenseUrl','example.license','example.sourcePage','example.changes','example.explanation','example.alt'])
    assert.ok(comp.includes(token),'Commons illustration component must expose '+token);
  assert.match(comp,/loading="lazy"/);
  assert.match(comp,/referrerpolicy="no-referrer"/);
  assert.match(index,/CommonsExamples all=\{true\}/);
  assert.match(course,/CommonsExamples studyId=\{chapter.id\}/);
  assert.match(regions,/CommonsExamples regionId=\{entry.id\}/);
  assert.ok(read('docs/COMMONS_ILLUSTRATION_POLICY.md').includes('independent of copyright'));
});
