import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {test} from 'node:test';
import {resolve} from 'node:path';

const root=process.cwd();
const read=path=>readFileSync(resolve(root,path),'utf8');
const files=readdirSync(resolve(root,'src/content/achievement')).filter(name=>name.endsWith('.md'));
const sources=JSON.parse(read('src/data/achievement-sources.json'));
const getFrontmatter=content=>content.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1]||'';

test('Eight achievement studies are present with distinct orders and complete metadata',()=>{
  assert.equal(files.length,8,'Expected the eight studies in the new curriculum');
  const numbers=new Set();
  const sourceIds=new Set(sources.map(source=>source.id));
  for(const filename of files){
    const content=read('src/content/achievement/'+filename);
    const frontmatter=getFrontmatter(content);
    for(const required of ['title','description','order','focus','period','sources'])
      assert.match(frontmatter,new RegExp('^'+required+':','m'),'Missing '+required+' in '+filename);
    const number=Number(frontmatter.match(/^order:\s*(\d+)/m)?.[1]);
    assert.ok(Number.isInteger(number)&&number>=1&&number<=8,'Invalid study order in '+filename);
    assert.ok(!numbers.has(number),'Repeated study order '+number);
    numbers.add(number);
    assert.match(content,/## Workshop|## Studio exercise|## Practical design|## Field assignment|## Capstone/i,'Each study should include an active exercise: '+filename);
    const references=frontmatter.match(/^sources:\s*\[([^\]]+)\]/m)?.[1]?.match(/"[^"]+"/g)?.map(item=>JSON.parse(item))||[];
    assert.ok(references.length>=2,'At least two source associations required for '+filename);
    for(const id of references)assert.ok(sourceIds.has(id),'Unknown source ID '+id+' in '+filename);
    assert.ok(content.length>2500,'Substantive reading expected: '+filename);
  }
  assert.deepEqual([...numbers].sort((a,b)=>a-b),[1,2,3,4,5,6,7,8]);
});

test('Source shelf maintains the provenance and limitations of each cited source',()=>{
  assert.ok(sources.length>=8);
  const ids=sources.map(source=>source.id);
  assert.equal(new Set(ids).size,ids.length,'Duplicate source identifiers');
  for(const source of sources){
    for(const field of ['id','label','jurisdiction','language','kind','url','caution'])
      assert.ok(typeof source[field]==='string'&&source[field].trim(),'Missing '+field+' on '+source.id);
    assert.ok(source.url.startsWith('https://')||source.url.startsWith('/traditions/'),'Source URL missing from '+source.id);
  }
});

test('Course renders in the Astro collection and provides route, source and disclaimer views',()=>{
  const config=read('src/content.config.ts');
  const index=read('src/pages/achievement/index.astro');
  const chapter=read('src/pages/achievement/[slug].astro');
  assert.match(config,/achievement:\s*defineCollection/);
  assert.match(index,/getCollection\('achievement'\)/);
  assert.match(index,/comparisons=/);
  assert.match(index,/specialist review/);
  assert.match(chapter,/source-linked|source|selectedSources/);
  assert.match(chapter,/getStaticPaths/);
  assert.match(chapter,/specialist review pending/);
});

test('Laboratory supports all independently toggled layers and five jurisdiction lenses',()=>{
  const page=read('src/pages/achievement/laboratory.astro');
  for(const name of ['crest','helmet','mantling','supporters','compartment','motto','orders']){
    assert.ok(page.includes('data-layer="'+name+'"'),'Missing toggle '+name);
    assert.ok(page.includes('data-layer-image="'+name+'"'),'Missing visible layer '+name);
  }
  for(const key of ['scotland','england','germany','iberia','canada'])
    assert.match(page,new RegExp('value="'+key+'"'));
  assert.match(page,/aria-live="polite"/);
  assert.match(page,/not.*entitlement/i);
  assert.match(page,/updateLayers\(\)/);
});

test('Core navigation and homepage actually expose the new course',()=>{
  const layout=read('src/layouts/Base.astro');
  const home=read('src/pages/index.astro');
  const academy=read('src/pages/academy/index.astro');
  assert.ok(existsSync(resolve(root,'src/pages/achievement/laboratory.astro')));
  assert.ok(layout.includes("href:'/achievement/'"));
  assert.ok(home.includes('id="beyond-the-shield"'));
  assert.ok(academy.includes('href="/achievement/"'));
});
