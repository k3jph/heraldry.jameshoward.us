import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {parseBlazon} from '../src/lib/blazon-parser.js';
import {armsSVG,normalizeDesign} from '../src/lib/heraldry.js';

test('unsupported and incomplete input removes the previous interpretation and its actions',()=>{
  const control=()=>({children:[],handlers:{},addEventListener(event,fn){this.handlers[event]=fn;},replaceChildren(){this.children=[];this.innerHTML='';},append(node){this.children.push(node);},removeAttribute(name){delete this[name];}});
  const controls=new Map(['decoder-form','decoder-input','decoder-status','decoder-feedback','decoder-shield','decoder-canonical','decoder-edit','decoder-copy'].map(id=>[id,control()]));
  const input=controls.get('decoder-input');input.value='Argent, a cross Gules.';
  const document={querySelector:selector=>controls.get(selector.slice(1)),querySelectorAll:()=>[],getElementById:id=>controls.get(id),createElement:()=>control()};
  const source=readFileSync(new URL('../src/pages/decoder.astro',import.meta.url),'utf8').match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^\s*import .*;$/gm,'');
  vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText,{document,parseBlazon,armsSVG,normalizeDesign,URLSearchParams});
  const interpret=text=>{input.value=text;controls.get('decoder-form').handlers.submit({preventDefault(){}});};
  assert.match(controls.get('decoder-shield').innerHTML,/aria-label="Argent, a cross Gules\."/);
  assert.match(controls.get('decoder-edit').href,/ordinary=cross/);
  for(const unsupported of ['Azure, a lion rampant Or.','Azure, on a fess Or.','']){
    interpret(unsupported);
    assert.equal(controls.get('decoder-shield').innerHTML,'');
    assert.equal(controls.get('decoder-canonical').textContent,'No interpretation available.');
    assert.equal(controls.get('decoder-edit').href,undefined);
    assert.equal(controls.get('decoder-edit').hidden,true);
    assert.equal(controls.get('decoder-copy').disabled,true);
  }
  interpret('Vert, three martlets Argent.');
  assert.match(controls.get('decoder-canonical').textContent,/martlets/);
  assert.equal(controls.get('decoder-edit').hidden,false);
  assert.equal(controls.get('decoder-copy').disabled,false);
  assert.match(controls.get('decoder-edit').href,/charge=martlet/);
});
