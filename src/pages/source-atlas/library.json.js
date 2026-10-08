import sources from '../../data/world-sources.json';
import {makeCSL} from '../../lib/bibliography.js';
export function GET(){
  return new Response(JSON.stringify(sources.map(makeCSL),null,2)+'\n',{headers:{'Content-Type':'application/json; charset=utf-8','Content-Disposition':'attachment; filename="heraldry-source-atlas.csl.json"'}});
}
